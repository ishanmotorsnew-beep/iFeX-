import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Workflow, ShieldCheck, UserCheck } from 'lucide-react';
import Button from '../Common/Button';
import Warp, { warpPresets } from '../ui/warp';

// Framer motion variants for left-hand content fade-in
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Hero() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const heroMotion = {
    staggerChildren: isMobile ? 0.08 : 0.15,
    delayChildren: isMobile ? 0.02 : 0.1,
  };

  const itemMotion = {
    hidden: { opacity: 0, y: isMobile ? 12 : 30, filter: isMobile ? 'blur(0px)' : 'blur(8px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: isMobile ? 0.45 : 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const nectarPreset = warpPresets.find(p => p.name === 'Nectar' || p.name === 'nectar') || warpPresets[0];

  return (
    <section className="home-hero relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-transparent pt-20 pb-16">
      
      {/* Warp Animated Background */}
      <div className="absolute inset-0 z-0 opacity-100">
        <Warp 
          {...nectarPreset.params} 
          speed={2.0} 
          softness={0.9} 
          colors={['#f0edea', '#796b9e', '#f0edea', '#796b9e', '#0d1d5e', '#151310']} 
          style={{ width: '100%', height: '100%' }} 
        />
      </div>

      {/* Subtle dark gradient overlay on the left for text legibility */}
      <div className="absolute inset-y-0 left-0 w-full md:w-1/2 lg:w-3/5 bg-gradient-to-r from-[#151310]/90 via-[#151310]/40 to-transparent z-10 pointer-events-none" />

      {/* 4. DOM Layout Wrapper */}
      <div className="section-container w-full relative z-20 flex items-center min-h-[calc(100vh-144px)]">
        <div className="w-full flex flex-col justify-center text-left">
          <AnimatePresence>
            <motion.div
              variants={{
                ...containerVariants,
                show: {
                  ...containerVariants.show,
                  transition: {
                    staggerChildren: heroMotion.staggerChildren,
                    delayChildren: heroMotion.delayChildren,
                  },
                },
              }}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-6 sm:gap-8 max-w-3xl"
            >
              {/* Headline */}
              <motion.h1
                variants={itemMotion}
                className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight"
              >
                Engineering{' '}
                <span className="glow-text bg-gradient-to-r from-[#7dd3fc] via-[#60a5fa] to-[#3b82f6] bg-clip-text text-transparent font-extrabold tracking-tight">
                  Intelligent Solutions
                </span>{' '}
                for Modern Businesses
              </motion.h1>

              {/* Grid of Three Badges */}
              <motion.div
                variants={itemMotion}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 w-full mt-2"
              >
                {/* Badge 1: Innovative Solutions */}
                <div className="glass-card p-4 flex items-center gap-3.5 border border-white/15 hover:border-cyan/40 transition-all duration-300 bg-white/[0.12]">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cyan/30 bg-cyan/15 shadow-[0_0_18px_rgba(6,182,212,0.24)]">
                    <Workflow className="h-5 w-5 text-cyan" />
                  </div>
                  <div className="text-sm font-bold text-white/90 leading-tight">
                    <div>Innovative</div>
                    <div className="font-normal text-white/60">Solutions</div>
                  </div>
                </div>

                {/* Badge 2: Quality & Reliability */}
                <div className="glass-card p-4 flex items-center gap-3.5 border border-white/15 hover:border-cyan/40 transition-all duration-300 bg-white/[0.12]">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cyan/30 bg-cyan/15 shadow-[0_0_18px_rgba(6,182,212,0.24)]">
                    <ShieldCheck className="h-5 w-5 text-cyan" />
                  </div>
                  <div className="text-sm font-bold text-white/90 leading-tight">
                    <div>Quality &</div>
                    <div className="font-normal text-white/60">Reliability</div>
                  </div>
                </div>

                {/* Badge 3: Client Satisfaction */}
                <div className="glass-card p-4 flex items-center gap-3.5 border border-white/15 hover:border-cyan/40 transition-all duration-300 bg-white/[0.12]">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cyan/30 bg-cyan/15 shadow-[0_0_18px_rgba(6,182,212,0.24)]">
                    <UserCheck className="h-5 w-5 text-cyan" />
                  </div>
                  <div className="text-sm font-bold text-white/90 leading-tight">
                    <div>Client</div>
                    <div className="font-normal text-white/60">Satisfaction</div>
                  </div>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                variants={itemMotion}
                className="flex flex-wrap gap-4 items-center mt-3"
              >
                <Button Component={Link} to="/contact" className="px-7 py-3.5 text-sm font-bold">
                  Start a Project
                </Button>
                <Button
                  Component={Link}
                  to="/portfolio"
                  variant="ghost"
                  icon={false}
                  className="px-7 py-3.5 text-sm font-bold flex items-center gap-2"
                >
                  <Play className="h-4 w-4 fill-white text-white" />
                  View Our Work
                </Button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
