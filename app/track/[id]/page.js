import { getTrackingById } from "../../../lib/db";
import { TrackingTimeline } from "../../../components/ui/TrackingTimeline";
import { GlassCard } from "../../../components/ui/GlassCard";
import { Package, Clock, MapPin, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../components/ui/Button";

// Assuming we bypass Next.js static generation caching for file data
export const dynamic = 'force-dynamic';

export default async function TrackPage({ params }) {
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams?.id;
    const trackingData = await getTrackingById(id);

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
        <div className="min-h-screen bg-background py-16 px-6 sm:px-12">
            <div className="max-w-4xl mx-auto">

                {/* Header Section */}
                <header className="mb-12 text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                        Shipment Status
                    </h1>
                    <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 dark:bg-neutral-900 px-4 py-2 text-sm font-mono text-neutral-600 dark:text-neutral-400">
                        <Package className="h-4 w-4" />
                        {trackingData.trackingId}
                    </div>
                </header>

                {/* Overview Glass Card */}
                <GlassCard className="p-8 mb-16 flex flex-col md:flex-row justify-between gap-8 md:gap-4 items-center md:items-start text-center md:text-left">
                    <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium text-neutral-500">Origin Start Date</p>
                        <p className="text-lg font-semibold text-foreground">{trackingData.startDate}</p>
                    </div>

                    <div className="flex-1 space-y-1 md:border-l border-neutral-200 dark:border-neutral-800 md:pl-8">
                        <p className="text-sm font-medium text-neutral-500 flex items-center justify-center md:justify-start gap-1">
                            <MapPin className="h-4 w-4" />
                            Destination
                        </p>
                        <p className="text-lg font-semibold text-foreground">
                            {trackingData.destinationCity}, {trackingData.destinationCountry}
                        </p>
                    </div>

                    <div className="flex-1 space-y-1 md:border-l border-neutral-200 dark:border-neutral-800 md:pl-8">
                        <p className="text-sm font-medium text-neutral-500 flex items-center justify-center md:justify-start gap-1">
                            <Clock className="h-4 w-4" />
                            Current Status
                        </p>
                        <div className="mt-1">
                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${isDelivered ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300' :
                                isActive ? 'bg-[#0071E3]/10 text-[#0071E3] dark:text-[#0071E3]' :
                                    'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300'
                                }`}>
                                {trackingData.status.charAt(0).toUpperCase() + trackingData.status.slice(1)}
                            </span>
                        </div>
                    </div>
                </GlassCard>

                {/* The Timeline UI */}
                <div>
                    <h2 className="text-2xl font-semibold mb-8 pl-8 sm:pl-16">Travel History</h2>
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
