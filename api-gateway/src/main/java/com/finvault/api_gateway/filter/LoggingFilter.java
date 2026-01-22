package com.finvault.api_gateway.filter;



import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class LoggingFilter implements GlobalFilter {

    private final Logger logger = LoggerFactory.getLogger(LoggingFilter.class);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        // 1. Log the Incoming Request
        logger.info("--------------------------------------------------");
        logger.info("🚪 GATEWAY ENTRY: Path request: {}", exchange.getRequest().getPath());
        logger.info("📨 Method: {}", exchange.getRequest().getMethod());

        // 2. Continue the Chain (Forward to Microservice)
        return chain.filter(exchange).then(Mono.fromRunnable(() -> {
            // 3. Log the Outgoing Response (After Microservice is done)
            logger.info("✅ GATEWAY EXIT: Response Status: {}", exchange.getResponse().getStatusCode());
            logger.info("--------------------------------------------------");
        }));
    }
}
