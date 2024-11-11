import "dotenv/config";
import express from "express";
import cors from "cors";  // Importa cors correctamente
import usersRouter from "./routes/users.js";
import productsRouter from "./routes/products.js";
import salesRouter from "./routes/sales.js";

const app = express();  // Solo declaras una vez `express()`

const PORT = process.env.PORT;

// Configura CORS antes de las rutas
app.use(cors({
  origin: 'http://localhost:3001'  // Permite solicitudes desde el puerto de tu frontend
}));

app.use(express.json());

// Define las rutas después de configurar CORS
app.use("/api/sales", salesRouter);
app.use("/api/products", productsRouter);
app.use("/api/users", usersRouter);

app.listen(PORT, () => {
  console.log("Servidor Web en el puerto:", PORT);
});