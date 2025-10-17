// script.js

document.addEventListener("DOMContentLoaded", () => {
  console.log("Student Job Portal JS Loaded");

  // Handle form submissions (client-side validation example)
  const loginForm = document.querySelector("form[action='dashboard.html']");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      const email = loginForm.querySelector("input[type='email']").value;
      const password = loginForm.querySelector("input[type='password']").value;

      if (!email || !password) {
        alert("Please fill in all fields.");
        e.preventDefault();
      } else {
        // In future, replace with actual API call
        console.log("Login form submitted:", email);
      }
    });
  }

  // Resume builder form example
  const resumeForm = document.querySelector("form");
  if (resumeForm && location.pathname.includes("resume.html")) {
    resumeForm.addEventListener("submit", function (e) {
      e.preventDefault();
      alert("Resume generated! (In future, this will export to PDF or upload)");
    });
  }

  // Skill assessment button
  const startAssessmentBtn = document.querySelector("button");
  if (startAssessmentBtn && location.pathname.includes("skills.html")) {
    startAssessmentBtn.addEventListener("click", () => {
      alert("Starting skill assessment... (Feature coming soon)");
    });
  }

  // Dashboard greeting animation (optional)
  if (location.pathname.includes("dashboard.html")) {
    const greeting = document.querySelector("h1");
    if (greeting) {
      greeting.style.opacity = 0;
      setTimeout(() => {
        greeting.style.transition = "opacity 1s ease-in-out";
        greeting.style.opacity = 1;
      }, 300);
    }
  }
});
