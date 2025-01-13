import jwt from 'jsonwebtoken';

import { userModel } from '../../dbschema.js';
import { JWTSECRET } from "../../index.js"

async function cams(req,res){
    const response = {
        status: 200,
        content: null,
        error: null,
    };
    const {jwttoken} = req.body
    if(!jwttoken){
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
                response.error = "Ok";
                response.content = currentuser.cams;
                console.log(response)
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

export default cams;