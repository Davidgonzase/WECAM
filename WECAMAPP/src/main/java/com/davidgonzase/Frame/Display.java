package com.davidgonzase.Frame;

import java.awt.Color;
import java.awt.Container;
import java.awt.Dimension;
import java.awt.Toolkit;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.JPasswordField;
import javax.swing.JTextField;

public class Display {
    private JFrame window;
    private JPanel panel;
    private Container con;
    private Screens currentscreen = Screens.LOAD;

    public Screens getcurrentscreen(){
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

        if()

        panel.add(loginButton);
        panel.add(userLabel);
        panel.add(passwordLabel);
        con.add(panel);

        repaint();

        currentscreen = Screens.LOGIN;
    }

    private void repaint(){
        window.revalidate();
        window.repaint();
    }

}
