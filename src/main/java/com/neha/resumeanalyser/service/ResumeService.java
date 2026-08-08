package com.neha.resumeanalyser.service;

import com.neha.resumeanalyser.util.ResumeParser;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ResumeService {

    private final ResumeParser resumeParser;

    public ResumeService() {
        this.resumeParser = new ResumeParser();
    }

    public String processResume(MultipartFile file) {

        try {

            return resumeParser.extractText(file);

        } catch (Exception e) {

            throw new RuntimeException(
                    "Unable to extract resume text.",
                    e
            );
        }
    }
}