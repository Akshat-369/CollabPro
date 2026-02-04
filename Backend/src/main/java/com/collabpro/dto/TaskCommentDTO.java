package com.collabpro.dto;

import lombok.Data;

@Data
public class TaskCommentDTO {
    private String id;
    private String user;
    private String avatar;
    private String text;
    private String time;
}
