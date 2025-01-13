import jwt from 'jsonwebtoken';

import { userModel } from "../../dbschema.js";
import { camModel} from "../../dbschema.js";
import { sdpModel } from "../../dbschema.js";
import { JWTSECRET } from "../../index.js";

async function deleteremote(req, res) {
    const response = {
        status: 200,
        content: null,
        error: null,
    };
    console.log(req.body)
    const { jwttoken, cameraid } = req.body;
    if (!jwttoken || !cameraid) {
        response.status = 400;
        response.error = "Missing properties";
        return res.send(response);
    }
    try {
        try {
            const decoded = jwt.verify(jwttoken, JWTSECRET);
            try {
                const currentuser = await userModel.findById(decoded.id);
                if(!currentuser)throw Error("Not found");
                if(currentuser.cams.find((e)=> e._id==cameraid)){
                    const camera = await camModel.findById(cameraid);
                    camera.vieweranswer = undefined;
                    await camera.save();
    
                    response.error = "Ok";
                }else{
                    response.error = "Not valid user/cam";
                    response.status = 403;
                }
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
        response.status = 500;
        response.error = "Internal error";
        return res.send(response);
    }

}

export default deleteremote;