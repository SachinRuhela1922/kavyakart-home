// src/app/api/user-details/route.js
import { MongoClient } from "mongodb";

const uri = "mongodb+srv://iosachinruhela:kavyakart@data.t3b3ogv.mongodb.net/?retryWrites=true&w=majority&appName=data";
const client = new MongoClient(uri);
const dbName = "data";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");

    if (!uid) {
      return new Response(JSON.stringify({ error: "UID missing" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    await client.connect();
    const db = client.db(dbName);
    const users = db.collection("users");

    const user = await users.findOne({ uid });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    return new Response(JSON.stringify({ user }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to fetch user" }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
}
