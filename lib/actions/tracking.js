'use server'

import { saveTracking, getTrackings, updateTrackingStatus, deleteTracking } from '../db';
import { generateTrackingTimeline } from '../tracking-logic';

export async function createTrackingAction(formData) {
    const trackingId = formData.get('trackingId');
    const startDate = formData.get('startDate');
    const destinationCountry = formData.get('destinationCountry');
    const destinationCity = formData.get('destinationCity');

    if (!trackingId || !startDate || !destinationCountry || !destinationCity) {
        return { error: 'All fields are required.' };
    }

    // Generate the timeline
    const events = generateTrackingTimeline(startDate, destinationCountry, destinationCity);

    const newTracking = {
        trackingId,
        startDate,
        destinationCountry,
        destinationCity,
        status: 'active', // Default status
        events
    };

    saveTracking(newTracking);
    return { success: true, tracking: newTracking };
}

export async function fetchAllTrackings() {
    return getTrackings();
}

export async function updateStatusAction(id, newStatus) {
    const success = updateTrackingStatus(id, newStatus);
    return { success };
}

export async function updateTrackingEventsAction(id, newEvents) {
    const trackings = getTrackings();
    const index = trackings.findIndex(t => t.trackingId === id);
    if (index >= 0) {
        trackings[index].events = newEvents;
        saveTracking(trackings[index]);
        return { success: true };
    }
    return { error: 'Tracking not found' };
}

export async function deleteTrackingAction(id) {
    const success = deleteTracking(id);
    return { success };
}
