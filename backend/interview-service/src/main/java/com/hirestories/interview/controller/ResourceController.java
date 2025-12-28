package com.hirestories.interview.controller;

import com.hirestories.interview.entity.Resource;
import com.hirestories.interview.service.ResourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService resourceService;

    @CrossOrigin(origins = "*")
    @GetMapping
    public List<Resource> getAllResources() {
        return resourceService.getAllResources();
    }

    @CrossOrigin(origins = "*")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Resource shareResource(
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("type") String type,
            @RequestParam(value = "url", required = false) String url,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestHeader("X-Username") String username) throws IOException {
        // In a real app, we would validate the username/token here or via Gateway
        // For now, we trust the header passed by the frontend (or inserted by Gateway)
        if (username == null)
            username = "Anonymous";
        return resourceService.shareResource(title, description, type, url, file, username);
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadFile(@PathVariable Long id) {
        Resource resource = resourceService.getResource(id);

        if (resource.getFileData() == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFileName() + "\"")
                .contentType(MediaType.parseMediaType(resource.getContentType()))
                .body(resource.getFileData());
    }

    @CrossOrigin(origins = "*")
    @DeleteMapping("/{id}")
    public void deleteResource(@PathVariable Long id, @RequestHeader("X-Username") String username) {
        resourceService.deleteResource(id, username);
    }
}
