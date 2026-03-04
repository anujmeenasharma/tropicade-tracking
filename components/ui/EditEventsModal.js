'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Save } from 'lucide-react';
import { Button } from './Button';
import { GlassCard } from './GlassCard';

export function EditEventsModal({ tracking, onClose, onSave }) {
    const [events, setEvents] = useState([...(tracking?.events || [])]);
    const [saving, setSaving] = useState(false);

    if (!tracking) return null;

    const handleEventChange = (index, field, value) => {
        const updated = [...events];
        updated[index] = { ...updated[index], [field]: value };
        setEvents(updated);
    };

    const handleDeleteEvent = (index) => {
        const updated = events.filter((_, i) => i !== index);
        setEvents(updated);
    };

    const handleAddEvent = () => {
        setEvents([
            {
                day: events.length > 0 ? Array.from(events).sort((a, b) => b.day - a.day)[0].day + 1 : 1,
                date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                time: '12:00 PM',
                location: '',
                title: '',
                description: '',
                eventCode: 'NEW-000',
                warning: false
            },
            ...events
        ]);
    };

    const handleSave = async () => {
        setSaving(true);
        await onSave(tracking.trackingId, events);
        setSaving(false);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.95, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 20 }}
                    className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-background rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-800">
                        <div>
                            <h2 className="text-xl font-bold">Edit Travel History</h2>
                            <p className="text-sm text-neutral-500 mt-1">Tracking ID: {tracking.trackingId}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        <div className="flex justify-end">
                            <Button onClick={handleAddEvent} variant="outline" className="text-sm px-4 py-2 gap-2">
                                <Plus className="h-4 w-4" /> Add Event
                            </Button>
                        </div>

                        {events.length === 0 ? (
                            <p className="text-center text-neutral-500 py-10">No events found.</p>
                        ) : (
                            <div className="space-y-4">
                                {events.map((ev, idx) => (
                                    <GlassCard key={idx} className="p-5 flex flex-col md:flex-row gap-4 relative">
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-medium text-neutral-500 mb-1 block">Date</label>
                                                <input
                                                    type="text"
                                                    value={ev.date}
                                                    onChange={(e) => handleEventChange(idx, 'date', e.target.value)}
                                                    className="w-full rounded-lg bg-neutral-100 dark:bg-neutral-900 border-none px-3 py-2 text-sm focus:ring-2 focus:ring-[#00388C] outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-neutral-500 mb-1 block">Time</label>
                                                <input
                                                    type="text"
                                                    value={ev.time}
                                                    onChange={(e) => handleEventChange(idx, 'time', e.target.value)}
                                                    className="w-full rounded-lg bg-neutral-100 dark:bg-neutral-900 border-none px-3 py-2 text-sm focus:ring-2 focus:ring-[#00388C] outline-none"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="text-xs font-medium text-neutral-500 mb-1 block">Title</label>
                                                <input
                                                    type="text"
                                                    value={ev.title}
                                                    onChange={(e) => handleEventChange(idx, 'title', e.target.value)}
                                                    className="w-full font-semibold rounded-lg bg-neutral-100 dark:bg-neutral-900 border-none px-3 py-2 text-sm focus:ring-2 focus:ring-[#00388C] outline-none"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="text-xs font-medium text-neutral-500 mb-1 block">Location</label>
                                                <input
                                                    type="text"
                                                    value={ev.location}
                                                    onChange={(e) => handleEventChange(idx, 'location', e.target.value)}
                                                    className="w-full rounded-lg bg-neutral-100 dark:bg-neutral-900 border-none px-3 py-2 text-sm focus:ring-2 focus:ring-[#00388C] outline-none"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="text-xs font-medium text-neutral-500 mb-1 block">Description</label>
                                                <textarea
                                                    value={ev.description}
                                                    onChange={(e) => handleEventChange(idx, 'description', e.target.value)}
                                                    rows={2}
                                                    className="w-full rounded-lg bg-neutral-100 dark:bg-neutral-900 border-none px-3 py-2 text-sm focus:ring-2 focus:ring-[#00388C] outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-neutral-500 mb-1 block">Event Code</label>
                                                <input
                                                    type="text"
                                                    value={ev.eventCode}
                                                    onChange={(e) => handleEventChange(idx, 'eventCode', e.target.value)}
                                                    className="w-full font-mono rounded-lg bg-neutral-100 dark:bg-neutral-900 border-none px-3 py-2 text-sm focus:ring-2 focus:ring-[#00388C] outline-none"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2 pt-6">
                                                <input
                                                    type="checkbox"
                                                    id={`warning-${idx}`}
                                                    checked={ev.warning || false}
                                                    onChange={(e) => handleEventChange(idx, 'warning', e.target.checked)}
                                                    className="w-4 h-4 text-[#0071E3] bg-neutral-100 border-gray-300 rounded focus:ring-[#00388C]"
                                                />
                                                <label htmlFor={`warning-${idx}`} className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                                                    Warning Icon Active
                                                </label>
                                            </div>
                                        </div>

                                        <div className="flex shrink-0 items-start md:items-center justify-end md:justify-center border-t md:border-t-0 md:border-l border-neutral-200 dark:border-neutral-800 pt-4 md:pt-0 md:pl-4 mt-4 md:mt-0">
                                            <button
                                                onClick={() => handleDeleteEvent(idx)}
                                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition cursor-pointer"
                                                title="Delete Event"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </GlassCard>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-4">
                        <Button onClick={onClose} variant="ghost">Cancel</Button>
                        <Button onClick={handleSave} variant="primary" disabled={saving} className="gap-2">
                            <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
