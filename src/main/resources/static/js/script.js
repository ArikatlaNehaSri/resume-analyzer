document.addEventListener("DOMContentLoaded", function () {

    const form = document.querySelector("form");
    const fileInput = document.querySelector('input[type="file"]');
    const jobDescription = document.querySelector("textarea");
    const analyzeButton = document.querySelector("button");

    if (!form || !fileInput || !jobDescription || !analyzeButton) {
        console.error("Required elements not found.");
        return;
    }

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        // Check resume
        if (!fileInput.files || fileInput.files.length === 0) {

            alert("Please upload your resume first.");
            return;
        }

        // Check job description
        if (jobDescription.value.trim() === "") {

            alert("Please enter the Job Description.");
            return;
        }

        const resumeFile = fileInput.files[0];

        // Check file type
        const fileName = resumeFile.name.toLowerCase();

        if (!fileName.endsWith(".pdf") &&
            !fileName.endsWith(".docx")) {

            alert("Only PDF and DOCX files are allowed.");
            return;
        }

        // Create form data
        const formData = new FormData();

        formData.append("resume", resumeFile);

        formData.append(
            "jobDescription",
            jobDescription.value
        );

        // Loading state
        const originalButtonText =
            analyzeButton.innerHTML;

        analyzeButton.disabled = true;

        analyzeButton.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Analyzing...';

        try {

            const response = await fetch(
                "/api/resume/analyze",
                {
                    method: "POST",
                    body: formData
                }
            );

            const result = await response.json();

            if (!response.ok) {

                throw new Error(
                    result.message ||
                    result ||
                    "Resume analysis failed."
                );
            }

            // Store result
            sessionStorage.setItem(
                "resumeAnalysis",
                JSON.stringify(result)
            );

            // Go to results page
            window.location.href = "/results";

        } catch (error) {

            console.error(
                "Analysis Error:",
                error
            );

            alert(
                "Could not analyze your resume.\n\n" +
                error.message
            );

        } finally {

            analyzeButton.disabled = false;

            analyzeButton.innerHTML =
                originalButtonText;
        }
    });
});