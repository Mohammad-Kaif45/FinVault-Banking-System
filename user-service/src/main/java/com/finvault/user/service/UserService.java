//package com.finvault.user.service;
//
//import com.finvault.user.entity.User;
//import com.finvault.user.repository.UserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//
//import java.util.Optional;
//
//@Service
//public class UserService {
//
//    @Autowired
//    private UserRepository repository;
//
//    @Autowired
//    private PasswordEncoder passwordEncoder; // 👈 Inject the Encoder
//
//    // 1. SAVE USER (Now with Encryption! 🔒)
//    public User saveUser(User user) {
//        // Scramble the password before saving
//        user.setPassword(passwordEncoder.encode(user.getPassword()));
//        return repository.save(user);
//    }
//
//    public Optional<User> getUserById(Long id) {
//        return repository.findById(id);
//    }
//
//    public Optional<User> getUserByEmail(String email) {
//        return repository.findByEmail(email);
//    }
//
//    public void deleteUser(Long id) {
//        repository.deleteById(id);
//    }
//
//    // --- TEMPORARY MOCKS (We fix these in Step 3!) ---
//    public String generateToken(String email) {
//        return "dummy-token-for-testing";
//    }
//
//    public void validateToken(String token) {
//        // Do nothing for now
//    }
//}

package com.finvault.user.service;

import com.finvault.user.entity.User;
import com.finvault.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService; // 👈 Inject the new Service

    public User saveUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return repository.save(user);
    }

    // ✅ REAL TOKEN GENERATION
    public String generateToken(String username) {
        return jwtService.generateToken(username);
    }

    // ✅ REAL TOKEN VALIDATION
    public void validateToken(String token) {
        jwtService.validateToken(token);
    }

    public Optional<User> getUserById(Long id) {
        return repository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return repository.findByEmail(email);
    }

    public void deleteUser(Long id) {
        repository.deleteById(id);
    }
}