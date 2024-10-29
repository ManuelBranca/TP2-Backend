import getConnection from "./conn.js";
import { ObjectId } from "mongodb";
const DATABASE = "ORT-database";
const PRODUCTS = "products";

export async function addProduct(product) {
  console.log("Entro al addProduct");

  if (!product.name) {
    throw new Error("El nombre es requerido");
  }
  if (!product.description) {
    throw new Error("La descripción es requerida");
  }
  if (!product.category) {
    throw new Error("La categoría es requerida");
  }
  if (typeof product.price !== "number" || product.price <= 0) {
    throw new Error("El precio es requerido y debe ser un número positivo");
  }
  if (!product.image) {
    throw new Error("La imagen es requerida");
  }

  const productModel = {
    name: product.name,
    description: product.description,
    category: product.category,
    price: product.price,
    image: product.image,
    stock: product.stock
  };

  const clientMongo = await getConnection();

  const result = await clientMongo
    .db(DATABASE)
    .collection(PRODUCTS)
    .insertOne(productModel);
  return result;
}

export async function getProductById(id) {
  const clientMongo = await getConnection();
  const result = await clientMongo
    .db(DATABASE)
    .collection(PRODUCTS)
    .findOne({ _id: new ObjectId(id) });

  if (!result) {
    throw new Error("Producto no encontrado");
  }

  return result;
}

export async function deleteProduct(id) {
  const clientMongo = await getConnection();
  const result = await clientMongo
    .db(DATABASE)
    .collection(PRODUCTS)
    .deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) {
    throw new Error("Producto no encontrado o no pudo ser eliminado");
  }

  return { message: "Producto eliminado exitosamente" };
}

export async function updateProduct(id, updatedProduct) {
  const clientMongo = await getConnection();
  const fieldsToUpdate = {};

  if (updatedProduct.name) fieldsToUpdate.name = updatedProduct.name;
  if (updatedProduct.description)
    fieldsToUpdate.description = updatedProduct.description;
  if (updatedProduct.category)
    fieldsToUpdate.category = updatedProduct.category;
  if (typeof updatedProduct.price === "number" && updatedProduct.price > 0)
    fieldsToUpdate.price = updatedProduct.price;
  if (updatedProduct.image) fieldsToUpdate.image = updatedProduct.image;

  const result = await clientMongo
    .db(DATABASE)
    .collection(PRODUCTS)
    .updateOne({ _id: new ObjectId(id) }, { $set: fieldsToUpdate });

  if (result.matchedCount === 0) {
    throw new Error("Producto no encontrado o no pudo ser actualizado");
  }

  return { message: "Producto actualizado exitosamente" };
}

export async function getProducts() {
  const clientMongo = await getConnection();

  const products = await clientMongo
    .db(DATABASE)
    .collection(PRODUCTS)
    .find()
    .toArray();

  return products;
}
