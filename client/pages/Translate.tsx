import { useState, useRef, useCallback, useEffect } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Volume2, Hand, RotateCw, Circle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useBluetooth } from "@/hooks/use-bluetooth";
import { MLService } from "@/lib/ml-service";
import type { SensorDataArray } from "@/lib/MLTypes";

const BLE_CONFIG = {
  SENSOR_SERVICE_UUID: "f40d6fd3-70e8-4008-bf64-03a57b87fdc6",
  SENSOR_CHARACTERISTIC_UUID: "7094fd70-4532-4d73-a118-473a0a63701a",
};

const RECORD_DURATION_MS = 5000;

export default function Translate() {
  const [glovesConnected, setGlovesConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordProgress, setRecordProgress] = useState(0);
  const [currentTranslation, setCurrentTranslation] = useState("");
  const [confidence, setConfidence] = useState<number | null>(null);
  const [translationHistory, setTranslationHistory] = useState<string[]>([]);
  const [latestSensorData, setLatestSensorData] = useState<SensorDataArray | null>(null);
  const [modelStatus, setModelStatus] = useState<"loading" | "ready" | "error">("loading");

  const recordedFramesRef = useRef<SensorDataArray[]>([]);
  const isRecordingRef = useRef(false);
  const recordingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mlServiceRef = useRef<MLService>(new MLService());

  // Initialize ML service on mount
  useEffect(() => {
    const ml = mlServiceRef.current;
    ml.initialize("/models/labels.json", "/models/config.json", "/models/model.tflite")
      .then(() => setModelStatus("ready"))
      .catch((err) => {
        console.error("Failed to load ML model:", err);
        setModelStatus("error");
      });
    return () => ml.destroy();
  }, []);

  const {
    device,
    connect,
    requestDevice,
    startNotifications,
    stopNotifications,
  } = useBluetooth();

  /**
   * Parse BLE DataView into a flat 15-number SensorDataArray:
   * [5 flex, 4 quaternion, 3 accel, 3 gyro]
   */
  const parseBLEPacket = useCallback(
    (value: DataView, offset: number): SensorDataArray => {
      const fingers: number[] = [];
      for (let i = 0; i < 5; i++) {
        fingers.push(value.getUint16(offset + i * 2, false));
      }

      const gyro_Q: number[] = [];
      const qOffset = offset + 10;
      for (let i = 0; i < 4; i++) {
        gyro_Q.push(value.getFloat32(qOffset + i * 4, false));
      }

      const accel: number[] = [];
      const accelOffset = offset + 26;
      for (let i = 0; i < 3; i++) {
        accel.push(value.getFloat32(accelOffset + i * 4, false));
      }

      const gyro: number[] = [];
      const gyroOffset = offset + 38;
      for (let i = 0; i < 3; i++) {
        gyro.push(value.getFloat32(gyroOffset + i * 4, false));
      }

      return [
        ...fingers,
        ...gyro_Q,
        ...accel,
        ...gyro,
      ] as unknown as SensorDataArray;
    },
    [],
  );

  const handleBLENotification = useCallback(
    (value: DataView) => {
      const PACKET_LEN = 50;
      for (
        let base = 0;
        base + PACKET_LEN <= value.byteLength;
        base += PACKET_LEN
      ) {
        const sensorData = parseBLEPacket(value, base);
        setLatestSensorData(sensorData);

        if (isRecordingRef.current) {
          recordedFramesRef.current.push(sensorData);
        }
      }
    },
    [parseBLEPacket],
  );

  const connectToDevice = async () => {
    if (glovesConnected) {
      await stopNotifications(
        BLE_CONFIG.SENSOR_SERVICE_UUID,
        BLE_CONFIG.SENSOR_CHARACTERISTIC_UUID,
      );
      setGlovesConnected(false);
      return;
    }

    await requestDevice({
      filters: [{ services: [BLE_CONFIG.SENSOR_SERVICE_UUID] }],
      optionalServices: [BLE_CONFIG.SENSOR_SERVICE_UUID],
    });

    if (device && !device.connected) {
      const connected = await connect();
      if (connected) {
        const started = await startNotifications(
          BLE_CONFIG.SENSOR_SERVICE_UUID,
          BLE_CONFIG.SENSOR_CHARACTERISTIC_UUID,
          handleBLENotification,
        );
        if (started) {
          setGlovesConnected(true);
        }
      }
    }
  };

  const stopRecording = useCallback(async () => {
    isRecordingRef.current = false;
    setIsRecording(false);
    setRecordProgress(1);

    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    if (recordingTimerRef.current) {
      clearTimeout(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    const frames = [...recordedFramesRef.current];
    recordedFramesRef.current = [];

    if (frames.length === 0) {
      setCurrentTranslation("No data recorded");
      setRecordProgress(0);
      return;
    }

    setIsProcessing(true);
    try {
      const ml = mlServiceRef.current;
      if (!ml.isReady) {
        setCurrentTranslation("Model not loaded yet");
        return;
      }

      const result = await ml.predict(frames);
      setCurrentTranslation(result.word);
      setConfidence(result.confidence);

      if (result.isConfident) {
        setTranslationHistory((prev) => [result.word, ...prev].slice(0, 50));
      }
    } catch (err) {
      console.error("Prediction error:", err);
      setCurrentTranslation("Prediction failed");
    } finally {
      setIsProcessing(false);
      setRecordProgress(0);
    }
  }, []);

  const startRecording = useCallback(() => {
    recordedFramesRef.current = [];
    isRecordingRef.current = true;
    setIsRecording(true);
    setRecordProgress(0);
    setCurrentTranslation("");
    setConfidence(null);

    const startTime = Date.now();
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setRecordProgress(Math.min(elapsed / RECORD_DURATION_MS, 1));
    }, 50);

    recordingTimerRef.current = setTimeout(() => {
      stopRecording();
    }, RECORD_DURATION_MS);
  }, [stopRecording]);

  const handleSpeak = () => {
    if (currentTranslation && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentTranslation);
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Translator Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Bar */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200/50 dark:border-slate-700/50 p-6 sm:p-8 shadow-lg transition-colors duration-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                    Live Translator
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                    {glovesConnected ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                        Gloves Connected
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
                        Connect gloves to begin
                      </span>
                    )}
                  </p>
                </div>
                <Button
                  onClick={connectToDevice}
                  className={`w-full sm:w-auto ${
                    glovesConnected
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gradient-to-r from-red-700 to-rose-600 hover:from-red-800 hover:to-rose-700"
                  } text-white font-semibold`}
                >
                  <Hand className="w-4 h-4 mr-2" />
                  {glovesConnected ? "Disconnect" : "Connect Gloves"}
                </Button>
              </div>
            </div>

            {/* Translation Output */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200/50 dark:border-slate-700/50 p-6 sm:p-8 shadow-lg flex flex-col transition-colors duration-300">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
                Translated Text
              </h2>
              <div className="flex-1 bg-gradient-to-br from-rose-50 to-red-50 dark:from-red-950 dark:to-red-900 rounded-xl p-6 flex flex-col items-center justify-center min-h-24 mb-6 border border-red-200/50 dark:border-red-800/50 transition-colors duration-300">
                {isProcessing ? (
                  <Loader2 className="w-8 h-8 animate-spin text-red-600 dark:text-red-400" />
                ) : (
                  <>
                    <p className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white transition-colors duration-300">
                      {currentTranslation || "Start translating..."}
                    </p>
                    {confidence !== null && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Confidence: {(confidence * 100).toFixed(1)}%
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Recording progress bar */}
              {isRecording && (
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 mb-4">
                  <div
                    className="bg-red-600 h-2 rounded-full transition-all duration-100"
                    style={{ width: `${recordProgress * 100}%` }}
                  />
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={!glovesConnected || isProcessing}
                  className={`flex-1 font-semibold ${
                    isRecording
                      ? "bg-red-700 hover:bg-red-800"
                      : "bg-gradient-to-r from-red-700 to-rose-600 hover:from-red-800 hover:to-rose-700"
                  } text-white`}
                >
                  {isRecording ? (
                    <>
                      <Circle className="w-4 h-4 mr-2 fill-current" />
                      Recording ({Math.ceil(RECORD_DURATION_MS / 1000 * (1 - recordProgress))}s)
                    </>
                  ) : (
                    <>
                      <Circle className="w-4 h-4 mr-2" />
                      Record (5s)
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleSpeak}
                  disabled={!currentTranslation || isRecording || isProcessing}
                  variant="outline"
                  className="flex-1 font-semibold"
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  Speak
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Sensor Data */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200/50 dark:border-slate-700/50 p-6 shadow-lg transition-colors duration-300">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
                Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg transition-colors duration-300">
                  <span className="text-gray-600 dark:text-gray-300 font-medium transition-colors duration-300">
                    Gloves
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      glovesConnected
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {glovesConnected ? "Connected" : "Disconnected"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg transition-colors duration-300">
                  <span className="text-gray-600 dark:text-gray-300 font-medium transition-colors duration-300">
                    Model
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      modelStatus === "ready"
                        ? "bg-green-100 text-green-700"
                        : modelStatus === "loading"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {modelStatus === "ready" ? "Ready" : modelStatus === "loading" ? "Loading..." : "Error"}
                  </span>
                </div>
                {latestSensorData && (
                  <div className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg text-xs font-mono text-gray-600 dark:text-gray-300 transition-colors duration-300 space-y-1">
                    <div>Flex: {latestSensorData.slice(0, 5).map((v) => v.toFixed(0)).join(", ")}</div>
                    <div>Quat: {latestSensorData.slice(5, 9).map((v) => v.toFixed(2)).join(", ")}</div>
                    <div>Accel: {latestSensorData.slice(9, 12).map((v) => v.toFixed(2)).join(", ")}</div>
                    <div>Gyro: {latestSensorData.slice(12, 15).map((v) => v.toFixed(2)).join(", ")}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Translation History */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200/50 dark:border-slate-700/50 p-6 shadow-lg transition-colors duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">
                  History
                </h3>
                <button
                  onClick={() => setTranslationHistory([])}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Clear history"
                >
                  <RotateCw className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {translationHistory.length > 0 ? (
                  translationHistory.map((translation, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-gradient-to-r from-rose-50 to-red-50 rounded-lg border border-red-100/50 cursor-pointer hover:border-red-200 transition-colors group"
                      onClick={() => setCurrentTranslation(translation)}
                    >
                      <p className="text-sm text-gray-700 group-hover:text-gray-900">
                        {translation}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-400 py-8 text-sm">
                    No translations yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  );
}
