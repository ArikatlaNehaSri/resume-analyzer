package com.neha.resumeanalyser.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import com.neha.resumeanalyser.model.AnalysisResponse;
import com.neha.resumeanalyser.model.JobRequirements;
import org.springframework.stereotype.Service;

@Service
public class GeminiService {

    private final Client client;

    public GeminiService() {

        client = Client.builder()
                .apiKey(System.getenv("GEMINI_API_KEY"))
                .build();
    }


    // =====================================================
    // TEST GEMINI API
    // =====================================================

    public String testGemini() {

        GenerateContentResponse response =
                client.models.generateContent(
                        "gemini-3.6-flash",
                        "Say hello and confirm that you are working.",
                        null
                );

        return response.text();
    }


    // =====================================================
    // EXTRACT JOB REQUIREMENTS
    // =====================================================

    public JobRequirements extractJobRequirements(
            String jobDescription) {

        String prompt = """
                You are an expert job description analyzer.

                Analyze the following job description and extract
                ONLY the requirements that are relevant for evaluating
                a candidate's resume.

                JOB DESCRIPTION:
                %s

                Extract the following categories:

                1. technicalSkills
                   Programming languages, frameworks, libraries,
                   databases, tools, platforms and technical concepts.

                2. educationRequirements
                   Degrees, fields of study and educational requirements.

                3. experienceRequirements
                   Years of experience, internship requirements,
                   professional experience and relevant background.

                4. responsibilities
                   Important work responsibilities that should be
                   demonstrated by the candidate.

                5. softSkills
                   Communication, teamwork, collaboration,
                   problem solving and other interpersonal abilities.

                IMPORTANT RULES:

                - Do not invent requirements that are not present
                  or reasonably implied by the job description.
                - Do not include generic filler words.
                - Keep each item short and meaningful.
                - Remove duplicate requirements.
                - Preserve the actual technologies and terminology
                  used in the job description.
                - Return empty arrays when a category has no
                  identifiable requirements.

                Return ONLY valid JSON.

                Do not use markdown.
                Do not use ```json.

                Use exactly this structure:

                {
                  "technicalSkills": [],
                  "educationRequirements": [],
                  "experienceRequirements": [],
                  "responsibilities": [],
                  "softSkills": []
                }
                """.formatted(jobDescription);


        GenerateContentResponse response =
                client.models.generateContent(
                        "gemini-3.6-flash",
                        prompt,
                        null
                );


        try {

            String json =
                    response.text().trim();


            ObjectMapper objectMapper =
                    new ObjectMapper();


            return objectMapper.readValue(
                    json,
                    JobRequirements.class
            );


        } catch (Exception e) {

            throw new RuntimeException(
                    "Could not extract job requirements from Gemini.",
                    e
            );
        }
    }


    // =====================================================
    // AI RESUME ANALYSIS
    // =====================================================

    public AnalysisResponse analyzeResume(
            String resumeText,
            String jobDescription) {

        String prompt = """
                You are an expert ATS resume analyzer.

                Analyze the following resume against the given
                job description.

                RESUME:
                %s

                JOB DESCRIPTION:
                %s

                Do NOT calculate an ATS score.

                The ATS compatibility score is calculated separately
                by the application's deterministic scoring engine.

                Identify:

                1. Skills present in both the resume and
                   job description.

                2. Important skills from the job description
                   missing from the resume.

                3. Specific and practical suggestions to
                   improve the resume.

                4. A short overall summary.

                IMPORTANT:

                - Only identify skills that are actually supported
                  by the resume or job description.
                - Do not invent skills.
                - Keep matchedSkills and missingSkills concise.
                - Suggestions should be specific and useful.

                Return ONLY valid JSON.

                Do not use markdown.
                Do not use ```json.

                Use exactly this structure:

                {
                  "atsScore": 0,
                  "matchedSkills": [],
                  "missingSkills": [],
                  "suggestions": [],
                  "summary": ""
                }
                """.formatted(
                resumeText,
                jobDescription
        );


        GenerateContentResponse response =
                client.models.generateContent(
                        "gemini-3.6-flash",
                        prompt,
                        null
                );


        try {

            String json =
                    response.text().trim();


            ObjectMapper objectMapper =
                    new ObjectMapper();


            AnalysisResponse analysis =
                    objectMapper.readValue(
                            json,
                            AnalysisResponse.class
                    );


            /*
             * Gemini does NOT determine the final ATS score.
             */

            analysis.setAtsScore(0);


            return analysis;


        } catch (Exception e) {

            throw new RuntimeException(
                    "Could not process Gemini analysis response.",
                    e
            );
        }
    }
}