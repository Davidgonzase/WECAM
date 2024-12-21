import { userModel } from "../../dbschema.js";
import { camModel } from "../../dbschema.js";

async function newcam(req, res) {
    const response = {
        status: 200,
        content: null,
        error: null,
    };
    const { jwttoken, name, camoffer } = req.body;
    if (!jwttoken || !name || !camoffer) {
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

                const newCam = new camModel({
                    name,
                    camoffer
                });
                await newCam.save();

                currentuser.cams.push(newCam.id);
                await currentuser.save();

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
        response.status = 500;
        response.error = "Internal error";
        return res.send(response);
    }
}

export default newcam;
