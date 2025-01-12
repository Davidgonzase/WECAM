import { FunctionComponent } from "preact";

type Context = {
  jwt: string;
  id: string;
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
      status.textContent = "Stream received!";
    };

    async function fetchOffer() {
      try {
        console.log("Inicializando")
        const response = await fetch("http://localhost:8010/camera", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ jwttoken: "${props.jwt}", cameraid: "${props.id}" }),
        });

        const data = await response.json();
        const offerSdp = data.content.camoffer;

        console.log(data)

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

          await fetch("http://localhost:8010/putsdp", {
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
    <div>
      <h1>Receiving WebRTC Stream</h1>
      <p id="status">Initializing...</p>
      <video id="remoteVideo" autoplay playsinline></video>
      <script dangerouslySetInnerHTML={{ __html: scriptContent }}></script>
    </div>
  );
};