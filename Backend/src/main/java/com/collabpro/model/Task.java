package com.collabpro.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.time.LocalDate;

@Entity
@Table(name = "tasks")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String amount;
    private String status;
    private LocalDate dueDate;

    @ManyToOne
    @JoinColumn(name = "project_id")
    @lombok.ToString.Exclude
    @lombok.EqualsAndHashCode.Exclude
    private Project project;

    @ManyToOne
    @JoinColumn(name = "assigned_to_id")
    @lombok.ToString.Exclude
    @lombok.EqualsAndHashCode.Exclude
    private User assignedTo;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    @lombok.ToString.Exclude
    @lombok.EqualsAndHashCode.Exclude
    private List<TaskComment> comments;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    @lombok.ToString.Exclude
    @lombok.EqualsAndHashCode.Exclude
    private List<TaskAttachment> attachments;

    private String paymentStatus;
}
