package com.collabpro.repository;

import com.collabpro.model.ProjectMember;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {
    Optional<ProjectMember> findByParentProjectIdAndUserId(Long projectId, Long userId);

    void deleteByParentProjectIdAndUserId(Long projectId, Long userId);
}
