package com.neha.resumeanalyser.model;

import java.util.List;

public class JobRequirements {

    private List<String> technicalSkills;

    private List<String> educationRequirements;

    private List<String> experienceRequirements;

    private List<String> responsibilities;

    private List<String> softSkills;


    // =====================================================
    // DEFAULT CONSTRUCTOR
    // =====================================================

    public JobRequirements() {
    }


    // =====================================================
    // TECHNICAL SKILLS
    // =====================================================

    public List<String> getTechnicalSkills() {
        return technicalSkills;
    }

    public void setTechnicalSkills(
            List<String> technicalSkills) {

        this.technicalSkills =
                technicalSkills;
    }


    // =====================================================
    // EDUCATION REQUIREMENTS
    // =====================================================

    public List<String> getEducationRequirements() {
        return educationRequirements;
    }

    public void setEducationRequirements(
            List<String> educationRequirements) {

        this.educationRequirements =
                educationRequirements;
    }


    // =====================================================
    // EXPERIENCE REQUIREMENTS
    // =====================================================

    public List<String> getExperienceRequirements() {
        return experienceRequirements;
    }

    public void setExperienceRequirements(
            List<String> experienceRequirements) {

        this.experienceRequirements =
                experienceRequirements;
    }


    // =====================================================
    // RESPONSIBILITIES
    // =====================================================

    public List<String> getResponsibilities() {
        return responsibilities;
    }

    public void setResponsibilities(
            List<String> responsibilities) {

        this.responsibilities =
                responsibilities;
    }


    // =====================================================
    // SOFT SKILLS
    // =====================================================

    public List<String> getSoftSkills() {
        return softSkills;
    }

    public void setSoftSkills(
            List<String> softSkills) {

        this.softSkills =
                softSkills;
    }
}