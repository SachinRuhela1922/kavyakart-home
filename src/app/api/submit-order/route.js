import { MongoClient } from "mongodb";
import cloudinary from "@/utils/cloudinary"; // adjust path if needed

const uri = "mongodb+srv://iosachinruhela:kavyakart@data.t3b3ogv.mongodb.net/?retryWrites=true&w=majority&appName=data";
const client = new MongoClient(uri);
const dbName = "data";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      uid,
      address,
      products,
      total,
      paymentMode = "cod",
      paymentScreenshot = "",
      paymentStatus = "pending"
    } = body;

    if (!uid || !address || !products || !total) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
    }

    let uploadedImageUrl = "";
    if (paymentMode === "online" && paymentScreenshot) {
      try {
        const uploadRes = await cloudinary.uploader.upload(paymentScreenshot, {
          folder: "kavyakart_orders",
          public_id: `order_${Date.now()}`
        });
        uploadedImageUrl = uploadRes.secure_url;
      } catch (uploadErr) {
        console.error("Cloudinary upload error:", uploadErr);
        return new Response(JSON.stringify({ error: "Image upload failed" }), { status: 500 });
      }
    }

    await client.connect();
    const db = client.db(dbName);
    const ordersCollection = db.collection("orders");
    const usersCollection = db.collection("users");

    const fullOrder = {
      uid,
      address,
      products,
      total,
      paymentMode,
      paymentScreenshot: uploadedImageUrl,
      paymentStatus,
      status: "pending",
      createdAt: new Date()
    };

    // ✅ Save order to 'orders' collection
    await ordersCollection.insertOne(fullOrder);

    // ✅ Push order into user's orders array
    await usersCollection.updateOne(
      { uid },
      {
        $push: { orders: fullOrder },
        $set: { cart: [] } // ✅ Clear the user's cart
      }
    );

    return new Response(JSON.stringify({ message: "✅ Order placed successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("❌ Error placing order:", err);
    return new Response(JSON.stringify({ error: "Failed to place order" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
