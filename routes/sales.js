import express from "express";
import { addSale, getSales } from "../data/sales.js";

const router = express.Router();

router.post("/addSale", async (req,res) =>{
    console.log("add sale router")
    const sale = await addSale(req.body);
    res.send(sale)
})

router.get("/getSales", async (req,res) =>{
    console.log("getSales router")
    const sales = await getSales();
    res.send(sales); 
})

export default router;