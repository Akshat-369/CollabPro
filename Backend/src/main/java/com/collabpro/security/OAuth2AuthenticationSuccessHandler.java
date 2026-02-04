package com.collabpro.security;

import com.collabpro.model.User;
import com.collabpro.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        String email = oauth2User.getAttribute("email");
        
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found after OAuth"));
        
        com.collabpro.security.UserPrincipal userPrincipal = com.collabpro.security.UserPrincipal.create(user);
        Authentication newAuth = new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                userPrincipal, null, userPrincipal.getAuthorities());
        
        String token = tokenProvider.generateToken(newAuth); 
        
        // Redirect to Frontend with Token
        // Using HashRouter, so we insert /#/
        String targetUrl = "http://localhost:5173/#/oauth2/success?token=" + token;
        
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
