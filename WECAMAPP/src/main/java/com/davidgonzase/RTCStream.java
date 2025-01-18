package com.davidgonzase;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import javax.swing.JLabel;

import com.google.gson.Gson;

import dev.onvoid.webrtc.CreateSessionDescriptionObserver;
import dev.onvoid.webrtc.PeerConnectionFactory;
import dev.onvoid.webrtc.PeerConnectionObserver;
import dev.onvoid.webrtc.RTCConfiguration;
import dev.onvoid.webrtc.RTCIceCandidate;
import dev.onvoid.webrtc.RTCIceServer;
import dev.onvoid.webrtc.RTCOfferOptions;
import dev.onvoid.webrtc.RTCPeerConnection;
import dev.onvoid.webrtc.RTCSessionDescription;
import dev.onvoid.webrtc.SetSessionDescriptionObserver;
import dev.onvoid.webrtc.media.MediaDevices;
import dev.onvoid.webrtc.media.video.VideoDevice;
import dev.onvoid.webrtc.media.video.VideoDeviceSource;
import dev.onvoid.webrtc.media.video.VideoFrame;
import dev.onvoid.webrtc.media.video.VideoTrack;
import dev.onvoid.webrtc.media.video.VideoTrackSink;

public class RTCStream {

    public RTCStream() {

    }

    public void start(String jwt, JLabel errorText, String name) {
        new Thread(() -> {
            try {
                PeerConnectionFactory factory = new PeerConnectionFactory();
                RTCConfiguration config = new RTCConfiguration();
                RTCIceServer server = new RTCIceServer();
                server.urls.add("stun:stun.l.google.com:19302");
                config.iceServers.add(server);
                MediaDevices devices = new MediaDevices();
                VideoDevice device = devices.getVideoCaptureDevices().get(0);
                VideoDeviceSource videoSource = new VideoDeviceSource();
                videoSource.setVideoCaptureDevice(device);
                videoSource.start();
                VideoTrack videoTrack = factory.createVideoTrack("videoTrack", videoSource);
                VideoTrackSink sink = new VideoTrackSink() {
                    @Override
                    public void onVideoFrame(VideoFrame frame) {

                    }
                };

                videoTrack.addSink(sink);
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
                                    System.out.println(sdp.sdp);
                                    String jsonBody = new Gson().toJson(new OfferMessage(jwt, name, sdp));
                                    HttpRequest request = HttpRequest.newBuilder()
                                            .uri(URI.create("http://localhost:8010/newcam"))
                                            .header("Content-Type", "application/json")
                                            .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                                            .build();

                                    HttpResponse<String> response = client.send(request,
                                            HttpResponse.BodyHandlers.ofString());

                                    int statusCode = response.statusCode();
                                    if (statusCode == 200) {
                                        String resbody = response.body();
                                        Gson gsonresult = new Gson();
                                        StatusResponse responseData = gsonresult.fromJson(resbody,
                                                StatusResponse.class);
                                        if (responseData.status == 200) {
                                            System.out.println(sdp.sdp);
                                            errorText.setText("Searching...");
                                            searchsdpresponse();
                                        } else {
                                            ErrorResponse responseErrorData = gsonresult.fromJson(resbody,
                                                    ErrorResponse.class);
                                            errorText.setText(responseErrorData.error);
                                        }
                                    }

                                } catch (Exception error) {
                                    System.out.println(error.getMessage());
                                    errorText.setText(error.getMessage());
                                }
                            }

                            @Override
                            public void onFailure(String error) {
                                errorText.setText(error);
                            }
                        });
                    }

                    @Override
                    public void onFailure(String error) {
                        errorText.setText(error);
                    }
                });

            } catch (Exception e) {
                errorText.setText(e.getMessage());
                e.printStackTrace();
            }
        }).start();
    }

    public void searchsdpresponse() {

    }

    public void searchiceresponse() {

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
