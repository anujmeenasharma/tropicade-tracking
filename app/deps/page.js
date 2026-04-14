'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { CheckCircle2, Package, Search, Edit, Link as LinkIcon, Trash2 } from 'lucide-react';
import { createTrackingAction, fetchAllTrackings, updateStatusAction, updateTrackingEventsAction, deleteTrackingAction } from '../../lib/actions/tracking';
import { EditEventsModal } from '../../components/ui/EditEventsModal';

// Hardcoded light-theme color palette
const C = {
    pageBg:       '#E8ECF2',
    cardBg:       '#FFFFFF',
    cardBorder:   '#E2E6EF',
    foreground:   '#0A1929',
    labelGrey:    '#8A96A8',
    inputBg:      '#F4F6F9',
    inputBgMono:  '#ECEEF2',
    rowHover:     '#F7F9FC',
    divider:      '#E2E6EF',
    accent:       '#1E4DB7',
    btnGrey:      '#EEF0F5',
    btnGreyHover: '#E2E6EF',
    btnGreyText:  '#0A1929',
    shadow:       '0 2px 12px rgba(0,0,0,0.06)',
};

export default function AdminDashboard() {
    const [trackings, setTrackings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [trackingId, setTrackingId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [country, setCountry] = useState('Australia');
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
        for (let i = 0; i < 5; i++) id += numbers.charAt(Math.floor(Math.random() * numbers.length));
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

    function handleCopyLink(tid) {
        const url = `${window.location.origin}/track/${tid}`;
        navigator.clipboard.writeText(url).then(() => {
            setCopiedId(tid);
            setTimeout(() => setCopiedId(null), 2000);
        }).catch(err => console.error('Failed to copy text: ', err));
    }

    async function handleDelete(id) {
        if (window.confirm(`Are you sure you want to delete tracking ${id}? This action cannot be undone.`)) {
            const res = await deleteTrackingAction(id);
            if (res.success) loadData();
            else alert(res.error || 'Failed to delete tracking');
        }
    }

    const activeCount    = trackings.filter(t => t.status === 'active').length;
    const deliveredCount = trackings.filter(t => t.status === 'delivered').length;
    const returnedCount  = trackings.filter(t => t.status === 'returned').length;

    const filteredTrackings = trackings.filter(t => {
        const matchesSearch  = t.trackingId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCountry = filterCountry ? t.destinationCountry === filterCountry : true;
        return matchesSearch && matchesCountry;
    });

    const inputStyle = {
        width: '100%',
        borderRadius: 12,
        border: `1px solid ${C.cardBorder}`,
        background: C.inputBg,
        color: C.foreground,
        padding: '10px 16px',
        fontSize: 14,
        outline: 'none',
        transition: 'border-color 0.2s',
    };

    const labelStyle = {
        display: 'block',
        fontSize: 13,
        fontWeight: 500,
        color: C.foreground,
        marginBottom: 6,
    };

    function statusStyle(status) {
        if (status === 'delivered') return { background: '#DCFCE7', color: '#166534' };
        if (status === 'active')    return { background: '#EEF4FF', color: '#1E4DB7' };
        return                              { background: '#FEF3C7', color: '#92400E' };
    }

    return (
        <div style={{ minHeight: '100vh', background: C.pageBg, padding: '64px 24px' }}>
            <div style={{ maxWidth: 1280, margin: '0 auto' }}>

                {/* Header */}
                <header style={{ marginBottom: 48 }}>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ fontSize: 32, fontWeight: 700, color: C.foreground, letterSpacing: '-0.5px' }}
                    >
                        Admin Dashboard
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        style={{ marginTop: 6, color: C.labelGrey, fontSize: 14 }}
                    >
                        Manage and oversee global logistics operations.
                    </motion.p>
                </header>

                {/* Stats row */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, marginBottom: 40 }}>
                    {[
                        { label: 'Total Shipments', value: trackings.length, color: C.foreground },
                        { label: 'Active',           value: activeCount,      color: '#1E4DB7'   },
                        { label: 'Delivered',        value: deliveredCount,   color: '#16A34A'   },
                        { label: 'Returned/Delayed', value: returnedCount,    color: '#D97706'   },
                    ].map(stat => (
                        <GlassCard key={stat.label} className="p-6">
                            <p style={{ fontSize: 13, fontWeight: 500, color: stat.color, marginBottom: 6 }}>{stat.label}</p>
                            <p style={{ fontSize: 36, fontWeight: 600, color: C.foreground }}>{stat.value}</p>
                        </GlassCard>
                    ))}
                </section>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, alignItems: 'start' }}>

                    {/* Create Form */}
                    <GlassCard className="p-8">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                            <Package style={{ width: 20, height: 20, color: C.accent }} />
                            <h2 style={{ fontSize: 18, fontWeight: 600, color: C.foreground }}>New Tracking</h2>
                        </div>

                        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div>
                                <label style={labelStyle}>Tracking ID (Auto-Generated)</label>
                                <input
                                    required readOnly type="text" value={trackingId}
                                    style={{ ...inputStyle, background: C.inputBgMono, color: C.labelGrey, cursor: 'not-allowed', fontFamily: 'monospace' }}
                                />
                            </div>

                            <div>
                                <label style={labelStyle}>Start Date</label>
                                <input
                                    required type="date" value={startDate}
                                    onChange={e => setStartDate(e.target.value)}
                                    style={{ ...inputStyle, colorScheme: 'light' }}
                                />
                            </div>

                            <div>
                                <label style={labelStyle}>Destination Country</label>
                                <select value={country} onChange={e => setCountry(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                                    {['Australia','Austria','Belgium','Brazil','Bulgaria','Canada','China','Croatia','Cyprus','Czech Republic','Denmark','Estonia','Finland','France','Germany','Greece','India','Ireland','Italy','Japan','Latvia','Lithuania','Luxembourg','Malta','Mexico','Netherlands','Poland','Portugal','Romania','Slovakia','Slovenia','Spain','Sweden','Switzerland','United Kingdom','United States'].map(c => (
                                        <option key={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label style={labelStyle}>Destination City</label>
                                <input
                                    required type="text" value={city}
                                    onChange={e => setCity(e.target.value)}
                                    placeholder="e.g. Berlin"
                                    style={inputStyle}
                                />
                            </div>

                            <Button type="submit" disabled={creating} className="w-full mt-2" variant="accent">
                                {creating ? 'Generating Timeline...' : 'Generate Logistics Timeline'}
                            </Button>

                            {successMsg && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{ padding: '10px 14px', background: '#DCFCE7', color: '#166534', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}
                                >
                                    <CheckCircle2 style={{ width: 16, height: 16 }} />
                                    {successMsg}
                                </motion.div>
                            )}
                        </form>
                    </GlassCard>

                    {/* Tracking List */}
                    <GlassCard className="p-8">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                            <h2 style={{ fontSize: 18, fontWeight: 600, color: C.foreground }}>Active Logistics</h2>
                            <div style={{ display: 'flex', gap: 8 }}>
                                {/* Search */}
                                <div style={{ position: 'relative' }}>
                                    <Search style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: C.labelGrey }} />
                                    <input
                                        type="text" placeholder="Search ID..." value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        style={{ ...inputStyle, width: 200, paddingLeft: 32, borderRadius: 999, padding: '8px 12px 8px 32px' }}
                                    />
                                </div>
                                <select
                                    value={filterCountry} onChange={e => setFilterCountry(e.target.value)}
                                    style={{ ...inputStyle, width: 'auto', borderRadius: 999, padding: '8px 14px', cursor: 'pointer' }}
                                >
                                    <option value="">All Countries</option>
                                    {Array.from(new Set(trackings.map(t => t.destinationCountry))).sort().map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <p style={{ color: C.labelGrey, textAlign: 'center', padding: '32px 0' }}>Loading data...</p>
                        ) : filteredTrackings.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '48px 0', border: `2px dashed ${C.cardBorder}`, borderRadius: 16 }}>
                                <p style={{ color: C.labelGrey }}>No shipments found.</p>
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, whiteSpace: 'nowrap' }}>
                                    <thead>
                                        <tr style={{ borderBottom: `1px solid ${C.divider}` }}>
                                            {['Tracking ID','Destination','Start Date','Status','Actions'].map((h, i) => (
                                                <th key={h} style={{ paddingBottom: 12, fontWeight: 500, color: C.labelGrey, textAlign: i === 4 ? 'right' : 'left' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTrackings.map(t => (
                                            <tr
                                                key={t.trackingId}
                                                style={{ borderBottom: `1px solid ${C.divider}` }}
                                                onMouseEnter={e => e.currentTarget.style.background = C.rowHover}
                                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                            >
                                                <td style={{ padding: '14px 0', fontFamily: 'monospace', fontWeight: 500, color: C.foreground }}>{t.trackingId}</td>
                                                <td style={{ padding: '14px 8px', color: C.foreground }}>{t.destinationCity}, {t.destinationCountry}</td>
                                                <td style={{ padding: '14px 8px', color: C.foreground }}>{t.startDate}</td>
                                                <td style={{ padding: '14px 8px' }}>
                                                    <span style={{ ...statusStyle(t.status), borderRadius: 999, padding: '2px 10px', fontSize: 12, fontWeight: 600 }}>
                                                        {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '14px 0', textAlign: 'right' }}>
                                                    <div style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                                                        {/* Link */}
                                                        <button
                                                            onClick={() => handleCopyLink(t.trackingId)}
                                                            title="Copy Tracking Link"
                                                            style={{ display: 'flex', alignItems: 'center', gap: 4, borderRadius: 6, background: C.btnGrey, color: copiedId === t.trackingId ? '#16A34A' : C.btnGreyText, border: 'none', padding: '5px 10px', fontSize: 12, fontWeight: 500, cursor: 'pointer', minWidth: 64, justifyContent: 'center' }}
                                                        >
                                                            {copiedId === t.trackingId ? (
                                                                <><CheckCircle2 style={{ width: 12, height: 12 }} /> Copied</>
                                                            ) : (
                                                                <><LinkIcon style={{ width: 12, height: 12 }} /> Link</>
                                                            )}
                                                        </button>
                                                        {/* Edit */}
                                                        <button
                                                            onClick={() => setEditingTracking(t)}
                                                            style={{ display: 'flex', alignItems: 'center', gap: 4, borderRadius: 6, background: C.btnGrey, color: C.btnGreyText, border: 'none', padding: '5px 10px', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}
                                                        >
                                                            <Edit style={{ width: 12, height: 12 }} /> Edit
                                                        </button>
                                                        {/* Delete */}
                                                        <button
                                                            onClick={() => handleDelete(t.trackingId)}
                                                            title="Delete Shipment"
                                                            style={{ display: 'flex', alignItems: 'center', gap: 4, borderRadius: 6, background: '#FEE2E2', color: '#DC2626', border: 'none', padding: '5px 10px', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}
                                                        >
                                                            <Trash2 style={{ width: 12, height: 12 }} /> Delete
                                                        </button>
                                                        {/* Status select */}
                                                        <select
                                                            value={t.status}
                                                            onChange={e => handleStatusChange(t.trackingId, e.target.value)}
                                                            style={{ borderRadius: 6, border: `1px solid ${C.cardBorder}`, background: C.btnGrey, color: C.foreground, padding: '5px 8px', fontSize: 12, outline: 'none', cursor: 'pointer' }}
                                                        >
                                                            <option value="active">Set Active</option>
                                                            <option value="delivered">Set Delivered</option>
                                                            <option value="returned">Set Returned/Delayed</option>
                                                        </select>
                                                    </div>
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
