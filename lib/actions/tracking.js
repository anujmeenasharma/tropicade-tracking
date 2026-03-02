'use server'

import { revalidatePath } from 'next/cache';
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

    await saveTracking(newTracking);
    revalidatePath('/admin');
    return { success: true, tracking: newTracking };
}

export async function fetchAllTrackings() {
    return await getTrackings();
}

export async function updateStatusAction(id, newStatus) {
    const success = await updateTrackingStatus(id, newStatus);
    revalidatePath('/admin');
    revalidatePath(`/track/${id}`);
    return { success };
}

export async function updateTrackingEventsAction(id, newEvents) {
    const trackings = await getTrackings();
    const index = trackings.findIndex(t => t.trackingId === id);
    if (index >= 0) {
        trackings[index].events = newEvents;
        await saveTracking(trackings[index]);
        revalidatePath('/admin');
        revalidatePath(`/track/${id}`);
        return { success: true };
    }
    return { error: 'Tracking not found' };
}

export async function deleteTrackingAction(id) {
    const success = await deleteTracking(id);
    if (success) {
        revalidatePath('/admin');
        return { success: true };
    }
    return { error: 'Tracking not found or could not be deleted' };
}
