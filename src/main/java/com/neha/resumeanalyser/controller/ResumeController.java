package com.neha.resumeanalyser.controller;

import com.neha.resumeanalyser.model.AnalysisResponse;
import com.neha.resumeanalyser.model.JobRequirements;
import com.neha.resumeanalyser.service.ATSScoreService;
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
    private final ATSScoreService atsScoreService;


    public ResumeController(
            ResumeService resumeService,
            GeminiService geminiService,
            ATSScoreService atsScoreService) {

        this.resumeService = resumeService;
        this.geminiService = geminiService;
        this.atsScoreService = atsScoreService;
    }


    @PostMapping("/upload")
    public ResponseEntity<String> uploadResume(
            @RequestParam("resume") MultipartFile resume) {

        if (resume.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("Please upload a resume.");
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


    @GetMapping("/test-ai")
    public ResponseEntity<String> testAI() {

        try {

            String response =
                    geminiService.testGemini();

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.internalServerError()
                    .body(
                            "Gemini AI test failed: "
                                    + e.getMessage()
                    );
        }
    }


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

            // =================================================
            // STEP 1
            // =================================================

            System.out.println(
                    "STEP 1 STARTED - EXTRACTING RESUME"
            );

            String resumeText =
                    resumeService.processResume(resume);

            System.out.println(
                    "STEP 1 COMPLETE - RESUME EXTRACTED"
            );

            System.out.println(
                    "Resume text length: "
                            + resumeText.length()
            );


            // =================================================
            // STEP 2
            // =================================================

            System.out.println(
                    "STEP 2 STARTED - EXTRACTING JOB REQUIREMENTS"
            );

            JobRequirements requirements =
                    geminiService.extractJobRequirements(
                            jobDescription
                    );
            System.out.println("========== GEMINI JOB REQUIREMENTS ==========");

            System.out.println("TECHNICAL SKILLS: "
                    + requirements.getTechnicalSkills());

            System.out.println("EDUCATION: "
                    + requirements.getEducationRequirements());

            System.out.println("EXPERIENCE: "
                    + requirements.getExperienceRequirements());

            System.out.println("RESPONSIBILITIES: "
                    + requirements.getResponsibilities());

            System.out.println("SOFT SKILLS: "
                    + requirements.getSoftSkills());

            System.out.println("=============================================");

            System.out.println(
                    "STEP 2 COMPLETE - JOB REQUIREMENTS EXTRACTED"
            );


            // =================================================
            // STEP 3
            // =================================================

            System.out.println(
                    "STEP 3 STARTED - GEMINI RESUME ANALYSIS"
            );

            AnalysisResponse analysis =
                    geminiService.analyzeResume(
                            resumeText,
                            jobDescription
                    );

            System.out.println(
                    "STEP 3 COMPLETE - GEMINI ANALYSIS COMPLETE"
            );


            // =================================================
            // STEP 4
            // =================================================

            System.out.println(
                    "STEP 4 STARTED - CALCULATING ATS SCORE"
            );

            ATSScoreService.ATSScoreResult scoreResult =
                    atsScoreService.calculateDetailedScore(
                            resumeText,
                            requirements
                    );


            // =================================================
            // STEP 5
            // =================================================

            analysis.setAtsScore(
                    scoreResult.getFinalScore()
            );

            analysis.setTechnicalSkillsScore(
                    scoreResult.getTechnicalSkillsScore()
            );

            analysis.setResponsibilitiesScore(
                    scoreResult.getResponsibilitiesScore()
            );

            analysis.setEducationScore(
                    scoreResult.getEducationScore()
            );

            analysis.setExperienceScore(
                    scoreResult.getExperienceScore()
            );

            analysis.setSoftSkillsScore(
                    scoreResult.getSoftSkillsScore()
            );


            System.out.println(
                    "STEP 4 COMPLETE - ATS SCORE: "
                            + scoreResult.getFinalScore()
            );


            // =================================================
            // STEP 6
            // =================================================

            System.out.println(
                    "STEP 5 COMPLETE - RETURNING RESULT"
            );

            return ResponseEntity.ok(
                    analysis
            );


        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.internalServerError()
                    .body(
                            "Could not analyze the resume: "
                                    + e.getMessage()
                    );
        }
    }
}