package com.neha.resumeanalyser.controller;

import com.neha.resumeanalyser.model.AnalysisResponse;
import com.neha.resumeanalyser.service.GeminiService;
import com.neha.resumeanalyser.service.ResumeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    private final ResumeService resumeService;
    private final GeminiService geminiService;

    public ResumeController(
            ResumeService resumeService,
            GeminiService geminiService) {

        this.resumeService = resumeService;
        this.geminiService = geminiService;
    }

    // Upload resume and extract text
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

        String lowerCaseFileName =
                fileName.toLowerCase();

        if (!lowerCaseFileName.endsWith(".pdf")
                && !lowerCaseFileName.endsWith(".docx")) {

            return ResponseEntity.badRequest()
                    .body("Only PDF and DOCX files are allowed.");
        }

        try {

            String extractedText =
                    resumeService.processResume(resume);

            System.out.println(
                    "========== RESUME TEXT =========="
            );

            System.out.println(extractedText);

            System.out.println(
                    "================================="
            );

            return ResponseEntity.ok(
                    "Resume uploaded and text extracted successfully."
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.internalServerError()
                    .body("Could not extract resume text.");
        }
    }

    // Test Gemini AI
    @GetMapping("/test-ai")
    public ResponseEntity<String> testAI() {

        try {

            String response =
                    geminiService.testGemini();

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.internalServerError()
                    .body("Gemini AI test failed: "
                            + e.getMessage());
        }
    }

    // Analyze resume using Gemini
    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeResume(

            @RequestParam("resume")
            MultipartFile resume,

            @RequestParam("jobDescription")
            String jobDescription) {

        if (resume.isEmpty()) {

            return ResponseEntity.badRequest()
                    .body("Please upload a resume.");
        }

        if (jobDescription == null
                || jobDescription.trim().isEmpty()) {

            return ResponseEntity.badRequest()
                    .body("Please provide a job description.");
        }

        String fileName =
                resume.getOriginalFilename();

        if (fileName == null) {

            return ResponseEntity.badRequest()
                    .body("Invalid file.");
        }

        String lowerCaseFileName =
                fileName.toLowerCase();

        if (!lowerCaseFileName.endsWith(".pdf")
                && !lowerCaseFileName.endsWith(".docx")) {

            return ResponseEntity.badRequest()
                    .body("Only PDF and DOCX files are allowed.");
        }

        try {

            // Step 1: Extract resume text
            String resumeText =
                    resumeService.processResume(resume);

            // Step 2: Send resume + job description to Gemini
            AnalysisResponse analysis =
                    geminiService.analyzeResume(
                            resumeText,
                            jobDescription
                    );

            // Step 3: Return AI analysis
            return ResponseEntity.ok(analysis);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.internalServerError()
                    .body("Could not analyze the resume: "
                            + e.getMessage());
        }
    }
}