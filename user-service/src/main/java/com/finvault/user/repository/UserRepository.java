package com.finvault.user.repository;

import com.finvault.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // This method automatically writes the SQL to find a user by their username
    Optional<User> findByUsername(String username);
}