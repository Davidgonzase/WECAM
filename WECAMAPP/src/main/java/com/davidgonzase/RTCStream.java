package com.davidgonzase;

import com.google.gson.Gson;

import java.awt.Color;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;


import dev.onvoid.webrtc.*;

public class RTCStream {
    


    public RTCStream() {

    }

    public void start() {
        String jwt = "jwt";
        String name = "";
        new Thread(() -> {
            try {
                PeerConnectionFactory factory = new PeerConnectionFactory();
                RTCConfiguration config = new RTCConfiguration();
                RTCIceServer server = new RTCIceServer();
                server.urls.add("stun:stun.l.google.com:19302");
                config.iceServers.add(server);
                PeerConnectionObserver observer = new PeerConnectionObserver() {
                    @Override
                    public void onIceCandidate(RTCIceCandidate candidate) {
                        System.out.println(candidate);
                    }

                };
                RTCPeerConnection connection = factory.createPeerConnection(config, observer);
                connection.createOffer(new RTCOfferOptions(), new CreateSessionDescriptionObserver() {
                    @Override
                    public void onSuccess(RTCSessionDescription sdp) {
                        connection.setLocalDescription(sdp, new SetSessionDescriptionObserver() {
                            @Override
                            public void onSuccess() {
                                try {
                                    HttpClient client = HttpClient.newHttpClient();

                                    String jsonBody = new Gson().toJson(new OfferMessage(jwt, name, sdp));
                                    HttpRequest request = HttpRequest.newBuilder()
                                            .uri(URI.create("http://localhost:8010/newcam"))
                                            .header("Content-Type", "application/json")
                                            .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                                            .build();

                                    HttpResponse<String> response = client.send(request,HttpResponse.BodyHandlers.ofString());

                                    int statusCode = response.statusCode();
                                    System.out.println(statusCode);
                                    if (statusCode == 200) {
                                        String resbody = response.body();
                                        System.out.println(jsonBody);
                                        Gson gsonresult = new Gson();
                                        StatusResponse responseData = gsonresult.fromJson(resbody,StatusResponse.class);

                                        if (responseData.status == 200) {
                                            System.out.println(sdp.sdp);
                                            searchsdpresponse();
                                        } else {
                                            ErrorResponse responseErrorData = gsonresult.fromJson(resbody,ErrorResponse.class);
                                        }
                                    }

                                } catch (Exception error) {
                                    System.out.println(error.getMessage());
                                }
                            }

                            @Override
                            public void onFailure(String error) {
                            }
                        });
                    }

                    @Override
                    public void onFailure(String error) {
                    }
                });

            } catch (Exception e) {

                e.printStackTrace();
            }
        }).start();
    }

    public void searchsdpresponse(){

    }

    public void searchiceresponse(){

    }

    static class StatusResponse {
        int status;
    }

    static class ErrorResponse {
        int status;
        String error;
    }

    static class OfferMessage {
        String jwttoken;
        String name;
        String sdp;

        OfferMessage(String jwt, String name, RTCSessionDescription sdp) {
            this.jwttoken = jwt;
            this.name = name;
            this.sdp = sdp.sdp;
        }
    }

    static class IceCandidateMessage {
        String jwttoken;
        String name;
        String sdp;
        String sdpMid;
        int sdpMLineIndex;

        IceCandidateMessage(String jwt, String name, RTCIceCandidate candidate) {
            this.jwttoken = jwt;
            this.name = name;
            this.sdp = candidate.sdp;
            this.sdpMid = candidate.sdpMid;
            this.sdpMLineIndex = candidate.sdpMLineIndex;
        }
    }
}
