
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const name = params.get("name");

let apiUrl = null;
let jwt = localStorage.getItem("authToken");
let stream = null;
let cameraid = id;
let peerConnection;
let human = null;
let lastdetect = 0;
let namestream = null;
let statusc = false;
let model = null;

const errorBox = document.getElementById("streamError");
const localVideo = document.getElementById("localVideo");
const status = document.getElementById("status");
const title = document.getElementById("title");

title.textContent = "Stream: " + name;

if (window.electronAPI) {
    window.electronAPI.onConfig((config) => {
        apiUrl = config.apiUrl;
        initCameraPreview();
        startStreaming();
    });
} else {
    console.warn("APP Error");
}

async function initCameraPreview() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    localVideo.srcObject = stream;

    model = await cocoSsd.load();

    setInterval(async () => {
      if (statusc && model && localVideo && localVideo.readyState >= 2) {
        const predictions = await model.detect(localVideo);
        const personDetected = predictions.some(
          (pred) => pred.class === 'person' && pred.score > 0.5
        );

          
        if (personDetected && Date.now() - lastdetect > 10000) {
          lastdetect = Date.now();
          try {
            console.log("jwt :" + jwt);
            await fetch(`${apiUrl}/warning`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                jwttoken: jwt,
                date: Date.now(),
                cameraid: cameraid,
              }),
            });
          } catch (error) {
            console.error("Error al enviar la deteccion:", error);
          }
        }
      }
    }, 1000);

    status.textContent = "Cámara lista para transmitir";
  } catch (error) {
    status.textContent = "Error al acceder a la cámara";
  }
}



async function startStreaming(name) {
    let peerConnection = new RTCPeerConnection({
        iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
        ],
    });

    let stopFetchingCandidates = false;
    let stopFetchingsdp = true;

    peerConnection.onconnectionstatechange = () => {
        if (
            peerConnection.connectionState === "connected" ||
            peerConnection.connectionState === "completed"
        ) {
            console.log(
                "Conexión establecida, deteniendo búsqueda de candidatos.",
            );
            stopFetchingCandidates = true;
        }
    };

    peerConnection.oniceconnectionstatechange = () => {
        console.log("ICE connection state:", peerConnection.iceConnectionState);
        if (
            peerConnection.iceConnectionState === "connected" ||
            peerConnection.iceConnectionState === "completed"
        ) {
            stopFetchingCandidates = true;
        }
    };

    peerConnection.oniceconnectionstatechange = () => {
        console.log("ICE connection state:", peerConnection.iceConnectionState);
        if (
            peerConnection.iceConnectionState === "disconnected" ||
            peerConnection.iceConnectionState === "disconnected"
        ) {
            console.log("Restarting...");
            stopFetchingsdp = true;
            sdpAnswer = null;
            deleteremote();
            restart();
        }
    };

    async function deleteremote() {
        const response = await fetch(`${apiUrl}/deleteremote`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jwttoken: jwt, cameraid: cameraid }),
        });
    }

    async function createAndSendOffer() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false,
            });
            localVideo.srcObject = stream;
            stream.getTracks().forEach((track) =>
                peerConnection.addTrack(track, stream)
            );

            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);

            if (!jwt || jwt == "") {
                status.textContent = "Missing components";
            } else {
                if (cameraid) {
                    status.textContent = "Camera ready...";
                    statusc = true
                    await new Promise((resolve) => {
                        peerConnection.onicegatheringstatechange = () => {
                            if (
                                peerConnection.iceGatheringState === "complete"
                            ) {
                                resolve();
                            }
                        };
                    });
                    status.textContent = "Searching for peer...";
                    answersdp(peerConnection.localDescription.sdp);
                    requestSdpResponse();
                } else {
                    status.textContent = "Failed y ...";
                }
            }
        } catch (error) {
            console.error("Error al crear la oferta:", error);
            status.textContent = "Failed to create offer";
        }
    }

    async function restart() {
        if (peerConnection.remoteDescription) {
            console.log("Eliminando descripción remota...");
            peerConnection.restartIce();
            peerConnection.close();
        }

        peerConnection = new RTCPeerConnection({
            iceServers: [
                { urls: "stun:stun.l.google.com:19302" },
            ],
        });

        peerConnection.oniceconnectionstatechange = () => {
            console.log(
                "ICE connection state:",
                peerConnection.iceConnectionState,
            );
            if (
                peerConnection.iceConnectionState === "disconnected" ||
                peerConnection.iceConnectionState === "disconnected"
            ) {
                console.log("Restarting...");
                stopFetchingsdp = true;
                sdpAnswer = null;
                deleteremote();
                restart();
            }
        };

        stream.getTracks().forEach((track) =>
            peerConnection.addTrack(track, stream)
        );

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        if (!jwt || jwt == "") {
            status.textContent = "Missing components";
        } else {
            if (cameraid) {
                status.textContent = "Camera ready...";
                peerConnection.restartIce();
                console.log(peerConnection.iceGatheringState);
                await new Promise((resolve) => {
                    peerConnection.onicegatheringstatechange = () => {
                        if (peerConnection.iceGatheringState === "complete") {
                            resolve();
                        }
                    };
                });
                status.textContent = "Searching for peer...";
                answersdp(peerConnection.localDescription.sdp);
                requestSdpResponse();
            }
        }
    }



    async function requestSdpResponse() {
        while (stopFetchingsdp) {
            console.log("Searching for response...");
            try {
                const response = await fetch(`${apiUrl}/camera`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ jwttoken: jwt, cameraid: cameraid }),
                });
                const data = await response.json();
                const sdpAnswer = data.content.vieweranswer;
                console.log(sdpAnswer);
                if (sdpAnswer) {
                    stopFetchingsdp = false;
                    console.log("SDP de respuesta recibido:", sdpAnswer);
                    await peerConnection.setRemoteDescription(
                        new RTCSessionDescription({
                            type: "answer",
                            sdp: sdpAnswer,
                        }),
                    );
                    status.textContent = " WebRTC connection established";
                }
            } catch (error) {
                console.error("Error al obtener SDP de respuesta:", error);
            }

            await new Promise((resolve) => setTimeout(resolve, 2000));
        }
        console.log("Búsqueda de candidatos detenida.");
    }

    async function answersdp(sdp) {
        try {
            console.log("SDP de respuesta enviado:", sdp);
            const response = await fetch(`${apiUrl}/putsdp`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    jwttoken: jwt,
                    cameraid: cameraid,
                    sdp: sdp,
                    type: "sender",
                }),
            });
        } catch (error) {
            console.error("Error al enviar SDP a la API:", error);
        }
    }
    createAndSendOffer();
}
