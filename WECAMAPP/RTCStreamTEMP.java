package com.davidgonzase;

import com.google.gson.Gson;

import java.awt.Color;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import javax.swing.JLabel;

import dev.onvoid.webrtc.*;

public class RTCStream {

    private ExecutorService executor;
    private String jwt;
    private String name;
    private String idcam;
    private JLabel errorLabel;

    public RTCStream() {
        executor = Executors.newSingleThreadExecutor();
    }

    public void start(String jwt, String name, JLabel errorLabel) {
        this.jwt = jwt;
        this.name = name;
        this.errorLabel = errorLabel;
        this.idcam = null;
        executor.submit(() -> {
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
                                //errorLabel.setForeground(Color.GREEN);
                                //errorLabel.setText("Creating stream...");
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
                                            //errorLabel.setForeground(Color.GREEN);
                                            //errorLabel.setText("Stream created, searching for peer...");
                                            System.out.println(sdp.sdp);
                                            searchsdpresponse();
                                        } else {
                                            ErrorResponse responseErrorData = gsonresult.fromJson(resbody,ErrorResponse.class);
                                            errorLabel.setText(responseErrorData.error);
                                            errorLabel.setForeground(Color.red);
                                        }
                                    }

                                } catch (Exception error) {
                                    System.out.println(error.getMessage());
                                    errorLabel.setForeground(Color.RED);
                                    errorLabel.setText("Internal Error");
                                    executor.shutdown();
                                }
                            }

                            @Override
                            public void onFailure(String error) {
                                errorLabel.setForeground(Color.RED);
                                errorLabel.setText("Problem creating local spd");
                                executor.shutdown();
                            }
                        });
                    }

                    @Override
                    public void onFailure(String error) {
                        errorLabel.setForeground(Color.RED);
                        errorLabel.setText("Problem creating offer");
                        executor.shutdown();
                    }
                });

            } catch (Exception e) {
                errorLabel.setForeground(Color.RED);
                errorLabel.setText("Internal error");
                e.printStackTrace();
                executor.shutdown();
            }
        });
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
