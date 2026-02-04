package com.collabpro.repository;

import com.collabpro.model.ProjectApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectApplicationRepository extends JpaRepository<ProjectApplication, Long> {
    boolean existsByProjectIdAndApplicantId(Long projectId, Long applicantId);

    List<ProjectApplication> findByProjectId(Long projectId);

    List<ProjectApplication> findByApplicantId(Long applicantId);

    Optional<ProjectApplication> findByProjectIdAndApplicantId(Long projectId, Long applicantId);
}
