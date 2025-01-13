import bcrypt from 'bcryptjs';

import { userModel } from "../../dbschema.js";

async function newuser(req, res) {
    const response = {
        status: 200,
        content: null,
        error: null,
    };
    const { name, password, email } = req.body;
    if (!name || !password || !email) {
        response.status = 400;
        response.error = "Missing properties";
        return res.send(response);
    }

    try {
        const currentuser = await userModel.find({ email: email });
        if (currentuser.length !== 0) {
            response.status = 400;
            response.error = "Mail already in use";
            return res.send(response);
        } else {
            const hashpass = await bcrypt.hash(password, 10);
            const newUser = new userModel({
                name,
                password:hashpass,
                email,
                cams: [],
            });
            await newUser.save();

            response.content = "OK";
            return res.send(response); 
        }
    } catch (error) {
        response.status = 500;
        response.error = "Internal error";
        return res.send(response);
    }
}

export default newuser;
