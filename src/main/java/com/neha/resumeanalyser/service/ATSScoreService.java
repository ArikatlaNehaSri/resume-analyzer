package com.neha.resumeanalyser.service;

import com.neha.resumeanalyser.model.JobRequirements;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ATSScoreService {

    // =====================================================
    // FINAL CATEGORY WEIGHTS
    // =====================================================

    private static final double TECHNICAL_SKILLS_WEIGHT = 0.40;
    private static final double RESPONSIBILITIES_WEIGHT = 0.20;
    private static final double EDUCATION_WEIGHT = 0.15;
    private static final double EXPERIENCE_WEIGHT = 0.15;
    private static final double SOFT_SKILLS_WEIGHT = 0.10;


    // =====================================================
    // MAIN SCORE METHOD
    // =====================================================

    public int calculateScore(
            String resumeText,
            JobRequirements requirements) {

        ATSScoreResult result =
                calculateDetailedScore(
                        resumeText,
                        requirements
                );

        return result.getFinalScore();
    }


    // =====================================================
    // DETAILED SCORE CALCULATION
    // =====================================================

    public ATSScoreResult calculateDetailedScore(
            String resumeText,
            JobRequirements requirements) {

        if (resumeText == null ||
                resumeText.isBlank() ||
                requirements == null) {

            return new ATSScoreResult(
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
            );
        }


        // -------------------------------------------------
        // NORMALIZE RESUME
        // -------------------------------------------------

        String resume =
                normalizeText(resumeText);


        // -------------------------------------------------
        // 1. TECHNICAL SKILLS
        // -------------------------------------------------

        int technicalScore =
                calculateTechnicalSkillsScore(
                        resume,
                        requirements.getTechnicalSkills()
                );


        // -------------------------------------------------
        // 2. RESPONSIBILITIES
        // -------------------------------------------------

        int responsibilityScore =
                calculateResponsibilitiesScore(
                        resume,
                        requirements.getResponsibilities()
                );


        // -------------------------------------------------
        // 3. EDUCATION
        // -------------------------------------------------

        int educationScore =
                calculateEducationScore(
                        resume,
                        requirements.getEducationRequirements()
                );


        // -------------------------------------------------
        // 4. EXPERIENCE
        // -------------------------------------------------

        int experienceScore =
                calculateExperienceScore(
                        resume,
                        requirements.getExperienceRequirements()
                );


        // -------------------------------------------------
        // 5. SOFT SKILLS
        // -------------------------------------------------

        int softSkillScore =
                calculateSoftSkillsScore(
                        resume,
                        requirements.getSoftSkills()
                );


        // -------------------------------------------------
        // FINAL WEIGHTED SCORE
        // -------------------------------------------------

        double finalScore =
                (technicalScore * TECHNICAL_SKILLS_WEIGHT)
                        +
                        (responsibilityScore * RESPONSIBILITIES_WEIGHT)
                        +
                        (educationScore * EDUCATION_WEIGHT)
                        +
                        (experienceScore * EXPERIENCE_WEIGHT)
                        +
                        (softSkillScore * SOFT_SKILLS_WEIGHT);


        int roundedFinalScore =
                (int) Math.round(
                        Math.max(
                                0,
                                Math.min(
                                        100,
                                        finalScore
                                )
                        )
                );


        // =================================================
        // CONSOLE OUTPUT
        // =================================================

        System.out.println(
                "=========================================="
        );

        System.out.println(
                "TECHNICAL SKILLS SCORE : "
                        + technicalScore
        );

        System.out.println(
                "RESPONSIBILITIES SCORE : "
                        + responsibilityScore
        );

        System.out.println(
                "EDUCATION SCORE        : "
                        + educationScore
        );

        System.out.println(
                "EXPERIENCE SCORE       : "
                        + experienceScore
        );

        System.out.println(
                "SOFT SKILLS SCORE      : "
                        + softSkillScore
        );

        System.out.println(
                "FINAL ATS SCORE        : "
                        + roundedFinalScore
        );

        System.out.println(
                "=========================================="
        );


        // =================================================
        // RETURN RESULT
        // IMPORTANT:
        // Constructor order is:
        // final, technical, responsibility,
        // education, experience, soft skills
        // =================================================

        return new ATSScoreResult(
                roundedFinalScore,
                technicalScore,
                responsibilityScore,
                educationScore,
                experienceScore,
                softSkillScore
        );
    }


    // =====================================================
    // TECHNICAL SKILLS SCORE
    // =====================================================

    private int calculateTechnicalSkillsScore(
            String resume,
            List<String> skills) {

        if (skills == null ||
                skills.isEmpty()) {

            return 100;
        }


        List<String> requirements =
                cleanRequirements(skills);


        if (requirements.isEmpty()) {

            return 100;
        }


        int matched = 0;


        for (String skill : requirements) {

            if (technicalSkillExists(
                    resume,
                    skill)) {

                matched++;
            }
        }


        return percentage(
                matched,
                requirements.size()
        );
    }


    // =====================================================
    // TECHNICAL SKILL MATCHING
    // =====================================================

    private boolean technicalSkillExists(
            String resume,
            String skill) {

        String normalized =
                normalizeText(skill);


        // -------------------------------------------------
        // JAVA
        // -------------------------------------------------

        if (normalized.equals("java")) {

            return containsWholeWord(
                    resume,
                    "java"
            );
        }


        // -------------------------------------------------
        // PYTHON
        // -------------------------------------------------

        if (normalized.equals("python")) {

            return containsWholeWord(
                    resume,
                    "python"
            );
        }


        // -------------------------------------------------
        // C / C++
        // -------------------------------------------------

        if (normalized.equals("c++") ||
                normalized.equals("cpp")) {

            return containsWholeWord(
                    resume,
                    "c++"
            ) ||
                    containsWholeWord(
                            resume,
                            "cpp"
                    );
        }


        if (normalized.equals("c")) {

            return containsWholeWord(
                    resume,
                    "c"
            );
        }


        // -------------------------------------------------
        // JAVASCRIPT
        // -------------------------------------------------

        if (normalized.equals("javascript")) {

            return containsWholeWord(
                    resume,
                    "javascript"
            ) ||
                    containsWholeWord(
                            resume,
                            "js"
                    );
        }


        // -------------------------------------------------
        // TYPESCRIPT
        // -------------------------------------------------

        if (normalized.equals("typescript")) {

            return containsWholeWord(
                    resume,
                    "typescript"
            ) ||
                    containsWholeWord(
                            resume,
                            "ts"
                    );
        }


        // -------------------------------------------------
        // REACT
        // -------------------------------------------------

        if (normalized.equals("react") ||
                normalized.equals("reactjs")) {

            return containsWholeWord(
                    resume,
                    "react"
            ) ||
                    containsWholeWord(
                            resume,
                            "reactjs"
                    );
        }


        // -------------------------------------------------
        // NODE
        // -------------------------------------------------

        if (normalized.equals("node") ||
                normalized.equals("nodejs")) {

            return containsWholeWord(
                    resume,
                    "node"
            ) ||
                    containsWholeWord(
                            resume,
                            "nodejs"
                    );
        }


        // -------------------------------------------------
        // EXPRESS
        // -------------------------------------------------

        if (normalized.equals("express") ||
                normalized.equals("expressjs")) {

            return containsWholeWord(
                    resume,
                    "express"
            ) ||
                    containsWholeWord(
                            resume,
                            "expressjs"
                    );
        }


        // -------------------------------------------------
        // SPRING BOOT
        // -------------------------------------------------

        if (normalized.equals("springboot") ||
                normalized.equals("spring")) {

            return containsWholeWord(
                    resume,
                    "springboot"
            ) ||
                    containsWholeWord(
                            resume,
                            "spring"
                    );
        }


        // -------------------------------------------------
        // REST API
        // -------------------------------------------------

        if (normalized.equals("restapi") ||
                normalized.equals("restapis")) {

            return containsWholeWord(
                    resume,
                    "restapi"
            ) ||
                    containsPhrase(
                            resume,
                            "rest api"
                    );
        }


        // -------------------------------------------------
        // SQL
        // -------------------------------------------------

        if (normalized.equals("sql")) {

            return containsWholeWord(
                    resume,
                    "sql"
            ) ||
                    containsWholeWord(
                            resume,
                            "mysql"
                    ) ||
                    containsWholeWord(
                            resume,
                            "postgresql"
                    );
        }


        // -------------------------------------------------
        // MYSQL
        // -------------------------------------------------

        if (normalized.equals("mysql")) {

            return containsWholeWord(
                    resume,
                    "mysql"
            );
        }


        // -------------------------------------------------
        // POSTGRESQL
        // -------------------------------------------------

        if (normalized.equals("postgresql") ||
                normalized.equals("postgres")) {

            return containsWholeWord(
                    resume,
                    "postgresql"
            ) ||
                    containsWholeWord(
                            resume,
                            "postgres"
                    );
        }


        // -------------------------------------------------
        // MONGODB
        // -------------------------------------------------

        if (normalized.equals("mongodb") ||
                normalized.equals("mongo")) {

            return containsWholeWord(
                    resume,
                    "mongodb"
            ) ||
                    containsWholeWord(
                            resume,
                            "mongo"
                    );
        }


        // -------------------------------------------------
        // GIT
        // -------------------------------------------------

        if (normalized.equals("git")) {

            return containsWholeWord(
                    resume,
                    "git"
            );
        }


        // -------------------------------------------------
        // GITHUB
        // -------------------------------------------------

        if (normalized.equals("github")) {

            return containsWholeWord(
                    resume,
                    "github"
            );
        }


        // -------------------------------------------------
        // DOCKER
        // -------------------------------------------------

        if (normalized.equals("docker")) {

            return containsWholeWord(
                    resume,
                    "docker"
            );
        }


        // -------------------------------------------------
        // AWS
        // -------------------------------------------------

        if (normalized.equals("aws") ||
                normalized.equals("amazon web services")) {

            return containsWholeWord(
                    resume,
                    "aws"
            ) ||
                    containsPhrase(
                            resume,
                            "amazon web services"
                    );
        }


        // -------------------------------------------------
        // HTML
        // -------------------------------------------------

        if (normalized.equals("html")) {

            return containsWholeWord(
                    resume,
                    "html"
            );
        }


        // -------------------------------------------------
        // CSS
        // -------------------------------------------------

        if (normalized.equals("css")) {

            return containsWholeWord(
                    resume,
                    "css"
            );
        }


        // -------------------------------------------------
        // OOP
        // -------------------------------------------------

        if (normalized.equals("oop") ||
                normalized.equals(
                        "object oriented programming")) {

            return containsWholeWord(
                    resume,
                    "oop"
            ) ||
                    containsPhrase(
                            resume,
                            "object oriented programming"
                    ) ||
                    containsPhrase(
                            resume,
                            "object-oriented programming"
                    );
        }


        // -------------------------------------------------
        // DATA STRUCTURES / DSA
        // -------------------------------------------------

        if (normalized.equals("datastructures") ||
                normalized.equals("data structures") ||
                normalized.equals("data structure") ||
                normalized.equals("dsa")) {

            return containsWholeWord(
                    resume,
                    "dsa"
            ) ||
                    containsPhrase(
                            resume,
                            "data structures"
                    ) ||
                    containsPhrase(
                            resume,
                            "data structure"
                    );
        }


        // -------------------------------------------------
        // FALLBACK
        // -------------------------------------------------

        return containsWholePhrase(
                resume,
                normalized
        );
    }


    // =====================================================
    // RESPONSIBILITIES SCORE
    // =====================================================

    private int calculateResponsibilitiesScore(
            String resume,
            List<String> responsibilities) {

        if (responsibilities == null ||
                responsibilities.isEmpty()) {

            return 100;
        }


        List<String> requirements =
                cleanRequirements(
                        responsibilities
                );


        if (requirements.isEmpty()) {

            return 100;
        }


        double total = 0;


        for (String responsibility :
                requirements) {

            total +=
                    calculateResponsibilityMatch(
                            resume,
                            responsibility
                    );
        }


        return clamp(
                (int) Math.round(
                        total / requirements.size()
                )
        );
    }


    // =====================================================
    // RESPONSIBILITY MATCH
    // =====================================================

    private int calculateResponsibilityMatch(
            String resume,
            String responsibility) {

        String text =
                normalizeText(
                        responsibility
                );


        // -------------------------------------------------
        // WEB APPLICATIONS
        // -------------------------------------------------

        if (containsAny(
                text,
                "develop and maintain web applications",
                "web applications",
                "develop web applications")) {

            boolean web =
                    containsAny(
                            resume,
                            "web application",
                            "web applications"
                    );

            boolean development =
                    containsAny(
                            resume,
                            "development",
                            "develop",
                            "developer"
                    );

            return scoreBooleanPair(
                    web,
                    development
            );
        }


        // -------------------------------------------------
        // FRONTEND
        // -------------------------------------------------

        if (containsAny(
                text,
                "frontend components",
                "frontend",
                "front end")) {

            int matches = 0;

            if (containsAny(
                    resume,
                    "frontend",
                    "front end")) {

                matches++;
            }

            if (containsAny(
                    resume,
                    "react",
                    "reactjs")) {

                matches++;
            }

            if (containsWholeWord(
                    resume,
                    "html")) {

                matches++;
            }

            if (containsWholeWord(
                    resume,
                    "css")) {

                matches++;
            }

            return partialScore(
                    matches,
                    2
            );
        }


        // -------------------------------------------------
        // BACKEND / REST APIs
        // -------------------------------------------------

        if (containsAny(
                text,
                "backend",
                "rest api",
                "rest apis",
                "backend services")) {

            int matches = 0;

            if (containsAny(
                    resume,
                    "backend",
                    "back end")) {

                matches++;
            }

            if (containsAny(
                    resume,
                    "restapi",
                    "rest api",
                    "restful api")) {

                matches++;
            }

            if (containsAny(
                    resume,
                    "node",
                    "nodejs",
                    "java",
                    "springboot",
                    "express")) {

                matches++;
            }

            return partialScore(
                    matches,
                    2
            );
        }


        // -------------------------------------------------
        // DATABASES
        // -------------------------------------------------

        if (containsAny(
                text,
                "databases",
                "database",
                "sql",
                "mongodb")) {

            int matches = 0;

            if (containsWholeWord(
                    resume,
                    "sql")) {

                matches++;
            }

            if (containsWholeWord(
                    resume,
                    "mysql")) {

                matches++;
            }

            if (containsAny(
                    resume,
                    "mongodb",
                    "mongo")) {

                matches++;
            }

            return partialScore(
                    matches,
                    2
            );
        }


        // -------------------------------------------------
        // DEBUGGING
        // -------------------------------------------------

        if (containsAny(
                text,
                "debug",
                "debugging",
                "fix software issues",
                "troubleshoot")) {

            return containsAny(
                    resume,
                    "debug",
                    "debugging",
                    "troubleshooting",
                    "troubleshoot"
            ) ? 100 : 0;
        }


        // -------------------------------------------------
        // CLEAN / MAINTAINABLE CODE
        // -------------------------------------------------

        if (containsAny(
                text,
                "clean code",
                "maintainable code",
                "reusable code",
                "software development best practices")) {

            int matches = 0;

            if (containsAny(
                    resume,
                    "clean code",
                    "clean and maintainable")) {

                matches++;
            }

            if (containsAny(
                    resume,
                    "reusable",
                    "maintainable")) {

                matches++;
            }

            if (containsAny(
                    resume,
                    "best practices",
                    "software development")) {

                matches++;
            }

            return partialScore(
                    matches,
                    2
            );
        }


        // -------------------------------------------------
        // CODE REVIEW
        // -------------------------------------------------

        if (containsAny(
                text,
                "code reviews",
                "code review")) {

            return containsAny(
                    resume,
                    "code review",
                    "code reviews"
            ) ? 100 : 0;
        }


        // -------------------------------------------------
        // COLLABORATION
        // -------------------------------------------------

        if (containsAny(
                text,
                "collaborate",
                "collaboration",
                "team members",
                "teamwork")) {

            return containsAny(
                    resume,
                    "teamwork",
                    "team member",
                    "collaboration",
                    "collaborated",
                    "collaborative"
            ) ? 100 : 0;
        }


        // -------------------------------------------------
        // TESTING
        // -------------------------------------------------

        if (containsAny(
                text,
                "test applications",
                "testing",
                "test software")) {

            return containsAny(
                    resume,
                    "testing",
                    "test cases",
                    "unit testing",
                    "tested"
            ) ? 100 : 0;
        }


        // -------------------------------------------------
        // FALLBACK
        // -------------------------------------------------

        return calculateMeaningfulWordMatch(
                resume,
                text
        );
    }


    // =====================================================
    // EDUCATION SCORE
    // =====================================================

    private int calculateEducationScore(
            String resume,
            List<String> educationRequirements) {

        if (educationRequirements == null ||
                educationRequirements.isEmpty()) {

            // No education requirement means
            // education should not reduce score.
            return 100;
        }


        List<String> requirements =
                cleanRequirements(
                        educationRequirements
                );


        if (requirements.isEmpty()) {

            return 100;
        }


        double total = 0;


        for (String requirement :
                requirements) {

            total +=
                    calculateEducationMatch(
                            resume,
                            requirement
                    );
        }


        return clamp(
                (int) Math.round(
                        total / requirements.size()
                )
        );
    }


    // =====================================================
    // EDUCATION MATCH
    // =====================================================

    private int calculateEducationMatch(
            String resume,
            String requirement) {

        String req =
                normalizeText(
                        requirement
                );


        int degreeScore = 0;
        int fieldScore = 0;


        // -------------------------------------------------
        // BACHELOR'S DEGREE
        // -------------------------------------------------

        if (containsAny(
                req,
                "bachelor",
                "bachelors",
                "bachelor's",
                "undergraduate")) {

            if (containsAny(
                    resume,
                    "bachelor",
                    "bachelors",
                    "bachelor's",
                    "b.tech",
                    "btech",
                    "b.e.",
                    "b.e",
                    "undergraduate")) {

                degreeScore = 50;
            }
        }


        // -------------------------------------------------
        // MASTER'S DEGREE
        // -------------------------------------------------

        else if (containsAny(
                req,
                "master",
                "masters",
                "master's",
                "postgraduate")) {

            if (containsAny(
                    resume,
                    "master",
                    "masters",
                    "master's",
                    "m.tech",
                    "mtech",
                    "m.e.",
                    "m.e",
                    "postgraduate")) {

                degreeScore = 50;
            }
        }


        // -------------------------------------------------
        // PHD
        // -------------------------------------------------

        else if (containsAny(
                req,
                "phd",
                "doctorate",
                "doctoral")) {

            if (containsAny(
                    resume,
                    "phd",
                    "doctorate",
                    "doctoral")) {

                degreeScore = 50;
            }
        }


        // -------------------------------------------------
        // GENERIC DEGREE
        // -------------------------------------------------

        else if (containsAny(
                req,
                "degree",
                "graduation")) {

            if (containsAny(
                    resume,
                    "b.tech",
                    "btech",
                    "b.e",
                    "bachelor",
                    "degree",
                    "graduation",
                    "m.tech",
                    "mtech",
                    "master")) {

                degreeScore = 50;
            }
        }


        // -------------------------------------------------
        // COMPUTER SCIENCE
        // -------------------------------------------------

        if (containsAny(
                req,
                "computer science",
                "computer science engineering",
                "cse")) {

            if (containsAny(
                    resume,
                    "computer science",
                    "computer science engineering",
                    "cse")) {

                fieldScore = 50;
            }
        }


        // -------------------------------------------------
        // INFORMATION TECHNOLOGY
        // -------------------------------------------------

        else if (containsAny(
                req,
                "information technology",
                "information technology engineering",
                "it")) {

            if (containsAny(
                    resume,
                    "information technology",
                    "information technology engineering")) {

                fieldScore = 50;
            }
        }


        // -------------------------------------------------
        // SOFTWARE ENGINEERING
        // -------------------------------------------------

        else if (containsAny(
                req,
                "software engineering",
                "software development")) {

            if (containsAny(
                    resume,
                    "software engineering",
                    "software development")) {

                fieldScore = 50;
            }
        }


        // -------------------------------------------------
        // RELATED FIELD
        // -------------------------------------------------

        if (fieldScore == 0 &&
                containsAny(
                        req,
                        "related field",
                        "related discipline")) {

            if (containsAny(
                    resume,
                    "computer science",
                    "computer science engineering",
                    "information technology",
                    "software engineering",
                    "cse",
                    "btech")) {

                fieldScore = 50;
            }
        }


        // -------------------------------------------------
        // IF WE COULD NOT IDENTIFY A SPECIFIC EDUCATION
        // REQUIREMENT, USE CAREFUL WORD MATCHING
        // -------------------------------------------------

        if (degreeScore == 0 &&
                fieldScore == 0) {

            return calculateMeaningfulWordMatch(
                    resume,
                    req
            );
        }


        return clamp(
                degreeScore + fieldScore
        );
    }


    // =====================================================
    // EXPERIENCE SCORE
    // =====================================================

    private int calculateExperienceScore(
            String resume,
            List<String> experienceRequirements) {

        if (experienceRequirements == null ||
                experienceRequirements.isEmpty()) {

            // No experience requirement = neutral.
            return 100;
        }


        List<String> requirements =
                cleanRequirements(
                        experienceRequirements
                );


        if (requirements.isEmpty()) {

            return 100;
        }


        double total = 0;


        for (String requirement :
                requirements) {

            total +=
                    calculateExperienceMatch(
                            resume,
                            requirement
                    );
        }


        return clamp(
                (int) Math.round(
                        total / requirements.size()
                )
        );
    }


    // =====================================================
    // EXPERIENCE MATCH
    // =====================================================

    private int calculateExperienceMatch(
            String resume,
            String requirement) {

        String req =
                normalizeText(
                        requirement
                );


        // -------------------------------------------------
        // INTERNSHIP EXPERIENCE
        // -------------------------------------------------

        if (containsAny(
                req,
                "internship",
                "intern experience",
                "intern")) {

            if (containsAny(
                    resume,
                    "internship",
                    "intern",
                    "intern experience")) {

                return 100;
            }
        }


        // -------------------------------------------------
        // PROJECT EXPERIENCE
        // -------------------------------------------------

        if (containsAny(
                req,
                "project experience",
                "project",
                "projects")) {

            if (containsAny(
                    resume,
                    "projects",
                    "project")) {

                return 100;
            }
        }


        // -------------------------------------------------
        // SOFTWARE DEVELOPMENT EXPERIENCE
        // -------------------------------------------------

        if (containsAny(
                req,
                "software development",
                "software developer",
                "development experience")) {

            if (containsAny(
                    resume,
                    "software development",
                    "software developer",
                    "development",
                    "developer")) {

                return 100;
            }
        }


        // -------------------------------------------------
        // WEB APPLICATION EXPERIENCE
        // -------------------------------------------------

        if (containsAny(
                req,
                "web applications",
                "web application")) {

            if (containsAny(
                    resume,
                    "web application",
                    "web applications",
                    "frontend",
                    "backend",
                    "web development")) {

                return 100;
            }
        }


        // -------------------------------------------------
        // BACKEND EXPERIENCE
        // -------------------------------------------------

        if (containsAny(
                req,
                "backend services",
                "backend experience",
                "backend")) {

            if (containsAny(
                    resume,
                    "backend",
                    "back end",
                    "node",
                    "springboot",
                    "restapi")) {

                return 100;
            }
        }


        // -------------------------------------------------
        // YEARS OF EXPERIENCE
        // -------------------------------------------------

        Matcher matcher =
                Pattern.compile(
                        "(\\d+)\\+?\\s*years?"
                ).matcher(req);


        if (matcher.find()) {

            int requiredYears =
                    Integer.parseInt(
                            matcher.group(1)
                    );


            Matcher resumeMatcher =
                    Pattern.compile(
                            "(\\d+)\\+?\\s*years?"
                    ).matcher(resume);


            if (resumeMatcher.find()) {

                int candidateYears =
                        Integer.parseInt(
                                resumeMatcher.group(1)
                        );


                if (candidateYears >=
                        requiredYears) {

                    return 100;
                }

                if (candidateYears > 0) {

                    return 50;
                }
            }


            return 0;
        }


        // -------------------------------------------------
        // FALLBACK
        // -------------------------------------------------

        return calculateMeaningfulWordMatch(
                resume,
                req
        );
    }


    // =====================================================
    // SOFT SKILLS SCORE
    // =====================================================

    private int calculateSoftSkillsScore(
            String resume,
            List<String> softSkills) {

        if (softSkills == null ||
                softSkills.isEmpty()) {

            return 100;
        }


        List<String> requirements =
                cleanRequirements(
                        softSkills
                );


        if (requirements.isEmpty()) {

            return 100;
        }


        int matched = 0;


        for (String skill :
                requirements) {

            if (softSkillExists(
                    resume,
                    skill
            )) {

                matched++;
            }
        }


        return percentage(
                matched,
                requirements.size()
        );
    }


    // =====================================================
    // SOFT SKILL MATCH
    // =====================================================

    private boolean softSkillExists(
            String resume,
            String skill) {

        String normalized =
                normalizeText(skill);


        // -------------------------------------------------
        // COMMUNICATION
        // -------------------------------------------------

        if (normalized.equals(
                "communication")) {

            return containsAny(
                    resume,
                    "communication",
                    "communicated",
                    "communicating"
            );
        }


        // -------------------------------------------------
        // TEAMWORK
        // -------------------------------------------------

        if (normalized.equals(
                "teamwork")) {

            return containsAny(
                    resume,
                    "teamwork",
                    "team member",
                    "team members",
                    "collaboration",
                    "collaborative"
            );
        }


        // -------------------------------------------------
        // COLLABORATION
        // -------------------------------------------------

        if (normalized.equals(
                "collaboration")) {

            return containsAny(
                    resume,
                    "collaboration",
                    "collaborative",
                    "teamwork",
                    "team member"
            );
        }


        // -------------------------------------------------
        // PROBLEM SOLVING
        // -------------------------------------------------

        if (normalized.equals(
                "problem solving") ||
                normalized.equals(
                        "problem-solving")) {

            return containsAny(
                    resume,
                    "problem solving",
                    "problem-solving",
                    "solved",
                    "troubleshooting",
                    "debugging"
            );
        }


        // -------------------------------------------------
        // ADAPTABILITY
        // -------------------------------------------------

        if (normalized.equals(
                "adaptability")) {

            return containsAny(
                    resume,
                    "adaptability",
                    "adaptable",
                    "flexible"
            );
        }


        // -------------------------------------------------
        // TIME MANAGEMENT
        // -------------------------------------------------

        if (normalized.equals(
                "time management")) {

            return containsAny(
                    resume,
                    "time management",
                    "deadline",
                    "deadlines",
                    "time management skills"
            );
        }


        // -------------------------------------------------
        // WILLINGNESS TO LEARN
        // -------------------------------------------------

        if (containsAny(
                normalized,
                "willingness to learn",
                "willing to learn")) {

            return containsAny(
                    resume,
                    "willingness to learn",
                    "willing to learn",
                    "learning",
                    "learn new technologies",
                    "continuous learning"
            );
        }


        // -------------------------------------------------
        // FALLBACK
        // -------------------------------------------------

        return containsWholePhrase(
                resume,
                normalized
        );
    }


    // =====================================================
    // MEANINGFUL WORD MATCH
    // Used only for fallback cases.
    // =====================================================

    private int calculateMeaningfulWordMatch(
            String resume,
            String requirement) {

        List<String> words =
                getMeaningfulWords(
                        requirement
                );


        if (words.isEmpty()) {

            return 0;
        }


        int matched = 0;


        for (String word : words) {

            if (containsWholeWord(
                    resume,
                    word
            )) {

                matched++;
            }
        }


        double ratio =
                matched * 100.0
                        / words.size();


        if (ratio >= 80) {

            return 100;

        } else if (ratio >= 60) {

            return 75;

        } else if (ratio >= 40) {

            return 50;

        } else if (ratio >= 20) {

            return 25;

        }


        return 0;
    }


    // =====================================================
    // NORMALIZE TEXT
    // =====================================================

    private String normalizeText(
            String text) {

        if (text == null) {

            return "";
        }


        String normalized =
                text.toLowerCase(
                        Locale.ROOT
                );


        normalized =
                normalized
                        .replace("c sharp", "c#")
                        .replace("c-sharp", "c#")

                        .replace(
                                "c plus plus",
                                "c++"
                        )

                        .replace(
                                "c-plus-plus",
                                "c++"
                        )

                        .replace(
                                "java script",
                                "javascript"
                        )

                        .replace(
                                "type script",
                                "typescript"
                        )

                        .replace(
                                "react.js",
                                "react"
                        )

                        .replace(
                                "react js",
                                "react"
                        )

                        .replace(
                                "node.js",
                                "node"
                        )

                        .replace(
                                "node js",
                                "node"
                        )

                        .replace(
                                "express.js",
                                "express"
                        )

                        .replace(
                                "express js",
                                "express"
                        )

                        .replace(
                                "spring boot",
                                "springboot"
                        )

                        .replace(
                                "spring-boot",
                                "springboot"
                        )

                        .replace(
                                "rest apis",
                                "restapi"
                        )

                        .replace(
                                "rest api",
                                "restapi"
                        )

                        .replace(
                                "restful apis",
                                "restapi"
                        )

                        .replace(
                                "restful api",
                                "restapi"
                        )

                        .replace(
                                "data structures",
                                "datastructures"
                        )

                        .replace(
                                "data structure",
                                "datastructures"
                        )

                        .replace(
                                "object oriented programming",
                                "oop"
                        )

                        .replace(
                                "object-oriented programming",
                                "oop"
                        );


        normalized =
                normalized
                        .replaceAll(
                                "\\s+",
                                " "
                        )
                        .trim();


        return normalized;
    }


    // =====================================================
    // CLEAN REQUIREMENTS
    // =====================================================

    private List<String> cleanRequirements(
            List<String> requirements) {

        if (requirements == null ||
                requirements.isEmpty()) {

            return Collections.emptyList();
        }


        Set<String> unique =
                new LinkedHashSet<>();


        for (String requirement :
                requirements) {

            if (requirement == null ||
                    requirement.isBlank()) {

                continue;
            }


            String cleaned =
                    normalizeText(
                            requirement
                    );


            if (!cleaned.isBlank()) {

                unique.add(cleaned);
            }
        }


        return new ArrayList<>(
                unique
        );
    }


    // =====================================================
    // MEANINGFUL WORDS
    // =====================================================

    private List<String> getMeaningfulWords(
            String requirement) {

        if (requirement == null ||
                requirement.isBlank()) {

            return Collections.emptyList();
        }


        String cleaned =
                requirement
                        .replaceAll(
                                "[^a-zA-Z0-9+#.]",
                                " "
                        );


        String[] words =
                cleaned.split(
                        "\\s+"
                );


        Set<String> stopWords =
                Set.of(
                        "and",
                        "the",
                        "with",
                        "for",
                        "from",
                        "that",
                        "this",
                        "have",
                        "has",
                        "using",
                        "use",
                        "able",
                        "work",
                        "working",
                        "knowledge",
                        "strong",
                        "good",
                        "experience",
                        "experiences",
                        "years",
                        "year",
                        "degree",
                        "required",
                        "preferred",
                        "desired",
                        "candidate",
                        "skills",
                        "skill",
                        "ability",
                        "including",
                        "such",
                        "etc",
                        "currently",
                        "pursuing",
                        "related",
                        "field"
                );


        Set<String> meaningful =
                new LinkedHashSet<>();


        for (String word :
                words) {

            String lower =
                    word.toLowerCase(
                            Locale.ROOT
                    ).trim();


            if (lower.length() < 2) {

                continue;
            }


            if (stopWords.contains(
                    lower
            )) {

                continue;
            }


            meaningful.add(
                    lower
            );
        }


        return new ArrayList<>(
                meaningful
        );
    }


    // =====================================================
    // WHOLE WORD
    // =====================================================

    private boolean containsWholeWord(
            String text,
            String word) {

        if (text == null ||
                word == null ||
                word.isBlank()) {

            return false;
        }


        String pattern =
                "(?<![a-zA-Z0-9])"
                        +
                        Pattern.quote(
                                word
                        )
                        +
                        "(?![a-zA-Z0-9])";


        return Pattern
                .compile(
                        pattern,
                        Pattern.CASE_INSENSITIVE
                )
                .matcher(text)
                .find();
    }


    // =====================================================
    // WHOLE PHRASE
    // =====================================================

    private boolean containsWholePhrase(
            String text,
            String phrase) {

        if (text == null ||
                phrase == null ||
                phrase.isBlank()) {

            return false;
        }


        String pattern =
                "(?<![a-zA-Z0-9])"
                        +
                        Pattern.quote(
                                phrase
                        )
                        +
                        "(?![a-zA-Z0-9])";


        return Pattern
                .compile(
                        pattern,
                        Pattern.CASE_INSENSITIVE
                )
                .matcher(text)
                .find();
    }


    // =====================================================
    // NORMAL PHRASE
    // =====================================================

    private boolean containsPhrase(
            String text,
            String phrase) {

        if (text == null ||
                phrase == null ||
                phrase.isBlank()) {

            return false;
        }


        return text.contains(
                phrase.toLowerCase(
                        Locale.ROOT
                )
        );
    }


    // =====================================================
    // ANY MATCH
    // =====================================================

    private boolean containsAny(
            String text,
            String... values) {

        if (text == null ||
                values == null) {

            return false;
        }


        for (String value :
                values) {

            if (value == null ||
                    value.isBlank()) {

                continue;
            }


            String normalizedValue =
                    normalizeText(
                            value
                    );


            if (normalizedValue.contains(
                    " "
            )) {

                if (text.contains(
                        normalizedValue
                )) {

                    return true;
                }

            } else {

                if (containsWholeWord(
                        text,
                        normalizedValue
                )) {

                    return true;
                }
            }
        }


        return false;
    }


    // =====================================================
    // BOOLEAN PAIR SCORE
    // =====================================================

    private int scoreBooleanPair(
            boolean first,
            boolean second) {

        if (first && second) {

            return 100;
        }

        if (first || second) {

            return 50;
        }

        return 0;
    }


    // =====================================================
    // PARTIAL SCORE
    // =====================================================

    private int partialScore(
            int matched,
            int expected) {

        if (expected <= 0) {

            return 100;
        }


        return clamp(
                (int) Math.round(
                        matched * 100.0
                                / expected
                )
        );
    }


    // =====================================================
    // PERCENTAGE
    // =====================================================

    private int percentage(
            int matched,
            int total) {

        if (total <= 0) {

            return 100;
        }


        return clamp(
                (int) Math.round(
                        matched * 100.0
                                / total
                )
        );
    }


    // =====================================================
    // CLAMP
    // =====================================================

    private int clamp(
            int value) {

        return Math.max(
                0,
                Math.min(
                        100,
                        value
                )
        );
    }


    // =====================================================
    // ATS SCORE RESULT
    // =====================================================

    public static class ATSScoreResult {

        private final int finalScore;

        private final int technicalSkillsScore;

        private final int responsibilitiesScore;

        private final int educationScore;

        private final int experienceScore;

        private final int softSkillsScore;


        public ATSScoreResult(
                int finalScore,
                int technicalSkillsScore,
                int responsibilitiesScore,
                int educationScore,
                int experienceScore,
                int softSkillsScore) {

            this.finalScore =
                    finalScore;

            this.technicalSkillsScore =
                    technicalSkillsScore;

            this.responsibilitiesScore =
                    responsibilitiesScore;

            this.educationScore =
                    educationScore;

            this.experienceScore =
                    experienceScore;

            this.softSkillsScore =
                    softSkillsScore;
        }


        // =================================================
        // GETTERS
        // =================================================

        public int getFinalScore() {

            return finalScore;
        }


        public int getTechnicalSkillsScore() {

            return technicalSkillsScore;
        }


        public int getResponsibilitiesScore() {

            return responsibilitiesScore;
        }


        public int getEducationScore() {

            return educationScore;
        }


        public int getExperienceScore() {

            return experienceScore;
        }


        public int getSoftSkillsScore() {

            return softSkillsScore;
        }
    }
}