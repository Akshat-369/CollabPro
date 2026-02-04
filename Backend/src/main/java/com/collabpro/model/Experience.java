package com.collabpro.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "profile_experiences")
public class Experience {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String role;
    private String company;
    private String location;
    private String date; // e.g. "Jan 2020 - Present"

    @Column(length = 2000)
    private String description;
    
    private String logo;

    // Helper method to update fields from another instance
    public void updateFrom(Experience other) {
        if (other.role != null) this.role = other.role;
        if (other.company != null) this.company = other.company;
        if (other.location != null) this.location = other.location;
        if (other.date != null) this.date = other.date;
        if (other.description != null) this.description = other.description;
        if (other.logo != null) this.logo = other.logo;
    }
}
