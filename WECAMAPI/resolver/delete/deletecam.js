import jwt from "jsonwebtoken";

import { detectionModel, userModel } from "../../dbschema.js";
import { camModel } from "../../dbschema.js";
import { JWTSECRET } from "../../index.js";

async function deleteuser(req, res) {
    const response = {
        status: 200,
        content: null,
        error: null,
    };
    const { jwttoken, cameraid } = req.body;
    if (!jwttoken || !cameraid) {
        response.status = 400;
        response.error = "Missing properties";
        return res.send(response);
    }
    try {
        const decoded = jwt.verify(jwttoken, JWTSECRET);
        try {
            const currentuser = await userModel.findById(decoded.id);
            if (!currentuser) throw Error("Not found");
            const found = await camModel.findOne({
                _id:  cameraid 
            });
            if (found) {
                for (const warning of found.detections) {
                    await detectionModel.findByIdAndDelete(warning); 
                }
                await camModel.findByIdAndDelete(cameraid); 
                response.status = "200";
                response.error = "OK";
                return res.send(response); 
            }else{
                response.status = "404";
                response.error = "Camera not in user";
                return res.send(response); 
            }
        } catch (error) {
            console.log(error);
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

export default deleteuser;
