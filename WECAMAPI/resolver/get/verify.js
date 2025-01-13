import jwt from 'jsonwebtoken';

import { userModel } from '../../dbschema.js';
import { JWTSECRET } from "../../index.js"

async function verify(req,res){
    const response = {
        status: 200,
        content: null,
        error: null,
    };
    const {jwttoken,name} = req.body
    if(!jwttoken||!name){
        response.status = 400;
        response.error = "Missing properties";
        return res.send(response);
    }
    try {
        try {
            const decoded = jwt.verify(jwttoken, JWTSECRET);
            try {
                const currentuser = await userModel.findById(decoded.id).populate("cams");
                if(!currentuser)throw Error("Not found");
                const exists = currentuser.cams.find((cams) => cams.name === name);
                if(exists){
                    response.status = 403;
                    response.error = "Cam already exists";
                    return res.send(response);
                }
                response.error = "Ok";
                return res.send(response); 
            } catch (error) {
                response.status = 404;
                response.error = "User not found";
                return res.send(response); 
            }
        } catch (error) {
            console.log(error)
            response.status = 400;
            response.error = "Revoked token";
            return res.send(response); 
        }
    } catch (error) {
        console.log(error);
        response.status = 500;
        response.error = "Internal error";
        return res.send(response);
    }
}

export default verify;