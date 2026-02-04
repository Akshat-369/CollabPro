package com.collabpro.controller;

import com.collabpro.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.security.Principal;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping("/{projectId}/apply")
    public ResponseEntity<Void> applyForProject(
            @PathVariable Long projectId,
            @RequestParam("coverLetter") String coverLetter,
            @RequestParam(value = "resume", required = false) MultipartFile resume,
            Principal principal) {

        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        try {
            applicationService.applyForProject(projectId, principal.getName(), coverLetter, resume);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/applications/my-applications")
    public ResponseEntity<java.util.List<java.util.Map<String, Object>>> getMyApplications(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(applicationService.getMyApplications(principal.getName()));
    }

    @GetMapping("/{projectId}/candidates")
    public ResponseEntity<java.util.List<com.collabpro.dto.CandidateDTO>> getProjectCandidates(
            @PathVariable Long projectId,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            return ResponseEntity.ok(applicationService.getProjectCandidates(projectId, principal.getName()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PatchMapping("/{projectId}/applications/{applicationId}/status")
    public ResponseEntity<?> updateApplicationStatus(
            @PathVariable Long projectId,
            @PathVariable Long applicationId,
            @RequestBody java.util.Map<String, Object> body,
            Principal principal) {
        if (principal == null)
            return ResponseEntity.status(401).build();

        try {
            String status = (String) body.get("status");
            @SuppressWarnings("unchecked")
            java.util.Map<String, String> interview = (java.util.Map<String, String>) body.get("interview");

            applicationService.updateApplicationStatus(projectId, applicationId, status, interview,
                    principal.getName());
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{projectId}/applications/{applicationId}/accept")
    public ResponseEntity<Void> acceptOffer(
            @PathVariable Long projectId,
            @PathVariable Long applicationId,
            Principal principal) {
        if (principal == null)
            return ResponseEntity.status(401).build();

        try {
            applicationService.acceptOffer(projectId, applicationId, principal.getName());
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{projectId}/applications/{applicationId}/reject")
    public ResponseEntity<Void> rejectOffer(
            @PathVariable Long projectId,
            @PathVariable Long applicationId,
            Principal principal) {
        if (principal == null)
            return ResponseEntity.status(401).build();

        try {
            applicationService.rejectOffer(projectId, applicationId, principal.getName());
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{projectId}/applications/{applicationId}/resume")
    public ResponseEntity<org.springframework.core.io.Resource> getResume(
            @PathVariable Long projectId,
            @PathVariable Long applicationId,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        try {
            org.springframework.core.io.Resource resource = applicationService.getResume(applicationId, principal.getName());
            
            String contentType = "application/octet-stream";
            if (resource.getFilename() != null) {
                String lower = resource.getFilename().toLowerCase();
                if (lower.endsWith(".pdf")) contentType = "application/pdf";
                else if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) contentType = "image/jpeg";
                else if (lower.endsWith(".png")) contentType = "image/png";
            }

            return ResponseEntity.ok()
                    .contentType(org.springframework.http.MediaType.parseMediaType(contentType))
                    .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (RuntimeException e) {
             if (e.getMessage().contains("Unauthorized")) return ResponseEntity.status(403).build();
             if (e.getMessage().contains("No resume")) return ResponseEntity.notFound().build();
             return ResponseEntity.badRequest().build();
        }
    }
}
