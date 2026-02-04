package com.collabpro.dto;

import lombok.Data;

@Data
public class TaskAttachmentDTO {
    private String id;
    private String name;
    private String size;
    private String type;
    private String url;
    private String uploadedBy;
}
