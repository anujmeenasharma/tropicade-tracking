const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const uri = "mongodb+srv://xvsanuj:iyRSMnm0AetLfVBQ@cluster0.bogij.mongodb.net/";

async function seed() {
    console.log("Connecting to MongoDB...");
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('tropicade');
        const collection = db.collection('trackings');

        // Read local data
        const dataPath = path.join(__dirname, 'lib', 'data.json');
        if (!fs.existsSync(dataPath)) {
            console.log("No local data.json found, skipping seed.");
            return;
        }

        const fileContent = fs.readFileSync(dataPath, 'utf-8');
        const data = JSON.parse(fileContent);
        const trackings = data.trackings || [];

        if (trackings.length > 0) {
            console.log(`Found ${trackings.length} trackings locally. Attempting to insert...`);

            // Insert
            for (const t of trackings) {
                await collection.updateOne(
                    { trackingId: t.trackingId },
                    { $set: t },
                    { upsert: true }
                );
            }
            console.log("Successfully seeded MongoDB with local trackings.");
        } else {
            console.log("Local data.json is empty.");
        }
    } catch (e) {
        console.error("Migration failed:", e);
    } finally {
        await client.close();
    }
}

seed();
