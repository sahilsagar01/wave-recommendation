import { MongoClient } from "mongodb";

declare global {
  var mongoClient: MongoClient;
}

const MONGODB_URI = "mongodb+srv://java:gogomaster@database.qrvyh.mongodb.net/wave?retryWrites=true&w=majority";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let client: MongoClient;

if (process.env.NODE_ENV === "production") {
  client = new MongoClient(MONGODB_URI);
} else {
  if (!global.mongoClient) {
    global.mongoClient = new MongoClient(MONGODB_URI);
  }
  client = global.mongoClient;
}

export async function getMongoClient() {
  if (!client) {
    client = new MongoClient(MONGODB_URI);
  }
  await client.connect();
  return client;
}

export async function getDatabase() {
  const client = await getMongoClient();
  return client.db("wave");
}

// Collections
export async function getDrawerSettingsCollection() {
  const db = await getDatabase();
  return db.collection("drawer_settings");
}

export async function getAnnouncementCollection() {
  const db = await getDatabase();
  return db.collection("announcements");
}

export async function getProgressBarCollection() {
  const db = await getDatabase();
  return db.collection("progress_bars");
}

export async function getRecommendationSettingsCollection() {
  const db = await getDatabase();
  return db.collection("recommendation_settings");
}

export default client;
