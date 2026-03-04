import clientPromise from './mongodb';

const DB_NAME = 'titanxlogistics';
const COLLECTION_NAME = 'trackings';

async function getCollection() {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    return db.collection(COLLECTION_NAME);
}

export async function getTrackings() {
    try {
        const collection = await getCollection();
        // Return trackings sorted by newest start date or creation (MongoDB default _id sort is roughly chronological)
        const trackings = await collection.find({}).sort({ _id: -1 }).toArray();
        // Convert MongoDB _id ObjectId to string if needed by the frontend, but typically it maps nicely,
        // however we ensure `trackingId` is our primary lookup key
        return trackings.map(t => {
            const { _id, ...rest } = t;
            return { ...rest, _id: _id.toString() };
        });
    } catch (error) {
        console.error('Failed to fetch trackings from MongoDB', error);
        return [];
    }
}

export async function getTrackingById(id) {
    try {
        const collection = await getCollection();
        const tracking = await collection.findOne({ trackingId: id });
        if (tracking) {
            const { _id, ...rest } = tracking;
            return { ...rest, _id: _id.toString() };
        }
        return null;
    } catch (error) {
        console.error('Failed to fetch tracking by ID', error);
        return null;
    }
}

export async function saveTracking(tracking) {
    try {
        const collection = await getCollection();
        // Upsert logic: Update if exists, Insert if it doesn't
        await collection.updateOne(
            { trackingId: tracking.trackingId },
            { $set: tracking },
            { upsert: true }
        );
        return true;
    } catch (error) {
        console.error('Failed to save tracking', error);
        return false;
    }
}

export async function updateTrackingStatus(id, newStatus) {
    try {
        const collection = await getCollection();
        const result = await collection.updateOne(
            { trackingId: id },
            { $set: { status: newStatus } }
        );
        return result.modifiedCount > 0;
    } catch (error) {
        console.error('Failed to update tracking status', error);
        return false;
    }
}

export async function deleteTracking(id) {
    try {
        const collection = await getCollection();
        const result = await collection.deleteOne({ trackingId: id });
        return result.deletedCount > 0;
    } catch (error) {
        console.error('Failed to delete tracking', error);
        return false;
    }
}
