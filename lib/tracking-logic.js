import { addDays, isWeekend, format } from 'date-fns';

const countriesToIso = {
    'United States': 'US',
    'Canada': 'CA',
    'United Kingdom': 'GB',
    'Australia': 'AU',
    'Germany': 'DE',
    'France': 'FR',
    'Italy': 'IT',
    'Spain': 'ES',
    'Japan': 'JP',
    'China': 'CN',
    'India': 'IN',
    'Brazil': 'BR',
    'Mexico': 'MX',
    'Netherlands': 'NL',
    'Sweden': 'SE',
    'Switzerland': 'CH'
};

export function getIsoCode(countryName) {
    return countriesToIso[countryName] || countryName.substring(0, 2).toUpperCase();
}

function addBusinessDays(startDate, daysToAdd) {
    let currentDate = startDate;
    let addedDays = 0;

    while (addedDays < daysToAdd) {
        currentDate = addDays(currentDate, 1);
        // 0 is Sunday, 6 is Saturday in date-fns by default depending on locale, 
        // but isWeekend accurately checks both
        if (!isWeekend(currentDate)) {
            addedDays++;
        }
    }
    return currentDate;
}

// 16 days of generic tracking events
const genericEventsTemplate = [
    { time: '08:45 AM', location: 'Origin Facility', title: 'Electronic Shipping Info Received', description: 'The shipper has generated a shipment label, but the shipment has not yet been handed over to the carrier.', eventCode: 'SYS-001', warning: false },
    { time: '02:30 PM', location: 'Origin Facility', title: 'Shipment Picked Up', description: 'The carrier has picked up the shipment from the shipper.', eventCode: 'ORG-012', warning: false },
    { time: '09:15 AM', location: 'Origin Sort Facility', title: 'Processed at Origin Hub', description: 'Shipment has been processed and sorted at the origin processing facility.', eventCode: 'ORG-055', warning: false },
    { time: '11:40 AM', location: 'Origin Sort Facility', title: 'Departed Origin Hub', description: 'Shipment has left the origin facility and is in transit to the export gateway.', eventCode: 'ORG-058', warning: false },
    { time: '04:20 PM', location: 'Export Gateway', title: 'Arrived at Export Gateway', description: 'Shipment has arrived at the international export facility.', eventCode: 'EXP-101', warning: false },
    { time: '10:05 AM', location: 'Export Customs', title: 'Customs Clearance Started', description: 'Shipment has been submitted to export customs for review.', eventCode: 'CUS-201', warning: false },
    { time: '03:50 PM', location: 'Export Customs', title: 'Export Customs Cleared', description: 'Customs clearance is complete. Shipment is ready for international departure.', eventCode: 'CUS-205', warning: false },
    { time: '08:10 AM', location: 'International Airport', title: 'Arrived at Departure Airport', description: 'Shipment is at the airport awaiting departure to the destination country.', eventCode: 'AIR-301', warning: false },
    { time: '01:45 PM', location: 'In Transit', title: 'Departed on Flight', description: 'Shipment has departed on an international flight.', eventCode: 'AIR-305', warning: false },
    { time: '11:20 AM', location: 'In Transit', title: 'Arrived at Transit Hub', description: 'Shipment has arrived at an intermediate transit hub.', eventCode: 'HUB-401', warning: false },
    { time: '05:30 PM', location: 'In Transit', title: 'Departed Transit Hub', description: 'Shipment has departed the intermediate transit hub.', eventCode: 'HUB-405', warning: false },
    { time: '09:40 AM', location: 'In Transit', title: 'Connecting Flight Departed', description: 'Shipment is on the final flight to the destination country.', eventCode: 'AIR-410', warning: false },
    { time: '02:15 PM', location: 'Destination Airport', title: 'Arrived at Destination Airport', description: 'Shipment has touched down in the destination country.', eventCode: 'AIR-501', warning: false },
    { time: '10:00 AM', location: 'Import Customs', title: 'Submitted to Import Customs', description: 'Shipment has been handed over to destination customs for processing.', eventCode: 'CUS-601', warning: false },
    { time: '04:25 PM', location: 'Import Customs', title: 'Customs Processing', description: 'Shipment is undergoing routine customs inspection.', eventCode: 'CUS-603', warning: true }, // adding a warning styling here for visual variety
    { time: '11:50 AM', location: 'Import Customs', title: 'Import Customs Cleared', description: 'Shipment has been released by customs and handed to the local carrier.', eventCode: 'CUS-609', warning: false }
];

export function generateTrackingTimeline(startDateString, destinationCountry, destinationCity) {
    // Parses a starting date like "2026-03-01"
    const startDate = new Date(startDateString);
    const events = [];

    const isoCode = getIsoCode(destinationCountry);

    // Day 1 to 16
    for (let i = 0; i < 16; i++) {
        const template = genericEventsTemplate[i];
        // i is the index, so day 1 corresponds to 0 business days added (or 1 depending on rule)
        // We will assume day 1 is the start date (0 added days), day 2 is 1 added day...
        const eventDate = addBusinessDays(startDate, i);

        events.push({
            day: i + 1,
            date: format(eventDate, 'MMMM d, yyyy'),
            time: template.time,
            location: template.location,
            title: template.title,
            description: template.description,
            eventCode: template.eventCode,
            warning: template.warning
        });
    }

    // Day 17: Show chosen Country Name dynamically
    const day17Date = addBusinessDays(startDate, 16);
    events.push({
        day: 17,
        date: format(day17Date, 'MMMM d, yyyy'),
        time: '08:30 AM',
        location: `National Hub, ${destinationCountry}`,
        title: `Arrived at ${destinationCountry} Hub`,
        description: `Shipment has arrived at the primary sorting facility in ${destinationCountry}.`,
        eventCode: 'HUB-701',
        warning: false
    });

    // Day 18 onwards: Dynamic city/country and ISO codes
    const finalTemplates = [
        { time: '02:15 PM', location: `Regional Center, ${destinationCountry}`, title: 'Processed at Regional Facility', description: `Shipment sorted at regional processing center serving ${destinationCity}.`, codeSuffix: '-802', warning: false },
        { time: '09:05 AM', location: `${destinationCity}, ${destinationCountry}`, title: 'Arrived at Local Facility', description: 'Shipment has arrived at the final delivery depot.', codeSuffix: '-901', warning: false },
        { time: '07:30 AM', location: `${destinationCity}, ${destinationCountry}`, title: 'Out for Delivery', description: 'Shipment has been loaded onto the delivery vehicle.', codeSuffix: '-905', warning: false },
        { time: '01:45 PM', location: `${destinationCity}, ${destinationCountry}`, title: 'Delivered', description: 'Shipment has been successfully delivered to the recipient.', codeSuffix: '-999', warning: false }
    ];

    for (let i = 0; i < finalTemplates.length; i++) {
        // day 18 is 17 business days added...
        const eventDate = addBusinessDays(startDate, 17 + i);
        const template = finalTemplates[i];

        events.push({
            day: 18 + i,
            date: format(eventDate, 'MMMM d, yyyy'),
            time: template.time,
            location: template.location,
            title: template.title,
            description: template.description,
            eventCode: `${isoCode}${template.codeSuffix}`,
            warning: template.warning
        });
    }

    // Sort descending so timeline appears newest first (optional based on UI, but standard logic)
    // For Apple-style vertical scrolling timelines, typically newest is at top or bottom. We will keep it chronological
    // so newest is at the bottom as you scroll down.

    return events;
}
