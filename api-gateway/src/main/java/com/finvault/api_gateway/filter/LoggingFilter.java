package com.finvault.api_gateway.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Component
public class LoggingFilter implements GlobalFilter {

    private final Logger logger = LoggerFactory.getLogger(LoggingFilter.class);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        // 1. Generate a unique "Luggage Tag" for this request
        String traceId = UUID.randomUUID().toString();

        // 2. Add the Trace ID to the Response Headers (So Postman sees it)
        exchange.getResponse().getHeaders().add("X-Trace-Id", traceId);

        // 3. Log the Entry with the Trace ID
        logger.info("--------------------------------------------------");
        logger.info("🚪 [Trace: {}] ENTRY: {} {}", traceId, exchange.getRequest().getMethod(), exchange.getRequest().getPath());

        // 4. Continue the Chain
        return chain.filter(exchange).then(Mono.fromRunnable(() -> {
            // 5. Log the Exit with the SAME Trace ID
            logger.info("✅ [Trace: {}] EXIT: Status: {}", traceId, exchange.getResponse().getStatusCode());
            logger.info("--------------------------------------------------");
        }));
    }
}