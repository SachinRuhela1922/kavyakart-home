// src/app/api/storeUser/route.js

import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

// ✅ MongoDB Connection
const MONGO_URI = "mongodb+srv://iosachinruhela:kavyakart@data.t3b3ogv.mongodb.net/?retryWrites=true&w=majority&appName=data";
const client = new MongoClient(MONGO_URI);

export async function POST(req) {
  try {
    const { uid, email } = await req.json();

    if (!uid || !email) {
      return NextResponse.json({ error: "Missing uid or email" }, { status: 400 });
    }

    await client.connect();
    const mongoDB = client.db("data"); // ✅ your database name
    const usersCollection = mongoDB.collection("users");

    await usersCollection.updateOne(
      { uid },
      { $set: { uid, email } },
      { upsert: true } // insert if doesn't exist
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Server Error:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
