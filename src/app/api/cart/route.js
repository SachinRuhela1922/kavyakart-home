import { MongoClient } from "mongodb";

const uri = "mongodb+srv://iosachinruhela:kavyakart@data.t3b3ogv.mongodb.net/?retryWrites=true&w=majority&appName=data";
const client = new MongoClient(uri);
const dbName = "data";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");

    await client.connect();
    const db = client.db(dbName);
    const users = db.collection("users");

    const user = await users.findOne({ uid });

    return new Response(JSON.stringify({ cart: user?.cart || [] }), {
      status: 200
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to fetch cart" }), {
      status: 500
    });
  }
}
