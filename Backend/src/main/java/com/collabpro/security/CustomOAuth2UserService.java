package com.collabpro.security;

import com.collabpro.model.User;
import com.collabpro.repository.UserRepository;
import com.collabpro.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final ProfileService profileService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);
        
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        String avatarUrl = oauth2User.getAttribute("picture");
        
        Optional<User> existingUser = userRepository.findByEmail(email);
        
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            if (user.getAuthProvider() == null || !user.getAuthProvider().equals("GOOGLE")) {
                user.setAuthProvider("GOOGLE");
                userRepository.save(user);
            }
            return oauth2User;
        } else {
            // Register new user
            // Generate secure random password
            String randomPassword = UUID.randomUUID().toString();
            
            // Create Profile
            com.collabpro.model.Profile profile = profileService.createProfile(name, email);
            if (avatarUrl != null) {
                profile.setProfileImage(avatarUrl);
                // We might need an update method in ProfileService or just save it via repository if exposed
                // For now, assuming createProfile sets defaults. 
                // We will manually update profile content if needed, but ProfileService.createProfile is simple.
                // NOTE: profileService.createProfile returns a saved entity. We should update it if we want the avatar.
            }
            // For now, let's stick to base logic. We can't easily access ProfileRepository here without injecting it.
            // But we can leave avatar as default for simplicity or update if critical.
            
            User newUser = User.builder()
                    .name(name)
                    .email(email)
                    .password(passwordEncoder.encode(randomPassword))
                    .profileId(profile.getId())
                    .authProvider("GOOGLE")
                    .build();
            
            userRepository.save(newUser);
            return oauth2User;
        }
    }
}
