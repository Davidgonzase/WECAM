package com.davidgonzase.Frame;

import java.awt.Color;
import java.awt.Container;
import java.awt.Dimension;
import java.awt.Toolkit;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;

import java.io.OutputStream;

import com.davidgonzase.Frame.Display.JWT;
import com.google.gson.Gson;

import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JPasswordField;
import javax.swing.JTextField;

public class Display {
    private JFrame window;
    private JPanel panel;
    private Container con;
    private String jwt = null;
    private Screens currentscreen = Screens.LOAD;

    public Screens getcurrentscreen() {
        return currentscreen;
    }

    public Display() {
        window = new JFrame("Wecamapp");
        window.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        window.setSize(600, 800);
        Dimension dim = Toolkit.getDefaultToolkit().getScreenSize();
        window.setLocation(dim.width / 2 - window.getSize().width / 2, dim.height / 2 - window.getSize().height / 2);
        window.setResizable(false);
        window.setLayout(null);
        con = window.getContentPane();
        window.setVisible(true);
        Login();
    }

    private void Login() {
        panel = new JPanel();
        panel.setLayout(null);
        panel.setBounds(0, 0, window.getBounds().width, window.getBounds().height);
        panel.setBackground(Color.black);

        JButton loginButton = new JButton("LOGIN");
        loginButton.setBounds(100, 600, 400, 50);

        JTextField userLabel = new JTextField("Username");
        userLabel.setBounds(100, 400, 400, 50);

        JPasswordField passwordLabel = new JPasswordField("Password");
        passwordLabel.setBounds(100, 500, 400, 50);
        passwordLabel.setEchoChar((char) 0);

        JLabel errorLabel = new JLabel("");
        errorLabel.setForeground(Color.RED);
        errorLabel.setBounds(100, 650, 400, 50);

        userLabel.addFocusListener(new FocusListener() {
            private boolean firstext = true;

            @Override
            public void focusGained(FocusEvent e) {
                if (firstext) {
                    userLabel.setText("");
                    firstext = false;
                }
            }

            @Override
            public void focusLost(FocusEvent e) {
                if (userLabel.getText().length() == 0) {
                    userLabel.setText("Username");
                    userLabel.setForeground(Color.GRAY);
                    firstext = true;
                }
            }
        });

        passwordLabel.addFocusListener(new FocusListener() {
            private boolean firstext = true;

            @Override
            public void focusGained(FocusEvent e) {
                if (firstext) {
                    passwordLabel.setText("");
                    passwordLabel.setForeground(Color.BLACK);
                    passwordLabel.setEchoChar('*');
                    firstext = false;
                }
            }

            @Override
            public void focusLost(FocusEvent e) {
                if (passwordLabel.getPassword().length == 0) {
                    passwordLabel.setText("Password");
                    passwordLabel.setForeground(Color.GRAY);
                    passwordLabel.setEchoChar((char) 0);
                    firstext = true;
                }
            }
        });

        panel.add(loginButton);
        panel.add(userLabel);
        panel.add(passwordLabel);
        panel.add(errorLabel);
        con.add(panel);

        loginButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                String usercontent = userLabel.getText();
                char[] passwordarray = passwordLabel.getPassword();
                String passwordcontent = new String(passwordarray);

                try {
                    HttpClient client = HttpClient.newHttpClient();

                    String jsonBody = "{\"password\":\"" + passwordcontent + "\", \"email\":\"" + usercontent + "\"}";

                    HttpRequest request = HttpRequest.newBuilder()
                            .uri(URI.create("http://localhost:8010/login"))
                            .header("Content-Type", "application/json")
                            .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                            .build();

                    HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

                    errorLabel.setText("");

                    int statusCode = response.statusCode();
                    if (statusCode == 200) {
                        String resbody = response.body();

                        Gson gsonresult = new Gson();
                        StatusResponse responseData = gsonresult.fromJson(resbody, StatusResponse.class);

                        if(responseData.status==200){
                            LoginJWTResponse responseJWTData = gsonresult.fromJson(resbody, LoginJWTResponse.class);
                            jwt= responseJWTData.content.jwttoken;
                            if(jwt!="")
                        }else{
                            LoginErrorResponse responseErrorData = gsonresult.fromJson(resbody, LoginErrorResponse.class);
                            errorLabel.setText(responseErrorData.error);
                        }
                    }

                } catch (Exception error) {
                    errorLabel.setText(error.getMessage());
                }

            }
        });

        repaint();

        currentscreen = Screens.LOGIN;
    }


    

    private void repaint() {
        window.revalidate();
        window.repaint();
    }

    static class StatusResponse {
        int status;
    }

    static class LoginErrorResponse {
        int status;
        String error;
    }

    static class LoginJWTResponse {
        JWT content;
    }

    static class JWT {
        String jwttoken;
    }

}
