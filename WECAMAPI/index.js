import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

const app = express()
app.use(express.json())
const port = 8010

import login from './resolver/get/login.js';
import camera from './resolver/get/getcaminfo.js';
import verify from './resolver/get/verify.js';
import cams from './resolver/get/getcams.js';
import putsdp from './resolver/put/putsdp.js'
import deleteuser from './resolver/delete/deleteuser.js'
import newuser from './resolver/post/newuser.js'
import newcam from './resolver/post/newcam.js'

await dotenv.config();
const MDKEY = process.env.mongodb_key;
export const JWTSECRET = process.env.jwt_secret;

await mongoose.connect(MDKEY, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Database connection error:', err));



  app.use(cors({
      origin: '*', 
      methods: ['GET', 'POST', 'PUT', 'DELETE'],        
      credentials: false            
  }));

app.get('/', (req, res) => {
  let response = {
    status:"400",
    endpoints:[
    ]
  } 
  res.send(response);
})

app.post('/login', async (req, res) => {
  await login(req,res);
})

app.post('/camera', async (req, res) => {
  await camera(req,res);
})

app.post('/getcams', async (req, res) => {
  await cams(req,res);
})

app.post('/verify', async (req, res) => {
  await verify(req,res);
})

app.post('/pcstatus',(req,res)=>{
  pcstatus(req,res);
})

app.put('/answercam',(req,res)=>{
  answercam(req,res);
})

app.put('/putsdp',(req,res)=>{
  putsdp(req,res);
})

app.post('/newuser', async (req, res) => {
  await newuser(req,res);
})

app.post('/newcam', async (req, res) => {
  await newcam(req,res);
})

app.delete('/deletecam',async (req,res)=>{
  await deletecam(req,res);
})

app.delete('/deleteuser',async (req,res)=>{
  await deleteuser(req,res);  
})


app.listen(port, () => {
  console.log(`Listening at ${port}`)
})

