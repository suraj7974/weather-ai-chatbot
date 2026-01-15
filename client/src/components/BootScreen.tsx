import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BootScreenProps {
  onComplete: () => void;
}

export function BootScreen({ onComplete }: BootScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<'greetings' | 'pause' | 'icons' | 'exit'>('greetings');
  const [isComplete, setIsComplete] = useState(false);

  const greetings = ['Hello', 'नमस्ते', 'こんにちは'];

  useEffect(() => {
    if (phase !== 'greetings') return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev < greetings.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => setPhase('pause'), 100);
          return prev;
        }
      });
    }, 400); // Increased from 220

    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (phase === 'pause') {
      const timer = setTimeout(() => {
        setPhase('icons');
      }, 600); // Increased from 300
      return () => clearTimeout(timer);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'icons') {
      const timer = setTimeout(() => {
        setPhase('exit');
      }, 700); // Increased from 350
      return () => clearTimeout(timer);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'exit') {
      setIsComplete(true);
      setTimeout(onComplete, 300);
    }
  }, [phase, onComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-neutral-950 flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }} // Increased from 0.12
        >
          {phase === 'greetings' && (
            <AnimatePresence mode="wait">
              <motion.span
                key={currentIndex}
                className="text-4xl md:text-6xl font-bold text-white tracking-wide"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.25, ease: 'easeOut' }} // Increased from 0.15
                style={{ textShadow: '0 0 20px rgba(255, 255, 255, 0.3)' }}
              >
                {greetings[currentIndex]}
              </motion.span>
            </AnimatePresence>
          )}

          {phase === 'icons' && (
            <div className="flex items-center gap-8 md:gap-12">
              {/* Tree Pine */}
              <motion.svg
                className="w-12 h-12 md:w-16 md:h-16 text-white"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0 }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m17 14 3 3.3a1 1 0 0 1-.7 1.7H4.7a1 1 0 0 1-.7-1.7L7 14h-.3a1 1 0 0 1-.7-1.7L9 9h-.2A1 1 0 0 1 8 7.3L12 3l4 4.3a1 1 0 0 1-.8 1.7H15l3 3.3a1 1 0 0 1-.7 1.7H17Z"/>
                <path d="M12 22v-3"/>
              </motion.svg>

              {/* Snowflake */}
              <motion.svg
                className="w-12 h-12 md:w-16 md:h-16 text-white"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m10 20-1.25-2.5L6 18"/>
                <path d="M10 4 8.75 6.5 6 6"/>
                <path d="m14 20 1.25-2.5L18 18"/>
                <path d="m14 4 1.25 2.5L18 6"/>
                <path d="m17 21-3-6h-4"/>
                <path d="m17 3-3 6 1.5 3"/>
                <path d="M2 12h6.5L10 9"/>
                <path d="m20 10-1.5 2 1.5 2"/>
                <path d="M22 12h-6.5L14 15"/>
                <path d="m4 10 1.5 2L4 14"/>
                <path d="m7 21 3-6-1.5-3"/>
                <path d="m7 3 3 6h4"/>
              </motion.svg>

              {/* Sun */}
              <motion.svg
                className="w-12 h-12 md:w-16 md:h-16 text-white"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.2 }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="4"/>
                <path d="M12 2v2"/>
                <path d="M12 20v2"/>
                <path d="m4.93 4.93 1.41 1.41"/>
                <path d="m17.66 17.66 1.41 1.41"/>
                <path d="M2 12h2"/>
                <path d="M20 12h2"/>
                <path d="m6.34 17.66-1.41 1.41"/>
                <path d="m19.07 4.93-1.41 1.41"/>
              </motion.svg>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
