package com.finvault.api_gateway.filter;

import com.finvault.api_gateway.util.JwtUtil;
import io.jsonwebtoken.Claims; // 👈 Import Claims
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.reactive.ServerHttpRequest; // 👈 Import ServerHttpRequest
import org.springframework.stereotype.Component;

@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

    @Autowired
    private RouteValidator validator;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthenticationFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return ((exchange, chain) -> {
            ServerHttpRequest request = null; // Create a placeholder for the modified request

            // 1. Check if the request needs security
            if (validator.isSecured.test(exchange.getRequest())) {

                // 2. Check for Authorization Header
                if (!exchange.getRequest().getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                    throw new RuntimeException("Missing Authorization Header");
                }

                String authHeader = exchange.getRequest().getHeaders().get(HttpHeaders.AUTHORIZATION).get(0);
                if (authHeader != null && authHeader.startsWith("Bearer ")) {
                    authHeader = authHeader.substring(7);
                }

                try {
                    // 3. Validate Token
                    jwtUtil.validateToken(authHeader);

                    // 4. 👇 EXTRACT USER & ROLE (New Logic for Day 4)
                    Claims claims = jwtUtil.getAllClaimsFromToken(authHeader);

                    // 5. 👇 STAMP HEADERS ONTO THE REQUEST
                    // We create a NEW request with these extra headers
                    request = exchange.getRequest()
                            .mutate()
                            .header("loggedInUser", claims.getSubject()) // The Email
                            .header("loggedInRole", String.valueOf(claims.get("role"))) // The Role
                            .build();

                } catch (Exception e) {
                    System.out.println("Invalid Token Access...");
                    throw new RuntimeException("Unauthorized Access to Application");
                }
            }

            // 6. Forward the modified request (if we changed it) or the original one
            if (request != null) {
                return chain.filter(exchange.mutate().request(request).build());
            } else {
                return chain.filter(exchange);
            }
        });
    }

    public static class Config {
        // Configuration properties
    }
}