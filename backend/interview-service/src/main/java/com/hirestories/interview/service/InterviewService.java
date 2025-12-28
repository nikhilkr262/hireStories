package com.hirestories.interview.service;

import com.hirestories.interview.dto.InterviewDto;
import com.hirestories.interview.entity.Comment;
import com.hirestories.interview.entity.Interview;
import com.hirestories.interview.repository.CommentRepository;
import com.hirestories.interview.repository.InterviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final CommentRepository commentRepository;

    public Interview createInterview(InterviewDto.CreateRequest request) {
        Interview interview = new Interview();
        interview.setCompany(request.getCompany());
        interview.setJobRole(request.getJobRole());
        interview.setExperienceRange(request.getExperienceRange());
        interview.setTechStack(request.getTechStack());
        interview.setRounds(request.getRounds());
        interview.setDifficulty(request.getDifficulty());
        interview.setResult(request.getResult());
        interview.setAuthorUsername(request.getAuthorUsername());

        return interviewRepository.save(interview);
    }

    public List<Interview> getAllInterviews() {
        return interviewRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    public Interview getInterviewById(Long id) {
        return interviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Interview not found"));
    }

    public List<Interview> searchInterviews(String company, String jobRole) {
        if (company != null && !company.isEmpty()) {
            return interviewRepository.findByCompanyContainingIgnoreCase(company);
        }
        if (jobRole != null && !jobRole.isEmpty()) {
            return interviewRepository.findByJobRoleContainingIgnoreCase(jobRole);
        }
        return getAllInterviews();
    }

    public Comment addComment(Long interviewId, InterviewDto.CommentRequest request) {
        Interview interview = getInterviewById(interviewId);
        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setAuthorUsername(request.getAuthorUsername());
        comment.setInterview(interview);

        return commentRepository.save(comment);
    }

    public Interview updateInterview(Long id, InterviewDto.CreateRequest request, String username) {
        Interview interview = getInterviewById(id);
        if (!interview.getAuthorUsername().equals(username)) {
            throw new RuntimeException("You are not authorized to update this interview");
        }
        interview.setCompany(request.getCompany());
        interview.setJobRole(request.getJobRole());
        interview.setExperienceRange(request.getExperienceRange());
        interview.setTechStack(request.getTechStack());
        interview.setRounds(request.getRounds());
        interview.setDifficulty(request.getDifficulty());
        interview.setResult(request.getResult());
        return interviewRepository.save(interview);
    }

    public void upvoteInterview(Long id) {
        Interview interview = getInterviewById(id);
        interview.setUpvoteCount(interview.getUpvoteCount() + 1);
        interviewRepository.save(interview);
    }

    public void deleteInterview(Long id, String username) {
        Interview interview = getInterviewById(id);
        if (!interview.getAuthorUsername().equals(username)) {
            throw new RuntimeException("You are not authorized to delete this interview");
        }
        interviewRepository.delete(interview);
    }
}
