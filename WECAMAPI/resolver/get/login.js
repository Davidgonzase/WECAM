import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { userModel } from "../../dbschema.js";
import { JWTSECRET } from "../../index.js"

async function login(req,res){
    const response = {
        status: 200,
        content: null,
        error: null,
    };
    const {email,password} = req.body
    if(!email||!password){
        response.status = 400;
        response.error = "Missing properties";
        return res.send(response);
    }
    try {
        const currentuser = await userModel.find({email:email})
        if(currentuser.length == 1){
            const match = await bcrypt.compare(password, currentuser[0].password);
            if(match){
                response.status = 200;
                
                const payload = {
                    name:currentuser[0].name,
                    id:currentuser[0].id
                };
              
                const options = { expiresIn: '30d' }; 
            
                const token = jwt.sign(payload, JWTSECRET, options);
            
                response.content ={
                    jwttoken:token,
                }

                return res.send(response);
            }else{
                response.status = 403;
                response.error = "Incorrect password";
                return res.send(response);
            }
        }else{
            response.status = 404;
            response.error = "User not found";
            return res.send(response);
        }
    } catch (error) {
        console.log(error);
        response.status = 500;
        response.error = "Internal error";
        return res.send(response);
    }

}

export default login;