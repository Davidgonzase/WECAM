export type user={
    name:string,
    id:string
}

export type camsresponse = {
    status:number,
    content:cam[],
}

export type cam = {
    _id:string,
    name:string,
    camoffer:string
}

export type warningtype = {
    camara:string,
    camaraid:string,
    detections:detection[]
}

export type detection = {
    _id:string,
    hour:string
}