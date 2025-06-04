try {
  peerConnection = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });

  stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  console.log("1")
  // Crear cámara en backend
  const resCam = await fetch(`${apiUrl}/newcam`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jwttoken: jwt, name }),
  });

  const camData = await resCam.json();
  cameraid = camData.content;
  console.log("2")
  // Enviar SDP
  try {
    console.log(JSON.stringify({
        jwttoken: jwt,
        cameraid,
        sdp: peerConnection.localDescription.sdp,
        type: "sender",
      }))
    const resPutSdp = await fetch(`${apiUrl}/putsdp`, {  
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jwttoken: jwt,
        cameraid,
        sdp: peerConnection.localDescription.sdp,
        type: "sender",
      }),
    });
    console.log("3");
    status.textContent = "Esperando respuesta del receptor...";
  } catch (error) {
    console.log("catch");
    console.error("Error en fetch putsdp:", error);
    status.textContent = "Error al enviar SDP: " + error.message;
  }
      
  status.textContent = "Esperando respuesta del receptor...";

  // Esperar SDP respuesta
  let fetched = false;
  while (!fetched) {
    const res = await fetch(`${apiUrl}/camera`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jwttoken: jwt, cameraid }),
    });

    const data = await res.json();
    const answerSdp = data.content?.vieweranswer;

    if (answerSdp) {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription({ type: "answer", sdp: answerSdp })
      );
      status.textContent = "✅ Transmisión activa";
      fetched = true;
    } else {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
} catch (error) {
  console.error("🚨 Error en startStreaming:", error);
  status.textContent = "Error al iniciar la transmisión";
}
