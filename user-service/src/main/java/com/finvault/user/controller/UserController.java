package com.finvault.user.controller;

import com.finvault.user.entity.User;
import com.finvault.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity; // Import needed for response handling
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional; // Import needed for Optional

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    // ✅ NEW: Get User by ID (Required for Dashboard!)
    // URL: http://localhost:8081/users/1
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        // We use a try-catch or Optional here. Assuming userService has a findById method.
        // If your service doesn't return Optional, adjust accordingly.
        // Quickest fix: Use the Repository directly if Service method is missing,
        // OR add getById to your Service.
        // For now, let's assume you add this method to UserService, or we can fetch via Repository if you prefer.
        // To be safe and simple, let's return the User directly if found.

        Optional<User> user = userService.getUserById(id); // You might need to add this to UserService
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // POST: Create User (Register)
    @PostMapping("/register")
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    // POST: Login
    @PostMapping("/login")
    public String login(@RequestBody User user) {
        Authentication authenticate = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
        );

        if (authenticate.isAuthenticated()) {
            return userService.generateToken(user.getUsername());
        } else {
            throw new RuntimeException("Invalid Access");
        }
    }

    // GET: User Profile (Secured)
    @GetMapping("/profile")
    public String getUserProfile() {
        return "Welcome to your secure profile!";
    }

    // GET: Validate Token
    @GetMapping("/validate")
    public String validateToken(@RequestParam("token") String token) {
        return userService.validateToken(token);
    }

    // DELETE ENDPOINT
    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return "User deleted successfully";
    }
}