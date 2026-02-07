package com.finvault.transaction_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "ACCOUNT-SERVICE")
public interface AccountClient {

    // ✅ Ensure these are @PostMapping, NOT @PutMapping
    // ✅ Ensure the path is exactly "/accounts/deposit"

    @PostMapping("/accounts/deposit")
    void deposit(@RequestParam("id") Long id, @RequestParam("amount") Double amount);

    @PostMapping("/accounts/withdraw")
    void withdraw(@RequestParam("id") Long id, @RequestParam("amount") Double amount);
}