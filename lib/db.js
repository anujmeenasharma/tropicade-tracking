import fs from 'fs';
import path from 'path';
import defaultData from './data.json';

const isProduction = process.env.NODE_ENV === 'production';
const dataFile = isProduction ? path.join('/tmp', 'data.json') : path.join(process.cwd(), 'lib', 'data.json');

let memoryCache = null;

export function getTrackings() {
    if (isProduction && memoryCache) return memoryCache;

    try {
        if (!fs.existsSync(dataFile)) {
            fs.writeFileSync(dataFile, JSON.stringify(defaultData, null, 2));
        }

        const fileContent = fs.readFileSync(dataFile, 'utf-8');
        const data = JSON.parse(fileContent);

        if (isProduction) memoryCache = data.trackings || [];
        return data.trackings || [];
    } catch (error) {
        console.error("Error reading database fallback to default:", error);
        return defaultData.trackings || [];
    }
}

export function getTrackingById(id) {
    const trackings = getTrackings();
    return trackings.find(t => t.trackingId === id) || null;
}

export function saveTracking(tracking) {
    const trackings = getTrackings();
    const index = trackings.findIndex(t => t.trackingId === tracking.trackingId);

    if (index >= 0) {
        trackings[index] = tracking;
    } else {
        trackings.push(tracking);
    }

    if (isProduction) memoryCache = trackings;

    try {
        fs.writeFileSync(dataFile, JSON.stringify({ trackings }, null, 2));
    } catch (e) {
        console.error("Save tracking failed", e);
    }
}

export function updateTrackingStatus(id, newStatus) {
    const trackings = getTrackings();
    const index = trackings.findIndex(t => t.trackingId === id);

    if (index >= 0) {
        trackings[index].status = newStatus;
        if (isProduction) memoryCache = trackings;

        try {
            fs.writeFileSync(dataFile, JSON.stringify({ trackings }, null, 2));
        } catch (e) { }
        return true;
    }
    return false;
}

export function deleteTracking(id) {
    const trackings = getTrackings();
    const newTrackings = trackings.filter(t => t.trackingId !== id);
    if (trackings.length !== newTrackings.length) {
        if (isProduction) memoryCache = newTrackings;

        try {
            fs.writeFileSync(dataFile, JSON.stringify({ trackings: newTrackings }, null, 2));
        } catch (e) { }
        return true;
    }
    return false;
}
