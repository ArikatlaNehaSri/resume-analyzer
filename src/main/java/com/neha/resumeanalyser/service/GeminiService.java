package com.neha.resumeanalyser.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import com.neha.resumeanalyser.model.AnalysisResponse;
import org.springframework.stereotype.Service;

@Service
public class GeminiService {

    private final Client client;

    public GeminiService() {

        client = Client.builder()
                .apiKey(System.getenv("GEMINI_API_KEY"))
                .build();
    }

    // Test method to check whether Gemini API is working
    public String testGemini() {

        GenerateContentResponse response =
                client.models.generateContent(
                        "gemini-3.6-flash",
                        "Say hello and confirm that you are working.",
                        null
                );

        return response.text();
    }

    // Actual AI resume analysis
    public AnalysisResponse analyzeResume(
            String resumeText,
            String jobDescription) {

        String prompt = """
                You are an expert ATS resume analyzer.

                Analyze the following resume against the given job description.

                RESUME:
                %s

                JOB DESCRIPTION:
                %s

                Calculate an ATS compatibility score from 0 to 100.

                Identify:

                1. Skills present in both the resume and job description.
                2. Important skills from the job description missing from the resume.
                3. Specific suggestions to improve the resume.
                4. A short overall summary.

                Return ONLY valid JSON.

                Do not use markdown.
                Do not use ```json.
                
                Use exactly this JSON structure:

                {
                  "atsScore": 0,
                  "matchedSkills": [],
                  "missingSkills": [],
                  "suggestions": [],
                  "summary": ""
                }
                """.formatted(resumeText, jobDescription);

        GenerateContentResponse response =
                client.models.generateContent(
                        "gemini-3.6-flash",
                        prompt,
                        null
                );

        try {

            String json = response.text().trim();

            ObjectMapper objectMapper = new ObjectMapper();

            return objectMapper.readValue(
                    json,
                    AnalysisResponse.class
            );

        } catch (Exception e) {

            throw new RuntimeException(
                    "Could not process Gemini analysis response.",
                    e
            );
        }
    }
}