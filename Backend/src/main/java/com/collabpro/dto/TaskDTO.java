package com.collabpro.dto;

import lombok.Data;
import java.util.List;

@Data
public class TaskDTO {
    private String id; // Frontend uses string IDs. We will convert or use String to match.
    // Actually backend ID is Long. I'll use String in DTO for compatibility.
    private String title;
    private String description;
    private String amount;
    private String status;
    private String date;
    private String assignedTo;
    private List<TaskCommentDTO> comments;
    private List<TaskAttachmentDTO> attachments;
    private String paymentStatus;
}
