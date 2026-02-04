package com.collabpro.dto;

import lombok.Data;
import java.util.List;

@Data
public class CandidateDTO {
    private Long id;
    private Long userId;
    private String name;
    private String role;
    private String company;
    private String match;
    private String rate;
    private String status;
    private Integer imageIndex;
    private List<String> skills;
    private String description;
    private String experience;
    private String location;
    private String email;
    private String phone;
    private String resume;
    private String resumeUrl;
    private String coverImage;
    private String about;
    private String joinedDate;
    private java.util.Map<String, String> interview;
    private String profileImage;
}
