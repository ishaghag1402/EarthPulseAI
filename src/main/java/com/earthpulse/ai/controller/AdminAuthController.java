
package com.earthpulse.ai.controller;

import com.earthpulse.ai.service.LoginAuditService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.MessageDigest;
import java.util.HexFormat;

@Controller
public class AdminAuthController {

    private final AuthenticationManager authenticationManager;
    private final LoginAuditService loginAudit;

    @Value("${app.admin.pin-salt}")
    private String pinSalt;

    @Value("${app.admin.pin-hash}")
    private String pinHash;

    private final HttpSessionSecurityContextRepository contextRepository =
            new HttpSessionSecurityContextRepository();

    public AdminAuthController(
            AuthenticationManager authenticationManager,
            LoginAuditService loginAudit) {
        this.authenticationManager = authenticationManager;
        this.loginAudit = loginAudit;
    }

    @GetMapping("/admin/login")
    public String login() {
        return "admin-login";
    }

    @PostMapping("/admin/login")
    public String authenticate(
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("pin") String pin,
            HttpServletRequest request,
            HttpServletResponse response,
            RedirectAttributes redirect) {

        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            email.trim().toLowerCase(),
                            password
                    )
            );

            boolean admin = auth.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

            if (!admin || !validPin(pin)) {
                redirect.addFlashAttribute(
                        "loginError",
                        "Invalid admin email, password or security PIN."
                );
                return "redirect:/admin/login";
            }

            SecurityContext context =
                    SecurityContextHolder.createEmptyContext();

            context.setAuthentication(auth);
            SecurityContextHolder.setContext(context);

            contextRepository.saveContext(context, request, response);

            request.getSession(true)
                    .setAttribute("ADMIN_PIN_VERIFIED", Boolean.TRUE);

            loginAudit.record(auth.getName(), "ADMIN", request);

            return "redirect:/admin";

        } catch (Exception ex) {
            SecurityContextHolder.clearContext();

            redirect.addFlashAttribute(
                    "loginError",
                    "Invalid admin email, password or security PIN."
            );

            return "redirect:/admin/login";
        }
    }

    private boolean validPin(String pin) {

        if (pin == null || !pin.matches("\\d{6}")) {
            return false;
        }

        try {
            byte[] salt = HexFormat.of().parseHex(pinSalt);
            byte[] expectedHash = HexFormat.of().parseHex(pinHash);

            PBEKeySpec spec = new PBEKeySpec(
                    pin.toCharArray(),
                    salt,
                    310000,
                    256
            );

            byte[] derived = SecretKeyFactory
                    .getInstance("PBKDF2WithHmacSHA256")
                    .generateSecret(spec)
                    .getEncoded();

            spec.clearPassword();

            return MessageDigest.isEqual(derived, expectedHash);

        } catch (Exception e) {
            return false;
        }
    }
}
