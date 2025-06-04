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
    camoffer: {type: String},
    vieweranswer : {type: String},
    detections:[{ type: Schema.Types.ObjectId, ref:'detection'}],
    icesendercandidates:[{ type: Schema.Types.ObjectId, ref:'spd'}],
    iceviewercandidates:[{ type: Schema.Types.ObjectId, ref:'spd'}]
});
const camModel = model('camera',camSchema); 

const detectionSchema = new Schema({
    hour: {type:String, required: true}
});

const detectionModel = model('detection',detectionSchema); 

const sdpSchema = new Schema({
    sdp: { type: String, required: true },
    sdpmid: { type: String, required: true },
    sdpmlineindex : { type: String, required: true },
});

const sdpModel = model('sdp',sdpSchema);

export {userModel,camModel,sdpModel,detectionModel};

