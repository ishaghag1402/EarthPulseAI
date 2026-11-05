package com.earthpulse.ai.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "app_users")
public class AppUser {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true) private String email;
    @Column(nullable = false) private String fullName;
    @Column(nullable = false) private String password;
    @Column(nullable = false) private String role = "USER";
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime lastLoginAt;
    private String lastLoginIp;
    private String lastLoginLocation;

    public Long getId(){return id;}
    public String getEmail(){return email;} public void setEmail(String v){email=v;}
    public String getFullName(){return fullName;} public void setFullName(String v){fullName=v;}
    public String getPassword(){return password;} public void setPassword(String v){password=v;}
    public String getRole(){return role;} public void setRole(String v){role=v;}
    public LocalDateTime getCreatedAt(){return createdAt;}
    public LocalDateTime getLastLoginAt(){return lastLoginAt;}
    public void setLastLoginAt(LocalDateTime v){lastLoginAt=v;}
    public String getLastLoginIp(){return lastLoginIp;}
    public void setLastLoginIp(String v){lastLoginIp=v;}
    public String getLastLoginLocation(){return lastLoginLocation;}
    public void setLastLoginLocation(String v){lastLoginLocation=v;}
}
