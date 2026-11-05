package com.earthpulse.ai.config;

import com.earthpulse.ai.service.CustomUserDetailsService;
import com.earthpulse.ai.service.LoginAuditService;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.authorization.AuthorizationDecision;
import org.springframework.security.authorization.AuthorizationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.intercept.RequestAuthorizationContext;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

@Configuration
public class SecurityConfig {
    @Bean PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }
    @Bean AuthenticationManager authenticationManager(AuthenticationConfiguration c) throws Exception { return c.getAuthenticationManager(); }

    @Bean DaoAuthenticationProvider authenticationProvider(CustomUserDetailsService uds, PasswordEncoder encoder) {
        DaoAuthenticationProvider p = new DaoAuthenticationProvider();
        p.setUserDetailsService(uds);
        p.setPasswordEncoder(encoder);
        return p;
    }

    @Bean AuthenticationSuccessHandler loginAuditSuccessHandler(LoginAuditService audit) {
        return (request, response, authentication) -> {
            boolean admin = authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            if (admin) {
                SecurityContextHolder.clearContext();
                var existingSession = request.getSession(false);
                if (existingSession != null) existingSession.invalidate();
                response.sendRedirect("/admin/login");
                return;
            }
            audit.record(authentication.getName(), "USER", request);
            response.sendRedirect("/dashboard");
        };
    }

    @Bean SecurityFilterChain filterChain(HttpSecurity http, DaoAuthenticationProvider provider,
                                          AuthenticationSuccessHandler loginAuditSuccessHandler) throws Exception {
        AuthorizationManager<RequestAuthorizationContext> adminPinAccess = (auth, ctx) -> {
            var session = ctx.getRequest().getSession(false);
            boolean adminRole = auth.get().getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            return new AuthorizationDecision(adminRole && session != null
                && Boolean.TRUE.equals(session.getAttribute("ADMIN_PIN_VERIFIED")));
        };
        http.authenticationProvider(provider).authorizeHttpRequests(a -> a
            .requestMatchers("/", "/register", "/login", "/admin/login", "/css/**", "/js/**",
                    "/images/**", "/uploads/**", "/waste-images/**", "/error").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/waste-reports").authenticated()
            .requestMatchers("/admin", "/admin/**").access(adminPinAccess)
            .requestMatchers(HttpMethod.GET, "/api/waste-reports").access(adminPinAccess)
            .requestMatchers(HttpMethod.PATCH, "/api/waste-reports/**").access(adminPinAccess)
            .anyRequest().authenticated())
            .formLogin(f -> f.loginPage("/login").successHandler(loginAuditSuccessHandler).permitAll())
            .logout(l -> l.logoutSuccessUrl("/").permitAll());
        return http.build();
    }
}
