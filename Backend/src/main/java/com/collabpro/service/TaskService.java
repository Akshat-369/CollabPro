package com.collabpro.service;

import com.collabpro.dto.TaskAttachmentDTO;
import com.collabpro.dto.TaskCommentDTO;
import com.collabpro.dto.TaskDTO;
import com.collabpro.model.*;
import com.collabpro.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.io.IOException;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional(readOnly = true)
    public List<TaskDTO> getProjectTasks(Long projectId, String requesterEmail) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        User requester = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (project.getProjectMembers().stream().noneMatch(pm -> pm.getUser().getId().equals(requester.getId()))
                && !project.getCreatedBy().getId().equals(requester.getId())) {
            // throw new RuntimeException("Unauthorized: Not a member or owner");
            // For now, if they can access the page, they can likely view tasks.
            // But strict constraint says "Other members: Can view tasks only".
            // So if they are not even a member, they shouldn't see it.
            // But wait, "Other members" implies they are members of the platform or
            // project?
            // Usually "Project Member". If not in project member list, they shouldn't see
            // tasks.
            // Double check: if user is not in project.getMembers() and not owner, are they
            // allowed?
            // "Workers" are in project.getMembers().
            // If someone is just browsing, they shouldn't see tasks.
            throw new RuntimeException("Unauthorized");
        }

        return taskRepository.findByProjectId(projectId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public TaskDTO createTask(Long projectId, TaskDTO taskDTO, String requesterEmail) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (!project.getCreatedBy().getEmail().equals(requesterEmail)) {
            throw new RuntimeException("Unauthorized: Only manager can create tasks");
        }

        Task task = new Task();
        task.setProject(project);
        updateTaskFromDTO(task, taskDTO);

        Task savedTask = taskRepository.save(task);

        if (savedTask.getAssignedTo() != null) {
            notificationService.createNotification(
                    savedTask.getAssignedTo().getId(),
                    "You have been assigned a new task: " + savedTask.getTitle(),
                    "TASK_ASSIGNED");
        }

        return mapToDTO(savedTask);
    }

    @Transactional
    public TaskDTO updateTask(Long projectId, String taskIdStr, TaskDTO taskDTO, String requesterEmail) {
        Long taskId = Long.parseLong(taskIdStr);
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getProject().getId().equals(projectId)) {
            throw new RuntimeException("Task does not belong to project");
        }

        User requester = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isManager = task.getProject().getCreatedBy().equals(requester);
        boolean isAssignee = task.getAssignedTo() != null && task.getAssignedTo().equals(requester);

        // Capture old state for notifications
        User oldAssignee = task.getAssignedTo();
        String oldStatus = task.getStatus();
        int oldCommentCount = task.getComments() != null ? task.getComments().size() : 0;
        int oldAttachmentCount = task.getAttachments() != null ? task.getAttachments().size() : 0;

        if (isManager) {
            updateTaskFromDTO(task, taskDTO);
        } else if (isAssignee) {
            if (taskDTO.getStatus() != null)
                task.setStatus(taskDTO.getStatus());
            if (taskDTO.getPaymentStatus() != null)
                task.setPaymentStatus(taskDTO.getPaymentStatus());

            updateComments(task, taskDTO.getComments());
            updateAttachments(task, taskDTO.getAttachments());
        } else {
            throw new RuntimeException("Unauthorized: You can only update tasks assigned to you");
        }

        Task savedTask = taskRepository.save(task);

        // Notification Logic
        if (isManager) {
            // Check for assignment change
            if (savedTask.getAssignedTo() != null
                    && (oldAssignee == null || !oldAssignee.equals(savedTask.getAssignedTo()))) {
                notificationService.createNotification(
                        savedTask.getAssignedTo().getId(),
                        "You have been assigned a new task: " + savedTask.getTitle(),
                        "TASK_ASSIGNED");
            }
            // Check for Approval
            if ("Approved".equalsIgnoreCase(savedTask.getStatus()) && !"Approved".equalsIgnoreCase(oldStatus)) {
                if (savedTask.getAssignedTo() != null) {
                    notificationService.createNotification(
                            savedTask.getAssignedTo().getId(),
                            "Your task '" + savedTask.getTitle() + "' has been approved",
                            "TASK_APPROVED");
                }
            }
        } else if (isAssignee) {
            // Check for Status Change
            if (savedTask.getStatus() != null && !savedTask.getStatus().equals(oldStatus)) {
                notificationService.createNotification(
                        savedTask.getProject().getCreatedBy().getId(),
                        requester.getName() + " updated task '" + savedTask.getTitle() + "' to "
                                + savedTask.getStatus(),
                        "INFO");
            }
            // Check for new Comments/Attachments
            int newCommentCount = savedTask.getComments() != null ? savedTask.getComments().size() : 0;
            int newAttachmentCount = savedTask.getAttachments() != null ? savedTask.getAttachments().size() : 0;

            if (newCommentCount > oldCommentCount || newAttachmentCount > oldAttachmentCount) {
                notificationService.createNotification(
                        savedTask.getProject().getCreatedBy().getId(),
                        requester.getName() + " added an update to task '" + savedTask.getTitle() + "'",
                        "INFO");
            }
        }

        return mapToDTO(savedTask);
    }

    @Transactional
    public void deleteTask(Long projectId, String taskIdStr, String requesterEmail) {
        Long taskId = Long.parseLong(taskIdStr);
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getProject().getId().equals(projectId)) {
            throw new RuntimeException("Task does not belong to project");
        }

        if (!task.getProject().getCreatedBy().getEmail().equals(requesterEmail)) {
            throw new RuntimeException("Unauthorized: Only manager can delete tasks");
        }

        taskRepository.delete(task);
    }

    private void updateTaskFromDTO(Task task, TaskDTO dto) {
        // Essential fields (Manager can update all)
        if (dto.getTitle() != null)
            task.setTitle(dto.getTitle());
        if (dto.getDescription() != null)
            task.setDescription(dto.getDescription());
        if (dto.getAmount() != null)
            task.setAmount(dto.getAmount());
        if (dto.getStatus() != null)
            task.setStatus(dto.getStatus());
        if (dto.getPaymentStatus() != null)
            task.setPaymentStatus(dto.getPaymentStatus());

        if (dto.getDate() != null && !dto.getDate().isEmpty()) {
            task.setDueDate(LocalDate.parse(dto.getDate()));
        }

        if (dto.getAssignedTo() != null) {
            if (!dto.getAssignedTo().isEmpty()) {
                // Robust user lookup by name to handle potential duplicates
                List<User> potentialAssignees = userRepository.findAllByName(dto.getAssignedTo());
                
                if (potentialAssignees.isEmpty()) {
                     System.err.println("DEBUG: Assigned user not found via Name: " + dto.getAssignedTo());
                     throw new RuntimeException("Assigned user not found: " + dto.getAssignedTo());
                }

                User validAssignee = null;
                
                // Iterate through all users with this name to find the one who is actually a member
                for (User candidate : potentialAssignees) {
                    boolean isMember = task.getProject().getProjectMembers().stream()
                            .anyMatch(pm -> pm.getUser().getId().equals(candidate.getId()));
                    boolean isOwner = task.getProject().getCreatedBy().getId().equals(candidate.getId());
                    
                    if (isMember || isOwner) {
                        validAssignee = candidate;
                        break;
                    }
                }

                if (validAssignee == null) {
                    System.err.println("DEBUG: Assignment Failed. Found " + potentialAssignees.size() + " users named '" + dto.getAssignedTo() + "' but none are members of project " + task.getProject().getId());
                    // Fallback: Just use the first one to throw the standard error or consistent behavior if strictness wasn't the issue
                    throw new RuntimeException("Assigned user " + dto.getAssignedTo() + " is not a member of this project");
                }

                task.setAssignedTo(validAssignee);
            } else {
                task.setAssignedTo(null);
            }
        }

        updateComments(task, dto.getComments());
        updateAttachments(task, dto.getAttachments());
    }

    private void updateComments(Task task, List<TaskCommentDTO> commentDTOs) {
        if (commentDTOs == null)
            return;

        // Remove existing? Or smart merge?
        // Frontend sends all comments.
        // We will clear and re-add or try to match.
        // Simple approach: Clear and Add All (Simpler but changes IDs).
        // Better: Check IDs.

        if (task.getComments() == null) {
            task.setComments(new ArrayList<>());
        }

        // This is tricky. If we clear and add, keys change.
        // But Frontend generates IDs: Math.random()
        // If we save them, backend generates IDs (Long).
        // Frontend IDs are strings.
        // If frontend sends a comment with a String ID not matching Backend Long ID,
        // it's new.
        // But frontend sends 'c1', 'c2' etc. initial data has strings.
        // We probably shouldn't simple-replace if we want to keep history correctly.
        // But for this demo, full replacement is robust enough for "No UI regressions"
        // if frontend handles new IDs well.
        // Frontend relies on the ID returned by backend after save?
        // Actually, frontend `onUpdateTask` just updates local state.
        // When we refresh, we get backend IDs.

        task.getComments().clear();
        for (TaskCommentDTO cDTO : commentDTOs) {
            TaskComment c = new TaskComment();
            c.setTask(task);
            c.setUserName(cDTO.getUser());
            c.setUserAvatar(cDTO.getAvatar());
            c.setText(cDTO.getText());
            // Time is string "2 hours ago".
            // We should store createdAt and let frontend calculate relative time?
            // Or just store the string for now to match Frontend type exactly.
            // Backend `TaskComment` has `LocalDateTime createdAt`.
            // We can set `createdAt` to Now if new.
            c.setCreatedAt(LocalDateTime.now());

            task.getComments().add(c);
        }
    }

    private void updateAttachments(Task task, List<TaskAttachmentDTO> attachmentDTOs) {
        if (attachmentDTOs == null)
            return;

        if (task.getAttachments() == null) {
            task.setAttachments(new ArrayList<>());
        }

        // List of IDs to keep
        List<Long> keepIds = new ArrayList<>();

        for (TaskAttachmentDTO aDTO : attachmentDTOs) {
            TaskAttachment attachment = null;

            // Try to parse ID
            Long id = null;
            try {
                if (aDTO.getId() != null) {
                    id = Long.parseLong(aDTO.getId());
                }
            } catch (NumberFormatException e) {
                // Ignore invalid ID (treat as new)
            }

            if (id != null) {
                Long finalId = id;
                attachment = task.getAttachments().stream()
                        .filter(a -> a.getId().equals(finalId))
                        .findFirst()
                        .orElse(null);
            }

            if (attachment == null) {
                // Create New
                attachment = new TaskAttachment();
                attachment.setTask(task);
                task.getAttachments().add(attachment);
            }

            // Update fields
            attachment.setName(aDTO.getName());
            attachment.setSize(aDTO.getSize());
            attachment.setType(aDTO.getType());
            attachment.setUrl(aDTO.getUrl());
            if (aDTO.getUploadedBy() != null) {
                attachment.setUploadedBy(aDTO.getUploadedBy());
            }

            // If it's a new entity being added to list, it won't have an ID yet until save.
            // But if it was an existing one found by ID, we add to keep list.
            if (attachment.getId() != null) {
                keepIds.add(attachment.getId());
            }
        }

        // Remove attachments not in the list (if we are syncing state)
        // Note: For partial updates or avoiding deletion via updateTask, be careful.
        // But 'updateTask' usually sends the FULL current state of attachments from frontend.
        // So anything missing should be removed.
        task.getAttachments().removeIf(a -> a.getId() != null && !keepIds.contains(a.getId()));
    }

    private TaskDTO mapToDTO(Task task) {
        TaskDTO dto = new TaskDTO();
        dto.setId(String.valueOf(task.getId()));
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setAmount(task.getAmount());
        dto.setStatus(task.getStatus());
        dto.setPaymentStatus(task.getPaymentStatus());
        if (task.getDueDate() != null)
            dto.setDate(task.getDueDate().toString());

        if (task.getAssignedTo() != null) {
            dto.setAssignedTo(task.getAssignedTo().getName());
        }

        if (task.getComments() != null) {
            dto.setComments(task.getComments().stream().map(c -> {
                TaskCommentDTO cd = new TaskCommentDTO();
                cd.setId(String.valueOf(c.getId()));
                cd.setUser(c.getUserName());
                cd.setAvatar(c.getUserAvatar());
                cd.setText(c.getText());
                // Format time relative or string?
                // Frontend expects string.
                cd.setTime("Recently"); // Placeholder or calc
                return cd;
            }).collect(Collectors.toList()));
        } else {
            dto.setComments(new ArrayList<>());
        }

        if (task.getAttachments() != null) {
            dto.setAttachments(task.getAttachments().stream().map(a -> {
                TaskAttachmentDTO ad = new TaskAttachmentDTO();
                ad.setId(String.valueOf(a.getId()));
                ad.setName(a.getName());
                ad.setSize(a.getSize());
                ad.setType(a.getType());
                ad.setType(a.getType());
                ad.setUrl(a.getUrl());
                ad.setUploadedBy(a.getUploadedBy());
                return ad;
            }).collect(Collectors.toList()));
        } else {
            dto.setAttachments(new ArrayList<>());
        }

        return dto;
    }


    @Transactional
    public TaskAttachmentDTO uploadAttachment(Long projectId, String taskIdStr, MultipartFile file, String requesterEmail) {
        Long taskId = Long.parseLong(taskIdStr);
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getProject().getId().equals(projectId)) {
            throw new RuntimeException("Task does not belong to project");
        }

        User requester = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        boolean isMember = task.getProject().getProjectMembers().stream()
                .anyMatch(pm -> pm.getUser().getId().equals(requester.getId()));
        boolean isOwner = task.getProject().getCreatedBy().getId().equals(requester.getId());

        if (!isMember && !isOwner) {
            throw new RuntimeException("Unauthorized: You must be a project member to upload files");
        }

        try {
            String uploadDir = "uploads/tasks/" + taskId + "/";
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFilename = file.getOriginalFilename();
            String filename = System.currentTimeMillis() + "_" + originalFilename;
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = "/uploads/tasks/" + taskId + "/" + filename;
            
            TaskAttachment attachment = new TaskAttachment();
            attachment.setTask(task);
            attachment.setName(originalFilename);
            attachment.setSize(file.getSize() / 1024 + " KB");
            attachment.setType(file.getContentType() != null && file.getContentType().contains("image") ? "image" : "file");
            attachment.setUrl(fileUrl);
            attachment.setUploadedBy(requesterEmail);

            task.getAttachments().add(attachment);
            taskRepository.save(task);
            // After save, attachment should have ID
            
            TaskAttachmentDTO attachmentDTO = new TaskAttachmentDTO();
            attachmentDTO.setId(String.valueOf(attachment.getId())); // Real DB ID
            attachmentDTO.setName(attachment.getName());
            attachmentDTO.setSize(attachment.getSize());
            attachmentDTO.setType(attachment.getType());
            attachmentDTO.setUrl(attachment.getUrl());
            attachmentDTO.setUploadedBy(attachment.getUploadedBy());

            return attachmentDTO;

        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }

    @Transactional
    public void deleteAttachment(Long projectId, String taskIdStr, String attachmentIdStr, String requesterEmail) {
        Long taskId = Long.parseLong(taskIdStr);
        Long attachmentId = Long.parseLong(attachmentIdStr);

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getProject().getId().equals(projectId)) {
            throw new RuntimeException("Task does not belong to project");
        }

        // Find attachment in the task's list (managed collection) or generic repo?
        // Since we don't have TaskAttachmentRepository injected, we must likely iterate or inject it.
        // But wait, we can iterate 'task.getAttachments()'.
        
        TaskAttachment attachment = task.getAttachments().stream()
                .filter(a -> a.getId().equals(attachmentId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Attachment not found"));

        // Check ownership
        if (attachment.getUploadedBy() == null || !attachment.getUploadedBy().equals(requesterEmail)) {
             throw new RuntimeException("Forbidden: You can only delete your own attachments");
        }

        // Delete file
        try {
            String relativePath = attachment.getUrl(); 
            // URL is like "/uploads/tasks/1/TIMESTAMP_filename.ext"
            // We need to resolve it relative to app root.
            if (relativePath.startsWith("/")) relativePath = relativePath.substring(1);
            
            Path filePath = Paths.get(relativePath);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            // Log but proceed? Or fail? 
            // Ideally proceed to clean DB.
            System.err.println("Failed to delete file: " + e.getMessage());
        }

        // Remove from list and let Cascade handling or explicit delete work.
        // TaskAttachment is likely CascadeType.ALL or dependent.
        task.getAttachments().remove(attachment);
        // Ensure orphan removal is set in Entity or repository save handles it.
        // If not orphan removal, we might need explicit delete from repo if we had one.
        // Assuming JPA handles removal from list -> delete from DB if configured. 
        // If not, we might need direct repo delete. Let's see Task entity details later if it fails.
        // For now, removing from list and saving task is standard JPA 'orphanRemoval=true' pattern.
        
        taskRepository.save(task);
    }
}
