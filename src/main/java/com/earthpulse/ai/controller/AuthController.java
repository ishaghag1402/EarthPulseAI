package com.earthpulse.ai.controller;

import com.earthpulse.ai.model.AppUser;
import com.earthpulse.ai.repository.UserRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.Locale;

@Controller
public class AuthController {
    private final UserRepository users;
    private final PasswordEncoder encoder;

    public AuthController(UserRepository users, PasswordEncoder encoder) {
        this.users = users;
        this.encoder = encoder;
    }

    public static class Registration {
        @NotBlank
        @Size(min = 2, max = 80)
        private String fullName;

        @NotBlank
        @Email
        @Size(max = 190)
        private String email;

        @NotBlank
        @Size(min = 8, max = 100)
        private String password;

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    @PostMapping("/register")
    public String register(
            @Valid @ModelAttribute("form") Registration form,
            BindingResult result,
            RedirectAttributes redirectAttributes) {

        String normalizedEmail = form.getEmail() == null
                ? "" : form.getEmail().trim().toLowerCase(Locale.ROOT);

        if (!normalizedEmail.isBlank() && users.existsByEmail(normalizedEmail)) {
            result.rejectValue("email", "duplicate", "Email already registered");
        }

        if (result.hasErrors()) {
            return "register";
        }

        AppUser user = new AppUser();
        user.setFullName(form.getFullName().trim());
        user.setEmail(normalizedEmail);
        user.setPassword(encoder.encode(form.getPassword()));
        user.setRole("USER");
        users.save(user);

        redirectAttributes.addFlashAttribute("registered", true);
        return "redirect:/login";
    }

    @ModelAttribute("form")
    public Registration registrationForm() {
        return new Registration();
    }
}
