package com.davidgonzase;

import java.awt.Desktop;
import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Paths;

public class RTCPage {
    public RTCPage(String jwt, String name) {
        int port = 4578;
        com.sun.net.httpserver.HttpServer server;
        try {
            String jarDir = new File(RTCPage.class.getProtectionDomain().getCodeSource().getLocation().toURI())
                    .getParent();
            String htmlFilePath = jarDir + File.separator + "index.html";
            server = com.sun.net.httpserver.HttpServer.create(new java.net.InetSocketAddress("0.0.0.0", port), 0);
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

            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
            }

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
        } catch (URISyntaxException e1) {
            System.out.println(e1.getMessage());
        }
    }

}