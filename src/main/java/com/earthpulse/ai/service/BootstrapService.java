package com.earthpulse.ai.service;

import com.earthpulse.ai.model.AppUser;
import com.earthpulse.ai.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class BootstrapService implements CommandLineRunner {
    private final UserRepository users;
    private final PasswordEncoder encoder;
    @Value("${app.admin.email:}") private String email1;
    @Value("${app.admin.password:}") private String password1;
    @Value("${app.admin2.email:}") private String email2;
    @Value("${app.admin2.password:}") private String password2;

    BootstrapService(UserRepository users, PasswordEncoder encoder) { this.users=users; this.encoder=encoder; }

    @Override public void run(String... args) {
        createAdmin(email1, password1, "EarthPulse Administrator");
        createAdmin(email2, password2, "EarthPulse Administrator 2");
    }

    private void createAdmin(String email, String password, String name) {
        if (email == null || email.isBlank() || password == null || password.isBlank()) return;
        String normalized=email.trim().toLowerCase(java.util.Locale.ROOT);
        AppUser admin=users.findByEmail(normalized).orElseGet(AppUser::new);
        if (admin.getId()==null) { admin.setFullName(name); admin.setEmail(normalized); }
        admin.setPassword(encoder.encode(password));
        admin.setRole("ADMIN");
        users.save(admin);
    }
}
