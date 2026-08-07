// ===============================
// AI Resume Analyzer - script.js
// ===============================

// Wait until page loads
document.addEventListener("DOMContentLoaded", function () {

    // -------------------------------
    // Animate Hero Section
    // -------------------------------

    const left = document.querySelector(".left");
    const right = document.querySelector(".right");

    if(left){
        left.style.opacity = "0";
        left.style.transform = "translateX(-60px)";
    }

    if(right){
        right.style.opacity = "0";
        right.style.transform = "translateX(60px)";
    }

    setTimeout(() => {

        if(left){
            left.style.transition = "1s";
            left.style.opacity = "1";
            left.style.transform = "translateX(0)";
        }

        if(right){
            right.style.transition = "1s";
            right.style.opacity = "1";
            right.style.transform = "translateX(0)";
        }

    },300);

    // -------------------------------
    // Upload Box Hover
    // -------------------------------

    const uploadBox = document.querySelector(".upload-box");

    if(uploadBox){

        uploadBox.addEventListener("mouseenter",function(){

            uploadBox.style.transform="scale(1.02)";

        });

        uploadBox.addEventListener("mouseleave",function(){

            uploadBox.style.transform="scale(1)";

        });

    }

    // -------------------------------
    // Analyze Button Animation
    // -------------------------------

    const button=document.querySelector("button");

    if(button){

        button.addEventListener("click",function(e){

            e.preventDefault();

            button.innerHTML="🤖 Analyzing Resume...";

            button.disabled=true;

            setTimeout(function(){

                button.innerHTML="✅ Analysis Ready";

                button.style.background="linear-gradient(90deg,#16a34a,#22c55e)";

            },2500);

        });

    }

    // -------------------------------
    // Floating Feature Cards
    // -------------------------------

    const cards=document.querySelectorAll(".feature-card");

    cards.forEach((card,index)=>{

        card.style.opacity="0";
        card.style.transform="translateY(60px)";

        setTimeout(()=>{

            card.style.transition="0.8s";

            card.style.opacity="1";

            card.style.transform="translateY(0)";

        },700+(index*250));

    });

    // -------------------------------
    // Typing Effect
    // -------------------------------

    const heading=document.querySelector(".right h1");

    if(heading){

        const text=heading.innerText;

        heading.innerHTML="";

        let i=0;

        function typing(){

            if(i<text.length){

                heading.innerHTML+=text.charAt(i);

                i++;

                setTimeout(typing,40);

            }

        }

        typing();

    }

});