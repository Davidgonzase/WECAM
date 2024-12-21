import mongoose from "mongoose";

const { Schema, model } = mongoose; 

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password : { type:String, required: true},
    cams : [{type:Schema.Types.ObjectId, ref:'camera'}]
});

const userModel = model('user',userSchema);

const camSchema = new Schema({
    name: { type: String, required: true },
    camoffer: { type: String },
    vieweranswer : { type: String },
});

const camModel = model('camera',camSchema);

export {userModel,camModel};

