package com.finvault.user.service;

import com.finvault.user.entity.User;
import com.finvault.user.repository.UserRepository;
import com.finvault.user.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UserDetails;
import com.finvault.user.config.CustomUserDetailsService;
import java.util.List;

@Service
public class UserService {
    @Autowired
    private CustomUserDetailsService userDetailsService;


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // 1. Generate Token Logic
    public String generateToken(String username) {
        return jwtUtil.generateToken(username);
    }

    // 2. Create User Logic
    public User createUser(User user) {
        // Encrypt the password before saving
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
        return userRepository.save(user);
    }


    public User getUser(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    public String validateToken(String token) {
        String username = jwtUtil.extractUsername(token);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        if (jwtUtil.validateToken(token, userDetails)) {
            return "Token is Valid";
        } else {
            throw new RuntimeException("Invalid Token");
        }
    }


}