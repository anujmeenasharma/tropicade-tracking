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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Abstract Background Elements */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none"
      />

      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-24 sm:pt-32 sm:pb-32 lg:px-8 flex flex-col items-center justify-center min-h-[calc(100vh-72px)]">
        <motion.div
          style={{ opacity }}
          className="mx-auto max-w-4xl text-center z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-7xl mb-6">
              TitanXLogistics. <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00388C] to-blue-400">
                Designed to Move the World.
              </span>
            </h1>
            <p className="mt-6 text-lg tracking-wide text-neutral-500 leading-relaxed max-w-2xl mx-auto">
              Experience the next generation of global supply chain tracking. Seamlessly beautiful, instantly informative, and built to the highest standards.
            </p>
          </motion.div>

          {/* Tracking Input */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mt-12 max-w-xl mx-auto"
          >
            <form onSubmit={handleSearch} className="group relative rounded-full p-2 bg-white/5 dark:bg-black/20 ring-1 ring-inset ring-black/5 dark:ring-white/10 shadow-2xl backdrop-blur-xl transition hover:ring-black/10 dark:hover:ring-white/20 focus-within:ring-[#00388C] dark:focus-within:ring-[#00388C]">
              <div className="flex items-center">
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="Enter Tracking ID..."
                  className="w-full bg-transparent pl-6 pr-4 py-3 text-lg outline-none placeholder:text-neutral-400"
                />
                <Button type="submit" variant="accent" className="rounded-full shrink-0 ml-2">
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Showcase Section */}
      <section className="py-24 sm:py-32 bg-neutral-50 dark:bg-black/50 border-t border-neutral-200 dark:border-neutral-900 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="text-base/7 font-semibold text-[#00388C]">Unmatched Clarity</h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Every detail, perfected.</p>
          </motion.div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {[
                { name: 'Global Network Visibility', description: 'Track across borders instantly. Our dynamic engine adapts country codes and local time zones seamlessly.', icon: Globe },
                { name: 'Business-Day Precision', description: 'Advanced logic strictly calculates transit times via business days for ultra-accurate delivery predictions.', icon: CalendarClock },
                { name: 'Intelligent Event Detection', description: 'Automated warnings and alerts. We surface exact delay reasons directly on the elegant tracking timeline.', icon: Zap },
                { name: 'Encrypted Security', description: 'Your supply chain data is highly secured, utilizing Next.js server actions to prevent exposure.', icon: ShieldCheck },
                { name: 'Real-time Telemetry', description: 'Syncs continuously with international flight logs and local processing hubs instantly.', icon: Plane },
                { name: 'Data-driven Analytics', description: 'The included admin dashboard provides high-level overviews on every package currently in transit.', icon: Activity },
              ].map((feature, idx) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <GlassCard className="flex flex-col h-full p-8">
                    <dt className="flex items-center gap-x-3 text-lg font-semibold text-foreground mb-4">
                      <div className="flex bg-[#00388C]/10 dark:bg-[#00388C]/20 p-2.5 rounded-lg">
                        <feature.icon className="h-6 w-6 text-[#00388C]" aria-hidden="true" />
                      </div>
                      {feature.name}
                    </dt>
                    <dd className="flex flex-auto flex-col text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm">
                      <p className="flex-auto">{feature.description}</p>
                    </dd>
                  </GlassCard>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
}