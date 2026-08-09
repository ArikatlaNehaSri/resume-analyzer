document.addEventListener("DOMContentLoaded", function () {

    const form = document.querySelector("#resumeForm");
    const fileInput = document.querySelector("#resumeFile");
    const uploadBox = document.querySelector("#uploadBox");
    const uploadText = document.querySelector("#uploadText");
    const jobDescription = document.querySelector("#jobDescription");
    const analyzeButton = document.querySelector("#analyzeButton");


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

            /*
             * Don't trigger the file picker again
             * when the actual input is clicked.
             */

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

            /*
             * Only remove when leaving
             * the upload box itself.
             */

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


            /*
             * Put dropped file into
             * the real file input.
             */

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
                   GO TO RESULTS
                   ========================================= */

                window.location.href =
                    "/results";


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


                analyzeButton.disabled =
                    false;


                analyzeButton.innerHTML =
                    originalButtonText;

            }

        }
    );

});