import getConnection from "./conn.js";
import { ObjectId } from "mongodb";
const DATABASE = "ORT-database";
const USERS = "users";
const PRODUCTS = "products";
const SALES = "sales";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { addSale } from "./sales.js";

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

//   //TODO purchase, iniciar sesion, cerrar sesion
// export async function purchase(id,itemsProductos){
//   const bdd = getConnection()
//   const compras = await bdd.db(DATABASE).collection(USERS).findOne({_id: new ObjectId(id)})
//   //TODO agregar Items productos en el array de compras
//   //TODO actualizar stock
// }

export async function purchase(id, itemsProductos) {
  const clientMongo = await getConnection();

  // Verificar existencia del usuario
  const user = await clientMongo
    .db(DATABASE)
    .collection(USERS)
    .findOne({ _id: new ObjectId(id) });

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  const productsCollection = clientMongo.db(DATABASE).collection(PRODUCTS);
  const productsPurchased = [];
  let total = 0;

  // Verificar y actualizar stock de productos
  for (const item of itemsProductos) {
    const product = await productsCollection.findOne({
      _id: new ObjectId(item.productId),
    });

    if (!product) {
      throw new Error(`Producto con ID ${item.productId} no encontrado`);
    }

    if (product.stock < item.quantity) {
      throw new Error(`Stock insuficiente para el producto ${product.name}`);
    }

    // Calcular total de la compra
    total += product.price * item.quantity;
    productsPurchased.push({
      productId: item.productId,
      quantity: item.quantity,
      price: product.price,
    });

    // Actualizar stock del producto
    await productsCollection.updateOne(
      { _id: new ObjectId(item.productId) },
      { $inc: { stock: -item.quantity } }
    );
  }

  // Crear objeto de venta
  const sale = {
    userId: id,
    products: productsPurchased,
    total,
    date: new Date(),
  };

  // Llamar a addSale para registrar la venta en SALES y obtener el ID de la venta
  const saleResult = await addSale(sale);

  // Actualizar las compras en el usuario con referencia al ID de la venta
  await clientMongo
    .db(DATABASE)
    .collection(USERS)
    .updateOne(
      { _id: new ObjectId(id) },
      {
        $push: {
          compras: {
            saleId: saleResult.insertedId,
            items: productsPurchased,
            date: new Date(),
          },
        },
      }
    );

  return {
    message: "Compra realizada exitosamente",
    saleId: saleResult.insertedId,
  };
}

export async function findByCredencial(email, password) {
  console.log("FindBycredential")
  const clientMongo = await getConnection();
  const user = await clientMongo
    .db(DATABASE)
    .collection(USERS)
    .findOne({ email: email });

  if (!user) {
    throw new Error("Credenciales no validas");
  }

  const isMatch = await bcryptjs.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Credenciales no validas");
  }

  return user;
}

export async function authToken(user) {
  const token = jwt.sign(
    { _id: user._id, email: user.email },
    process.env.SECRET,
    { expiresIn: "1h" }
  );

  return token;
}

