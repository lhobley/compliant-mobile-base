import React from 'react';
import { motion } from 'framer-motion';

export const VideoIntro = () => {
  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      {/* Background Cinematic Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent"
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Logo Container with 3D-like flip */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 1.5
          }}
          className="relative"
        >
          {/* Glow effect */}
          <motion.div 
            className="absolute inset-0 bg-blue-500 rounded-full blur-2xl"
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="w-40 h-40 object-contain relative z-10 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
          />
        </motion.div>

        {/* Text Reveal */}
        <div className="mt-8 overflow-hidden">
          <motion.h1
            className="text-4xl font-black text-white tracking-widest uppercase text-center"
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
          >
            Compliance<span className="text-blue-500">Daddy</span>
          </motion.h1>
        </div>

        {/* Subtitle / Tagline */}
        <motion.p
          className="mt-2 text-slate-400 font-medium tracking-[0.3em] text-xs uppercase"
          initial={{ opacity: 0, letterSpacing: "0em" }}
          animate={{ opacity: 1, letterSpacing: "0.3em" }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          Authenticating Secure Session
        </motion.p>

        {/* Loading Progress Line */}
        <motion.div 
          className="mt-12 h-0.5 w-64 bg-slate-800 rounded-full overflow-hidden relative"
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 256 }}
          transition={{ delay: 1 }}
        >
          <motion.div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.2, delay: 1.2, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};
