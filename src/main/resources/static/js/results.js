document.addEventListener("DOMContentLoaded", function () {

    // =========================================================
    // LOAD ANALYSIS RESULT
    // =========================================================

    const storedData = sessionStorage.getItem("analysisResult");

    console.log("Stored analysis result:", storedData);

    if (!storedData) {
        console.error("No analysis result found in sessionStorage.");
        window.location.href = "/";
        return;
    }

    let analysis;

    try {
        analysis = JSON.parse(storedData);
        console.log("Analysis object:", analysis);
    } catch (error) {
        console.error("Error parsing analysis result:", error);
        window.location.href = "/";
        return;
    }


    // =========================================================
    // HELPER FUNCTIONS
    // =========================================================

    function numberValue(value) {
        const n = Number(value);
        return Number.isFinite(n) ? n : 0;
    }

    function arrayValue(value) {
        return Array.isArray(value) ? value : [];
    }

    function escapeHtml(value) {
        const div = document.createElement("div");
        div.textContent = value == null ? "" : String(value);
        return div.innerHTML;
    }


    // =========================================================
    // ATS SCORE
    // =========================================================

    const score = Math.max(
        0,
        Math.min(
            100,
            Math.round(numberValue(analysis.atsScore))
        )
    );

    console.log("ATS Score:", score);


    const scoreNumber =
        document.getElementById("scoreNumber");

    const scoreProgress =
        document.getElementById("scoreProgress");

    const scoreTitle =
        document.getElementById("scoreTitle");

    const scoreDescription =
        document.getElementById("scoreDescription");


    // =========================================================
    // SCORE CIRCLE
    // =========================================================

    const radius = 82;

    const circumference = 2 * Math.PI * radius;

    if (scoreProgress) {

        scoreProgress.style.strokeDasharray =
            circumference;

        scoreProgress.style.strokeDashoffset =
            circumference;
    }


    // =========================================================
    // SCORE ANIMATION
    // =========================================================

    const duration = 1500;

    const startTime = performance.now();

    function animateScore(currentTime) {

        const elapsed =
            currentTime - startTime;

        const progress =
            Math.min(elapsed / duration, 1);

        const eased =
            1 - Math.pow(1 - progress, 3);

        const currentScore =
            Math.round(eased * score);


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
                scoreNumber.textContent = score;
            }

            if (scoreProgress) {

                scoreProgress.style.strokeDashoffset =
                    circumference -
                    (score / 100) *
                    circumference;
            }
        }
    }

    requestAnimationFrame(animateScore);


    // =========================================================
    // SCORE MESSAGE
    // =========================================================

    if (scoreTitle && scoreDescription) {

        if (score >= 80) {

            scoreTitle.textContent =
                "Excellent Match!";

            scoreDescription.textContent =
                "Your resume has a strong match with the job description.";

        } else if (score >= 60) {

            scoreTitle.textContent =
                "Good Match!";

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
    }


    // =========================================================
    // SUMMARY
    // =========================================================

    const summary =
        document.getElementById("summary");

    if (summary) {

        summary.textContent =
            analysis.summary ||
            "No summary was generated.";
    }


    // =========================================================
    // MATCHED SKILLS
    // =========================================================

    const matchedContainer =
        document.getElementById("matchedSkills");

    const matchedSkills =
        arrayValue(analysis.matchedSkills);


    if (matchedContainer) {

        matchedContainer.innerHTML = "";

        if (matchedSkills.length === 0) {

            matchedContainer.innerHTML =
                '<span class="no-data">No matching skills identified.</span>';

        } else {

            matchedSkills.forEach(
                function (skill, index) {

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
                }
            );
        }
    }


    // =========================================================
    // MISSING SKILLS
    // =========================================================

    const missingContainer =
        document.getElementById("missingSkills");

    const missingSkills =
        arrayValue(analysis.missingSkills);


    if (missingContainer) {

        missingContainer.innerHTML = "";

        if (missingSkills.length === 0) {

            missingContainer.innerHTML =
                '<span class="no-data">No major missing skills identified.</span>';

        } else {

            missingSkills.forEach(
                function (skill, index) {

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
                }
            );
        }
    }


    // =========================================================
    // AI SUGGESTIONS
    // =========================================================

    const suggestionsContainer =
        document.getElementById("suggestions");

    const suggestions =
        arrayValue(analysis.suggestions);


    if (suggestionsContainer) {

        suggestionsContainer.innerHTML = "";

        if (suggestions.length === 0) {

            suggestionsContainer.innerHTML =
                '<div class="suggestion">No additional suggestions were generated.</div>';

        } else {

            suggestions.forEach(
                function (suggestion) {

                    const element =
                        document.createElement("div");

                    element.className =
                        "suggestion";

                    element.innerHTML =
                        '<i class="fa-solid fa-lightbulb"></i> ' +
                        escapeHtml(suggestion);

                    suggestionsContainer.appendChild(element);
                }
            );
        }
    }


    // =========================================================
    // DOWNLOAD PDF BUTTON
    // =========================================================

    // =========================================================
// DOWNLOAD PDF
// =========================================================

    const downloadButton =
        document.getElementById("downloadReport");

    if (downloadButton) {

        downloadButton.addEventListener("click", function (event) {

            event.preventDefault();

            console.log("PDF download button clicked");

            downloadButton.disabled = true;

            const originalText =
                downloadButton.innerHTML;

            downloadButton.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i> Generating PDF...';

            try {

                generatePDF();

                setTimeout(function () {

                    downloadButton.disabled = false;

                    downloadButton.innerHTML =
                        originalText;

                }, 1000);

            } catch (error) {

                console.error(
                    "PDF generation failed:",
                    error
                );

                downloadButton.disabled = false;

                downloadButton.innerHTML =
                    originalText;
            }
        });
    }


// =========================================================
// GENERATE PDF
// =========================================================

    function generatePDF() {

        const PAGE_WIDTH = 595;
        const PAGE_HEIGHT = 842;

        const LEFT = 45;
        const TOP = 55;
        const BOTTOM = 55;

        const FONT_NORMAL = 10;
        const FONT_HEADING = 14;
        const FONT_TITLE = 20;

        const usableWidth =
            PAGE_WIDTH - (LEFT * 2);


        // =====================================================
        // GET DATA
        // =====================================================

        const technical =
            Math.round(
                numberValue(
                    analysis.technicalSkillsScore
                )
            );

        const responsibilities =
            Math.round(
                numberValue(
                    analysis.responsibilitiesScore
                )
            );

        const education =
            Math.round(
                numberValue(
                    analysis.educationScore
                )
            );

        const experience =
            Math.round(
                numberValue(
                    analysis.experienceScore
                )
            );

        const softSkills =
            Math.round(
                numberValue(
                    analysis.softSkillsScore
                )
            );


        // =====================================================
        // PDF CONTENT
        // =====================================================

        const content = [];


        function addLine(
            text,
            size = FONT_NORMAL,
            bold = false,
            gap = 5
        ) {

            const wrapped =
                wrapPDFText(
                    cleanPDFText(text),
                    size
                );

            wrapped.forEach(function (line) {

                content.push({
                    text: line,
                    size: size,
                    bold: bold,
                    gap: gap
                });

            });
        }


        function addHeading(text) {

            content.push({
                text: cleanPDFText(text),
                size: FONT_HEADING,
                bold: true,
                gap: 8
            });

        }


        function addBullet(text) {

            addLine(
                "- " + text,
                FONT_NORMAL,
                false,
                3
            );

        }


        // =====================================================
        // REPORT
        // =====================================================

        addLine(
            "AI RESUME ANALYZER",
            FONT_TITLE,
            true,
            12
        );

        addLine(
            "ATS Resume Analysis Report",
            FONT_NORMAL,
            false,
            12
        );


        addHeading("ATS SCORE");

        addLine(
            score + "%",
            16,
            true,
            12
        );


        addHeading("SCORE BREAKDOWN");

        addLine(
            "Technical Skills: " +
            technical +
            "%"
        );

        addLine(
            "Responsibilities: " +
            responsibilities +
            "%"
        );

        addLine(
            "Education: " +
            education +
            "%"
        );

        addLine(
            "Experience: " +
            experience +
            "%"
        );

        addLine(
            "Soft Skills: " +
            softSkills +
            "%",
            FONT_NORMAL,
            false,
            10
        );


        addHeading("RESUME SUMMARY");

        addLine(
            analysis.summary ||
            "No summary available.",
            FONT_NORMAL,
            false,
            10
        );


        addHeading("MATCHED SKILLS");

        if (matchedSkills.length > 0) {

            matchedSkills.forEach(function (skill) {

                addBullet(skill);

            });

        } else {

            addLine("None");
        }


        addHeading("MISSING SKILLS");

        if (missingSkills.length > 0) {

            missingSkills.forEach(function (skill) {

                addBullet(skill);

            });

        } else {

            addLine("None");
        }


        addHeading(
            "AI IMPROVEMENT SUGGESTIONS"
        );

        if (suggestions.length > 0) {

            suggestions.forEach(
                function (suggestion, index) {

                    addLine(
                        (index + 1) +
                        ". " +
                        suggestion,
                        FONT_NORMAL,
                        false,
                        4
                    );

                }
            );

        } else {

            addLine("None");
        }


        // =====================================================
        // CREATE PAGES
        // =====================================================

        const pages = [];

        let currentPage = [];

        let y =
            PAGE_HEIGHT -
            TOP;


        content.forEach(function (item) {

            const lineHeight =
                item.size * 1.45;


            if (
                y -
                lineHeight <
                BOTTOM + 25
            ) {

                pages.push(
                    currentPage
                );

                currentPage = [];

                y =
                    PAGE_HEIGHT -
                    TOP;
            }


            currentPage.push({

                text: item.text,

                size: item.size,

                bold: item.bold,

                y: y

            });


            y -=
                lineHeight +
                item.gap;

        });


        if (currentPage.length > 0) {

            pages.push(
                currentPage
            );
        }


        // =====================================================
        // PDF OBJECTS
        // =====================================================

        const objects = [null];


        // 1 - Catalog

        objects.push(
            "<< /Type /Catalog /Pages 2 0 R >>"
        );


        // 2 - Pages

        objects.push("");


        // 3 - Helvetica

        objects.push(
            "<< /Type /Font " +
            "/Subtype /Type1 " +
            "/BaseFont /Helvetica >>"
        );


        // 4 - Helvetica Bold

        objects.push(
            "<< /Type /Font " +
            "/Subtype /Type1 " +
            "/BaseFont /Helvetica-Bold >>"
        );


        const pageIds = [];

        const contentIds = [];


        pages.forEach(function () {

            const contentId =
                objects.length;

            objects.push("");

            contentIds.push(
                contentId
            );


            const pageId =
                objects.length;

            objects.push("");

            pageIds.push(
                pageId
            );

        });


        // =====================================================
        // PAGES TREE
        // =====================================================

        objects[2] =
            "<< /Type /Pages " +
            "/Kids [" +
            pageIds
                .map(function (id) {

                    return id + " 0 R";

                })
                .join(" ") +
            "] " +
            "/Count " +
            pageIds.length +
            " >>";


        // =====================================================
        // BUILD EACH PAGE
        // =====================================================

        pages.forEach(
            function (
                pageData,
                pageIndex
            ) {

                let stream = "";

                stream += "BT\n";


                pageData.forEach(
                    function (line) {

                        const font =
                            line.bold
                                ? "F2"
                                : "F1";


                        stream +=
                            "/" +
                            font +
                            " " +
                            line.size +
                            " Tf\n";


                        stream +=
                            "1 0 0 1 " +
                            LEFT +
                            " " +
                            line.y +
                            " Tm\n";


                        stream +=
                            "(" +
                            escapePDFText(
                                line.text
                            ) +
                            ") Tj\n";

                    }
                );


                // Footer

                stream +=
                    "/F1 8 Tf\n";

                stream +=
                    "1 0 0 1 " +
                    LEFT +
                    " 25 Tm\n";

                stream +=
                    "(" +
                    escapePDFText(
                        "AI Resume Analyzer - Page " +
                        (pageIndex + 1) +
                        " of " +
                        pages.length
                    ) +
                    ") Tj\n";


                stream +=
                    "ET";


                const contentId =
                    contentIds[pageIndex];


                objects[contentId] =
                    "<< /Length " +
                    pdfByteLength(stream) +
                    " >>\n" +
                    "stream\n" +
                    stream +
                    "\nendstream";


                const pageId =
                    pageIds[pageIndex];


                objects[pageId] =
                    "<< /Type /Page " +
                    "/Parent 2 0 R " +
                    "/MediaBox [0 0 " +
                    PAGE_WIDTH +
                    " " +
                    PAGE_HEIGHT +
                    "] " +
                    "/Resources << " +
                    "/Font << " +
                    "/F1 3 0 R " +
                    "/F2 4 0 R " +
                    ">> >> " +
                    "/Contents " +
                    contentId +
                    " 0 R >>";

            }
        );


        // =====================================================
        // BUILD PDF FILE
        // =====================================================

        let pdf =
            "%PDF-1.4\n";


        const offsets = [0];


        for (
            let i = 1;
            i < objects.length;
            i++
        ) {

            offsets[i] =
                pdfByteLength(pdf);


            pdf +=
                i +
                " 0 obj\n" +
                objects[i] +
                "\n" +
                "endobj\n";

        }


        const xrefOffset =
            pdfByteLength(pdf);


        pdf +=
            "xref\n" +
            "0 " +
            objects.length +
            "\n";


        pdf +=
            "0000000000 65535 f \n";


        for (
            let i = 1;
            i < objects.length;
            i++
        ) {

            pdf +=
                String(offsets[i])
                    .padStart(10, "0") +
                " 00000 n \n";

        }


        pdf +=
            "trailer\n" +
            "<< /Size " +
            objects.length +
            " /Root 1 0 R >>\n" +
            "startxref\n" +
            xrefOffset +
            "\n" +
            "%%EOF";


        // =====================================================
        // DOWNLOAD
        // =====================================================

        const pdfBlob =
            new Blob(
                [pdf],
                {
                    type: "application/pdf"
                }
            );


        const blobUrl =
            URL.createObjectURL(
                pdfBlob
            );


        const link =
            document.createElement("a");


        link.href =
            blobUrl;


        link.download =
            "AI_Resume_Analysis.pdf";


        link.setAttribute(
            "download",
            "AI_Resume_Analysis.pdf"
        );


        link.style.position =
            "fixed";

        link.style.left =
            "-9999px";


        document.body.appendChild(
            link
        );


        link.click();


        document.body.removeChild(
            link
        );


        setTimeout(
            function () {

                URL.revokeObjectURL(
                    blobUrl
                );

            },
            5000
        );


        console.log(
            "AI_Resume_Analysis.pdf download started."
        );
    }


// =========================================================
// PDF HELPERS
// =========================================================

    function cleanPDFText(value) {

        return String(
            value == null
                ? ""
                : value
        )
            .replace(
                /\r?\n/g,
                " "
            )
            .normalize("NFKD")
            .replace(
                /[^\x20-\x7E]/g,
                "?"
            )
            .replace(
                /\s+/g,
                " "
            )
            .trim();
    }


    function escapePDFText(value) {

        return String(value)
            .replace(
                /\\/g,
                "\\\\"
            )
            .replace(
                /\(/g,
                "\\("
            )
            .replace(
                /\)/g,
                "\\)"
            );
    }


    function pdfByteLength(value) {

        return new TextEncoder()
            .encode(value)
            .length;
    }


    function wrapPDFText(text, fontSize) {

        const pageWidth = 595;
        const leftMargin = 45;

        const usableWidth =
            pageWidth - (leftMargin * 2);

        const charsPerLine =
            Math.max(
                25,
                Math.floor(
                    usableWidth /
                    (fontSize * 0.52)
                )
            );

        const words =
            String(text).split(/\s+/);

        const lines = [];

        let current = "";

        words.forEach(function (word) {

            if (!word) {
                return;
            }

            const test =
                current
                    ? current + " " + word
                    : word;

            if (test.length > charsPerLine) {

                if (current) {
                    lines.push(current);
                }

                current = word;

            } else {

                current = test;
            }
        });

        if (current) {
            lines.push(current);
        }

        return lines.length
            ? lines
            : [""];
    }


    // =========================================================
    // PDF GENERATOR
    // =========================================================

    function createPDF() {

        const PAGE_WIDTH = 595;
        const PAGE_HEIGHT = 842;

        const LEFT = 45;
        const TOP = 55;
        const BOTTOM = 55;

        const usableWidth =
            PAGE_WIDTH - (LEFT * 2);


        // -----------------------------------------------------
        // SCORE BREAKDOWN
        // -----------------------------------------------------

        const technical =
            Math.round(
                numberValue(
                    analysis.technicalSkillsScore
                )
            );

        const responsibilities =
            Math.round(
                numberValue(
                    analysis.responsibilitiesScore
                )
            );

        const education =
            Math.round(
                numberValue(
                    analysis.educationScore
                )
            );

        const experience =
            Math.round(
                numberValue(
                    analysis.experienceScore
                )
            );

        const softSkills =
            Math.round(
                numberValue(
                    analysis.softSkillsScore
                )
            );


        // -----------------------------------------------------
        // PDF CONTENT
        // -----------------------------------------------------

        const content = [];


        function addTitle(text) {

            content.push({
                text: cleanText(text),
                size: 20,
                bold: true,
                gap: 12
            });
        }


        function addHeading(text) {

            content.push({
                text: cleanText(text),
                size: 14,
                bold: true,
                gap: 7
            });
        }


        function addBody(text) {

            const lines =
                wrapText(
                    cleanText(text),
                    10
                );

            lines.forEach(
                function (line) {

                    content.push({
                        text: line,
                        size: 10,
                        bold: false,
                        gap: 3
                    });
                }
            );

            if (content.length > 0) {
                content[content.length - 1].gap = 8;
            }
        }


        function addBullet(text) {

            const lines =
                wrapText(
                    "- " + cleanText(text),
                    10
                );

            lines.forEach(
                function (line) {

                    content.push({
                        text: line,
                        size: 10,
                        bold: false,
                        gap: 3
                    });
                }
            );
        }


        // -----------------------------------------------------
        // TITLE
        // -----------------------------------------------------

        addTitle("AI RESUME ANALYZER");

        addBody(
            "ATS Resume Analysis Report"
        );


        // -----------------------------------------------------
        // ATS SCORE
        // -----------------------------------------------------

        addHeading("ATS SCORE");

        addBody(score + "%");


        // -----------------------------------------------------
        // SCORE BREAKDOWN
        // -----------------------------------------------------

        addHeading("SCORE BREAKDOWN");

        addBody(
            "Technical Skills: " +
            technical +
            "%"
        );

        addBody(
            "Responsibilities: " +
            responsibilities +
            "%"
        );

        addBody(
            "Education: " +
            education +
            "%"
        );

        addBody(
            "Experience: " +
            experience +
            "%"
        );

        addBody(
            "Soft Skills: " +
            softSkills +
            "%"
        );


        // -----------------------------------------------------
        // SUMMARY
        // -----------------------------------------------------

        addHeading("RESUME SUMMARY");

        addBody(
            analysis.summary ||
            "No summary available."
        );


        // -----------------------------------------------------
        // MATCHED SKILLS
        // -----------------------------------------------------

        addHeading("MATCHED SKILLS");

        if (matchedSkills.length > 0) {

            matchedSkills.forEach(
                function (skill) {
                    addBullet(skill);
                }
            );

        } else {

            addBody("None");
        }


        // -----------------------------------------------------
        // MISSING SKILLS
        // -----------------------------------------------------

        addHeading("MISSING SKILLS");

        if (missingSkills.length > 0) {

            missingSkills.forEach(
                function (skill) {
                    addBullet(skill);
                }
            );

        } else {

            addBody("None");
        }


        // -----------------------------------------------------
        // SUGGESTIONS
        // -----------------------------------------------------

        addHeading(
            "AI IMPROVEMENT SUGGESTIONS"
        );

        if (suggestions.length > 0) {

            suggestions.forEach(
                function (suggestion, index) {

                    const lines =
                        wrapText(
                            (index + 1) +
                            ". " +
                            cleanText(suggestion),
                            10
                        );

                    lines.forEach(
                        function (line) {

                            content.push({
                                text: line,
                                size: 10,
                                bold: false,
                                gap: 3
                            });
                        }
                    );
                }
            );

        } else {

            addBody("None");
        }


        // -----------------------------------------------------
        // CREATE PAGES
        // -----------------------------------------------------

        const pages = [];

        let currentPage = [];

        let y =
            PAGE_HEIGHT - TOP;


        content.forEach(
            function (item) {

                const lineHeight =
                    item.size * 1.5;

                if (
                    y - lineHeight <
                    BOTTOM + 20
                ) {

                    pages.push(
                        currentPage
                    );

                    currentPage = [];

                    y =
                        PAGE_HEIGHT - TOP;
                }


                currentPage.push({
                    text: item.text,
                    size: item.size,
                    bold: item.bold,
                    y: y
                });


                y -=
                    lineHeight +
                    item.gap;
            }
        );


        if (currentPage.length > 0) {
            pages.push(currentPage);
        }


        // -----------------------------------------------------
        // PDF OBJECTS
        // -----------------------------------------------------

        const objects = [null];

        // Catalog
        objects.push(
            "<< /Type /Catalog /Pages 2 0 R >>"
        );

        // Pages
        objects.push("");

        // Helvetica
        objects.push(
            "<< /Type /Font " +
            "/Subtype /Type1 " +
            "/BaseFont /Helvetica >>"
        );

        // Helvetica Bold
        objects.push(
            "<< /Type /Font " +
            "/Subtype /Type1 " +
            "/BaseFont /Helvetica-Bold >>"
        );


        const pageIds = [];
        const contentIds = [];


        pages.forEach(
            function () {

                contentIds.push(
                    objects.length
                );

                objects.push("");


                pageIds.push(
                    objects.length
                );

                objects.push("");
            }
        );


        // -----------------------------------------------------
        // PAGES TREE
        // -----------------------------------------------------

        objects[2] =
            "<< /Type /Pages " +
            "/Kids [" +
            pageIds
                .map(
                    id => id + " 0 R"
                )
                .join(" ") +
            "] " +
            "/Count " +
            pageIds.length +
            " >>";


        // -----------------------------------------------------
        // PAGE CONTENT
        // -----------------------------------------------------

        pages.forEach(
            function (pageData, pageIndex) {

                let stream = "BT\n";


                pageData.forEach(
                    function (line) {

                        const font =
                            line.bold
                                ? "F2"
                                : "F1";


                        stream +=
                            "/" +
                            font +
                            " " +
                            line.size +
                            " Tf\n";


                        stream +=
                            "1 0 0 1 " +
                            LEFT +
                            " " +
                            line.y +
                            " Tm\n";


                        stream +=
                            "(" +
                            escapePDF(
                                line.text
                            ) +
                            ") Tj\n";
                    }
                );


                // Footer

                stream +=
                    "/F1 8 Tf\n";

                stream +=
                    "1 0 0 1 " +
                    LEFT +
                    " 25 Tm\n";

                stream +=
                    "(" +
                    escapePDF(
                        "AI Resume Analyzer - Page " +
                        (pageIndex + 1) +
                        " of " +
                        pages.length
                    ) +
                    ") Tj\n";


                stream += "ET";


                const contentId =
                    contentIds[pageIndex];


                objects[contentId] =
                    "<< /Length " +
                    byteLength(stream) +
                    " >>\n" +
                    "stream\n" +
                    stream +
                    "\nendstream";


                const pageId =
                    pageIds[pageIndex];


                objects[pageId] =
                    "<< /Type /Page " +
                    "/Parent 2 0 R " +
                    "/MediaBox [0 0 " +
                    PAGE_WIDTH +
                    " " +
                    PAGE_HEIGHT +
                    "] " +
                    "/Resources << /Font << " +
                    "/F1 3 0 R " +
                    "/F2 4 0 R " +
                    ">> >> " +
                    "/Contents " +
                    contentId +
                    " 0 R >>";
            }
        );


        // -----------------------------------------------------
        // BUILD PDF
        // -----------------------------------------------------

        let pdf =
            "%PDF-1.4\n";

        const offsets = [0];


        for (
            let i = 1;
            i < objects.length;
            i++
        ) {

            offsets[i] =
                byteLength(pdf);

            pdf +=
                i +
                " 0 obj\n" +
                objects[i] +
                "\nendobj\n";
        }


        const xrefOffset =
            byteLength(pdf);


        pdf +=
            "xref\n" +
            "0 " +
            objects.length +
            "\n";


        pdf +=
            "0000000000 65535 f \n";


        for (
            let i = 1;
            i < objects.length;
            i++
        ) {

            pdf +=
                String(offsets[i])
                    .padStart(10, "0") +
                " 00000 n \n";
        }


        pdf +=
            "trailer\n" +
            "<< /Size " +
            objects.length +
            " /Root 1 0 R >>\n" +
            "startxref\n" +
            xrefOffset +
            "\n" +
            "%%EOF";


        // -----------------------------------------------------
        // DOWNLOAD FILE
        // -----------------------------------------------------

        const blob =
            new Blob(
                [pdf],
                {
                    type: "application/pdf"
                }
            );


        const url =
            URL.createObjectURL(blob);


        const link =
            document.createElement("a");


        link.href = url;

        link.download =
            "AI_Resume_Analysis.pdf";

        link.style.display =
            "none";


        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);


        setTimeout(
            function () {
                URL.revokeObjectURL(url);
            },
            1000
        );


        console.log(
            "PDF downloaded successfully."
        );
    }


    // =========================================================
    // PDF HELPERS
    // =========================================================

    function cleanText(value) {

        return String(
            value == null
                ? ""
                : value
        )
            .replace(/\r?\n/g, " ")
            .normalize("NFKD")
            .replace(
                /[^\x20-\x7E]/g,
                "?"
            )
            .replace(
                /\s+/g,
                " "
            )
            .trim();
    }


    function escapePDF(value) {

        return String(value)
            .replace(
                /\\/g,
                "\\\\"
            )
            .replace(
                /\(/g,
                "\\("
            )
            .replace(
                /\)/g,
                "\\)"
            );
    }


    function byteLength(value) {

        return new TextEncoder()
            .encode(value)
            .length;
    }


    function wrapText(text, fontSize) {

        const charsPerLine =
            Math.max(
                25,
                Math.floor(
                    usableWidth /
                    (fontSize * 0.52)
                )
            );


        const words =
            String(text).split(/\s+/);


        const result = [];

        let current = "";


        words.forEach(
            function (word) {

                if (!word) {
                    return;
                }


                const test =
                    current
                        ? current + " " + word
                        : word;


                if (
                    test.length >
                    charsPerLine
                ) {

                    if (current) {
                        result.push(current);
                    }

                    current = word;

                } else {

                    current = test;
                }
            }
        );


        if (current) {
            result.push(current);
        }


        return result.length
            ? result
            : [""];
    }

});