let jwt = localStorage.getItem("authToken");
let apiUrl = "";

if (window.electronAPI) {
    window.electronAPI.onConfig((config) => {
        apiUrl = config.apiUrl;
        cargarCamaras();
    });
} else {
    console.warn("APP Error");
}

console.log(jwt)
console.log(apiUrl)


async function cargarCamaras() {
    const res = await fetch(apiUrl + "/getcams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jwttoken: jwt }),
    });

    const data = await res.json();
    const cams = data.content;
    const contenedor = document.getElementById("cameras");

    contenedor.innerHTML = ""; 
    for (const cam of cams) {
        const div = document.createElement("div");
        div.className = "cams";
        div.innerHTML = `
        <p><strong>${cam.name}</strong></p>
        <a href="exists.html?id=${cam._id}&name=${encodeURIComponent(cam.name)}">STREAM</a>
        <br />
        <button onclick="borrarCamara('${cam._id}')">BORRAR</button>
        `;
        contenedor.appendChild(div);
    }
}

async function borrarCamara(id) {
    await fetch(apiUrl + "/deletecam", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jwttoken: jwt, cameraid: id }),
    });
    cargarCamaras();
}
