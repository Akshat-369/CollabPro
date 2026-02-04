package com.collabpro.controller;

import com.collabpro.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class DirectApplicationController {

    private final ApplicationService applicationService;

    @GetMapping("/{applicationId}/resume")
    public ResponseEntity<Resource> getResume(
            @PathVariable Long applicationId,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        try {
            Resource resource = applicationService.getResume(applicationId, principal.getName());
            
            String contentType = "application/octet-stream";
            if (resource.getFilename() != null) {
                String lower = resource.getFilename().toLowerCase();
                if (lower.endsWith(".pdf")) contentType = "application/pdf";
                else if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) contentType = "image/jpeg";
                else if (lower.endsWith(".png")) contentType = "image/png";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (RuntimeException e) {
             if (e.getMessage().contains("Unauthorized")) return ResponseEntity.status(403).build();
             if (e.getMessage().contains("No resume")) return ResponseEntity.notFound().build();
             return ResponseEntity.badRequest().build();
        }
    }
}
