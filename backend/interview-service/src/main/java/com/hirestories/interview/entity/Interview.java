package com.hirestories.interview.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "interviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String company;
    private String jobRole;
    private String experienceRange; // 0-1, 1-3, 3-5, 5+
    private String techStack; // Comma separated or just text

    @Column(columnDefinition = "TEXT")
    private String rounds; // JSON or long text description

    private String difficulty; // Easy, Medium, Hard
    private String result; // Selected, Rejected, Pending

    private String authorUsername; // Store username or ID from Auth Service

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "interview", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments;

    private int upvoteCount = 0;
}
