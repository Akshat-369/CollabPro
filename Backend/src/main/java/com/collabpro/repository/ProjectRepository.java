package com.collabpro.repository;

import com.collabpro.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByCreatedBy_Email(String email);

    List<Project> findByStatus(String status);
}
