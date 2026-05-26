import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Hotel, 
  Sparkles, 
  MessageSquare, 
  BarChart3, 
  Star, 
  ArrowRight, 
  Compass 
} from 'lucide-react';

const Home = () => {
  // Animation Variants for staggered content entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } // Custom premium ease-out
    }
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" }
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white overflow-hidden scroll-smooth selection:bg-violet-500/30 select-none pb-20 transition-colors duration-500">
      
      {/* 1. LIQUID MESH BACKGROUND - Glowing pulsating gradient blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Violet/Magenta Blob */}
        <motion.div
          animate={{
            x: [0, 80, -40, 0],
            y: [0, -60, 40, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-violet-600/10 dark:from-violet-600/20 to-fuchsia-600/10 dark:to-fuchsia-600/20 blur-[120px] md:blur-[160px] opacity-70 dark:opacity-100"
        />
        
        {/* Cyan/Blue Blob */}
        <motion.div
          animate={{
            x: [0, -100, 60, 0],
            y: [0, 80, -50, 0],
            scale: [1, 1.15, 0.85, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-cyan-600/10 dark:from-cyan-600/15 to-blue-600/10 dark:to-blue-600/15 blur-[130px] md:blur-[180px] opacity-70 dark:opacity-100"
        />

        {/* Soft Center Background Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.08),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.12),rgba(255,255,255,0))]" />
        
        {/* Modern Dot Matrix Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.04] dark:opacity-[0.02]"
          style={{
            backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "24px 24px"
          }}
        />
      </div>

      {/* 2. HERO SECTION */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-28 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy & Actions */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 flex flex-col items-start text-left"
          >
            {/* Glowing Welcome Badge */}
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/5 dark:bg-violet-950/20 text-violet-600 dark:text-violet-300 text-sm font-medium backdrop-blur-md mb-6 hover:border-violet-500/40 transition-colors duration-300 cursor-default shadow-[0_0_15px_rgba(139,92,246,0.05)] dark:shadow-[0_0_15px_rgba(139,92,246,0.1)]"
            >
              <Sparkles className="h-4 w-4 text-violet-500 dark:text-violet-400 animate-pulse" />
              <span>The Next Generation of Hospitality</span>
            </motion.div>

            {/* Premium Headline with gradient */}
            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6 text-slate-900 dark:text-white"
            >
              Smart Luxury. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 dark:from-violet-400 dark:via-fuchsia-400 dark:to-cyan-400 drop-shadow-sm">
                Seamless Comfort.
              </span>
            </motion.h1>

            {/* High-Impact Description */}
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-slate-600 dark:text-slate-300 font-medium max-w-xl leading-relaxed mb-10"
            >
              Experience a world-class sanctuary where opulent suites blend perfectly with instant digital room service, real-time analytics, and automated smart management.
            </motion.p>

            {/* CTA Buttons with hover scale */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto"
            >
              <Button asChild size="lg" className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-full px-8 py-7 text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-[0_0_25px_rgba(139,92,246,0.3)] border-0 cursor-pointer">
                <Link to="/rooms" className="flex items-center gap-2">
                  <span>Explore Rooms</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              
              <Button asChild size="lg" variant="outline" className="rounded-full px-8 py-7 text-lg font-semibold bg-slate-900/5 dark:bg-white/5 hover:bg-slate-900/10 dark:hover:bg-white/10 text-slate-800 dark:text-white border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 backdrop-blur-md transition-all duration-300 hover:scale-105 cursor-pointer">
                <Link to="/register">Sign Up Now</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Column: Premium Interactive Floating Showcase */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[400px] lg:min-h-[500px]">
            
            {/* Center Showcase Glow Background */}
            <div className="absolute w-[300px] h-[300px] bg-violet-500/10 rounded-full blur-[80px]" />

            {/* Premium Main Image Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, rotate: 1 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="relative w-full max-w-[380px] md:max-w-[420px] aspect-[4/5] rounded-[30px] border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 p-3 shadow-xl dark:shadow-2xl backdrop-blur-sm overflow-hidden group"
            >
              <div className="relative w-full h-full rounded-[22px] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=1000" 
                  alt="Luxury Suite Room Showcase" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />
              </div>
            </motion.div>

            {/* FLOATING CARD 1: TripAdvisor Rating */}
            <motion.div
              animate={{
                y: [0, -12, 0],
                x: [0, 5, 0]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-[8%] left-[-6%] md:left-[-12%] bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 backdrop-blur-xl rounded-2xl p-4 shadow-lg dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center gap-3.5 max-w-[210px] cursor-default"
            >
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
                <Star className="h-6 w-6 fill-amber-500 text-amber-500" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Guest Rating</p>
                <p className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  5.0 / 5.0 <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">(Perfect)</span>
                </p>
              </div>
            </motion.div>

            {/* FLOATING CARD 2: Live Room Occupancy */}
            <motion.div
              animate={{
                y: [0, 10, 0],
                x: [0, -5, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute bottom-[10%] right-[-6%] md:right-[-10%] bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 backdrop-blur-xl rounded-2xl p-4 shadow-lg dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center gap-3.5 max-w-[210px] cursor-default"
            >
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 relative">
                <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <Hotel className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Suites Occupancy</p>
                <p className="text-base font-bold text-slate-900 dark:text-white">94% Booked Today</p>
              </div>
            </motion.div>

            {/* FLOATING CARD 3: Quick Request Status */}
            <motion.div
              animate={{
                y: [0, -8, 0],
                x: [0, 4, 0]
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
              className="absolute bottom-[2%] left-[4%] bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 backdrop-blur-xl rounded-2xl py-3 px-4 shadow-lg dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center gap-3 cursor-default"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-violet-600 dark:bg-violet-500 animate-pulse" />
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                ⚡ Towel delivery requested
                <span className="ml-2.5 px-2 py-0.5 rounded-full bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-300 font-bold text-[9px]">
                  Solved (2m)
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 3. LIVE REAL-TIME STATS ROW */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-3xl border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-slate-900/30 backdrop-blur-md shadow-lg dark:shadow-xl"
        >
          <div className="text-center md:border-r border-slate-200 dark:border-white/5 last:border-0 py-2">
            <h3 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400">10k+</h3>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Delighted Guests</p>
          </div>
          
          <div className="text-center md:border-r border-slate-200 dark:border-white/5 last:border-0 py-2">
            <h3 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-pink-500 dark:from-fuchsia-400 dark:to-pink-400">150+</h3>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Elite Suites & Rooms</p>
          </div>
          
          <div className="text-center md:border-r border-slate-200 dark:border-white/5 last:border-0 py-2">
            <h3 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-500 dark:from-pink-400 dark:to-cyan-400">99.8%</h3>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Service Satisfaction</p>
          </div>
          
          <div className="text-center py-2">
            <h3 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-violet-600 dark:from-cyan-400 dark:to-violet-400">24/7</h3>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Digital Concierge Support</p>
          </div>
        </motion.div>
      </div>

      {/* 4. SMART FEATURES GRID SECTION */}
      <div id="features" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/5 dark:bg-cyan-950/30 border border-cyan-500/25 text-cyan-600 dark:text-cyan-300 text-xs font-semibold mb-4 uppercase tracking-wider"
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Digital Superpowers</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white"
          >
            Reimagining the Hotel Experience
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-base md:text-lg text-slate-600 dark:text-slate-400 mt-4 leading-relaxed"
          >
            Say goodbye to traditional queues and manual paperwork. Control your entire lodging journey seamlessly with state-of-the-art tools.
          </motion.p>
        </div>

        {/* 2x2 Interactive Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Luxury Suites */}
          <motion.div
            variants={featureVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="group relative rounded-3xl border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-slate-900/20 p-8 md:p-10 hover:border-violet-500/35 hover:bg-white/80 dark:hover:bg-slate-900/40 transition-all duration-300 shadow-md dark:shadow-lg overflow-hidden cursor-default"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-violet-600/10 rounded-bl-[100px] blur-[15px] group-hover:bg-violet-600/25 transition-all duration-300" />
            
            <div className="p-4 rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400 inline-block mb-6 group-hover:scale-110 transition-transform duration-300">
              <Hotel className="h-8 w-8" />
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Immersive Catalog of Suites</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Explore an array of masterfully curated spaces ranging from deluxe ocean views to presidential penthouses. Check available facilities, detailed images, pricing, and live room specs instantaneously.
            </p>
          </motion.div>

          {/* Card 2: Instant Request Management */}
          <motion.div
            variants={featureVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="group relative rounded-3xl border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-slate-900/20 p-8 md:p-10 hover:border-fuchsia-500/35 hover:bg-white/80 dark:hover:bg-slate-900/40 transition-all duration-300 shadow-md dark:shadow-lg overflow-hidden cursor-default"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-fuchsia-600/10 rounded-bl-[100px] blur-[15px] group-hover:bg-fuchsia-600/25 transition-all duration-300" />
            
            <div className="p-4 rounded-2xl bg-fuchsia-500/10 text-fuchsia-650 dark:text-fuchsia-400 inline-block mb-6 group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="h-8 w-8" />
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Ultra-Fast Digital Service</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Need fresh linens, quick housekeeping, or a gourmet in-room breakfast? Place custom service requests on your personalized dashboard and watch staff respond in minutes.
            </p>
          </motion.div>

          {/* Card 3: Real-Time Chat Concierge */}
          <motion.div
            variants={featureVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="group relative rounded-3xl border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-slate-900/20 p-8 md:p-10 hover:border-cyan-500/35 hover:bg-white/80 dark:hover:bg-slate-900/40 transition-all duration-300 shadow-md dark:shadow-lg overflow-hidden cursor-default"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-600/10 rounded-bl-[100px] blur-[15px] group-hover:bg-cyan-600/25 transition-all duration-300" />
            
            <div className="p-4 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 inline-block mb-6 group-hover:scale-110 transition-transform duration-300">
              <MessageSquare className="h-8 w-8" />
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">24/7 Smart AI Companion</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Engage with our intelligent chatbot concierge. Whether you want to enquire about pool hours, request recommendations, or check local shuttle schedules, help is always a message away.
            </p>
          </motion.div>

          {/* Card 4: Intelligent Dashboard */}
          <motion.div
            variants={featureVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="group relative rounded-3xl border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-slate-900/20 p-8 md:p-10 hover:border-blue-500/35 hover:bg-white/80 dark:hover:bg-slate-900/40 transition-all duration-300 shadow-md dark:shadow-lg overflow-hidden cursor-default"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/10 rounded-bl-[100px] blur-[15px] group-hover:bg-blue-600/25 transition-all duration-300" />
            
            <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 inline-block mb-6 group-hover:scale-110 transition-transform duration-300">
              <BarChart3 className="h-8 w-8" />
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Live Insights & Analytics</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              For hotel administrators, oversee operations from a futuristic vantage point. Manage room inventories, review dynamic metrics, and track service requests with a complete real-time dashboard.
            </p>
          </motion.div>

        </div>
      </div>

      {/* 5. DYNAMIC PROCESS TIMELINE */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-slate-200/20 dark:bg-slate-900/10 rounded-[40px] border border-slate-200 dark:border-white/5 backdrop-blur-sm">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">How it Works</h2>
          <p className="text-slate-550 dark:text-slate-400 text-sm md:text-base mt-2">Elevating your hotel stay in three effortless steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          
          {/* Connector Line (visible on desktop) */}
          <div className="hidden md:block absolute top-[40px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-violet-500/30 via-fuchsia-500/30 to-cyan-500/30 z-0" />

          {/* Step 1 */}
          <div className="flex flex-col items-center text-center relative z-10">
            <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-950 border border-violet-300 dark:border-violet-500/40 text-violet-650 dark:text-violet-300 flex items-center justify-center font-black text-xl shadow-md dark:shadow-[0_0_20px_rgba(139,92,246,0.2)] mb-6 hover:scale-110 transition-transform duration-300 cursor-default">
              01
            </div>
            <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Find Your Sanctuary</h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xs leading-relaxed">
              Select your ideal premium suite using detailed image showcases and real-time room pricing.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center relative z-10">
            <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-950 border border-fuchsia-300 dark:border-fuchsia-500/40 text-fuchsia-650 dark:text-fuchsia-300 flex items-center justify-center font-black text-xl shadow-md dark:shadow-[0_0_20px_rgba(240,70,240,0.2)] mb-6 hover:scale-110 transition-transform duration-300 cursor-default">
              02
            </div>
            <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Command Instantly</h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xs leading-relaxed">
              Order gourmet meals, fresh towels, or support on your dynamic glass-theme user dashboard.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center relative z-10">
            <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-950 border border-cyan-300 dark:border-cyan-500/40 text-cyan-650 dark:text-cyan-300 flex items-center justify-center font-black text-xl shadow-md dark:shadow-[0_0_20px_rgba(34,211,238,0.2)] mb-6 hover:scale-110 transition-transform duration-300 cursor-default">
              03
            </div>
            <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Enjoy Next-Gen Luxury</h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xs leading-relaxed">
              Relax while our smart digital dispatch notifies our staff to fulfill requests immediately.
            </p>
          </div>

        </div>
      </div>

      {/* 6. IMMERSIVE BOTTOM CTA */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl border border-slate-200 dark:border-violet-500/20 bg-gradient-to-b from-slate-100 to-slate-200/50 dark:from-violet-950/20 dark:to-slate-950/40 p-12 text-center overflow-hidden shadow-lg dark:shadow-2xl"
        >
          {/* Radiant Backlights */}
          <div className="absolute bottom-[-50px] left-[50%] translate-x-[-50%] w-[350px] h-[350px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
            Ready to Experience Digital Opulence?
          </h2>
          <p className="text-base md:text-lg text-slate-700 dark:text-slate-300 max-w-xl mx-auto leading-relaxed mb-10 font-medium">
            Join thousands of guests who have upgraded their stays. Create your account today or view our available suites.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-slate-950 dark:bg-white hover:bg-slate-900 dark:hover:bg-slate-100 text-white dark:text-slate-950 rounded-full px-8 py-6 text-base font-semibold shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer w-full sm:w-auto border-0">
              <Link to="/rooms">Book A Suite</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8 py-6 text-base font-semibold bg-slate-900/5 dark:bg-white/5 hover:bg-slate-900/10 dark:hover:bg-white/10 text-slate-800 dark:text-white border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-105 cursor-pointer w-full sm:w-auto">
              <Link to="/register">Create Account</Link>
            </Button>
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default Home;
