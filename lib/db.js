import fs from 'fs';
import path from 'path';

const dataFile = path.join(process.cwd(), 'lib', 'data.json');

// Helper to assure the file exists securely
function ensureFile() {
    if (!fs.existsSync(dataFile)) {
        fs.writeFileSync(dataFile, JSON.stringify({ trackings: [] }, null, 2));
    }
}

export function getTrackings() {
    ensureFile();
    const fileContent = fs.readFileSync(dataFile, 'utf-8');
    try {
        const data = JSON.parse(fileContent);
        return data.trackings || [];
    } catch (error) {
        return [];
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

    fs.writeFileSync(dataFile, JSON.stringify({ trackings }, null, 2));
}

export function updateTrackingStatus(id, newStatus) {
    const trackings = getTrackings();
    const index = trackings.findIndex(t => t.trackingId === id);

    if (index >= 0) {
        trackings[index].status = newStatus;
        fs.writeFileSync(dataFile, JSON.stringify({ trackings }, null, 2));
        return true;
    }
    return false;
}
