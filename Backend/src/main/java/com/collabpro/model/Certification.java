package com.collabpro.model;

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
@Table(name = "profile_certifications")
public class Certification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long dbId; // Database ID

    private String name;
    private String issuer;
    private String issueDate;
    
    // This maps to the 'id' field in frontend type Certification which is likely credential ID
    private String id; 
    
    private String logo;

    public void updateFrom(Certification other) {
        if (other.name != null) this.name = other.name;
        if (other.issuer != null) this.issuer = other.issuer;
        if (other.issueDate != null) this.issueDate = other.issueDate;
        if (other.id != null) this.id = other.id;
        if (other.logo != null) this.logo = other.logo;
    }
}
