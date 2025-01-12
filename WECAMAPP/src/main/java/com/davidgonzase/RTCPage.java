package com.davidgonzase;

import java.awt.Desktop;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Paths;

public class RTCPage {
    public RTCPage(String jwt, String name) {
        int port = 4578;
        String htmlFilePath = "src/main/java/com/davidgonzase/index.html";
        com.sun.net.httpserver.HttpServer server;
        try {
            server = com.sun.net.httpserver.HttpServer.create(new java.net.InetSocketAddress(port), 0);
            server.createContext("/", exchange -> {
                System.out.println("Request received: " + exchange.getRequestURI());
                String query = exchange.getRequestURI().getQuery();
                System.out.println("Query string: " + query);
                String response = new String(Files.readAllBytes(Paths.get(htmlFilePath)));

                if (query != null) {
                    response = response.replace("{{QUERY}}", query);
                }

                exchange.getResponseHeaders().set("Content-Type", "text/html");
                exchange.sendResponseHeaders(200, response.getBytes().length);
                exchange.getResponseBody().write(response.getBytes());
                exchange.getResponseBody().close();
            });

            server.setExecutor(null);
            server.start();

            if (Desktop.isDesktopSupported() && Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
                try {
                    Desktop.getDesktop()
                            .browse(new URI("http://localhost:4578" + "/?token=" + jwt + "&name=" + name));
                } catch (URISyntaxException ex) {
                    System.out.println(ex.getMessage());
                }
            }
        } catch (IOException e) {
            System.out.println(e.getMessage());
        }
    }

}