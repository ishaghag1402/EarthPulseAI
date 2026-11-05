package com.earthpulse.ai.service;

import com.earthpulse.ai.model.LoginEvent;
import com.earthpulse.ai.repository.LoginEventRepository;
import com.earthpulse.ai.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LoginAuditService {
    private final UserRepository users;
    private final LoginEventRepository events;

    public LoginAuditService(UserRepository users, LoginEventRepository events) {
        this.users = users;
        this.events = events;
    }

    @Transactional
    public void record(String email, String role, HttpServletRequest request) {
        String ip = request.getRemoteAddr();
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) ip = forwarded.split(",")[0].trim();
        final String ipAddress = ip;
        String normalized = email.trim().toLowerCase(java.util.Locale.ROOT);
        users.findByEmail(normalized).ifPresent(user -> {
            user.setLastLoginAt(java.time.LocalDateTime.now());
            user.setLastLoginIp(ipAddress);
            users.save(user);
        });
        events.save(new LoginEvent(normalized, role, ipAddress));
    }
}
