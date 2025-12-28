package com.hirestories.interview.repository;

import com.hirestories.interview.entity.Interview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InterviewRepository extends JpaRepository<Interview, Long> {

    // Basic search/filter - can be improved with Specifications later
    List<Interview> findByCompanyContainingIgnoreCase(String company);

    List<Interview> findByJobRoleContainingIgnoreCase(String jobRole);

    List<Interview> findByExperienceRange(String experienceRange);

    // For sorting
    List<Interview> findAllByOrderByCreatedAtDesc();

    List<Interview> findAllByOrderByUpvoteCountDesc();
}
