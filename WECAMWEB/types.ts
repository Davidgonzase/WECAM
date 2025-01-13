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