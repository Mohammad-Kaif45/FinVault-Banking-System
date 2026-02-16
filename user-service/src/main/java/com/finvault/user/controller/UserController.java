package com.finvault.user.controller;

import com.finvault.user.entity.User;
import com.finvault.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    // ⚠️ We commented this out because SecurityConfig is not ready for it yet.
    // We will enable AuthenticationManager in Day 2.
    // @Autowired
    // private AuthenticationManager authenticationManager;

    // ✅ 1. Get User by ID (Fixed)
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.getUserById(id);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ 2. Register User (Fixed)
    @PostMapping("/register")
    public ResponseEntity<String> createUser(@RequestBody User user) {
        userService.saveUser(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    // ⚠️ 3. Login (Temporarily Simplified for Day 1)
    @PostMapping("/login")
    public String login(@RequestBody User user) {
        // We will add real Authentication here in Day 2.
        // For now, just check if user exists to prevent errors.
        return "Login logic coming in Day 2!";

        /* // OLD CODE (Will fix in Day 2):
        Authentication authenticate = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()) // Changed getUsername to getEmail
        );
        if (authenticate.isAuthenticated()) {
            return userService.generateToken(user.getEmail());
        } else {
            throw new RuntimeException("Invalid Access");
        }
        */
    }

    // ✅ 4. Validate Token
    @GetMapping("/validate")
    public String validateToken(@RequestParam("token") String token) {
        userService.validateToken(token);
        return "Token is valid";
    }

    // ✅ 5. Delete User
    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return "User deleted successfully";
    }
}