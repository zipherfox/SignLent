import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="w-full border-b border-gray-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-red-700 to-rose-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <span className="text-white font-bold text-lg sm:text-xl">✋</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 text-base sm:text-lg">SignVoice</span>
              <span className="text-[10px] sm:text-xs text-gray-500">Sign to Speech</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden sm:flex items-center gap-8">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium text-sm"
            >
              Home
            </Link>
            <Link 
              to="/translate" 
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium text-sm"
            >
              Translator
            </Link>
            <a 
              href="#features" 
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium text-sm"
            >
              Features
            </a>
          </nav>

          {/* Theme Toggle & CTA Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                title="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-600" />
                )}
              </button>
            )}
            <Link to="/translate">
              <Button className="bg-gradient-to-r from-red-700 to-rose-600 hover:from-red-800 hover:to-rose-700 dark:from-red-600 dark:to-rose-500 dark:hover:from-red-700 dark:hover:to-rose-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all text-sm sm:text-base">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
