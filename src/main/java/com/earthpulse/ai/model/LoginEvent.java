package com.earthpulse.ai.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "login_events")
public class LoginEvent {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable=false) private String email;
    private String role;
    private String ipAddress;
    private LocalDateTime loggedInAt = LocalDateTime.now();

    protected LoginEvent() {}
    public LoginEvent(String email, String role, String ipAddress) {
        this.email=email; this.role=role; this.ipAddress=ipAddress; this.loggedInAt=LocalDateTime.now();
    }
    public Long getId(){return id;}
    public String getEmail(){return email;}
    public String getRole(){return role;}
    public String getIpAddress(){return ipAddress;}
    public LocalDateTime getLoggedInAt(){return loggedInAt;}
}
