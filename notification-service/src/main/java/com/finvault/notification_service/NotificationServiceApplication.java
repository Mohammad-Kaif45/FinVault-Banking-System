package com.finvault.notification_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class NotificationServiceApplication {
   // Notification Service application
	// MAIN MEHTOD

	public static void main(String[] args) {
        //
		SpringApplication.run(NotificationServiceApplication.class, args);
	}
}
