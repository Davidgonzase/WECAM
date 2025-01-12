import jwt from 'jsonwebtoken';

import { userModel } from "../../dbschema.js";
import { camModel } from "../../dbschema.js";
import { JWTSECRET } from "../../src/main/index.js"

async function newcam(req, res) {
    const response = {
        status: 200,
        content: null,
        error: null,
    };
    const jwttoken = String(req.body.jwttoken);
    const name = String(req.body.name);
    const sdp = String(req.body.sdp);
    if (!jwttoken || !name) {
        response.status = 400;
        response.error = "Missing properties";
        return res.send(response);
    }
    try {
        try {
            const decoded = jwt.verify(jwttoken, JWTSECRET);
            try {
                const currentuser = await userModel.findById(decoded.id)
                if(!currentuser)throw Error("Not found")
                const found = await camModel.findOne({ _id: { $in: currentuser.cams }, name });
                if(found){
                    response.status = 400;
                    response.error = "PC already exist";
                    return res.send(response); 
                }

                const newcam = new camModel({
                    name:name,
                })

                await newcam.save();
                currentuser.email=currentuser.email;
                currentuser.cams.push(newcam.id);

                await currentuser.save();
                
                response.error = "Ok";
                response.content=newcam.id;
                return res.send(response); 

            } catch (error) {
                console.log(error)
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
        response.status = 500;
        response.error = "Internal error";
        return res.send(response);
    }
}

export default newcam;
