package com.finvault.api_gateway.filter;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Predicate;

@Component
public class RouteValidator {

    // 🔓 LIST OF OPEN ENDPOINTS (No Token Needed)
    public static final List<String> openApiEndpoints = List.of(
            "/users/register",
            "/users/login",
            "/users/validate",
            "/eureka"
    );

    public Predicate<ServerHttpRequest> isSecured =
            request -> openApiEndpoints
                    .stream()
                    .noneMatch(uri -> request.getURI().getPath().contains(uri));
}