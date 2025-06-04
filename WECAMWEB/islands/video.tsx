import { FunctionComponent } from "preact";

type Context = {
  jwt: string;
  id: string;
  name: string
};

export const Stream: FunctionComponent<Context> = (props) => {
  const scriptContent = `
    const status = document.getElementById("status");
    const videoElement = document.getElementById("remoteVideo");

    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnection.ontrack = (event) => {
      console.log("Receiving remote stream...");
      videoElement.srcObject = event.streams[0];
      status.textContent = "Stream ready";
    };

    async function fetchOffer() {
      try {
        console.log("Inicializando")
        const response = await fetch("https://wecam.onrender.com/camera", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ jwttoken: "${props.jwt}", cameraid: "${props.id}" }),
        });

        const data = await response.json();
        const offerSdp = data.content.camoffer;

        console.log(data)
        console.log(offerSdp)

        if (offerSdp) {
          await peerConnection.setRemoteDescription({ type: "offer", sdp: offerSdp });
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);

          await new Promise((resolve) => {
            if (peerConnection.iceGatheringState === "complete") {
              resolve();
            } else {
              peerConnection.addEventListener("icegatheringstatechange", () => {
                if (peerConnection.iceGatheringState === "complete") {
                  resolve();
                }
              });
            }
          });

          console.log("sdp", peerConnection.localDescription.sdp)

          await fetch("https://wecam.onrender.com/putsdp", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              jwttoken: "${props.jwt}",
              cameraid: "${props.id}",
              sdp: peerConnection.localDescription.sdp,
              type: "viewer",
            }),
          });

          status.textContent = "Waiting for remote stream...";
        }
      } catch (error) {
        console.error("Error during WebRTC setup:", error);
        status.textContent = "Error setting up WebRTC.";
      }
    }

    fetchOffer();
  `;

  return (
    <div class="cameralive">
      <h1>Stream {props.name}</h1>
      <video id="remoteVideo" autoplay playsinline></video>
      <p id="status">Initializing...</p>
      <script dangerouslySetInnerHTML={{ __html: scriptContent }}></script>
    </div>
  );
};