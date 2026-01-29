package com.finvault.api_gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class ApiGatewayApplication {

	// API gateway main method
	public static void main(String[] args) {
		SpringApplication.run(ApiGatewayApplication.class, args);
	}

}
