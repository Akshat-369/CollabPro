package com.collabpro.service;

import com.collabpro.model.Project;
import com.collabpro.model.ProjectApplication;
import com.collabpro.model.User;
import com.collabpro.repository.ProjectApplicationRepository;
import com.collabpro.repository.ProjectRepository;
import com.collabpro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import java.net.MalformedURLException;
import org.springframework.http.MediaType;

@Service
@RequiredArgsConstructor
public class ApplicationService {
    private final ProjectApplicationRepository applicationRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public void applyForProject(Long projectId, String userEmail, String coverLetter, MultipartFile resume) {
        User applicant = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // Check for existing application
        com.collabpro.model.ProjectApplication existingApp = applicationRepository
                .findByProjectIdAndApplicantId(projectId, applicant.getId())
                .orElse(null);

        String resumeFilename = resume != null ? resume.getOriginalFilename() : null;

        ProjectApplication applicationToSave;

        if (existingApp != null) {
            ProjectApplication.ApplicationStatus status = existingApp.getStatus();

            // Allow re-application only if HIRED, REJECTED, or REMOVED
            if (status == ProjectApplication.ApplicationStatus.PENDING ||
                    status == ProjectApplication.ApplicationStatus.REVIEWING ||
                    status == ProjectApplication.ApplicationStatus.SHORTLISTED ||
                    status == ProjectApplication.ApplicationStatus.OFFERED) {
                throw new RuntimeException("You have already applied to this project");
            }

            // If Hired, remove from project members before resetting application
            if (status == ProjectApplication.ApplicationStatus.HIRED) {
                project.getProjectMembers().removeIf(pm -> pm.getUser().getId().equals(applicant.getId()));
                projectRepository.save(project);
            }

            // Reset application to PENDING
            existingApp.setStatus(ProjectApplication.ApplicationStatus.PENDING);
            existingApp.setCoverLetter(coverLetter);
            existingApp.setResumeFilename(resumeFilename);
            existingApp.setInterviewDate(null);
            existingApp.setInterviewTime(null);
            existingApp.setJoinedAt(null);

            applicationToSave = applicationRepository.save(existingApp);
        } else {
            // New Application
            ProjectApplication application = ProjectApplication.builder()
                    .project(project)
                    .applicant(applicant)
                    .coverLetter(coverLetter)
                    .resumeFilename(resumeFilename)
                    .status(ProjectApplication.ApplicationStatus.PENDING)
                    .build();

            applicationToSave = applicationRepository.save(application);
        }

        // Handle File Upload if resume is present
        if (resume != null && !resume.isEmpty()) {
            try {
                String uploadDir = "uploads/applications/" + applicationToSave.getId() + "/";
                Path uploadPath = Paths.get(uploadDir);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                // Use timestamp to avoid cache issues or collisions
                String cleanFilename = System.currentTimeMillis() + "_" + resume.getOriginalFilename().replaceAll("\\s+", "_");
                Path filePath = uploadPath.resolve(cleanFilename);
                Files.copy(resume.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                
                // Update DB with the actual saved filename
                applicationToSave.setResumeFilename(cleanFilename);
                applicationRepository.save(applicationToSave);

            } catch (IOException e) {
                throw new RuntimeException("Failed to store resume file", e);
            }
        }

        // Notify Applicant
        notificationService.createNotification(
                applicant.getId(),
                "Application submitted successfully for '" + project.getTitle() + "'",
                "INFO");

        // Notify Manager
        notificationService.createNotification(
                project.getCreatedBy().getId(),
                "New application received for '" + project.getTitle() + "' from " + applicant.getName(),
                "INFO");
    }

    @Transactional(readOnly = true)
    public java.util.List<java.util.Map<String, Object>> getMyApplications(String userEmail) {
        try {
            User applicant = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            return applicationRepository.findByApplicantId(applicant.getId()).stream()
                    .filter(app -> app.getStatus() != ProjectApplication.ApplicationStatus.REJECTED)
                    .map(app -> {
                        java.util.Map<String, Object> map = new java.util.HashMap<>();
                        map.put("projectId", app.getProject().getId());
                        map.put("applicationId", app.getId());

                        String status;
                        if (app.getStatus() == ProjectApplication.ApplicationStatus.PENDING)
                            status = "applicants";
                        else if (app.getStatus() == ProjectApplication.ApplicationStatus.REVIEWING)
                            status = "invited";
                        else if (app.getStatus() == ProjectApplication.ApplicationStatus.SHORTLISTED)
                            status = "offered";
                        else if (app.getStatus() == ProjectApplication.ApplicationStatus.OFFERED)
                            status = "offered";
                        else if (app.getStatus() == ProjectApplication.ApplicationStatus.HIRED)
                            status = "hired";
                        else
                            status = app.getStatus().name().toLowerCase();

                        map.put("status", status);
                        
                        // Add interview details if they exist
                        if (app.getInterviewDate() != null || app.getInterviewTime() != null) {
                            java.util.Map<String, String> interview = new java.util.HashMap<>();
                            if (app.getInterviewDate() != null)
                                interview.put("date", app.getInterviewDate());
                            if (app.getInterviewTime() != null)
                                interview.put("time", app.getInterviewTime());
                            map.put("interview", interview);
                        }
                        
                        return map;
                    })
                    .collect(java.util.stream.Collectors.toList());
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    @Transactional(readOnly = true)
    public java.util.List<com.collabpro.dto.CandidateDTO> getProjectCandidates(Long projectId, String userEmail) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        boolean isOwner = project.getCreatedBy().getEmail().equals(userEmail);

        java.util.List<ProjectApplication> applications = applicationRepository.findByProjectId(projectId);

        // If not owner, filter to only show HIRED members (Team View)
        if (!isOwner) {
            return applications.stream()
                    .filter(app -> app.getStatus() == ProjectApplication.ApplicationStatus.HIRED)
                    .map(this::mapToCandidateDTO)
                    .collect(java.util.stream.Collectors.toList());
        }

        // If owner, show all candidates (Manager View)
        return applications.stream()
                .map(this::mapToCandidateDTO)
                .collect(java.util.stream.Collectors.toList());
    }

    @Transactional
    public void updateApplicationStatus(Long projectId, Long applicationId, String statusStr,
            java.util.Map<String, String> interviewDetails, String userEmail) {
        ProjectApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!application.getProject().getId().equals(projectId)) {
            throw new RuntimeException("Application does not belong to this project");
        }

        if (!application.getProject().getCreatedBy().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized: You are not the owner of this project");
        }

        String normalizedStatus = statusStr.trim();
        System.out.println("DEBUG: Updating application " + applicationId + " status to " + normalizedStatus);

        if (normalizedStatus.equalsIgnoreCase("applicants"))
            application.setStatus(ProjectApplication.ApplicationStatus.PENDING);
        else if (normalizedStatus.equalsIgnoreCase("invited"))
            application.setStatus(ProjectApplication.ApplicationStatus.REVIEWING);
        else if (normalizedStatus.equalsIgnoreCase("offered") || normalizedStatus.equalsIgnoreCase("shortlisted"))
            application.setStatus(ProjectApplication.ApplicationStatus.OFFERED);
        else if (normalizedStatus.equalsIgnoreCase("hired")) {
            if (application.getStatus() != ProjectApplication.ApplicationStatus.HIRED) {
                application.setJoinedAt(java.time.LocalDateTime.now());
            }
            application.setStatus(ProjectApplication.ApplicationStatus.HIRED);
        } else if (normalizedStatus.equalsIgnoreCase("rejected"))
            application.setStatus(ProjectApplication.ApplicationStatus.REJECTED);
        else {
            System.err.println("DEBUG: Unknown status string: " + normalizedStatus);
            throw new RuntimeException("Invalid status: " + normalizedStatus);
        }

        if (interviewDetails != null) {
            if (interviewDetails.containsKey("date"))
                application.setInterviewDate(interviewDetails.get("date"));
            if (interviewDetails.containsKey("time"))
                application.setInterviewTime(interviewDetails.get("time"));
        }

        applicationRepository.save(application);

        // Notify Applicant about status change
        if (normalizedStatus.equalsIgnoreCase("invited")) {
            notificationService.createNotification(
                    application.getApplicant().getId(),
                    "You have been invited to interview for '" + application.getProject().getTitle() + "'",
                    "INFO");
        } else if (normalizedStatus.equalsIgnoreCase("offered") || normalizedStatus.equalsIgnoreCase("shortlisted")) {
            notificationService.createNotification(
                    application.getApplicant().getId(),
                    "You have received an offer for '" + application.getProject().getTitle() + "'",
                    "INFO");
        } else if (normalizedStatus.equalsIgnoreCase("rejected")) {
            notificationService.createNotification(
                    application.getApplicant().getId(),
                    "Your application for '" + application.getProject().getTitle() + "' was not successful",
                    "INFO");
        }
    }

    @Transactional
    public void acceptOffer(Long projectId, Long applicationId, String userEmail) {
        ProjectApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!application.getProject().getId().equals(projectId)) {
            throw new RuntimeException("Application does not belong to this project");
        }

        if (!application.getApplicant().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized: You are not the applicant");
        }

        if (application.getStatus() != ProjectApplication.ApplicationStatus.OFFERED &&
                application.getStatus() != ProjectApplication.ApplicationStatus.SHORTLISTED) {
            throw new RuntimeException("Application is not in OFFERED state");
        }

        application.setStatus(ProjectApplication.ApplicationStatus.HIRED);
        application.setJoinedAt(java.time.LocalDateTime.now());
        applicationRepository.save(application);

        Project project = application.getProject();
        com.collabpro.model.ProjectMember member = com.collabpro.model.ProjectMember.builder()
                .parentProject(project)
                .user(application.getApplicant())
                .joinedAt(application.getJoinedAt())
                .build();
        project.getProjectMembers().add(member);
        // Duplicate line removed
        System.out.println("DEBUG: Adding member " + application.getApplicant().getEmail() + " to project " + projectId);
        projectRepository.save(project);

        // Notify Applicant
        notificationService.createNotification(
                application.getApplicant().getId(),
                "You have accepted the offer for '" + project.getTitle() + "'",
                "INFO");

        // Notify Manager
        notificationService.createNotification(
                project.getCreatedBy().getId(),
                "Offer accepted by " + application.getApplicant().getName() + " for '" + project.getTitle() + "'",
                "INFO");
    }

    @Transactional
    public void rejectOffer(Long projectId, Long applicationId, String userEmail) {
        ProjectApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!application.getProject().getId().equals(projectId)) {
            throw new RuntimeException("Application does not belong to this project");
        }

        if (!application.getApplicant().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized: You are not the applicant");
        }

        if (application.getStatus() != ProjectApplication.ApplicationStatus.OFFERED &&
                application.getStatus() != ProjectApplication.ApplicationStatus.SHORTLISTED) {
            throw new RuntimeException("Application is not in OFFERED state");
        }

        application.setStatus(ProjectApplication.ApplicationStatus.REJECTED);
        applicationRepository.save(application);
    }

    @Transactional(readOnly = true)
    public Resource getResume(Long applicationId, String userEmail) {
        ProjectApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        // Check ownership (Applicant or Project Manager)
        boolean isApplicant = application.getApplicant().getEmail().equals(userEmail);
        boolean isManager = application.getProject().getCreatedBy().getEmail().equals(userEmail);

        if (!isApplicant && !isManager) {
            throw new RuntimeException("Unauthorized: You do not have permission to view this resume");
        }

        if (application.getResumeFilename() == null) {
            throw new RuntimeException("No resume found for this application");
        }

        try {
            Path filePath = Paths.get("uploads/applications/" + applicationId + "/" + application.getResumeFilename());
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("Could not read file: " + application.getResumeFilename());
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }

    private final com.collabpro.repository.ProfileRepository profileRepository;

    private com.collabpro.dto.CandidateDTO mapToCandidateDTO(ProjectApplication app) {
        com.collabpro.dto.CandidateDTO dto = new com.collabpro.dto.CandidateDTO();
        dto.setId(app.getId());
        dto.setUserId(app.getApplicant().getId());
        dto.setName(app.getApplicant().getName());
        dto.setEmail(app.getApplicant().getEmail());
        dto.setRole("Freelancer");
        dto.setCompany("Self-Employed");
        dto.setMatch("Pending");
        dto.setRate("Negotiable");

        if (app.getStatus() == ProjectApplication.ApplicationStatus.PENDING)
            dto.setStatus("applicants");
        else if (app.getStatus() == ProjectApplication.ApplicationStatus.REVIEWING)
            dto.setStatus("invited");
        else if (app.getStatus() == ProjectApplication.ApplicationStatus.SHORTLISTED)
            dto.setStatus("offered");
        else if (app.getStatus() == ProjectApplication.ApplicationStatus.OFFERED)
            dto.setStatus("offered");
        else if (app.getStatus() == ProjectApplication.ApplicationStatus.HIRED)
            dto.setStatus("hired");
        else
            dto.setStatus(app.getStatus().name().toLowerCase());

        dto.setImageIndex((int) (app.getApplicant().getId() % 5));
        dto.setSkills(java.util.Collections.singletonList("Motivation"));
        dto.setDescription(app.getCoverLetter());
        dto.setExperience("N/A");
        dto.setLocation("Remote");
        dto.setPhone("N/A");
        if (app.getResumeFilename() != null) {
            dto.setResume(app.getResumeFilename());
            // Construct dynamic controller URL
            dto.setResumeUrl("/api/applications/" + app.getId() + "/resume");
        } else {
            dto.setResume(null);
            dto.setResumeUrl(null);
        }
        dto.setAbout("Applicant for project " + app.getProject().getTitle());

        // Fetch Profile Data
        if (app.getApplicant().getProfileId() != null) {
            profileRepository.findById(app.getApplicant().getProfileId())
                    .ifPresent(profile -> {
                        dto.setProfileImage(profile.getProfileImage());
                        // Can also fetch phone, skills etc from profile here!
                        if (profile.getSkills() != null && !profile.getSkills().isEmpty()) {
                            dto.setSkills(profile.getSkills());
                        }
                        if (profile.getPhone() != null && !profile.getPhone().isEmpty()) {
                            dto.setPhone(profile.getPhone());
                        }
                        // Experiences -> Experience string?
                    });
        }

        if (app.getJoinedAt() != null) {
            java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter
                    .ofPattern("MMM d, yyyy, h:mm a", java.util.Locale.ENGLISH);
            dto.setJoinedDate(app.getJoinedAt().format(formatter));
        }

        if (app.getInterviewDate() != null || app.getInterviewTime() != null) {
            java.util.Map<String, String> interview = new java.util.HashMap<>();
            if (app.getInterviewDate() != null)
                interview.put("date", app.getInterviewDate());
            if (app.getInterviewTime() != null)
                interview.put("time", app.getInterviewTime());
            dto.setInterview(interview);
        }
        return dto;
    }
}
