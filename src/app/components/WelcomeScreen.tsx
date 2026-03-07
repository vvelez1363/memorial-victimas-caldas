import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "motion/react";
import { ChevronDown, SkipForward } from "lucide-react";

interface WelcomeScreenProps {
  onComplete: () => void;
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [scrollY, setScrollY] = useState(0);
  const [isOpening, setIsOpening] = useState(false);
  const [isReadyToOpen, setIsReadyToOpen] = useState(false);
  const completionTimeoutRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const wheelCooldownTimeoutRef = useRef<number | null>(null);
  const isWheelCoolingDownRef = useRef(false);

  const scheduleCompletion = useCallback(() => {
    if (completionTimeoutRef.current) {
      window.clearTimeout(completionTimeoutRef.current);
    }
    completionTimeoutRef.current = window.setTimeout(onComplete, 1500);
  }, [onComplete]);

  const handleSkip = useCallback(() => {
    if (!isOpening) {
      setIsOpening(true);
      scheduleCompletion();
    }
  }, [isOpening, scheduleCompletion]);

  useEffect(() => {
    // Handle Escape key to skip
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleSkip();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    const handleScroll = (e: WheelEvent) => {
      if (!isOpening && scrollY < 100) {
        if (!isReadyToOpen) {
          setIsReadyToOpen(true);
          isWheelCoolingDownRef.current = true;
          if (wheelCooldownTimeoutRef.current) {
            window.clearTimeout(wheelCooldownTimeoutRef.current);
          }
          wheelCooldownTimeoutRef.current = window.setTimeout(() => {
            isWheelCoolingDownRef.current = false;
          }, 400);
          return;
        }
        if (isWheelCoolingDownRef.current || e.deltaY <= 0) {
          return;
        }
        e.preventDefault();
        setScrollY((prev) => {
          const newValue = Math.min(prev + Math.abs(e.deltaY), 100);
          if (newValue >= 80 && !isOpening) {
            setIsOpening(true);
            scheduleCompletion(); // Wait for animation to complete
          }
          return newValue;
        });
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartYRef.current = touch.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isOpening && scrollY < 100) {
        if (!isReadyToOpen) {
          setIsReadyToOpen(true);
          return;
        }
        const touch = e.touches[0];
        const touchStartY = touchStartYRef.current ?? touch.clientY;
        const deltaY = touchStartY - touch.clientY;

        if (deltaY > 0) {
          e.preventDefault();
          setScrollY((prev) => {
            const newValue = Math.min(prev + Math.abs(deltaY) * 0.5, 100);
            if (newValue >= 80 && !isOpening) {
              setIsOpening(true);
              scheduleCompletion();
            }
            return newValue;
          });
        }
      }
    };

    window.addEventListener("wheel", handleScroll, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [scrollY, isOpening, isReadyToOpen, handleSkip, scheduleCompletion]);

  useEffect(() => {
    return () => {
      if (completionTimeoutRef.current) {
        window.clearTimeout(completionTimeoutRef.current);
        completionTimeoutRef.current = null;
      }
      if (wheelCooldownTimeoutRef.current) {
        window.clearTimeout(wheelCooldownTimeoutRef.current);
        wheelCooldownTimeoutRef.current = null;
      }
    };
  }, []);

  const splitAmount = isOpening ? scrollY * 10 : 0; // Max 1000px split

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-gradient-to-br from-[#4A5D3F] via-[#5a6d4f] to-[#7A8B6F] flex items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Soft glowing orbs with natural tones */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C9A227]/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#D4D9C5]/15 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        />
      </div>

      {/* Skip Button */}
      <motion.button
        className="absolute top-8 right-8 z-50 text-white/70 hover:text-white transition-colors pointer-events-auto bg-black/20 backdrop-blur-sm rounded-full p-3 hover:bg-black/30"
        onClick={handleSkip}
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpening ? 0 : 1 }}
        transition={{ delay: 2 }}
        title="Saltar introducción (ESC)"
      >
        <SkipForward className="w-5 h-5" />
      </motion.button>

      {/* Left Half */}
      <motion.div
        className="absolute top-0 left-0 w-1/2 h-full overflow-hidden"
        animate={{
          x: isOpening ? `-${splitAmount}px` : 0,
        }}
        transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
      >
        <div
          className="absolute inset-0 w-[200vw] h-full bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1769538484869-6e01a9bc11bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvbWJpYW4lMjBtb3VudGFpbnMlMjBzdW5yaXNlJTIwbWlzdHklMjBsYW5kc2NhcGUlMjBuYXR1cmUlMjBob3BlJTIwcGVhY2VmdWx8ZW58MXx8fHwxNzcyODA3MTIzfDA&ixlib=rb-4.1.0&q=80&w=1080')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-[#2d4a5c]/20 to-black/40" />
        </div>
      </motion.div>

      {/* Right Half */}
      <motion.div
        className="absolute top-0 right-0 w-1/2 h-full overflow-hidden"
        animate={{
          x: isOpening ? `${splitAmount}px` : 0,
        }}
        transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
      >
        <div
          className="absolute inset-0 w-[200vw] h-full bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1769538484869-6e01a9bc11bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvbWJpYW4lMjBtb3VudGFpbnMlMjBzdW5yaXNlJTIwbWlzdHklMjBsYW5kc2NhcGUlMjBuYXR1cmUlMjBob3BlJTIwcGVhY2VmdWx8ZW58MXx8fHwxNzcyODA3MTIzfDA&ixlib=rb-4.1.0&q=80&w=1080')`,
            backgroundPositionX: "-100%",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-[#2d4a5c]/20 to-black/40" />
        </div>
      </motion.div>

      {/* Content Overlay */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center pointer-events-none"
        animate={{
          opacity: isOpening ? 0 : 1,
        }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        >
          {/* Main Message */}
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-white mb-6 leading-tight drop-shadow-2xl max-w-5xl">
            La memoria mantiene viva la esperanza.
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-white/90 mb-16 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
            Un santuario digital para honrar a las víctimas de desaparición
            <br className="hidden sm:block" />y preservar sus historias.
          </p>

          {/* Scroll Indicator */}
          <motion.div
            className="flex flex-col items-center gap-3"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <p className="text-white/80 text-lg font-light tracking-wide">
              {isReadyToOpen
                ? "Desliza para entrar"
                : "Toca o desplaza para activar"}
            </p>
            <div className="w-6 h-10 border-2 border-white/60 rounded-full flex items-start justify-center p-2 backdrop-blur-sm bg-white/10">
              <motion.div
                className="w-1.5 h-3 bg-white rounded-full"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
            <ChevronDown className="w-8 h-8 text-white/60" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Progress Indicator */}
      {scrollY > 0 && !isOpening && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-white/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="h-full bg-[#d4af37]"
            style={{ width: `${scrollY}%` }}
          />
        </motion.div>
      )}
    </motion.div>
  );
}
