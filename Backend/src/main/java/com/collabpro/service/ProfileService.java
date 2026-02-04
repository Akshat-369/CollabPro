package com.collabpro.service;

import com.collabpro.model.Certification;
import com.collabpro.model.Experience;
import com.collabpro.model.Profile;
import com.collabpro.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ProfileService {

    @Autowired
    private ProfileRepository profileRepository;

    private final Path fileStorageLocation;

    public ProfileService() {
        this.fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public Profile createProfile(String name, String email) {
        Profile profile = Profile.builder()
                .name(name)
                .email(email)
                .phone("")
                .coverImage("https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=2000") // Default cover
                .profileImage("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200") // Default avatar
                .about("")
                .skills(new ArrayList<>())
                .experiences(new ArrayList<>())
                .certifications(new ArrayList<>())
                .build();
        return profileRepository.save(profile);
    }

    public Profile getProfile(Long id) {
        return profileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
    }

    public Profile updateProfile(Long id, Profile updateRequest) {
        Profile existingProfile = getProfile(id);

        if (updateRequest.getName() != null) existingProfile.setName(updateRequest.getName());
        if (updateRequest.getEmail() != null) existingProfile.setEmail(updateRequest.getEmail());
        if (updateRequest.getPhone() != null) existingProfile.setPhone(updateRequest.getPhone());
        if (updateRequest.getCoverImage() != null) existingProfile.setCoverImage(updateRequest.getCoverImage());
        if (updateRequest.getProfileImage() != null) existingProfile.setProfileImage(updateRequest.getProfileImage());
        if (updateRequest.getAbout() != null) existingProfile.setAbout(updateRequest.getAbout());
        
        if (updateRequest.getSkills() != null) {
            existingProfile.getSkills().clear();
            existingProfile.getSkills().addAll(updateRequest.getSkills());
        }

        if (updateRequest.getExperiences() != null) {
            existingProfile.getExperiences().clear();
            if (!updateRequest.getExperiences().isEmpty()) {
                existingProfile.getExperiences().addAll(updateRequest.getExperiences());
            }
        }

        if (updateRequest.getCertifications() != null) {
            existingProfile.getCertifications().clear();
             if (!updateRequest.getCertifications().isEmpty()) {
                existingProfile.getCertifications().addAll(updateRequest.getCertifications());
            }
        }

        return profileRepository.save(existingProfile);
    }

    public String uploadProfileImage(Long userId, MultipartFile file) {
        try {
            // 1. Validate File Size (Max 10MB)
            if (file.getSize() > 10 * 1024 * 1024) {
                throw new RuntimeException("File size exceeds 10MB limit");
            }

            // 2. Validate File Type
            String contentType = file.getContentType();
            if (contentType == null || !isValidImageType(contentType)) {
                throw new RuntimeException("Invalid file type. Only JPG, PNG, and WebP are allowed.");
            }

            // 3. Create Directory
            Path uploadPath = Paths.get("uploads", "profile").toAbsolutePath().normalize();
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // 4. Generate Filename: userId_timestamp.extension
            String originalFilename = file.getOriginalFilename();
            String extension = getFileExtension(originalFilename);
            String newFilename = userId + "_" + System.currentTimeMillis() + "." + extension;

            // 5. Save File
            Path filePath = uploadPath.resolve(newFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // 6. Return URL
            // Assuming server runs on localhost:8080. Ideally from properties.
            return "http://localhost:8080/uploads/profile/" + newFilename;

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image", e);
        }
    }

    private boolean isValidImageType(String contentType) {
        return contentType.equals("image/jpeg") || 
               contentType.equals("image/png") || 
               contentType.equals("image/webp") ||
               contentType.equals("image/jpg");
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "jpg";
        return filename.substring(filename.lastIndexOf(".") + 1);
    }
}
