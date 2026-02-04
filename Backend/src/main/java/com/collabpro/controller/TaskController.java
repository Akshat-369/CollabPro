package com.collabpro.controller;

import com.collabpro.dto.TaskDTO;
import com.collabpro.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/projects/{projectId}/tasks")
@RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;

    @PostMapping("/{taskId}/attachments")
    public ResponseEntity<com.collabpro.dto.TaskAttachmentDTO> uploadAttachment(
            @PathVariable Long projectId,
            @PathVariable String taskId,
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file,
            Principal principal) {
        if (principal == null)
            return ResponseEntity.status(401).build();
        return ResponseEntity.ok(taskService.uploadAttachment(projectId, taskId, file, principal.getName()));
    }

    @DeleteMapping("/{taskId}/attachments/{attachmentId}")
    public ResponseEntity<Void> deleteAttachment(
            @PathVariable Long projectId,
            @PathVariable String taskId,
            @PathVariable String attachmentId,
            Principal principal) {
        if (principal == null)
            return ResponseEntity.status(401).build();
        taskService.deleteAttachment(projectId, taskId, attachmentId, principal.getName());
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<TaskDTO>> getTasks(@PathVariable Long projectId, Principal principal) {
        if (principal == null)
            return ResponseEntity.status(401).build();
        return ResponseEntity.ok(taskService.getProjectTasks(projectId, principal.getName()));
    }

    @PostMapping
    public ResponseEntity<TaskDTO> createTask(@PathVariable Long projectId, @RequestBody TaskDTO taskDTO,
            Principal principal) {
        if (principal == null)
            return ResponseEntity.status(401).build();
        return ResponseEntity.ok(taskService.createTask(projectId, taskDTO, principal.getName()));
    }

    @PatchMapping("/{taskId}")
    public ResponseEntity<TaskDTO> updateTask(@PathVariable Long projectId, @PathVariable String taskId,
            @RequestBody TaskDTO taskDTO, Principal principal) {
        if (principal == null)
            return ResponseEntity.status(401).build();
        return ResponseEntity.ok(taskService.updateTask(projectId, taskId, taskDTO, principal.getName()));
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long projectId, @PathVariable String taskId,
            Principal principal) {
        if (principal == null)
            return ResponseEntity.status(401).build();
        taskService.deleteTask(projectId, taskId, principal.getName());
        return ResponseEntity.ok().build();
    }
}
