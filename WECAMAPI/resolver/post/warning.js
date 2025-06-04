import jwt from "jsonwebtoken";

import { userModel } from "../../dbschema.js";
import { camModel } from "../../dbschema.js";
import { detectionModel } from "../../dbschema.js";
import { JWTSECRET } from "../../index.js";

async function warning(req, res) {
    const response = {
        status: 200,
        content: null,
        error: null,
    };
    const jwttoken = String(req.body.jwttoken);
    const cameraid = String(req.body.cameraid);
    const date = String(req.body.date);
    if (!jwttoken || !date || !cameraid) {
        response.status = 400;
        response.error = "Missing properties";
        return res.send(response);
    }
    try {
        try {
            const decoded = jwt.verify(jwttoken, JWTSECRET);
            try {
                const currentuser = await userModel.findById(decoded.id);
                if (!currentuser) throw Error("Not found");
                const found = await camModel.findOne({
                    $and: [
                        { _id: cameraid },
                        { _id: { $in: currentuser.cams } }
                    ]
                });
                

                const now = new Date();
                const hour = now.toISOString().replace("T", " ").substring(
                    0,
                    19,
                );

                const newwarning = new detectionModel({ hour });
                await newwarning.save();

                found.detections.push(newwarning._id);
                await found.save();

                response.error = "Ok";
                response.content = newwarning.id;
                return res.send(response);
            } catch (error) {
                console.log(error);
                response.status = 404;
                response.error = "User not found";
                return res.send(response);
            }
        } catch (error) {
            console.log(error);
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

export default warning;
