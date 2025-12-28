package com.hirestories.interview.dto;

import lombok.Data;

public class InterviewDto {

    @Data
    public static class CreateRequest {
        private String company;
        private String jobRole;
        private String experienceRange;
        private String techStack;
        private String rounds;
        private String difficulty;
        private String result;
        private String authorUsername; // Usually set by controller from token
    }

    @Data
    public static class CommentRequest {
        private String content;
        private String authorUsername;
    }
}
