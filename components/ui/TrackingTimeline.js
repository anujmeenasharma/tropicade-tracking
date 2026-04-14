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
            {/* Vertical line */}
            <div className="absolute left-[23px] sm:left-[159px] top-10 bottom-10 w-[2px] rounded-full" style={{background: 'var(--card-border)'}} />
            <div className="absolute left-[23px] sm:left-[159px] top-10 w-[2px] rounded-full overflow-hidden" style={{bottom: '2.5rem'}}>
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
                            <div className="absolute -left-10 sm:-left-12 top-6 flex h-8 w-8 items-center justify-center rounded-full z-10" style={{background: 'var(--foreground)', boxShadow: '0 0 0 3px var(--background), 0 0 0 4px var(--accent)'}}>
                                {event.warning ? (
                                    <AlertCircle className="h-4 w-4 text-orange-400" />
                                ) : event.eventCode.endsWith('-999') ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                                ) : (
                                    <div className="h-2.5 w-2.5 rounded-full bg-white" />
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
                                        <h3 className="text-base font-semibold tracking-tight" style={{color: 'var(--foreground)'}}>
                                            {event.title}
                                        </h3>
                                        <p className="mt-0.5 text-sm font-medium text-black">
                                            {event.location}
                                        </p>
                                        <p className="mt-3 text-sm leading-relaxed" style={{color: '#111', opacity: event.warning ? 1 : 0.8}}>
                                            {event.description}
                                        </p>
                                    </div>

                                    <div className="shrink-0 flex items-center gap-2">
                                        <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-mono font-medium" style={{background: 'var(--badge-bg)', color: 'var(--badge-text)'}}>
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
