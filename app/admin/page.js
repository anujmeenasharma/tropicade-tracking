'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { CheckCircle2, Package, Search, Edit, Link as LinkIcon, Trash2 } from 'lucide-react';
import { createTrackingAction, fetchAllTrackings, updateStatusAction, updateTrackingEventsAction, deleteTrackingAction } from '../../lib/actions/tracking';
import { EditEventsModal } from '../../components/ui/EditEventsModal';

export default function AdminDashboard() {
    const [trackings, setTrackings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form state
    const [trackingId, setTrackingId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [country, setCountry] = useState('United States');
    const [city, setCity] = useState('');
    const [creating, setCreating] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const [searchTerm, setSearchTerm] = useState('');
    const [filterCountry, setFilterCountry] = useState('');
    const [editingTracking, setEditingTracking] = useState(null);
    const [copiedId, setCopiedId] = useState(null);

    function generateTrackingId() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        let id = 'TXK-';
        for (let i = 0; i < 5; i++) {
            id += numbers.charAt(Math.floor(Math.random() * numbers.length));
        }
        id += letters.charAt(Math.floor(Math.random() * letters.length));
        return id;
    }

    useEffect(() => {
        setTrackingId(generateTrackingId());
        loadData();
    }, []);

    async function loadData() {
        const data = await fetchAllTrackings();
        setTrackings(data);
        setLoading(false);
    }

    async function handleCreate(e) {
        e.preventDefault();
        setCreating(true);
        setSuccessMsg('');

        const formData = new FormData();
        formData.append('trackingId', trackingId);
        formData.append('startDate', startDate);
        formData.append('destinationCountry', country);
        formData.append('destinationCity', city);

        const res = await createTrackingAction(formData);

        if (res.error) {
            alert(res.error);
        } else {
            setSuccessMsg(`Tracking ${trackingId} created successfully!`);
            setTrackingId(generateTrackingId());
            setCity('');
            loadData();
        }
        setCreating(false);
    }

    async function handleStatusChange(id, status) {
        await updateStatusAction(id, status);
        loadData();
    }

    async function handleSaveEvents(id, newEvents) {
        await updateTrackingEventsAction(id, newEvents);
        setEditingTracking(null);
        loadData();
    }

    function handleCopyLink(trackingId) {
        const url = `${window.location.origin}/track/${trackingId}`;
        navigator.clipboard.writeText(url).then(() => {
            setCopiedId(trackingId);
            setTimeout(() => {
                setCopiedId(null);
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }

    async function handleDelete(id) {
        if (window.confirm(`Are you sure you want to delete tracking ${id}? This action cannot be undone.`)) {
            const res = await deleteTrackingAction(id);
            if (res.success) {
                loadData();
            } else {
                alert(res.error || 'Failed to delete tracking');
            }
        }
    }

    const activeCount = trackings.filter(t => t.status === 'active').length;
    const deliveredCount = trackings.filter(t => t.status === 'delivered').length;
    const returnedCount = trackings.filter(t => t.status === 'returned').length;

    const filteredTrackings = trackings.filter(t => {
        const matchesSearch = t.trackingId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCountry = filterCountry ? t.destinationCountry === filterCountry : true;
        return matchesSearch && matchesCountry;
    });

    return (
        <div className="min-h-screen bg-background py-16 px-6 sm:px-12 object-contain">
            <div className="max-w-7xl mx-auto space-y-12">
                <header>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold tracking-tight"
                    >
                        Admin Dashboard
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mt-2 text-neutral-500"
                    >
                        Manage and oversee global logistics operations.
                    </motion.p>
                </header>

                {/* Analytics Section */}
                <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <GlassCard className="p-6 flex flex-col justify-between">
                        <h3 className="text-sm font-medium text-neutral-500">Total Shipments</h3>
                        <p className="text-4xl font-semibold mt-2">{trackings.length}</p>
                    </GlassCard>
                    <GlassCard className="p-6 flex flex-col justify-between">
                        <h3 className="text-sm font-medium text-[#00388C]">Active</h3>
                        <p className="text-4xl font-semibold mt-2">{activeCount}</p>
                    </GlassCard>
                    <GlassCard className="p-6 flex flex-col justify-between">
                        <h3 className="text-sm font-medium text-green-500">Delivered</h3>
                        <p className="text-4xl font-semibold mt-2">{deliveredCount}</p>
                    </GlassCard>
                    <GlassCard className="p-6 flex flex-col justify-between">
                        <h3 className="text-sm font-medium text-orange-500">Returned/Delayed</h3>
                        <p className="text-4xl font-semibold mt-2">{returnedCount}</p>
                    </GlassCard>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Create Tracking Form */}
                    <GlassCard className="p-8 lg:col-span-1 h-fit">
                        <div className="mb-6 flex items-center gap-2">
                            <Package className="h-5 w-5 text-[#00388C]" />
                            <h2 className="text-xl font-semibold">New Tracking</h2>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Tracking ID (Auto-Generated)</label>
                                <div className="flex gap-2">
                                    <input
                                        required
                                        readOnly
                                        type="text"
                                        value={trackingId}
                                        className="flex-1 rounded-xl border-none bg-neutral-200 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 px-4 py-3 text-sm focus:outline-none cursor-not-allowed transition-all font-mono"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Start Date</label>
                                <input
                                    required
                                    type="date"
                                    value={startDate}
                                    onChange={e => setStartDate(e.target.value)}
                                    className="w-full rounded-xl border-none bg-neutral-100 dark:bg-neutral-900 px-4 py-3 text-sm focus:ring-2 focus:ring-[#00388C] outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Destination Country</label>
                                <select
                                    value={country}
                                    onChange={e => setCountry(e.target.value)}
                                    className="w-full rounded-xl border-none bg-neutral-100 dark:bg-neutral-900 px-4 py-3 text-sm focus:ring-2 focus:ring-[#00388C] outline-none transition-all"
                                >
                                    <option>United States</option>
                                    <option>Canada</option>
                                    <option>United Kingdom</option>
                                    <option>Australia</option>
                                    <option>Germany</option>
                                    <option>France</option>
                                    <option>Italy</option>
                                    <option>Spain</option>
                                    <option>Japan</option>
                                    <option>China</option>
                                    <option>India</option>
                                    <option>Brazil</option>
                                    <option>Mexico</option>
                                    <option>Netherlands</option>
                                    <option>Sweden</option>
                                    <option>Switzerland</option>
                                    <option>Austria</option>
                                    <option>Belgium</option>
                                    <option>Bulgaria</option>
                                    <option>Croatia</option>
                                    <option>Cyprus</option>
                                    <option>Czech Republic</option>
                                    <option>Denmark</option>
                                    <option>Estonia</option>
                                    <option>Finland</option>
                                    <option>Greece</option>
                                    <option>Ireland</option>
                                    <option>Latvia</option>
                                    <option>Lithuania</option>
                                    <option>Luxembourg</option>
                                    <option>Malta</option>
                                    <option>Poland</option>
                                    <option>Portugal</option>
                                    <option>Romania</option>
                                    <option>Slovakia</option>
                                    <option>Slovenia</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Destination City</label>
                                <input
                                    required
                                    type="text"
                                    value={city}
                                    onChange={e => setCity(e.target.value)}
                                    placeholder="e.g. Berlin"
                                    className="w-full rounded-xl border-none bg-neutral-100 dark:bg-neutral-900 px-4 py-3 text-sm focus:ring-2 focus:ring-[#00388C] outline-none transition-all"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={creating}
                                className="w-full mt-4"
                                variant="accent"
                            >
                                {creating ? "Generating Timeline..." : "Generate Logistics Timeline"}
                            </Button>

                            {successMsg && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-4 p-3 bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg flex items-center gap-2 text-sm"
                                >
                                    <CheckCircle2 className="h-4 w-4" />
                                    {successMsg}
                                </motion.div>
                            )}
                        </form>
                    </GlassCard>

                    {/* Tracking List */}
                    <GlassCard className="p-8 lg:col-span-2">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                            <h2 className="text-xl font-semibold">Active Logistics</h2>

                            <div className="flex gap-2 w-full sm:w-auto">
                                <div className="relative flex-1 sm:w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                    <input
                                        type="text"
                                        placeholder="Search ID..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        className="w-full rounded-full bg-neutral-100 dark:bg-neutral-900 pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00388C]"
                                    />
                                </div>
                                <select
                                    value={filterCountry}
                                    onChange={e => setFilterCountry(e.target.value)}
                                    className="rounded-full bg-neutral-100 dark:bg-neutral-900 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00388C]"
                                >
                                    <option value="">All Countries</option>
                                    {Array.from(new Set(trackings.map(t => t.destinationCountry))).map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <p className="text-neutral-500 py-8 text-center animate-pulse">Loading data...</p>
                        ) : filteredTrackings.length === 0 ? (
                            <div className="text-center py-12 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl">
                                <p className="text-neutral-500">No shipments found.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">
                                        <tr>
                                            <th className="pb-3 font-medium">Tracking ID</th>
                                            <th className="pb-3 font-medium">Destination</th>
                                            <th className="pb-3 font-medium">Start Date</th>
                                            <th className="pb-3 font-medium">Status</th>
                                            <th className="pb-3 font-medium text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
                                        {filteredTrackings.map((t) => (
                                            <tr key={t.trackingId} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                                                <td className="py-4 font-mono font-medium">{t.trackingId}</td>
                                                <td className="py-4">{t.destinationCity}, {t.destinationCountry}</td>
                                                <td className="py-4">{t.startDate}</td>
                                                <td className="py-4">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${t.status === 'delivered' ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300' :
                                                        t.status === 'active' ? 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300' :
                                                            'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300'
                                                        }`}>
                                                        {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="py-4 flex justify-end gap-2 items-center">
                                                    <button
                                                        onClick={() => handleCopyLink(t.trackingId)}
                                                        className="text-xs flex items-center gap-1 rounded-md bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition font-medium w-20 justify-center cursor-pointer"
                                                        title="Copy Tracking Link"
                                                    >
                                                        {copiedId === t.trackingId ? (
                                                            <>
                                                                <CheckCircle2 className="h-3 w-3 text-green-500" />
                                                                <span className="text-green-600 dark:text-green-400">Copied</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <LinkIcon className="h-3 w-3" /> Link
                                                            </>
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingTracking(t)}
                                                        className="text-xs flex items-center gap-1 rounded-md bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition font-medium cursor-pointer"
                                                    >
                                                        <Edit className="h-3 w-3" /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(t.trackingId)}
                                                        className="text-xs flex items-center gap-1 rounded-md bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 px-3 py-1.5 hover:bg-red-200 dark:hover:bg-red-500/30 transition font-medium cursor-pointer"
                                                        title="Delete Shipment"
                                                    >
                                                        <Trash2 className="h-3 w-3" /> Delete
                                                    </button>
                                                    <select
                                                        value={t.status}
                                                        onChange={(e) => handleStatusChange(t.trackingId, e.target.value)}
                                                        className="text-xs rounded-md bg-neutral-100 dark:bg-neutral-800 px-2 py-1 h-7 border-none outline-none cursor-pointer"
                                                    >
                                                        <option value="active">Set Active</option>
                                                        <option value="delivered">Set Delivered</option>
                                                        <option value="returned">Set Returned/Delayed</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </GlassCard>
                </div>
            </div>
            {editingTracking && (
                <EditEventsModal
                    tracking={editingTracking}
                    onClose={() => setEditingTracking(null)}
                    onSave={handleSaveEvents}
                />
            )}
        </div>
    );
}
