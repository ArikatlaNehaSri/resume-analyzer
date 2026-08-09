document.addEventListener("DOMContentLoaded", function () {

    const form = document.querySelector("#resumeForm");
    const fileInput = document.querySelector("#resumeFile");
    const uploadBox = document.querySelector("#uploadBox");
    const uploadText = document.querySelector("#uploadText");
    const jobDescription = document.querySelector("#jobDescription");
    const analyzeButton = document.querySelector("#analyzeButton");

    /* AI Loading elements */
    const loadingOverlay =
        document.querySelector("#aiLoadingOverlay");

    const loadingMessage =
        document.querySelector("#aiLoadingMessage");

    const progressBar =
        document.querySelector("#aiProgressBar");


    /* =====================================================
       CHECK REQUIRED ELEMENTS
       ===================================================== */

    if (!form ||
        !fileInput ||
        !uploadBox ||
        !uploadText ||
        !jobDescription ||
        !analyzeButton) {

        console.error("Required elements not found.");

        return;
    }


    /* =====================================================
       FILE VALIDATION
       ===================================================== */

    function isValidFile(file) {

        if (!file) {
            return false;
        }

        const fileName =
            file.name.toLowerCase();

        return fileName.endsWith(".pdf") ||
            fileName.endsWith(".docx");
    }


    /* =====================================================
       DISPLAY SELECTED FILE
       ===================================================== */

    function showSelectedFile(file) {

        if (!isValidFile(file)) {

            alert(
                "Only PDF and DOCX files are allowed."
            );

            fileInput.value = "";

            uploadText.textContent =
                "Drag & Drop or Choose File";

            return false;
        }


        uploadText.textContent =
            "Selected: " + file.name;

        uploadText.style.color =
            "#60a5fa";

        uploadBox.classList.add(
            "file-selected"
        );

        console.log(
            "Resume selected:",
            file.name
        );

        return true;
    }


    /* =====================================================
       NORMAL FILE SELECTION
       ===================================================== */

    fileInput.addEventListener(
        "change",
        function () {

            if (fileInput.files &&
                fileInput.files.length > 0) {

                showSelectedFile(
                    fileInput.files[0]
                );
            }

        }
    );


    /* =====================================================
       CLICK UPLOAD BOX
       ===================================================== */

    uploadBox.addEventListener(
        "click",
        function (event) {

            if (event.target !== fileInput) {

                fileInput.click();

            }

        }
    );


    /* =====================================================
       DRAG OVER
       ===================================================== */

    uploadBox.addEventListener(
        "dragover",
        function (event) {

            event.preventDefault();

            event.stopPropagation();

            uploadBox.classList.add(
                "drag-active"
            );

        }
    );


    /* =====================================================
       DRAG ENTER
       ===================================================== */

    uploadBox.addEventListener(
        "dragenter",
        function (event) {

            event.preventDefault();

            event.stopPropagation();

            uploadBox.classList.add(
                "drag-active"
            );

        }
    );


    /* =====================================================
       DRAG LEAVE
       ===================================================== */

    uploadBox.addEventListener(
        "dragleave",
        function (event) {

            event.preventDefault();

            event.stopPropagation();

            if (
                event.relatedTarget &&
                uploadBox.contains(
                    event.relatedTarget
                )
            ) {

                return;
            }

            uploadBox.classList.remove(
                "drag-active"
            );

        }
    );


    /* =====================================================
       DROP FILE
       ===================================================== */

    uploadBox.addEventListener(
        "drop",
        function (event) {

            event.preventDefault();

            event.stopPropagation();

            uploadBox.classList.remove(
                "drag-active"
            );


            const files =
                event.dataTransfer.files;


            if (!files ||
                files.length === 0) {

                return;
            }


            const file = files[0];


            if (!isValidFile(file)) {

                alert(
                    "Only PDF and DOCX files are allowed."
                );

                return;
            }


            try {

                const dataTransfer =
                    new DataTransfer();

                dataTransfer.items.add(file);

                fileInput.files =
                    dataTransfer.files;

            } catch (error) {

                console.error(
                    "Could not attach dropped file:",
                    error
                );

                return;
            }


            showSelectedFile(file);

        }
    );


    /* =====================================================
       AI LOADING ANIMATION
       ===================================================== */

    function startAILoading() {

        if (!loadingOverlay) {
            return;
        }


        loadingOverlay.classList.add("show");


        if (loadingMessage) {

            loadingMessage.textContent =
                "Reading your resume...";

        }


        if (progressBar) {

            progressBar.style.width =
                "5%";

        }


        const messages = [

            "Reading your resume...",

            "Extracting skills and experience...",

            "Analyzing your education and experience...",

            "Comparing your resume with the job description...",

            "Calculating ATS compatibility...",

            "Identifying missing skills...",

            "Generating AI recommendations..."

        ];


        let messageIndex = 0;

        let progress = 5;


        /*
         * Change AI message every 1.6 seconds.
         */

        window.aiMessageInterval =
            setInterval(function () {

                messageIndex++;

                if (
                    messageIndex >=
                    messages.length
                ) {

                    messageIndex =
                        messages.length - 1;

                }


                if (loadingMessage) {

                    loadingMessage.textContent =
                        messages[messageIndex];

                }

            }, 1600);


        /*
         * Slowly increase progress
         * while the backend is working.
         */

        window.aiProgressInterval =
            setInterval(function () {

                if (progress < 90) {

                    progress +=
                        Math.random() * 6;


                    if (progress > 90) {

                        progress = 90;

                    }


                    if (progressBar) {

                        progressBar.style.width =
                            progress + "%";

                    }

                }

            }, 500);

    }


    /* =====================================================
       STOP AI LOADING
       ===================================================== */

    function stopAILoading(success) {

        if (window.aiMessageInterval) {

            clearInterval(
                window.aiMessageInterval
            );

        }


        if (window.aiProgressInterval) {

            clearInterval(
                window.aiProgressInterval
            );

        }


        if (!loadingOverlay) {
            return;
        }


        if (success) {

            if (progressBar) {

                progressBar.style.width =
                    "100%";

            }


            if (loadingMessage) {

                loadingMessage.textContent =
                    "Analysis complete! Preparing your results...";

            }

        } else {

            loadingOverlay.classList.remove(
                "show"
            );

        }

    }


    /* =====================================================
       FORM SUBMIT
       ===================================================== */

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            /* ---------------------------------------------
               CHECK RESUME
               --------------------------------------------- */

            if (!fileInput.files ||
                fileInput.files.length === 0) {

                alert(
                    "Please upload your resume first."
                );

                return;
            }


            /* ---------------------------------------------
               CHECK JOB DESCRIPTION
               --------------------------------------------- */

            if (
                jobDescription.value.trim() === ""
            ) {

                alert(
                    "Please enter the Job Description."
                );

                return;
            }


            const resumeFile =
                fileInput.files[0];


            /* ---------------------------------------------
               CHECK FILE TYPE
               --------------------------------------------- */

            if (!isValidFile(resumeFile)) {

                alert(
                    "Only PDF and DOCX files are allowed."
                );

                return;
            }


            /* ---------------------------------------------
               CREATE FORM DATA
               --------------------------------------------- */

            const formData =
                new FormData();


            formData.append(
                "resume",
                resumeFile
            );


            formData.append(
                "jobDescription",
                jobDescription.value
            );


            /* ---------------------------------------------
               BUTTON LOADING
               --------------------------------------------- */

            const originalButtonText =
                analyzeButton.innerHTML;


            analyzeButton.disabled = true;


            analyzeButton.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i> Analyzing...';


            /* ---------------------------------------------
               START AI ANIMATION
               --------------------------------------------- */

            startAILoading();


            try {


                /* =========================================
                   SEND TO SPRING BOOT
                   ========================================= */

                const response =
                    await fetch(
                        "/api/resume/analyze",
                        {
                            method: "POST",
                            body: formData
                        }
                    );


                /* =========================================
                   READ RESPONSE
                   ========================================= */

                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        result ||
                        "Resume analysis failed."
                    );

                }


                /* =========================================
                   STORE RESULT
                   ========================================= */

                sessionStorage.setItem(
                    "resumeAnalysis",
                    JSON.stringify(result)
                );


                /* =========================================
                   FINISH AI ANIMATION
                   ========================================= */

                stopAILoading(true);


                /* =========================================
                   GO TO RESULTS
                   ========================================= */

                setTimeout(
                    function () {

                        window.location.href =
                            "/results";

                    },
                    900
                );


            } catch (error) {


                console.error(
                    "Analysis Error:",
                    error
                );


                /* Stop animation */

                stopAILoading(false);


                /* Restore button */

                analyzeButton.disabled =
                    false;


                analyzeButton.innerHTML =
                    originalButtonText;


                alert(
                    "Could not analyze your resume.\n\n" +
                    error.message
                );

            }

        }
    );

});