package com.finvault.transaction_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

// This tells Feign: "Go find the service named ACCOUNT-SERVICE in the Registry"
@FeignClient(name = "ACCOUNT-SERVICE")
public interface AccountClient {

    // This matches the Withdraw URL in AccountController
    @PutMapping("/accounts/{id}/withdraw")
    void withdraw(@PathVariable("id") Long id, @RequestParam("amount") Double amount);

    // This matches the Deposit URL in AccountController
    @PutMapping("/accounts/{id}/deposit")
    void deposit(@PathVariable("id") Long id, @RequestParam("amount") Double amount);
}