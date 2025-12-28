package com.hirestories.interview.service;

import com.hirestories.interview.entity.Resource;
import com.hirestories.interview.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
@org.springframework.transaction.annotation.Transactional
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public Resource shareResource(String title, String description, String type, String url, MultipartFile file,
            String username) throws IOException {
        Resource resource = new Resource();
        resource.setTitle(title);
        resource.setDescription(description);
        resource.setUsername(username);

        try {
            resource.setType(Resource.ResourceType.valueOf(type.toUpperCase()));
        } catch (IllegalArgumentException e) {
            resource.setType(Resource.ResourceType.OTHER);
        }

        if (file != null && !file.isEmpty()) {
            resource.setFileData(file.getBytes());
            resource.setFileName(file.getOriginalFilename());
            resource.setContentType(file.getContentType());
        }

        if (url != null && !url.isEmpty()) {
            resource.setContentUrl(url);
        }

        return resourceRepository.save(resource);
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public Resource getResource(Long id) {
        return resourceRepository.findById(id).orElseThrow(() -> new RuntimeException("Resource not found"));
    }

    @org.springframework.transaction.annotation.Transactional
    public void deleteResource(Long id, String username) {
        Resource resource = getResource(id);
        if (!resource.getUsername().equals(username)) {
            throw new RuntimeException("You are not authorized to delete this resource");
        }
        resourceRepository.delete(resource);
    }
}
