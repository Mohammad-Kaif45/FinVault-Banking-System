package com.finvault.user.controller;

import com.finvault.user.entity.User;
import com.finvault.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    // 👇 UNCOMMENTED: This is the Login Manager
    @Autowired
    private AuthenticationManager authenticationManager;

    // 1. Get User by ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.getUserById(id);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 2. Register User
    @PostMapping("/register")
    public ResponseEntity<String> createUser(@RequestBody User user) {
        userService.saveUser(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    // 👇 UPDATED: Real Login Logic
    @PostMapping("/login")
    public String login(@RequestBody User user) {
        // 1. Authenticate (Check Email & Password against DB)
        Authentication authenticate = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword())
        );

        // 2. If valid, Generate Token
        if (authenticate.isAuthenticated()) {
            // We generate the token using the EMAIL
            return userService.generateToken(user.getEmail());
        } else {
            throw new RuntimeException("Invalid Access");
        }
    }

    // 4. Validate Token
    @GetMapping("/validate")
    public String validateToken(@RequestParam("token") String token) {
        userService.validateToken(token);
        return "Token is valid";
    }

    // 5. Delete User
    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return "User deleted successfully";
    }
}