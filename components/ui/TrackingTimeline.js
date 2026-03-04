'use client';

import { motion } from "framer-motion";
import { GlassCard } from "./GlassCard";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function TrackingTimeline({ events = [] }) {
    if (!events || events.length === 0) {
        return <p className="text-neutral-500">No events to display.</p>;
    }

    // Reverse so the newest event is at the top
    const sortedEvents = [...events].sort((a, b) => b.day - a.day);

    return (
        <div className="relative py-8 pl-12 sm:pl-48 w-full max-w-3xl mx-auto">
            {/* Glowing vertical line */}
            <div className="absolute left-[23px] sm:left-[159px] top-10 bottom-10 w-[2px] rounded-full bg-neutral-200 dark:bg-neutral-800 z-0">
                <motion.div
                    className="absolute top-0 w-full rounded-full timeline-line"
                    initial={{ height: 0 }}
                    animate={{ height: '100%' }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                />
            </div>

            <div className="space-y-12">
                {sortedEvents.map((event, index) => {
                    const isLatest = index === 0;
                    return (
                        <div
                            key={index}
                            className="relative"
                        >
                            {/* Timeline dot */}
                            <div className="absolute -left-10 sm:-left-12 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-black shadow-[0_0_15px_rgba(0,56,140,0.3)] border-2 border-[#00388C] z-10">
                                {event.warning ? (
                                    <AlertCircle className="h-4 w-4 text-orange-500" />
                                ) : event.eventCode.endsWith('-999') ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                ) : (
                                    <div className="h-2 w-2 rounded-full bg-[#00388C]" />
                                )}
                            </div>

                            {/* Timestamp left of line on larger screens, above on small */}
                            <div className="hidden sm:block absolute -left-48 top-6 w-32 text-right">
                                <p className="text-sm font-medium text-foreground">{event.date}</p>
                                <p className="text-xs text-neutral-500">{event.time}</p>
                            </div>

                            <GlassCard className="p-6 ml-2 group">
                                <div className="sm:hidden mb-4">
                                    <p className="text-sm font-medium text-foreground">{event.date}</p>
                                    <p className="text-xs text-neutral-500">{event.time}</p>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg font-semibold tracking-tight text-foreground">
                                            {event.title}
                                        </h3>
                                        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                                            {event.location}
                                        </p>
                                        <p className="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                                            {event.description}
                                        </p>
                                    </div>

                                    <div className="shrink-0 flex items-center gap-2">
                                        <span className="inline-flex items-center rounded-md bg-neutral-100 dark:bg-neutral-800 px-2 py-1 text-xs font-mono font-medium text-neutral-600 dark:text-neutral-400 ring-1 ring-inset ring-neutral-500/10">
                                            {event.eventCode}
                                        </span>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
