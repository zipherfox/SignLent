import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { ArrowRight, Mic, Zap, Globe, Hand, Radio } from "lucide-react";
import { motion } from "framer-motion";

export default function Index() {
  return (
    <motion.div
      className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-rose-100 to-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-br from-red-200 to-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/3 left-1/2 w-72 h-72 bg-gradient-to-br from-slate-200 to-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-20">
            <div className="inline-block mb-4 px-4 py-2 bg-rose-100/80 rounded-full border border-rose-200/50">
              <span className="text-rose-700 text-xs sm:text-sm font-semibold">🎯 Breaking Communication Barriers</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Sign Language
              <span className="bg-gradient-to-r from-red-700 to-rose-600 bg-clip-text text-transparent"> Made Accessible</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Real-time sign language translation powered by AI. Understand sign language conversations instantly through voice output and live subtitles.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/translate">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-red-700 to-rose-600 hover:from-red-800 hover:to-rose-700 text-white text-base sm:text-lg font-semibold shadow-xl hover:shadow-2xl transition-all group">
                  Start Translating
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base sm:text-lg border-gray-300 hover:border-gray-400">
                  Learn More
                </Button>
              </a>
            </div>
          </div>

          {/* Hero Image / Demo Area */}
          <div className="relative mt-16 sm:mt-20">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-rose-600/10 dark:from-red-600/5 dark:to-rose-600/5 rounded-2xl blur-2xl transition-colors duration-300"></div>
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-800 rounded-2xl border border-gray-200/50 dark:border-slate-600/50 p-8 sm:p-12 lg:p-16 shadow-2xl transition-colors duration-300">
              <div className="aspect-video bg-gradient-to-br from-rose-100 to-red-100 dark:from-red-900 dark:to-red-800 rounded-xl flex items-center justify-center transition-colors duration-300">
                <div className="text-center">
                  <div className="text-6xl mb-4">🤟</div>
                  <p className="text-gray-600 dark:text-gray-300 font-medium transition-colors duration-300">Sign Language Translation Demo</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 transition-colors duration-300">Connect your gloves to get started</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 bg-gray-50 dark:bg-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
              Powerful Features for Accessibility
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300">
              Multiple ways to translate sign language for seamless communication
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200/50 dark:border-slate-700/50 p-8 sm:p-10 hover:border-red-200/50 dark:hover:border-red-800/50 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-rose-100 to-red-100 dark:from-red-900 dark:to-red-800 rounded-xl flex items-center justify-center mb-6 group-hover:from-rose-200 group-hover:to-red-200 dark:group-hover:from-red-800 dark:group-hover:to-red-700 transition-colors">
                <Mic className="w-7 h-7 text-red-700 dark:text-red-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-300">Voice Output</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300">
                Signs are automatically converted to spoken words. Perfect for real-time conversations and accessibility.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200/50 dark:border-slate-700/50 p-8 sm:p-10 hover:border-red-200/50 dark:hover:border-red-800/50 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-xl flex items-center justify-center mb-6 group-hover:from-slate-200 group-hover:to-slate-300 dark:group-hover:from-slate-600 dark:group-hover:to-slate-500 transition-colors">
                <Radio className="w-7 h-7 text-slate-700 dark:text-slate-300" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-300">Live Subtitles</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300">
                Full-screen subtitle display acts as a secondary webcam feed. Easy to read and understand in real-time.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200/50 dark:border-slate-700/50 p-8 sm:p-10 hover:border-red-200/50 dark:hover:border-red-800/50 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-900 dark:to-red-800 rounded-xl flex items-center justify-center mb-6 group-hover:from-red-200 group-hover:to-rose-200 dark:group-hover:from-red-800 dark:group-hover:to-red-700 transition-colors">
                <Hand className="w-7 h-7 text-red-700 dark:text-red-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-300">Smart Gloves</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300">
                Connect your smart gloves for accurate and responsive sign language detection and translation.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200/50 dark:border-slate-700/50 p-8 sm:p-10 hover:border-red-200/50 dark:hover:border-red-800/50 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-xl flex items-center justify-center mb-6 group-hover:from-slate-200 group-hover:to-slate-300 dark:group-hover:from-slate-600 dark:group-hover:to-slate-500 transition-colors">
                <Zap className="w-7 h-7 text-slate-700 dark:text-slate-300" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-300">Real-Time</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300">
                Instant translation as you sign. Low latency AI processing for smooth, natural conversations.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200/50 dark:border-slate-700/50 p-8 sm:p-10 hover:border-red-200/50 dark:hover:border-red-800/50 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-900 dark:to-red-800 rounded-xl flex items-center justify-center mb-6 group-hover:from-red-200 group-hover:to-rose-200 dark:group-hover:from-red-800 dark:group-hover:to-red-700 transition-colors">
                <Globe className="w-7 h-7 text-red-700 dark:text-red-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-300">Multi-Language</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300">
                Support for multiple sign languages and spoken languages. Connect across borders effortlessly.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200/50 dark:border-slate-700/50 p-8 sm:p-10 hover:border-red-200/50 dark:hover:border-red-800/50 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-xl flex items-center justify-center mb-6 group-hover:from-slate-200 group-hover:to-slate-300 dark:group-hover:from-slate-600 dark:group-hover:to-slate-500 transition-colors">
                <Zap className="w-7 h-7 text-slate-700 dark:text-slate-300" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-300">Mobile Ready</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300">
                Use on any device - phone, tablet, or desktop. Take sign language translation anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 bg-gradient-to-br from-red-700 to-rose-600 dark:from-slate-800 dark:to-slate-900 transition-colors duration-300">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 transition-colors duration-300">
            Ready to Break Down Barriers?
          </h2>
          <p className="text-lg sm:text-xl text-red-100 dark:text-gray-300 mb-10 max-w-2xl mx-auto transition-colors duration-300">
            Start translating sign language in real-time. Connect your gloves and begin communicating instantly.
          </p>
          <Link to="/translate">
            <Button size="lg" className="w-full sm:w-auto bg-white hover:bg-gray-100 text-red-700 hover:text-red-800 text-lg font-bold shadow-2xl hover:shadow-3xl transition-all">
              Launch Translator
              <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-slate-950 text-gray-400 dark:text-gray-500 py-12 sm:py-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4">SignVoice</h3>
              <p className="text-sm">Breaking communication barriers through AI-powered sign language translation.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="text-sm space-y-2">
                <li><Link to="/translate" className="hover:text-white transition-colors">Translator</Link></li>
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="text-sm space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-sm text-center">
            <p>&copy; 2024 SignVoice. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
