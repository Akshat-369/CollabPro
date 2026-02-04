package com.collabpro.controller;

import com.collabpro.dto.ProjectDTO;
import com.collabpro.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    public ResponseEntity<ProjectDTO> createProject(@RequestBody ProjectDTO projectDTO, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(projectService.createProject(projectDTO, principal.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectDTO> updateProject(@PathVariable Long id, @RequestBody ProjectDTO projectDTO,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(projectService.updateProject(id, projectDTO, principal.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDTO> getProject(@PathVariable Long id, Principal principal) {
        String email = principal != null ? principal.getName() : null;
        return ResponseEntity.ok(projectService.getProject(id, email));
    }

    @GetMapping
    public ResponseEntity<java.util.List<ProjectDTO>> getAllProjects(Principal principal) {
        String email = principal != null ? principal.getName() : null;
        return ResponseEntity.ok(projectService.getAllProjects(email));
    }

    @PostMapping("/{id}/save")
    public ResponseEntity<Void> saveProject(@PathVariable Long id, Principal principal) {
        if (principal == null)
            return ResponseEntity.status(401).build();
        projectService.saveProject(id, principal.getName());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/save")
    public ResponseEntity<Void> unsaveProject(@PathVariable Long id, Principal principal) {
        if (principal == null)
            return ResponseEntity.status(401).build();
        projectService.unsaveProject(id, principal.getName());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/saved")
    public ResponseEntity<java.util.List<ProjectDTO>> getSavedProjects(Principal principal) {
        if (principal == null)
            return ResponseEntity.status(401).build();
        return ResponseEntity.ok(projectService.getSavedProjects(principal.getName()));
    }

    @DeleteMapping("/{projectId}/members/{applicationId}")
    public ResponseEntity<Void> removeMember(@PathVariable Long projectId, @PathVariable Long applicationId,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        projectService.removeMember(projectId, applicationId, principal.getName());
        return ResponseEntity.ok().build();
    }
    @GetMapping("/{id}/members")
    public ResponseEntity<java.util.List<com.collabpro.dto.ProjectMemberDTO>> getProjectMembers(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectMembers(id));
    }
}
