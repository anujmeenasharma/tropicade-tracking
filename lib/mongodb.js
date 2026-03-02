import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

let clientPromise;

if (!uri) {
    // During Next.js build, we don't want to throw at the top-level because it breaks config collection.
    // Instead we return a rejected promise which only throws at runtime if a component tries to connect.
    clientPromise = Promise.reject(new Error('Invalid/Missing environment variable: "MONGODB_URI"'));
} else {
    let client;
    if (process.env.NODE_ENV === 'development') {
        if (!global._mongoClientPromise) {
            client = new MongoClient(uri, options);
            global._mongoClientPromise = client.connect();
        }
        clientPromise = global._mongoClientPromise;
    } else {
        client = new MongoClient(uri, options);
        clientPromise = client.connect();
    }
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
