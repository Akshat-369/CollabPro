package com.collabpro.service;

import com.collabpro.dto.ProjectDTO;
import com.collabpro.model.*;
import com.collabpro.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Collections;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectApplicationRepository applicationRepository;
    private final NotificationService notificationService;
    private final TaskRepository taskRepository;

    @Transactional
    public ProjectDTO createProject(ProjectDTO dto, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Project project = mapToEntity(dto);
        project.setCreatedBy(user);

        Project saved = projectRepository.save(project);

        notificationService.createNotification(
                user.getId(),
                "Project '" + project.getTitle() + "' created successfully",
                "INFO");

        return mapToDTO(saved, user);
    }

    @Transactional
    public ProjectDTO updateProject(Long id, ProjectDTO dto, String userEmail) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (!project.getCreatedBy().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized: Only the project manager can edit this project");
        }

        project.setTitle(dto.getTitle());
        project.setLocation(dto.getLocation());
        project.setPrice(dto.getPrice());
        project.setExperience(dto.getExperience());
        project.setProjectType(dto.getProjectType());
        project.setStatus(dto.getStatus());
        project.setDescription(dto.getDescription());
        project.setLongDescription(dto.getLongDescription());
        project.setTags(dto.getTags());
        project.setRequirements(dto.getRequirements());

        Project saved = projectRepository.save(project);

        notificationService.createNotification(
                project.getCreatedBy().getId(),
                "Project '" + project.getTitle() + "' updated successfully",
                "INFO");

        return mapToDTO(saved, project.getCreatedBy());
    }

    @Transactional(readOnly = true)
    public List<ProjectDTO> getAllProjects(String viewerEmail) {
        User viewer = null;
        if (viewerEmail != null) {
            viewer = userRepository.findByEmail(viewerEmail).orElse(null);
        }
        User finalViewer = viewer;

        return projectRepository.findAll().stream()
                .map(project -> mapToDTO(project, finalViewer))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProjectDTO getProject(Long id, String viewerEmail) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        User viewer = null;
        if (viewerEmail != null) {
            viewer = userRepository.findByEmail(viewerEmail).orElse(null);
        }

        return mapToDTO(project, viewer);
    }

    private Project mapToEntity(ProjectDTO dto) {
        Project p = new Project();
        p.setTitle(dto.getTitle());
        p.setLocation(dto.getLocation());
        p.setPrice(dto.getPrice());
        p.setExperience(dto.getExperience());
        p.setProjectType(dto.getProjectType());
        p.setStatus(dto.getStatus());
        p.setDescription(dto.getDescription());
        p.setLongDescription(dto.getLongDescription());
        p.setTags(dto.getTags());
        p.setRequirements(dto.getRequirements());
        return p;
    }

    private ProjectDTO mapToDTO(Project project, User viewer) {
        ProjectDTO dto = new ProjectDTO();
        dto.setId(project.getId().toString());
        dto.setTitle(project.getTitle());
        dto.setLocation(project.getLocation());
        dto.setPrice(project.getPrice());
        dto.setExperience(project.getExperience());
        dto.setProjectType(project.getProjectType());
        dto.setStatus(project.getStatus());
        dto.setDescription(project.getDescription());
        dto.setLongDescription(project.getLongDescription());
        dto.setAboutProject(project.getLongDescription()); // Alias for frontend compatibility
        dto.setTags(project.getTags());
        dto.setRequirements(project.getRequirements());
        dto.setCompany(project.getCreatedBy().getName());

        boolean isOwner = viewer != null && project.getCreatedBy().getId().equals(viewer.getId());
        dto.setPostedByMe(isOwner);

        dto.setPostedAgo(calculatePostedAgo(project.getCreatedAt()));

        // Dynamic Metrics
        long activeApplicants = applicationRepository.findByProjectId(project.getId()).stream()
                .filter(app -> app.getStatus() != com.collabpro.model.ProjectApplication.ApplicationStatus.HIRED
                        && app.getStatus() != com.collabpro.model.ProjectApplication.ApplicationStatus.REJECTED
                        && app.getStatus() != com.collabpro.model.ProjectApplication.ApplicationStatus.REMOVED)
                .count();
        dto.setApplicants((int) activeApplicants);

        dto.setMembersCount(project.getProjectMembers().size() + 1); // Manager + Hired Members

        long incompleteTasks = taskRepository.findByProjectId(project.getId()).stream()
                .filter(task -> !task.getStatus().equalsIgnoreCase("Approved"))
                .count();
        dto.setIncompleteTasksCount((int) incompleteTasks);

        return dto;
    }

    private String calculatePostedAgo(LocalDateTime createdAt) {
        if (createdAt == null)
            return "Just now";
        Duration duration = Duration.between(createdAt, LocalDateTime.now());
        long hours = duration.toHours();
        if (hours < 1)
            return "Just now";
        if (hours < 24)
            return hours + " hours ago";
        long days = duration.toDays();
        return days + " days ago";
    }

    @Transactional
    public void saveProject(Long projectId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (user.getSavedProjects() == null) {
            user.setSavedProjects(new java.util.HashSet<>());
        }
        user.getSavedProjects().add(project);
        userRepository.save(user);
    }

    @Transactional
    public void unsaveProject(Long projectId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (user.getSavedProjects() != null) {
            user.getSavedProjects().remove(project);
            userRepository.save(user);
        }
    }

    @Transactional(readOnly = true)
    public List<ProjectDTO> getSavedProjects(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getSavedProjects() == null) {
            return Collections.emptyList();
        }

        return user.getSavedProjects().stream()
                .map(project -> mapToDTO(project, user))
                .collect(Collectors.toList());
    }

    @Transactional
    public void removeMember(Long projectId, Long applicationId, String requesterEmail) {
        com.collabpro.model.ProjectApplication application = applicationRepository
                .findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        Project project = application.getProject();

        if (!project.getId().equals(projectId)) {
            throw new RuntimeException("Application does not match project");
        }

        User member = application.getApplicant();

        // Authority check
        if (!project.getCreatedBy().getEmail().equals(requesterEmail)) {
            throw new RuntimeException("Unauthorized: Only the project manager can remove members");
        }

        // Prevent removing self
        if (project.getCreatedBy().getId().equals(member.getId())) {
            throw new RuntimeException("Cannot remove the project manager");
        }

        // Remove from project members
        project.getProjectMembers().removeIf(pm -> pm.getUser().getId().equals(member.getId()));
        projectRepository.save(project);

        // Update application status
        application.setStatus(com.collabpro.model.ProjectApplication.ApplicationStatus.REMOVED);
        applicationRepository.save(application);

        // Notify the removed member
        notificationService.createNotification(
                member.getId(),
                "You have been removed from the project '" + project.getTitle() + "'.",
                "REMOVAL");
    }
    private final com.collabpro.repository.ProfileRepository profileRepository;

    @Transactional(readOnly = true)
    public List<com.collabpro.dto.ProjectMemberDTO> getProjectMembers(Long projectId) {
        return applicationRepository.findByProjectId(projectId).stream()
             .filter(app -> app.getStatus() == com.collabpro.model.ProjectApplication.ApplicationStatus.HIRED)
             .map(app -> {
                 com.collabpro.dto.ProjectMemberDTO dto = new com.collabpro.dto.ProjectMemberDTO();
                 dto.setId(app.getId());
                 dto.setName(app.getApplicant().getName());
                 dto.setEmail(app.getApplicant().getEmail());
                 
                 Long profileId = app.getApplicant().getProfileId();
                 if (profileId != null) {
                      profileRepository.findById(profileId).ifPresent(p -> dto.setProfileImage(p.getProfileImage()));
                 }
                 
                 if (app.getJoinedAt() != null) {
                     dto.setJoinedAt(app.getJoinedAt().format(java.time.format.DateTimeFormatter.ofPattern("MMM d, yyyy")));
                 } else {
                     dto.setJoinedAt("Recently");
                 }

                 return dto;
             })
             .collect(Collectors.toList());
    }
}
