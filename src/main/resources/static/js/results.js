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
        Number(analysis.atsScore) || 0;

    const scoreNumber =
        document.getElementById("scoreNumber");

    const scoreProgress =
        document.getElementById("scoreProgress");

    const scoreTitle =
        document.getElementById("scoreTitle");

    const scoreDescription =
        document.getElementById("scoreDescription");


    // SVG circle circumference
    const circumference = 515;

    const finalOffset =
        circumference -
        (score / 100) * circumference;


    // Animate score number
    let currentScore = 0;

    const scoreAnimation =
        setInterval(function () {

            currentScore++;

            scoreNumber.textContent =
                currentScore;

            if (currentScore >= score) {

                clearInterval(scoreAnimation);

            }

        }, 20);


    // Animate circular progress
    setTimeout(function () {

        scoreProgress.style.strokeDashoffset =
            finalOffset;

    }, 200);


    // Score message
    if (score >= 80) {

        scoreTitle.textContent =
            "Excellent Match! 🎯";

        scoreDescription.textContent =
            "Your resume has a strong match with the job description.";

    } else if (score >= 60) {

        scoreTitle.textContent =
            "Good Match! 👍";

        scoreDescription.textContent =
            "Your resume matches many of the important job requirements.";

    } else if (score >= 40) {

        scoreTitle.textContent =
            "Needs Improvement";

        scoreDescription.textContent =
            "Your resume has some relevant skills, but there are important gaps.";

    } else {

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
        document.getElementById("matchedSkills");

    const matchedSkills =
        Array.isArray(analysis.matchedSkills)
            ? analysis.matchedSkills
            : [];


    if (matchedSkills.length === 0) {

        matchedContainer.innerHTML =
            '<span class="no-data">No matching skills identified.</span>';

    } else {

        matchedSkills.forEach(function (skill, index) {

            const element =
                document.createElement("span");

            element.className =
                "skill matched-skill";

            element.style.animationDelay =
                (index * 0.08) + "s";

            element.innerHTML =
                '<i class="fa-solid fa-check"></i> ' +
                escapeHtml(skill);

            matchedContainer.appendChild(element);

        });
    }


    // ==========================================
    // MISSING SKILLS
    // ==========================================

    const missingContainer =
        document.getElementById("missingSkills");

    const missingSkills =
        Array.isArray(analysis.missingSkills)
            ? analysis.missingSkills
            : [];


    if (missingSkills.length === 0) {

        missingContainer.innerHTML =
            '<span class="no-data">No major missing skills identified.</span>';

    } else {

        missingSkills.forEach(function (skill, index) {

            const element =
                document.createElement("span");

            element.className =
                "skill missing-skill";

            element.style.animationDelay =
                (index * 0.08) + "s";

            element.innerHTML =
                '<i class="fa-solid fa-xmark"></i> ' +
                escapeHtml(skill);

            missingContainer.appendChild(element);

        });
    }


    // ==========================================
    // AI SUGGESTIONS
    // ==========================================

    const suggestionsContainer =
        document.getElementById("suggestions");

    const suggestions =
        Array.isArray(analysis.suggestions)
            ? analysis.suggestions
            : [];


    if (suggestions.length === 0) {

        suggestionsContainer.innerHTML =
            '<div class="suggestion">No additional suggestions were generated.</div>';

    } else {

        suggestions.forEach(function (suggestion) {

            const element =
                document.createElement("div");

            element.className =
                "suggestion";

            element.innerHTML =
                '<i class="fa-solid fa-lightbulb"></i>' +
                escapeHtml(suggestion);

            suggestionsContainer.appendChild(element);

        });
    }


    // ==========================================
    // DOWNLOAD REPORT
    // ==========================================

    const downloadButton =
        document.getElementById("downloadReport");


    downloadButton.addEventListener(
        "click",
        function () {

            const report = `
AI RESUME ANALYZER
==================

ATS SCORE: ${score}%

SUMMARY:
${analysis.summary || "No summary available."}

MATCHED SKILLS:
${matchedSkills.length
                ? matchedSkills.map(skill => "✓ " + skill).join("\n")
                : "None"}

MISSING SKILLS:
${missingSkills.length
                ? missingSkills.map(skill => "✗ " + skill).join("\n")
                : "None"}

AI SUGGESTIONS:
${suggestions.length
                ? suggestions.map((item, index) =>
                    `${index + 1}. ${item}`).join("\n")
                : "None"}
`;

            const blob =
                new Blob(
                    [report],
                    { type: "text/plain" }
                );

            const url =
                URL.createObjectURL(blob);

            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                "AI_Resume_Analysis.txt";

            link.click();

            URL.revokeObjectURL(url);

        }
    );


    // ==========================================
    // HTML ESCAPE
    // ==========================================

    function escapeHtml(value) {

        const div =
            document.createElement("div");

        div.textContent =
            value;

        return div.innerHTML;
    }

});