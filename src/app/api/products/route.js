// src/app/api/products/route.js
import { MongoClient } from "mongodb";

const uri = "mongodb+srv://iosachinruhela:kavyakart@data.t3b3ogv.mongodb.net/data?retryWrites=true&w=majority&appName=data";

let cachedClient = null;

export async function GET() {
  try {
    if (!cachedClient) {
      cachedClient = await MongoClient.connect(uri);
    }

    const db = cachedClient.db("data"); // your DB name
    const products = await db.collection("products").find({}).toArray();

    return new Response(JSON.stringify(products), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    console.error("❌ MongoDB Error:", err.message);
    return new Response(JSON.stringify({ error: "Connection failed ❌" }), {
      status: 500,
    });
  }
}
