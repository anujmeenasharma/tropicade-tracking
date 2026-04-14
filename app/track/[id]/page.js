import { getTrackingById } from "../../../lib/db";
import { TrackingTimeline } from "../../../components/ui/TrackingTimeline";
import { GlassCard } from "../../../components/ui/GlassCard";
import { Package, Clock, MapPin, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../components/ui/Button";
import { parse, startOfDay } from "date-fns";
import Navbar from "../../../components/Navbar";

// Assuming we bypass Next.js static generation caching for file data
export const dynamic = 'force-dynamic';

export default async function TrackPage({ params }) {
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams?.id;
    const trackingData = await getTrackingById(id);

    // Filter events to only show those whose date has arrived (date <= today)
    if (trackingData && trackingData.events) {
        const today = startOfDay(new Date());
        trackingData.events = trackingData.events.filter(event => {
            try {
                const eventDate = startOfDay(parse(event.date, 'MMMM d, yyyy', new Date()));
                return eventDate <= today;
            } catch {
                return true; // Show event if date can't be parsed
            }
        });
    }

    if (!trackingData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-6">
                <GlassCard className="max-w-md w-full p-10 text-center flex flex-col items-center">
                    <div className="h-16 w-16 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                        <Search className="h-7 w-7 text-red-600 dark:text-red-400" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight mb-2">Tracking Not Found</h1>
                    <p className="text-neutral-500 mb-8">
                        We couldn't find a shipment associated with ID <span className="font-mono font-medium text-foreground">{id}</span>. Please verify the code and try again.
                    </p>
                    <Link href="/">
                        <Button variant="primary" className="w-full">Return Home</Button>
                    </Link>
                </GlassCard>
            </div>
        );
    }

    // Get current status from the latest event logic or the object state
    const isDelivered = trackingData.status === 'delivered';
    const isActive = trackingData.status === 'active';

    return (
        <div className="min-h-screen" style={{background: '#E8ECF2'}}>
            <Navbar />
            <div className="max-w-4xl mx-auto py-16 px-6 sm:px-12">

                {/* Header Section */}
                <header className="mb-12 text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4" style={{color: '#0A1929'}}>
                        Shipment Status
                    </h1>
                    <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-mono" style={{background: '#EEF0F5', color: '#5A6478'}}>
                        <Package className="h-4 w-4" />
                        {trackingData.trackingId}
                    </div>
                </header>

                {/* Overview Card */}
                <GlassCard className="p-8 mb-16 flex flex-col md:flex-row justify-between gap-8 md:gap-4 items-center md:items-start text-center md:text-left">
                    <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium" style={{color: '#8A96A8'}}>Origin Start Date</p>
                        <p className="text-base font-semibold" style={{color: '#0A1929'}}>{trackingData.startDate}</p>
                    </div>

                    <div className="flex-1 space-y-1 md:border-l md:pl-8" style={{borderColor: '#E2E6EF'}}>
                        <p className="text-sm font-medium flex items-center justify-center md:justify-start gap-1" style={{color: '#8A96A8'}}>
                            <MapPin className="h-4 w-4" />
                            Destination
                        </p>
                        <p className="text-base font-semibold" style={{color: '#0A1929'}}>
                            {trackingData.destinationCity}, {trackingData.destinationCountry}
                        </p>
                    </div>

                    <div className="flex-1 space-y-1 md:border-l md:pl-8" style={{borderColor: '#E2E6EF'}}>
                        <p className="text-sm font-medium flex items-center justify-center md:justify-start gap-1" style={{color: '#8A96A8'}}>
                            <Clock className="h-4 w-4" />
                            Current Status
                        </p>
                        <div className="mt-1">
                            <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                borderRadius: '9999px',
                                padding: '4px 12px',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                background: isDelivered ? '#DCFCE7' : isActive ? '#EEF4FF' : '#FEF3C7',
                                color: isDelivered ? '#166534' : isActive ? '#1E4DB7' : '#92400E',
                            }}>
                                {trackingData.status.charAt(0).toUpperCase() + trackingData.status.slice(1)}
                            </span>
                        </div>
                    </div>
                </GlassCard>

                {/* The Timeline UI */}
                <div>
                    <h2 className="text-2xl font-semibold mb-8 pl-8 sm:pl-16" style={{color: '#0A1929'}}>Travel History</h2>
                    <TrackingTimeline events={trackingData.events} />
                </div>

                <div className="mt-20 text-center">
                    <Link href="/">
                        <Button variant="outline">Track Another Package</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
