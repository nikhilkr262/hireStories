package com.hirestories.interview.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "resources")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    @Enumerated(EnumType.STRING)
    private ResourceType type;

    // For URLs/Links
    private String contentUrl;

    // For Files (PDF/Doc) - storing as LOB for simplicity in this MVP
    @Lob
    @Column(length = 10000000) // Allow up to ~10MB
    @JsonIgnore
    private byte[] fileData;

    private String fileName;
    private String contentType;

    @Column(nullable = false)
    private String username; // Store username of uploader

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum ResourceType {
        PDF,
        URL,
        DOCUMENT,
        OTHER
    }
}
