import "dotenv/config";
import { MongoClient } from "mongodb";
const url = process.env.MONGODB;

const client = new MongoClient(url);

let instance = null;

export default async function getConnection() {
  if (instance == null) {
    try {
      instance = await client.connect();
    } catch (error) {
      console.log("error de conexion:", err.message);
    }
  }
  return instance;
}
