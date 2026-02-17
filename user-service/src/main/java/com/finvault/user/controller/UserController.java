package com.finvault.user.controller;

import com.finvault.user.entity.User;
import com.finvault.user.repository.UserRepository; // 👈 Import Repository
import com.finvault.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap; // 👈 Import Map
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository repository; // 👈 Inject Repository to find User Details

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

    // 👇 UPDATED LOGIN LOGIC (Returns Token + ID + Name)
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody User user) {
        // 1. Authenticate
        Authentication authenticate = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword())
        );

        if (authenticate.isAuthenticated()) {
            // 2. Find the User in DB (to get ID and Name)
            User dbUser = repository.findByEmail(user.getEmail()).get();

            // 3. Generate Token
            String token = userService.generateToken(user.getEmail());

            // 4. Create Response Package
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("userId", dbUser.getId());
            response.put("name", dbUser.getName());

            return response;
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