import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, Hand, RotateCw } from "lucide-react";
import { motion } from "framer-motion";
import { useBluetooth } from "@/hooks/use-bluetooth";

interface SensorData {
  fingers: number[];
  gyro_Q: number[];
  gyro: number[];
  accel: number[];
}

export default function Translate() {
  const [glovesConnected, setGlovesConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [sensorData, setSensorData] = useState<SensorData>({
    fingers: [],
    gyro_Q: [],
    gyro: [],
    accel: [],
  });
  const [currentTranslation, setCurrentTranslation] = useState("");
  const [translationHistory, setTranslationHistory] = useState<string[]>([]);

  const BLE_CONFIG = {
    SENSOR_SERVICE_UUID: "f40d6fd3-70e8-4008-bf64-03a57b87fdc6",
    SENSOR_CHARACTERISTIC_UUID: "7094fd70-4532-4d73-a118-473a0a63701a",
    BATTERY_CHARACTERISTIC_UUID: "00002a19-0000-1000-8000-00805f9b34fb", // Standard Battery Service UUID
  };
  const {
    device,
    connect,
    requestDevice,
    startNotifications,
    stopNotifications,
  } = useBluetooth();

  const connectToDevice = async () => {
    await requestDevice({
      filters: [{ services: [BLE_CONFIG.SENSOR_SERVICE_UUID] }],
      optionalServices: [BLE_CONFIG.SENSOR_SERVICE_UUID],
    });
    if (device && !device.connected) {
      await connect();
      setGlovesConnected(device.connected);
    }
  };

  const readData = (value: DataView<ArrayBuffer>) => {
    const totalBytes = value.byteLength;
    const PACKET_LEN = 50;
    for (let base = 0; base + PACKET_LEN <= totalBytes; base += PACKET_LEN) {
      // Read 5 u16 values for fingers (2 bytes each, big-endian)
      const fingers: number[] = [];
      for (let i = 0; i < 5; i++) {
        fingers.push(value.getUint16(base + i * 2, false)); // false = big-endian
      }

      // Read 4 f32 values for gyro quaternion (4 bytes each, big-endian)
      const gyro_Q: number[] = [];
      const gyro_QOffset = base + 10; // after 5 u16s
      for (let i = 0; i < 4; i++) {
        gyro_Q.push(value.getFloat32(gyro_QOffset + i * 4, false)); // false = big-endian
      }

      // Read 3 f32 values for acceleration (4 bytes each, big-endian)
      const accel: number[] = [];
      const accelOffset = base + 26; // after 5 u16s + 4 f32s (10 + 16)
      for (let i = 0; i < 3; i++) {
        accel.push(value.getFloat32(accelOffset + i * 4, false)); // false = big-endian
      }

      // Read 3 f32 values for gyroscope (4 bytes each, big-endian)
      const gyro: number[] = [];
      const gyroOffset = base + 38; // after 5 u16s + 4 f32s + 3 f32s (10 + 16 + 12)
      for (let i = 0; i < 3; i++) {
        gyro.push(value.getFloat32(gyroOffset + i * 4, false)); // false = big-endian
      }

      const data: SensorData = { fingers, gyro_Q, gyro, accel };
      //console.log("📊 Sensor data:", sensorData);

      // Invoke callback for each complete packet received
      setSensorData(data);
    }
  };

  const handleStartListening = async () => {
    setIsListening(!isListening);
    if (isListening && device?.connected) {
      await startNotifications(
        BLE_CONFIG.SENSOR_SERVICE_UUID,
        BLE_CONFIG.SENSOR_CHARACTERISTIC_UUID,
        readData,
      );
    } else {
      await stopNotifications(
        BLE_CONFIG.SENSOR_SERVICE_UUID,
        BLE_CONFIG.SENSOR_CHARACTERISTIC_UUID,
      );
    }
  };

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

            {/* Camera and Translation Area */}
            <div className="gap-6">
              {/* Translation Output */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200/50 dark:border-slate-700/50 p-6 sm:p-8 shadow-lg flex flex-col transition-colors duration-300">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
                  Translated Text
                </h2>
                <div className="flex-1 bg-gradient-to-br from-rose-50 to-red-50 dark:from-red-950 dark:to-red-900 rounded-xl p-6 flex items-center justify-center min-h-24 mb-6 border border-red-200/50 dark:border-red-800/50 transition-colors duration-300">
                  <p className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white transition-colors duration-300">
                    {currentTranslation || "Start translating..."}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleStartListening}
                    disabled={!glovesConnected}
                    className={`flex-1 font-semibold ${
                      isListening
                        ? "bg-red-700 hover:bg-red-800"
                        : "bg-gradient-to-r from-red-700 to-rose-600 hover:from-red-800 hover:to-rose-700"
                    } text-white`}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-4 h-4 mr-2" />
                        Stop
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4 mr-2" />
                        Listen
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleSpeak}
                    disabled={!currentTranslation}
                    variant="outline"
                    className="flex-1 font-semibold"
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    Speak
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
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
                    {glovesConnected ? `${sensorData}` : "Disconnected"}
                  </span>
                </div>
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
