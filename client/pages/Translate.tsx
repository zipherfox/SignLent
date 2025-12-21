import { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, Zap, Hand, RotateCw } from "lucide-react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Translate() {
  const [glovesConnected, setGlovesConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentTranslation, setCurrentTranslation] = useState("");
  const [translationHistory, setTranslationHistory] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>("");

  useEffect(() => {
    // Enumerate cameras on mount
    enumerateCameras();
  }, []);

  useEffect(() => {
    if (cameraActive) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [cameraActive, selectedCamera]);

  const enumerateCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((device) => device.kind === "videoinput");
      setCameras(videoDevices);
      if (videoDevices.length > 0 && !selectedCamera) {
        setSelectedCamera(videoDevices[0].deviceId);
      }
    } catch (error) {
      console.error("Error enumerating cameras:", error);
    }
  };

  const startCamera = async () => {
    try {
      const constraints: MediaStreamConstraints = {
        video: selectedCamera ? { deviceId: { exact: selectedCamera } } : true,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  const handleConnectGloves = () => {
    setGlovesConnected(!glovesConnected);
  };

  const handleStartListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate translation
      setTimeout(() => {
        const mockTranslations = [
          "Hello",
          "How are you?",
          "Thank you",
          "What is your name?",
          "I am learning sign language",
        ];
        const randomTranslation =
          mockTranslations[Math.floor(Math.random() * mockTranslations.length)];
        setCurrentTranslation(randomTranslation);
        setTranslationHistory([randomTranslation, ...translationHistory.slice(0, 4)]);
      }, 1000);
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
                  onClick={handleConnectGloves}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Camera Feed */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200/50 dark:border-slate-700/50 overflow-hidden shadow-lg transition-colors duration-300">
                <div className="aspect-video bg-gray-900 relative">
                  {cameraActive ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center flex-col gap-4">
                      <div className="text-6xl">📷</div>
                      <p className="text-gray-400 text-center">Camera Inactive</p>
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Select Camera
                    </label>
                    <Select
                      value={selectedCamera}
                      onValueChange={setSelectedCamera}
                      disabled={cameras.length === 0}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose a camera" />
                      </SelectTrigger>
                      <SelectContent>
                        {cameras.map((camera) => (
                          <SelectItem key={camera.deviceId} value={camera.deviceId}>
                            {camera.label || `Camera ${cameras.indexOf(camera) + 1}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={() => setCameraActive(!cameraActive)}
                    variant="outline"
                    className="w-full"
                    disabled={cameras.length === 0}
                  >
                    {cameraActive ? "Stop Camera" : "Start Camera"}
                  </Button>
                </div>
              </div>

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

            {/* Full Screen Subtitles */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200/50 dark:border-slate-700/50 p-6 sm:p-8 shadow-lg transition-colors duration-300">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
                Full Screen Subtitles
              </h2>
              <div className="bg-gray-900 rounded-xl aspect-video flex items-end justify-center p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
                <p className="text-2xl sm:text-4xl font-bold text-white text-center relative z-10">
                  {currentTranslation || "Waiting for input..."}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-3 text-sm text-gray-600">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span>
                  Subtitles display in full-screen for use as a secondary
                  webcam feed
                </span>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200/50 dark:border-slate-700/50 p-6 shadow-lg transition-colors duration-300">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg transition-colors duration-300">
                  <span className="text-gray-600 dark:text-gray-300 font-medium transition-colors duration-300">Gloves</span>
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
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Listening</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      isListening
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {isListening ? "Active" : "Idle"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Camera</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      cameraActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {cameraActive ? "Active" : "Off"}
                  </span>
                </div>
              </div>
            </div>

            {/* Translation History */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200/50 dark:border-slate-700/50 p-6 shadow-lg transition-colors duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">History</h3>
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

            {/* Help Section */}
            <div className="bg-gradient-to-br from-rose-50 to-red-50 dark:from-red-950 dark:to-red-900 rounded-2xl border border-red-200/50 dark:border-red-800/50 p-6 transition-colors duration-300">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-300">Getting Started</h3>
              <ol className="text-sm text-gray-700 dark:text-gray-300 space-y-2 list-decimal list-inside transition-colors duration-300">
                <li>Connect your gloves</li>
                <li>Start the camera</li>
                <li>Click "Listen" to begin</li>
                <li>Sign naturally</li>
                <li>View translations and speak them out</li>
              </ol>
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  );
}
