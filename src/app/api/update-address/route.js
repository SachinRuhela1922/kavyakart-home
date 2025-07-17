// src/app/api/update-address/route.js
import { MongoClient } from "mongodb";

const uri = "mongodb+srv://iosachinruhela:kavyakart@data.t3b3ogv.mongodb.net/?retryWrites=true&w=majority&appName=data";
const client = new MongoClient(uri);
const dbName = "data";

export async function POST(req) {
  try {
    const body = await req.json();
    const { uid, address } = body;

    if (!uid || !address) {
      return new Response(JSON.stringify({ error: "Missing data" }), { status: 400 });
    }

    await client.connect();
    const db = client.db(dbName);
    const users = db.collection("users");

    await users.updateOne({ uid }, { $set: { address } });

    return new Response(JSON.stringify({ message: "Address updated ✅" }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Update failed ❌" }), { status: 500 });
  }
}
