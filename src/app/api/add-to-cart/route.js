import { MongoClient, ObjectId } from "mongodb";

const uri = "mongodb+srv://iosachinruhela:kavyakart@data.t3b3ogv.mongodb.net/?retryWrites=true&w=majority&appName=data";
const client = new MongoClient(uri);
const dbName = "data";

export async function POST(req) {
  try {
    const { uid, product } = await req.json();

    await client.connect();
    const db = client.db(dbName);
    const users = db.collection("users");

    const result = await users.updateOne(
      { uid: uid }, // find by uid
      { $push: { cart: product } }, // push product to cart array
      { upsert: true } // create document if not exists
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to add to cart" }), {
      status: 500
    });
  }
}
