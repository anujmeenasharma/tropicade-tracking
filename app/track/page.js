'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { Globe, ShieldCheck, Zap, ArrowRight, Activity, CalendarClock, Plane } from 'lucide-react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';

export default function Home() {
  const [trackingId, setTrackingId] = useState('');
  const router = useRouter();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (trackingId.trim()) {
      router.push(`/track/${trackingId}`);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Abstract Background Elements */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full pointer-events-none"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full pointer-events-none"
      />

      {/* Hero Section */}
      <section className="relative px-6 lg:px-8 flex h-[90vh] flex-col items-center justify-center">
        <motion.div
          style={{ opacity }}
          className="mx-auto max-w-4xl text-center z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl font-bold tracking-tight text-black sm:text-7xl mb-6">
              TitanXLogistics. <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E4DB7] to-[#1E6BF5]">
                Designed to Move the World.
              </span>
            </h1>
            <p className="mt-6 text-lg tracking-wide text-neutral-500 leading-relaxed max-w-2xl mx-auto">
              Experience the next generation of global supply chain tracking.
            </p>
          </motion.div>

          {/* Tracking Input */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mt-12 max-w-xl mx-auto"
          >
            <form onSubmit={handleSearch} className="group relative rounded-full p-2 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-[#E2E6EF] transition focus-within:border-[#1E4DB7] focus-within:shadow-[0_0_0_3px_rgba(30,77,183,0.12)]">
              <div className="flex items-center">
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="Enter Tracking ID..."
                  className="w-full bg-transparent pl-6 pr-4 py-3 text-lg outline-none placeholder:text-black text-black"
                />
                <Button type="submit" variant="accent" className="rounded-full shrink-0 ml-2">
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}