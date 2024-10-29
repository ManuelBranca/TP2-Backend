import getConnection from "./conn.js";
import { ObjectId } from "mongodb";
const DATABASE = "ORT-database";
const USERS = "users";
const PRODUCTS = "products";
import bcryptjs from "bcryptjs";

export async function addUser(user) {
  console.log("Entro al addUser");

  if (!user.email) {
    throw new Error("El email es requerido");
  }
  if (!user.password) {
    throw new Error("La contraseña es requerida");
  }
  if (!user.name) {
    throw new Error("El nombre es requerido");
  }
  if (!user.lastname) {
    throw new Error("El apellido es requerido");
  }
  if (!user.username) {
    throw new Error("El username es requerido");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(user.email)) {
    throw new Error("El email no es válido");
  }

  const userModel = {
    email: user.email,
    password: await bcryptjs.hash(user.password, 10),
    name: user.name,
    lastname: user.lastname,
    username: user.username,
    compras: [],
  };

  const clientMongo = await getConnection();

  const result = clientMongo
    .db(DATABASE)
    .collection(USERS)
    .insertOne(userModel);
  return result;
}

export async function getUsers() {
  const clientMongo = await getConnection();

  const users = await clientMongo
    .db(DATABASE)
    .collection(USERS)
    .find()
    .toArray();

  return users;
}

export async function deleteUser(id) {
  const clientMongo = await getConnection();

  const result = await clientMongo
    .db(DATABASE)
    .collection(USERS)
    .deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) {
    throw new Error("Usuario no encontrado o no pudo ser eliminado");
  }

  return { message: "Usuario eliminado exitosamente" };
}

export async function getUserById(id) {
  const clientMongo = await getConnection();

  const user = await clientMongo
    .db(DATABASE)
    .collection(USERS)
    .findOne({ _id: new ObjectId(id) });

  return user;
}

export async function updateUser(id, updatedUser) {
  const clientMongo = await getConnection();
  const fieldsToUpdate = {};

  if (updatedUser.email) fieldsToUpdate.email = updatedUser.email;
  if (updatedUser.password)
    fieldsToUpdate.password = await bcryptjs.hash(updatedUser.password, 10);
  if (updatedUser.name) fieldsToUpdate.name = updatedUser.name;
  if (updatedUser.lastname) fieldsToUpdate.lastname = updatedUser.lastname;
  if (updatedUser.username) fieldsToUpdate.username = updatedUser.username;

  const result = await clientMongo
    .db(DATABASE)
    .collection(USERS)
    .updateOne({ _id: new ObjectId(id) }, { $set: fieldsToUpdate });

  if (result.matchedCount === 0) {
    throw new Error("Usuario no encontrado o no pudo ser actualizado");
  }

  return { message: "Usuario actualizado exitosamente" };
}

  //TODO purchase, iniciar sesion, cerrar sesion
export async function purchase(id,itemsProductos){
  const bdd = getConnection()
  const compras = await bdd.db(DATABASE).collection(USERS).findOne({_id: new ObjectId(id)})
  //TODO agregar Items productos en el array de compras
  //TODO actualizar stock
}
