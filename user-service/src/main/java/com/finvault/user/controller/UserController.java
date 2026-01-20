package com.finvault.user.controller;

import com.finvault.user.entity.User;
import com.finvault.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    // POST: Create User (Register)
    // URL: http://localhost:8081/users/register
    @PostMapping("/register")
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    // POST: Login
    // URL: http://localhost:8081/users/login
    // THIS ENTIRE METHOD WAS MISSING
    @PostMapping("/login")
    public String login(@RequestBody User user) {
        // 1. Check username and password
        Authentication authenticate = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
        );

        // 2. If valid, generate the Token
        if (authenticate.isAuthenticated()) {
            return userService.generateToken(user.getUsername());
        } else {
            throw new RuntimeException("Invalid Access");
        }
    }
    // GET: User Profile (Secured)
    // URL: http://localhost:8081/users/profile
    @GetMapping("/profile")
    public String getUserProfile() {
        return "Welcome to your secure profile! If you see this, your Token is valid.";
    }

    // GET: Validate Token
    // URL: http://localhost:8081/users/validate?token=eyJhb...
    @GetMapping("/validate")
    public String validateToken(@RequestParam("token") String token) {
        return userService.validateToken(token);
    }
}