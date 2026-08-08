package com.neha.resumeanalyser.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    @PostMapping("/upload")
    public ResponseEntity<String> uploadResume(
            @RequestParam("resume") MultipartFile resume) {

        if (resume.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("Please upload a resume.");
        }

        String fileName = resume.getOriginalFilename();

        if (fileName == null) {
            return ResponseEntity.badRequest()
                    .body("Invalid file.");
        }

        String lowerCaseFileName = fileName.toLowerCase();

        if (!lowerCaseFileName.endsWith(".pdf")
                && !lowerCaseFileName.endsWith(".docx")) {

            return ResponseEntity.badRequest()
                    .body("Only PDF and DOCX files are allowed.");
        }

        return ResponseEntity.ok(
                "Resume uploaded successfully: " + fileName
        );
    }
}