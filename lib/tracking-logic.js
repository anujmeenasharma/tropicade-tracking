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

// Fixed 16 days of tracking events (Mapping Day 1 to 16 statically)
const genericEventsTemplate = [
    { dayOffset: 0, dayLabel: 1, time: '10:14 AM', location: 'Los Angeles, CA, USA', title: 'Shipping Label Created', description: 'The sender has generated a shipping label. The package is awaiting acceptance by the carrier.', eventCode: 'PC1', warning: false },
    { dayOffset: 2, dayLabel: 3, time: '12:37 AM', location: 'Los Angeles, CA, USA', title: 'Accepted at Titan X Logistics Origin Facility', description: 'Package received by carrier.', eventCode: 'OF1', warning: false },
    { dayOffset: 2, dayLabel: 3, time: '04:21 PM', location: 'Los Angeles, CA, USA', title: 'Processed Through Regional Facility', description: 'Shipment processed at origin sorting center.', eventCode: 'PF1', warning: false },
    { dayOffset: 3, dayLabel: 4, time: '11:48 PM', location: 'ISC Los Angeles, CA, USA', title: 'Processed Through Facility – ISC LAX', description: 'Processed at the International Service Center at Los Angeles International Airport and dispatched overseas.', eventCode: 'ISC-LAX-DISPATCH', warning: false },
    { dayOffset: 5, dayLabel: 6, time: '06:22 AM', location: 'Frankfurt, Germany', title: 'Arrived at International Hub – Frankfurt Airport', description: 'The shipment has arrived at the European transit hub.', eventCode: 'EU-ARR-FRA', warning: false },
    { dayOffset: 6, dayLabel: 7, time: '08:03 AM', location: 'Frankfurt, Germany', title: 'Held in Customs – Clearance Processing', description: 'The shipment is undergoing customs review.', eventCode: 'CUS-IN-FRA', warning: false },
    { dayOffset: 8, dayLabel: 9, time: '02:41 PM', location: 'Frankfurt, Germany', title: 'Customs Inspection', description: 'Customs authorities are verifying shipment documentation.', eventCode: 'CUS-SEC-CHK', warning: false },
    { dayOffset: 11, dayLabel: 12, time: '11:19 AM', location: 'Frankfurt, Germany', title: 'Customs Delay – Additional Information Required ⚠️', description: 'Shipment temporarily delayed pending documentation verification.', eventCode: 'CUS-HOLD-DOC', warning: true },
    { dayOffset: 15, dayLabel: 16, time: '03:55 PM', location: 'Frankfurt, Germany', title: 'Released from Customs', description: 'Customs clearance completed.', eventCode: 'CUS-REL-FRA', warning: false }
];

export function generateTrackingTimeline(startDateString, destinationCountry, destinationCity) {
    // Parses a starting date like "2026-03-01"
    const startDate = new Date(startDateString);
    const events = [];

    const isoCode = getIsoCode(destinationCountry);

    // Day 1 to 16
    for (const template of genericEventsTemplate) {
        const eventDate = addBusinessDays(startDate, template.dayOffset);

        events.push({
            day: template.dayLabel,
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
