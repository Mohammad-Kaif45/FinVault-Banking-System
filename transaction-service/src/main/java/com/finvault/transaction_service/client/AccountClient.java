package com.finvault.transaction_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "ACCOUNT-SERVICE")
public interface AccountClient {

    // ✅ Changed from Long to String to match the 16-digit Account Number
    // ✅ Updated the path to a dedicated "/feign" endpoint to avoid conflicts

    @PostMapping("/accounts/feign/deposit")
    void deposit(@RequestParam("accountNumber") String accountNumber, @RequestParam("amount") Double amount);

    @PostMapping("/accounts/feign/withdraw")
    void withdraw(@RequestParam("accountNumber") String accountNumber, @RequestParam("amount") Double amount);
}