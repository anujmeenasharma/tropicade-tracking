import fs from 'fs';
import path from 'path';

// Use /tmp for writable storage in serverless environments like Vercel
const tmpFile = path.join('/tmp', 'data.json');
const defaultDataFile = path.join(process.cwd(), 'lib', 'data.json');

// Helper to assure the file exists securely in /tmp
function ensureFile() {
    if (!fs.existsSync(tmpFile)) {
        if (fs.existsSync(defaultDataFile)) {
            // Copy default data seed to /tmp
            fs.copyFileSync(defaultDataFile, tmpFile);
        } else {
            fs.writeFileSync(tmpFile, JSON.stringify({ trackings: [] }, null, 2));
        }
    }
}

export function getTrackings() {
    ensureFile();
    try {
        const fileContent = fs.readFileSync(tmpFile, 'utf-8');
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

    fs.writeFileSync(tmpFile, JSON.stringify({ trackings }, null, 2));
}

export function updateTrackingStatus(id, newStatus) {
    const trackings = getTrackings();
    const index = trackings.findIndex(t => t.trackingId === id);

    if (index >= 0) {
        trackings[index].status = newStatus;
        fs.writeFileSync(tmpFile, JSON.stringify({ trackings }, null, 2));
        return true;
    }
    return false;
}
