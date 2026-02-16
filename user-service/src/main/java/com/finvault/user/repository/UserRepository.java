//package com.finvault.user.repository;
//
//import com.finvault.user.entity.User;
//import org.springframework.data.jpa.repository.JpaRepository;
//import java.util.Optional;
//
//public interface UserRepository extends JpaRepository<User, Long> {
//    // This method automatically writes the SQL to find a user by their username
//    Optional<User> findByUsername(String username);
//}

package com.finvault.user.repository;

import com.finvault.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // 👇 This checks if an email already exists (for Registration)
    boolean existsByEmail(String email);

    // 👇 This finds a user for Login (so we can check password)
    Optional<User> findByEmail(String email);
}