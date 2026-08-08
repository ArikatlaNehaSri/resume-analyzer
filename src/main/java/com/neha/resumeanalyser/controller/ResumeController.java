package com.neha.resumeanalyser.controller;

import com.neha.resumeanalyser.service.ResumeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

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

        try {

            String extractedText =
                    resumeService.processResume(resume);

            System.out.println("========== RESUME TEXT ==========");

            System.out.println(extractedText);

            System.out.println("=================================");

            return ResponseEntity.ok(
                    "Resume uploaded and text extracted successfully."
            );

        } catch (Exception e) {

            return ResponseEntity.internalServerError()
                    .body("Could not extract resume text.");
        }
    }
}