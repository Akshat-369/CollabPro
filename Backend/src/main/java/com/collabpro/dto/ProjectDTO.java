package com.collabpro.dto;

import lombok.Data;
import java.util.List;

@Data
public class ProjectDTO {
    private String id; // Frontend works with strings
    private String title;
    private String location;
    private String price;
    private String experience;
    private String projectType;
    private String status;
    private String description;
    @com.fasterxml.jackson.annotation.JsonProperty("longDescription")
    private String longDescription;
    private String aboutProject; // Mapping alias
    private List<String> tags;
    private List<String> requirements;
    private String company; // To return the user name
    private boolean postedByMe;
    private String postedAgo;
    private int applicants;
    private int membersCount;
    private int incompleteTasksCount;
}
