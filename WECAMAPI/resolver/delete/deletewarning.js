import jwt from "jsonwebtoken";

import { userModel } from "../../dbschema.js";
import { camModel } from "../../dbschema.js";
import { detectionModel } from "../../dbschema.js";
import { JWTSECRET } from "../../index.js";

async function deletewarning(req, res) {
    const response = {
        status: 200,
        content: null,
        error: null,
    };
    const { jwttoken, cameraid, warningid} = req.body;
    if (!jwttoken || !cameraid || !warningid) {
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
                _id: cameraid,
            });
            if (found) {
                const warning = found.detections.find((e)=>{if(e==warningid)return e})
                console.log(warning)
                if (warning) {
                    const finalwarning = await detectionModel.findByIdAndDelete(warningid)
                    found.detections.map((e)=>{if(!warningid) return e})
                    found.save()
                    return res.send(response); 
                }else{
                    response.status = "404";
                    response.error = "Warning not used";
                    return res.send(response); 
                }
            }else{
                response.status = "404";
                response.error = "Camera not found";
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

export default deletewarning;
