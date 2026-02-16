package com.finvault.user.service;

import com.finvault.user.entity.User;
import com.finvault.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder; // Will use later
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository repository;

    // We will enable this in Day 2
    // @Autowired
    // private PasswordEncoder passwordEncoder;

    // 1. SAVE USER (Registration)
    public User saveUser(User user) {
        // user.setPassword(passwordEncoder.encode(user.getPassword())); // Enable later
        return repository.save(user);
    }

    // 2. GET USER BY ID
    public Optional<User> getUserById(Long id) {
        return repository.findById(id);
    }

    // 3. GET USER BY EMAIL
    public Optional<User> getUserByEmail(String email) {
        return repository.findByEmail(email);
    }

    // 4. DELETE USER
    public void deleteUser(Long id) {
        repository.deleteById(id);
    }

    // --- TEMPORARY MOCKS (To stop Controller errors until Day 3) ---
    public String generateToken(String email) {
        return "dummy-token-for-testing";
    }

    public void validateToken(String token) {
        // Do nothing for now
    }
}