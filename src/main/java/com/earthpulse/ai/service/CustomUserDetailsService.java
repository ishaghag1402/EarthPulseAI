package com.earthpulse.ai.service;
import com.earthpulse.ai.repository.UserRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import java.util.Locale;
@Service
public class CustomUserDetailsService implements UserDetailsService{
 private final UserRepository users;
 public CustomUserDetailsService(UserRepository users){this.users=users;}
 public UserDetails loadUserByUsername(String email)throws UsernameNotFoundException{
  var u=users.findByEmail(email.trim().toLowerCase(Locale.ROOT)).orElseThrow(()->new UsernameNotFoundException("Account not found"));
  return User.withUsername(u.getEmail()).password(u.getPassword()).roles(u.getRole()).build();
 }
}
