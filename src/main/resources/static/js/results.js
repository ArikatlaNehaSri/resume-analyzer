document.addEventListener("DOMContentLoaded", function () {

    const storedData =
        sessionStorage.getItem("resumeAnalysis");


    if (!storedData) {

        window.location.href = "/";

        return;
    }


    let analysis;


    try {

        analysis = JSON.parse(storedData);

    } catch (error) {

        console.error(
            "Could not read analysis data.",
            error
        );

        window.location.href = "/";

        return;
    }



    // ==========================================
    // ATS SCORE
    // ==========================================

    const score =
        Math.max(
            0,
            Math.min(
                100,
                Number(analysis.atsScore) || 0
            )
        );


    const scoreNumber =
        document.getElementById("scoreNumber");


    const scoreProgress =
        document.getElementById("scoreProgress");


    const scoreTitle =
        document.getElementById("scoreTitle");


    const scoreDescription =
        document.getElementById("scoreDescription");



    // ==========================================
    // SVG CIRCLE
    // ==========================================

    const radius = 82;

    const circumference =
        2 * Math.PI * radius;


    if (scoreProgress) {

        scoreProgress.style.strokeDasharray =
            circumference;

        scoreProgress.style.strokeDashoffset =
            circumference;

    }



    // ==========================================
    // SCORE NUMBER ANIMATION
    // ==========================================

    let currentScore = 0;


    const duration = 1800;


    const startTime =
        performance.now();


    function animateScore(currentTime) {

        const elapsed =
            currentTime - startTime;


        const progress =
            Math.min(
                elapsed / duration,
                1
            );


        /*
         * Ease-out animation.
         * Starts quickly and slows down
         * near the final score.
         */

        const easedProgress =
            1 -
            Math.pow(
                1 - progress,
                3
            );


        currentScore =
            Math.round(
                easedProgress * score
            );


        if (scoreNumber) {

            scoreNumber.textContent =
                currentScore;

        }


        if (scoreProgress) {

            const offset =
                circumference -
                (currentScore / 100) *
                circumference;


            scoreProgress.style.strokeDashoffset =
                offset;

        }


        if (progress < 1) {

            requestAnimationFrame(
                animateScore
            );

        } else {

            if (scoreNumber) {

                scoreNumber.textContent =
                    score;

            }


            if (scoreProgress) {

                scoreProgress.style.strokeDashoffset =
                    circumference -
                    (score / 100) *
                    circumference;

            }


            /*
             * Small finishing animation
             */

            if (scoreProgress) {

                scoreProgress.classList.add(
                    "score-complete"
                );

            }

        }

    }


    requestAnimationFrame(
        animateScore
    );



    // ==========================================
    // SCORE MESSAGE
    // ==========================================

    if (score >= 80) {

        scoreTitle.textContent =
            "Excellent Match! 🎯";


        scoreDescription.textContent =
            "Your resume has a strong match with the job description.";

    }

    else if (score >= 60) {

        scoreTitle.textContent =
            "Good Match! 👍";


        scoreDescription.textContent =
            "Your resume matches many of the important job requirements.";

    }

    else if (score >= 40) {

        scoreTitle.textContent =
            "Needs Improvement";


        scoreDescription.textContent =
            "Your resume has some relevant skills, but there are important gaps.";

    }

    else {

        scoreTitle.textContent =
            "Low Match";


        scoreDescription.textContent =
            "Consider improving your resume to better match this position.";

    }



    // ==========================================
    // SUMMARY
    // ==========================================

    const summary =
        document.getElementById("summary");


    summary.textContent =
        analysis.summary ||
        "No summary was generated.";



    // ==========================================
    // MATCHED SKILLS
    // ==========================================

    const matchedContainer =
        document.getElementById(
            "matchedSkills"
        );


    const matchedSkills =
        Array.isArray(
            analysis.matchedSkills
        )
            ? analysis.matchedSkills
            : [];


    if (matchedSkills.length === 0) {

        matchedContainer.innerHTML =
            '<span class="no-data">No matching skills identified.</span>';

    }

    else {

        matchedSkills.forEach(
            function (skill, index) {

                const element =
                    document.createElement(
                        "span"
                    );


                element.className =
                    "skill matched-skill";


                element.style.animationDelay =
                    (index * 0.08) + "s";


                element.innerHTML =
                    '<i class="fa-solid fa-check"></i> ' +
                    escapeHtml(skill);


                matchedContainer.appendChild(
                    element
                );

            }
        );

    }



    // ==========================================
    // MISSING SKILLS
    // ==========================================

    const missingContainer =
        document.getElementById(
            "missingSkills"
        );


    const missingSkills =
        Array.isArray(
            analysis.missingSkills
        )
            ? analysis.missingSkills
            : [];


    if (missingSkills.length === 0) {

        missingContainer.innerHTML =
            '<span class="no-data">No major missing skills identified.</span>';

    }

    else {

        missingSkills.forEach(
            function (skill, index) {

                const element =
                    document.createElement(
                        "span"
                    );


                element.className =
                    "skill missing-skill";


                element.style.animationDelay =
                    (index * 0.08) + "s";


                element.innerHTML =
                    '<i class="fa-solid fa-xmark"></i> ' +
                    escapeHtml(skill);


                missingContainer.appendChild(
                    element
                );

            }
        );

    }



    // ==========================================
    // AI SUGGESTIONS
    // ==========================================

    const suggestionsContainer =
        document.getElementById(
            "suggestions"
        );


    const suggestions =
        Array.isArray(
            analysis.suggestions
        )
            ? analysis.suggestions
            : [];


    if (suggestions.length === 0) {

        suggestionsContainer.innerHTML =
            '<div class="suggestion">No additional suggestions were generated.</div>';

    }

    else {

        suggestions.forEach(
            function (suggestion) {

                const element =
                    document.createElement(
                        "div"
                    );


                element.className =
                    "suggestion";


                element.innerHTML =
                    '<i class="fa-solid fa-lightbulb"></i>' +
                    escapeHtml(suggestion);


                suggestionsContainer.appendChild(
                    element
                );

            }
        );

    }



    // ==========================================
    // DOWNLOAD REPORT
    // ==========================================

    const downloadButton =
        document.getElementById(
            "downloadReport"
        );


    if (downloadButton) {

        downloadButton.addEventListener(
            "click",
            function () {

                const report = `# AI RESUME ANALYZER

ATS SCORE: ${score}%

SUMMARY:
${analysis.summary || "No summary available."}

MATCHED SKILLS:
${
                    matchedSkills.length
                        ? matchedSkills
                            .map(
                                skill => "✓ " + skill
                            )
                            .join("\n")
                        : "None"
                }

MISSING SKILLS:
${
                    missingSkills.length
                        ? missingSkills
                            .map(
                                skill => "✗ " + skill
                            )
                            .join("\n")
                        : "None"
                }

AI SUGGESTIONS:
${
                    suggestions.length
                        ? suggestions
                            .map(
                                (item, index) =>
                                    `${index + 1}. ${item}`
                            )
                            .join("\n")
                        : "None"
                }
`;


                const blob =
                    new Blob(
                        [report],
                        {
                            type:
                                "text/plain"
                        }
                    );


                const url =
                    URL.createObjectURL(
                        blob
                    );


                const link =
                    document.createElement(
                        "a"
                    );


                link.href = url;


                link.download =
                    "AI_Resume_Analysis.txt";


                document.body.appendChild(
                    link
                );


                link.click();


                document.body.removeChild(
                    link
                );


                URL.revokeObjectURL(
                    url
                );

            }
        );

    }



    // ==========================================
    // HTML ESCAPE
    // ==========================================

    function escapeHtml(value) {

        const div =
            document.createElement(
                "div"
            );


        div.textContent =
            value;


        return div.innerHTML;

    }

});