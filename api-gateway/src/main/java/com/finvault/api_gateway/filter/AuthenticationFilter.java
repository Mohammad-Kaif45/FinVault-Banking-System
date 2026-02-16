package com.finvault.api_gateway.filter;

import com.finvault.api_gateway.util.JwtUtil; // We will create this next!
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

    @Autowired
    private RouteValidator validator;

    // ⚠️ We will create this Utility class in Step 4
    @Autowired
    private JwtUtil jwtUtil;

    public AuthenticationFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return ((exchange, chain) -> {
            // 1. Check if the request needs security
            if (validator.isSecured.test(exchange.getRequest())) {

                // 2. Check if Header contains Token
                if (!exchange.getRequest().getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                    throw new RuntimeException("Missing Authorization Header");
                }

                String authHeader = exchange.getRequest().getHeaders().get(HttpHeaders.AUTHORIZATION).get(0);
                if (authHeader != null && authHeader.startsWith("Bearer ")) {
                    authHeader = authHeader.substring(7); // Remove "Bearer " prefix
                }

                // 3. Validate Token using JwtUtil
                try {
                    jwtUtil.validateToken(authHeader); // Throw error if invalid
                } catch (Exception e) {
                    System.out.println("Invalid Token Access...");
                    throw new RuntimeException("Unauthorized Access to Application");
                }
            }
            return chain.filter(exchange);
        });
    }

    public static class Config {
        // Configuration properties
    }
}