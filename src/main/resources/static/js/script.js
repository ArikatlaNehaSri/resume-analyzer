document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("resumeForm");
    const fileInput = document.getElementById("resumeFile");
    const button = document.querySelector("button");
    const uploadBox = document.querySelector(".upload-box");

    // -------------------------------
    // Hero Animation
    // -------------------------------

    const left = document.querySelector(".left");
    const right = document.querySelector(".right");

    if (left) {
        left.style.opacity = "0";
        left.style.transform = "translateX(-60px)";
    }

    if (right) {
        right.style.opacity = "0";
        right.style.transform = "translateX(60px)";
    }

    setTimeout(() => {

        if (left) {
            left.style.transition = "1s";
            left.style.opacity = "1";
            left.style.transform = "translateX(0)";
        }

        if (right) {
            right.style.transition = "1s";
            right.style.opacity = "1";
            right.style.transform = "translateX(0)";
        }

    }, 300);


    // -------------------------------
    // File Selection
    // -------------------------------

    if (fileInput) {

        fileInput.addEventListener("change", function () {

            if (fileInput.files.length === 0) {
                return;
            }

            const file = fileInput.files[0];

            const fileName = file.name.toLowerCase();

            if (!fileName.endsWith(".pdf") &&
                !fileName.endsWith(".docx")) {

                alert("Please select a PDF or DOCX resume.");

                fileInput.value = "";

                return;
            }

            uploadBox.classList.add("selected");

            const uploadText = uploadBox.querySelector("span");

            if (uploadText) {
                uploadText.textContent =
                    "Selected: " + file.name;
            }

        });
    }


    // -------------------------------
    // Upload Resume
    // -------------------------------

    if (form) {

        form.addEventListener("submit", async function (event) {

            event.preventDefault();

            if (!fileInput.files.length) {

                alert("Please upload your resume first.");

                return;
            }

            const file = fileInput.files[0];

            const formData = new FormData();

            formData.append("resume", file);

            button.disabled = true;

            button.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i> Uploading...';


            try {

                const response = await fetch(
                    "/api/resume/upload",
                    {
                        method: "POST",
                        body: formData
                    }
                );

                const message = await response.text();

                if (response.ok) {

                    button.innerHTML =
                        '<i class="fa-solid fa-circle-check"></i> Upload Successful';

                    button.style.background =
                        "linear-gradient(90deg,#16a34a,#22c55e)";

                    alert(message);

                } else {

                    button.disabled = false;

                    button.innerHTML =
                        '<i class="fa-solid fa-wand-magic-sparkles"></i> Analyze Resume';

                    alert(message);
                }

            } catch (error) {

                console.error(error);

                button.disabled = false;

                button.innerHTML =
                    '<i class="fa-solid fa-wand-magic-sparkles"></i> Analyze Resume';

                alert(
                    "Unable to connect to the server. Please try again."
                );

            }

        });

    }

});