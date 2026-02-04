package com.collabpro.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "project_applications", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "project_id", "applicant_id" })
})
public class ProjectApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "applicant_id", nullable = false)
    private User applicant;

    @Column(columnDefinition = "TEXT")
    private String coverLetter;

    private String resumeFilename;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "VARCHAR(50)")
    private ApplicationStatus status;

    private String interviewDate;
    private String interviewTime;

    @Column(nullable = false)
    private LocalDateTime appliedAt;

    private LocalDateTime joinedAt;

    @PrePersist
    protected void onCreate() {
        appliedAt = LocalDateTime.now();
        if (status == null) {
            status = ApplicationStatus.PENDING;
        }
    }

    public enum ApplicationStatus {
        PENDING,
        REVIEWING,
        SHORTLISTED,
        OFFERED,
        REJECTED,
        HIRED,
        REMOVED
    }
}
