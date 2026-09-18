package com.sih.gemforensic.controller;

import com.sih.gemforensic.dto.LoginRequestDTO;
import com.sih.gemforensic.dto.RegisterRequestDTO;
import com.sih.gemforensic.model.User;
import com.sih.gemforensic.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequestDTO dto) {
        if (dto.getEmail() == null || dto.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
        }
        if (dto.getPassword() == null || dto.getPassword().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Password is required"));
        }
        if (userRepository.existsByEmail(dto.getEmail().trim().toLowerCase())) {
            return ResponseEntity.badRequest().body(Map.of("error", "An account with this email already exists"));
        }

        User user = new User(
            dto.getEmail().trim().toLowerCase(),
            dto.getPassword(),
            dto.getFullName() != null ? dto.getFullName() : "Procurement Officer",
            dto.getRole() != null ? dto.getRole() : "Procurement Officer",
            dto.getDepartment() != null ? dto.getDepartment() : "Ministry of Finance",
            dto.getEmployeeId() != null ? dto.getEmployeeId() : "GEM/OFF/" + (1000 + (int)(Math.random()*9000))
        );

        userRepository.save(user);

        Map<String, Object> res = new HashMap<>();
        res.put("message", "User registered successfully");
        res.put("token", "gem-token-" + System.currentTimeMillis());
        res.put("user", Map.of(
            "id", user.getId(),
            "email", user.getEmail(),
            "fullName", user.getFullName(),
            "role", user.getRole(),
            "department", user.getDepartment(),
            "employeeId", user.getEmployeeId()
        ));

        return ResponseEntity.ok(res);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO dto) {
        if (dto.getEmail() == null || dto.getPassword() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required"));
        }

        Optional<User> userOpt = userRepository.findByEmail(dto.getEmail().trim().toLowerCase());
        if (userOpt.isEmpty() || !userOpt.get().getPassword().equals(dto.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials. Please check your email and password."));
        }

        User user = userOpt.get();

        Map<String, Object> res = new HashMap<>();
        res.put("token", "gem-token-" + System.currentTimeMillis());
        res.put("user", Map.of(
            "id", user.getId(),
            "email", user.getEmail(),
            "fullName", user.getFullName(),
            "role", user.getRole(),
            "department", user.getDepartment(),
            "employeeId", user.getEmployeeId()
        ));

        return ResponseEntity.ok(res);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestParam(value = "email", required = false) String email) {
        String queryEmail = (email != null && !email.isEmpty()) ? email : "arjun.singh@gov.in";
        Optional<User> userOpt = userRepository.findByEmail(queryEmail.trim().toLowerCase());

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "fullName", user.getFullName(),
                "role", user.getRole(),
                "department", user.getDepartment(),
                "employeeId", user.getEmployeeId()
            ));
        }

        return ResponseEntity.ok(Map.of(
            "id", 1,
            "email", "arjun.singh@gov.in",
            "fullName", "Arjun Singh",
            "role", "Procurement Officer",
            "department", "Ministry of Finance",
            "employeeId", "GEM/OFF/1910"
        ));
    }
}
