package com.hirestories.interview.repository;

import com.hirestories.interview.entity.Resource;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResourceRepository extends JpaRepository<Resource, Long> {
    List<Resource> findAllByOrderByCreatedAtDesc();
}
