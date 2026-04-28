import { addDays, isWeekend, format } from 'date-fns';

const countriesToIso = {
    'Australia': 'AU',
    'Austria': 'AT',
    'Belgium': 'BE',
    'Brazil': 'BR',
    'Bulgaria': 'BG',
    'Canada': 'CA',
    'China': 'CN',
    'Croatia': 'HR',
    'Cyprus': 'CY',
    'Czech Republic': 'CZ',
    'Denmark': 'DK',
    'Estonia': 'EE',
    'Finland': 'FI',
    'France': 'FR',
    'Germany': 'DE',
    'Greece': 'GR',
    'India': 'IN',
    'Ireland': 'IE',
    'Italy': 'IT',
    'Japan': 'JP',
    'Latvia': 'LV',
    'Lithuania': 'LT',
    'Luxembourg': 'LU',
    'Malta': 'MT',
    'Mexico': 'MX',
    'Netherlands': 'NL',
    'Poland': 'PL',
    'Portugal': 'PT',
    'Romania': 'RO',
    'Slovakia': 'SK',
    'Slovenia': 'SI',
    'Spain': 'ES',
    'Sweden': 'SE',
    'Switzerland': 'CH',
    'Ukraine': 'UA',
    'United Kingdom': 'UK',
    'United States': 'US'
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

// Complete timeline mapping
const genericEventsTemplate = [
    { dayOffset: 0, dayLabel: 1, time: '10:14 AM', location: 'Los Angeles, CA, USA', title: 'Shipping Label Created', description: 'The sender has generated a shipping label. The package is awaiting acceptance by the carrier.', eventCode: 'PC1', warning: false },
    { dayOffset: 2, dayLabel: 3, time: '04:21 PM', location: 'Los Angeles, CA, USA', title: 'Processed Through Regional Facility', description: 'Shipment processed at origin sorting center.', eventCode: 'PF1', warning: false },
    { dayOffset: 2, dayLabel: 3, time: '12:37 AM', location: 'Los Angeles, CA, USA', title: 'Accepted at Titan X Logistics Origin Facility', description: 'Package received by carrier.', eventCode: 'OF1', warning: false },
    { dayOffset: 3, dayLabel: 4, time: '11:48 PM', location: 'ISC Los Angeles, CA, USA', title: 'Processed Through Facility – ISC LAX', description: 'Processed at the International Service Center at Los Angeles International Airport and dispatched overseas.', eventCode: 'ISC-LAX-DISPATCH', warning: false },
    { dayOffset: 5, dayLabel: 6, time: '06:22 AM', location: 'Frankfurt, Germany', title: 'Arrived at International Hub – Frankfurt Airport', description: 'The shipment has arrived at the European transit hub.', eventCode: 'EU-ARR-FRA', warning: false },
    { dayOffset: 6, dayLabel: 7, time: '08:03 AM', location: 'Frankfurt, Germany', title: 'Held in Customs – Clearance Processing', description: 'The shipment is undergoing customs review.', eventCode: 'CUS-IN-FRA', warning: false },
    { dayOffset: 8, dayLabel: 9, time: '02:41 PM', location: 'Frankfurt, Germany', title: 'Customs Inspection', description: 'Customs authorities are verifying shipment documentation.', eventCode: 'CUS-SEC-CHK', warning: false },
    { dayOffset: 11, dayLabel: 12, time: '11:19 AM', location: 'Frankfurt, Germany', title: 'Customs Delay – Additional Information Required ⚠️', description: 'Shipment temporarily delayed pending documentation verification.', eventCode: 'CUS-HOLD-DOC', warning: true },
    { dayOffset: 15, dayLabel: 16, time: '03:55 PM', location: 'Frankfurt, Germany', title: 'Released from Customs', description: 'Customs clearance completed.', eventCode: 'CUS-REL-FRA', warning: false },
    { dayOffset: 16, dayLabel: 17, time: '07:20 AM', location: 'European Transit Hub', title: 'In Transit to Destination Country', description: (country) => `The shipment is en route to the final destination country (${country}).`, eventCode: 'EU-DEP-FRA', warning: false },
    { dayOffset: 17, dayLabel: 18, time: '07:44 AM', location: (city, country) => country, title: 'Arrival at Destination Hub', description: 'Shipment arrived at the destination country sorting facility.', eventCode: (isoCode) => `${isoCode}-ARR-IN`, warning: false },
    { dayOffset: 18, dayLabel: 19, time: '02:15 PM', location: (city, country) => country, title: 'In Transit to Local Distribution Center', description: 'The shipment is moving within the destination country toward the local delivery facility.', eventCode: (isoCode) => `${isoCode}-DOM-TRANSIT`, warning: false },
    { dayOffset: 19, dayLabel: 20, time: '07:22 PM', location: (city, country) => `${city}, ${country}`, title: 'Local Distribution Center', description: 'Shipment transferred to local delivery unit.', eventCode: (isoCode) => `${isoCode}-LOCAL-SORT`, warning: false },
    { dayOffset: 20, dayLabel: 21, time: '08:09 AM', location: (city, country) => `${city}, ${country}`, title: 'Out for Delivery', description: 'The shipment is out for delivery.', eventCode: 'OFD', warning: false },
    { dayOffset: 21, dayLabel: 22, time: '05:46 PM', location: (city, country) => `${city}, ${country}`, title: 'Delivery Attempt Failed – Action Required ⚠️', description: 'Delivery could not be completed. Please contact customer support to arrange redelivery or provide additional delivery instructions.', eventCode: 'DEL-ATTEMPT-FAIL', warning: true },
    { dayOffset: 22, dayLabel: 23, time: '09:18 AM', location: (city, country) => `${city}, ${country}`, title: 'Return to Sender Initiated', description: 'The shipment is being returned to the sender due to unsuccessful delivery attempts.', eventCode: 'RTS-INIT', warning: true }
];

export function generateTrackingTimeline(startDateString, destinationCountry, destinationCity) {
    // Parses a starting date like "2026-03-01"
    const startDate = new Date(startDateString);
    const events = [];
    const isoCode = destinationCountry ? getIsoCode(destinationCountry) : '';

    for (const template of genericEventsTemplate) {
        const eventDate = addBusinessDays(startDate, template.dayOffset);

        events.push({
            day: template.dayLabel,
            date: format(eventDate, 'MMMM d, yyyy'),
            time: template.time,
            location: typeof template.location === 'function' ? template.location(destinationCity, destinationCountry) : template.location,
            title: template.title,
            description: typeof template.description === 'function' ? template.description(destinationCountry) : template.description,
            eventCode: typeof template.eventCode === 'function' ? template.eventCode(isoCode) : template.eventCode,
            warning: template.warning
        });
    }

    return events;
}
