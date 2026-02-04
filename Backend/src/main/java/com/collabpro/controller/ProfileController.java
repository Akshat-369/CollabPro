package com.collabpro.controller;

import com.collabpro.model.Profile;
import com.collabpro.model.User;
import com.collabpro.repository.UserRepository;
import com.collabpro.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @Autowired
    private UserRepository userRepository;

    @PutMapping("/me/image")
    public ResponseEntity<String> uploadProfileImage(@RequestParam("profileImage") org.springframework.web.multipart.MultipartFile file) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (file == null || file.isEmpty()) {
             // "If image not sent -> do nothing" (But @RequestParam implies required by default, so need required=false or check)
             return ResponseEntity.badRequest().body("Image file is required");
        }

        String imageUrl = profileService.uploadProfileImage(user.getId(), file);
        
        // Update profile in DB with new URL
        Profile profile = profileService.getProfile(user.getProfileId());
        profile.setProfileImage(imageUrl);
        profileService.updateProfile(user.getProfileId(), profile);

        return ResponseEntity.ok(imageUrl);
    }
    
    // Remove old uploadImage if conflicting or just keep as unused
    /*
    @PostMapping("/upload-image")
    public ResponseEntity<String> uploadImage(@RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        String imageUrl = profileService.uploadImage(file);
        return ResponseEntity.ok(imageUrl);
    }
    */

    @GetMapping("/me")
    public ResponseEntity<Profile> getMyProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        if (user.getProfileId() == null) {
            // Auto-migrate existing user: Create profile
            Profile newProfile = profileService.createProfile(user.getName(), user.getEmail());
            user.setProfileId(newProfile.getId());
            userRepository.save(user);
            return ResponseEntity.ok(newProfile);
        }

        Profile profile = profileService.getProfile(user.getProfileId());
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/me")
    public ResponseEntity<Profile> updateMyProfile(@RequestBody Profile updateRequest) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getProfileId() == null) {
             return ResponseEntity.notFound().build();
        }

        Profile updatedProfile = profileService.updateProfile(user.getProfileId(), updateRequest);
        return ResponseEntity.ok(updatedProfile);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<Profile> getUserProfile(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getProfileId() == null) {
            // Auto-migrate existing user: Create profile
            Profile newProfile = profileService.createProfile(user.getName(), user.getEmail());
            user.setProfileId(newProfile.getId());
            userRepository.save(user);
            return ResponseEntity.ok(newProfile);
        }

        Profile profile = profileService.getProfile(user.getProfileId());
        return ResponseEntity.ok(profile);
    }
}
