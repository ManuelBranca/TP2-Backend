import express from "express";
import { addUser, deleteUser, getUserById, updateUser, getUsers } from "../data/users.js";

const router = express.Router();

router.post("/adduser", async (req,res)=>{
    console.log("Entro al router addUser")
    const result = await addUser(req.body);
    res.send(result)
})

router.get("/getUsers", async (req,res) =>{
    console.log("getUser router")
    const result = await getUsers();
    res.send(result)
})

router.delete("/deleteUser/:id", async (req,res) =>{
    console.log("delete U router")
    const result = await deleteUser(req.params.id);
    res.send(result);
})

router.get("/userById/:id", async (req,res) =>{
    console.log("getByid U router")
    const result = await getUserById(req.params.id)
    res.send(result);
})

router.post("/updateUser/:id", async (req,res) =>{
    console.log("update u")
    const result = await updateUser(req.params.id,req.body)
    res.send(result)
})
export default router;