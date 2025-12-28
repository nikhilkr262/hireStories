package com.hirestories.interview.controller;

import com.hirestories.interview.dto.InterviewDto;
import com.hirestories.interview.entity.Comment;
import com.hirestories.interview.entity.Interview;
import com.hirestories.interview.service.InterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/interviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class InterviewController {

    private final InterviewService interviewService;

    @PostMapping
    public Interview createInterview(@RequestBody InterviewDto.CreateRequest request) {
        // In real app, extract username from header or token
        return interviewService.createInterview(request);
    }

    @PutMapping("/{id}")
    public Interview updateInterview(@PathVariable Long id, @RequestBody InterviewDto.CreateRequest request,
            @RequestHeader("X-Username") String username) {
        return interviewService.updateInterview(id, request, username);
    }

    @GetMapping
    public List<Interview> getAllInterviews(
            @RequestParam(required = false) String company,
            @RequestParam(required = false) String jobRole) {
        return interviewService.searchInterviews(company, jobRole);
    }

    @GetMapping("/{id}")
    public Interview getInterview(@PathVariable Long id) {
        return interviewService.getInterviewById(id);
    }

    @PostMapping("/{id}/comments")
    public Comment addComment(@PathVariable Long id, @RequestBody InterviewDto.CommentRequest request) {
        return interviewService.addComment(id, request);
    }

    @PostMapping("/{id}/upvote")
    public void upvoteInterview(@PathVariable Long id) {
        interviewService.upvoteInterview(id);
    }

    @DeleteMapping("/{id}")
    public void deleteInterview(@PathVariable Long id, @RequestHeader("X-Username") String username) {
        interviewService.deleteInterview(id, username);
    }
}
