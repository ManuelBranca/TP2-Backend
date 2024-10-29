import express from "express";
import { addProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../data/products.js";

const router = express.Router();

router.post("/addProduct", async(req,res) => {
    console.log("Entro al router addProduct")
    const result = await addProduct(req.body);
    res.send(result)
})

router.get("/getById/:id", async(req,res) =>{
    console.log("getProductById router")
    const result = await getProductById(req.params.id);
    res.send(result);
})

router.delete("/deleteProduct/:id", async(req,res) =>{
    console.log("delete product router")
    const result = await deleteProduct(req.params.id);
    res.send(result);
})

router.post("/updateProduct/:id", async(req,res) =>{
    console.log("Update router")
    const result = await updateProduct(req.params.id,req.body);
    res.send(result);
})

router.get("/getProducts", async(req,res) =>{
    console.log("getProducts router")
    const result = await getProducts();
    res.send(result);
})
export default router;