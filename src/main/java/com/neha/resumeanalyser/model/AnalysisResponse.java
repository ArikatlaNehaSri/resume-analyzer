package com.neha.resumeanalyser.model;

import java.util.List;

public class AnalysisResponse {

    private int atsScore;

    private double technicalSkillsScore;

    private double responsibilitiesScore;

    private double educationScore;

    private double experienceScore;

    private double softSkillsScore;

    private List<String> matchedSkills;

    private List<String> missingSkills;

    private List<String> suggestions;

    private String summary;


    public AnalysisResponse() {
    }


    // =====================================================
    // ATS SCORE
    // =====================================================

    public int getAtsScore() {
        return atsScore;
    }

    public void setAtsScore(int atsScore) {
        this.atsScore = atsScore;
    }


    // =====================================================
    // TECHNICAL SKILLS SCORE
    // =====================================================

    public double getTechnicalSkillsScore() {
        return technicalSkillsScore;
    }

    public void setTechnicalSkillsScore(
            double technicalSkillsScore) {

        this.technicalSkillsScore =
                technicalSkillsScore;
    }


    // =====================================================
    // RESPONSIBILITIES SCORE
    // =====================================================

    public double getResponsibilitiesScore() {
        return responsibilitiesScore;
    }

    public void setResponsibilitiesScore(
            double responsibilitiesScore) {

        this.responsibilitiesScore =
                responsibilitiesScore;
    }


    // =====================================================
    // EDUCATION SCORE
    // =====================================================

    public double getEducationScore() {
        return educationScore;
    }

    public void setEducationScore(
            double educationScore) {

        this.educationScore =
                educationScore;
    }


    // =====================================================
    // EXPERIENCE SCORE
    // =====================================================

    public double getExperienceScore() {
        return experienceScore;
    }

    public void setExperienceScore(
            double experienceScore) {

        this.experienceScore =
                experienceScore;
    }


    // =====================================================
    // SOFT SKILLS SCORE
    // =====================================================

    public double getSoftSkillsScore() {
        return softSkillsScore;
    }

    public void setSoftSkillsScore(
            double softSkillsScore) {

        this.softSkillsScore =
                softSkillsScore;
    }


    // =====================================================
    // MATCHED SKILLS
    // =====================================================

    public List<String> getMatchedSkills() {
        return matchedSkills;
    }

    public void setMatchedSkills(
            List<String> matchedSkills) {

        this.matchedSkills =
                matchedSkills;
    }


    // =====================================================
    // MISSING SKILLS
    // =====================================================

    public List<String> getMissingSkills() {
        return missingSkills;
    }

    public void setMissingSkills(
            List<String> missingSkills) {

        this.missingSkills =
                missingSkills;
    }


    // =====================================================
    // SUGGESTIONS
    // =====================================================

    public List<String> getSuggestions() {
        return suggestions;
    }

    public void setSuggestions(
            List<String> suggestions) {

        this.suggestions =
                suggestions;
    }


    // =====================================================
    // SUMMARY
    // =====================================================

    public String getSummary() {
        return summary;
    }

    public void setSummary(
            String summary) {

        this.summary = summary;
    }
}