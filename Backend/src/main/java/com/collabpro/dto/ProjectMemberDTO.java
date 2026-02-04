package com.collabpro.dto;

import lombok.Data;

@Data
public class ProjectMemberDTO {
    private Long id; // Application ID (for identification/removal)
    private String name;
    private String email;
    private String profileImage;
    private String joinedAt;
}
