import "dotenv/config";
import express from "express";
import usersRouter from "./routes/users.js";
import productsRouter from "./routes/products.js"
import salesRouter from "./routes/sales.js"

const PORT = process.env.PORT;
const app = express();
app.use(express.json());
app.use("/api/sales", salesRouter);
app.use("/api/products", productsRouter);
app.use("/api/users", usersRouter);

app.listen(PORT, () => {
  console.log("Servidor Web en el puerto:", PORT);
});
