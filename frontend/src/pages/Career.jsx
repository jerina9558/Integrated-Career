import React, { useState, useEffect } from "react";

export default function Career() {
  // GLOBAL THEME & FONT PREFS
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [fontSize, setFontSize] = useState(localStorage.getItem("fontSize") || "medium");
  const [fontStyle, setFontStyle] = useState(localStorage.getItem("fontStyle") || "Arial");

  const [domain, setDomain] = useState("");
  const [careers, setCareers] = useState([]);
  const [domainDescription, setDomainDescription] = useState("");
  const [selectedCareer, setSelectedCareer] = useState(null);

  const fontSizeMap = { small: "14px", medium: "16px", large: "18px" };
  const isDark = theme === "dark";

  // Listen for account-wide appearance changes
  useEffect(() => {
    const updateThemeFromStorage = () => setTheme(localStorage.getItem("theme") || "light");
    const updateFontSizeFromStorage = () => setFontSize(localStorage.getItem("fontSize") || "medium");
    const updateFontStyleFromStorage = () => setFontStyle(localStorage.getItem("fontStyle") || "Arial");

    window.addEventListener("themeChange", updateThemeFromStorage);
    window.addEventListener("fontSizeChange", updateFontSizeFromStorage);
    window.addEventListener("fontStyleChange", updateFontStyleFromStorage);

    return () => {
      window.removeEventListener("themeChange", updateThemeFromStorage);
      window.removeEventListener("fontSizeChange", updateFontSizeFromStorage);
      window.removeEventListener("fontStyleChange", updateFontStyleFromStorage);
    };
  }, []);

  // ALL CAREER DATA
  const careerDetails = {
    /* ---------- Web Development ---------- */
    "Frontend Developer": {
      skills: ["HTML", "CSS (Flex/Grid)", "JavaScript", "React", "Responsive Design"],
      certifications: ["Meta Frontend Developer (Coursera)", "freeCodeCamp Frontend"],
      salary: "₹4 LPA – ₹10 LPA",
      growth: ["UI Engineer", "Frontend Architect", "Full Stack Developer", "Tech Lead"],
      roadmap: [
        "HTML & CSS basics",
        "Advanced CSS (Flexbox, Grid)",
        "JavaScript fundamentals",
        "React & state management",
        "Build portfolio projects",
      ],
      resources: [
        { name: "roadmap.sh/frontend", link: "https://roadmap.sh/frontend" },
        { name: "freeCodeCamp", link: "https://www.freecodecamp.org/" },
      ],
      projects: [
        "Build a personal portfolio website",
        "Create a responsive e-commerce site",
        "Implement a React To-Do App",
      ],
      demand: " High",
      softSkills: ["Problem Solving", "Teamwork", "Creativity", "Attention to Detail"],
    },
    "Backend Developer": {
      skills: ["Node.js / Express", "Databases (SQL/NoSQL)", "API Design", "Authentication", "Testing"],
      certifications: ["AWS Developer Associate", "Node.js Certification"],
      salary: "₹5 LPA – ₹12 LPA",
      growth: ["Full Stack Developer", "System Architect", "Cloud Engineer", "Tech Lead"],
      roadmap: [
        "Learn Node.js/Express or Java + Spring",
        "Design RESTful APIs",
        "Work with relational & non-relational DBs",
        "Authentication & security",
        "Deploy backend services",
      ],
      resources: [
        { name: "Node.js Docs", link: "https://nodejs.org/en/docs/" },
        { name: "roadmap.sh/backend", link: "https://roadmap.sh/backend" },
      ],
      projects: [
        "Build a RESTful API with Node.js",
        "Create a user authentication system",
        "Develop a CRUD backend service",
      ],
      demand: " High",
      softSkills: ["Analytical Thinking", "Problem Solving", "Teamwork", "Attention to Detail"],
    },
    "Full Stack Developer": {
      skills: ["React / Frontend", "Node.js / Backend", "Databases", "APIs", "CI/CD"],
      certifications: ["IBM Full Stack", "MERN Bootcamp (Udemy)"],
      salary: "₹6 LPA – ₹15 LPA",
      growth: ["Tech Lead", "Software Architect", "Product Engineer", "Engineering Manager"],
      roadmap: [
        "Frontend basics -> React",
        "Backend basics -> Node.js/Express",
        "Databases & ORMs",
        "Testing & CI/CD",
        "Deploy and monitor apps",
      ],
      resources: [
        { name: "The Odin Project", link: "https://www.theodinproject.com/" },
        { name: "roadmap.sh/fullstack", link: "https://roadmap.sh/full-stack" },
      ],
      projects: [
        "Build a full MERN stack application",
        "Create a real-time chat app",
        "Deploy a full stack portfolio project",
      ],
      demand: " High",
      softSkills: ["Problem Solving", "Communication", "Adaptability", "Team Collaboration"],
    },
    "Web Designer": {
      skills: ["Design fundamentals", "Figma", "HTML/CSS basics", "Prototyping", "Accessibility"],
      certifications: ["Google UX Design (useful)", "Coursera UI courses"],
      salary: "₹3.5 LPA – ₹9 LPA",
      growth: ["Product Designer", "Design Lead", "Creative Director"],
      roadmap: [
        "Learn design basics (layout, color, typography)",
        "Master Figma or Adobe XD",
        "Design responsive templates",
        "Turn designs into HTML/CSS",
        "Build a design case study portfolio",
      ],
      resources: [
        { name: "Figma Learn", link: "https://www.figma.com/learn" },
        { name: "NNGroup Articles", link: "https://www.nngroup.com/articles/" },
      ],
      projects: [
        "Design a portfolio website mockup",
        "Redesign an existing website for usability",
        "Create interactive UI prototypes in Figma",
      ],
      demand: " Medium",
      softSkills: ["Creativity", "Communication", "Attention to Detail", "Collaboration"],
    },
    "DevOps Engineer": {
      skills: ["Linux", "Docker", "Kubernetes", "CI/CD", "Cloud (AWS/Azure)"],
      certifications: ["CKA (Kubernetes)", "AWS Certified DevOps Engineer"],
      salary: "₹6 LPA – ₹18 LPA",
      growth: ["Cloud Engineer", "Site Reliability Engineer", "DevOps Architect"],
      roadmap: [
        "Linux fundamentals",
        "Learn Docker containers",
        "CI/CD pipelines (GitHub Actions/Jenkins)",
        "Kubernetes basics",
        "Monitor & scale production apps",
      ],
      resources: [
        { name: "kubernetes.io", link: "https://kubernetes.io/" },
        { name: "roadmap.sh/devops", link: "https://roadmap.sh/devops" },
      ],
      projects: [
        "Set up a CI/CD pipeline",
        "Deploy a containerized application",
        "Manage Kubernetes clusters",
      ],
      demand: " Medium",
      softSkills: ["Problem Solving", "Collaboration", "Time Management", "Communication"],
    },

    /* ---------- Data Science ---------- */
    "Data Analyst": {
      skills: ["Excel", "SQL", "Python (pandas)", "Data Visualization", "Statistics basics"],
      certifications: ["Google Data Analytics", "Microsoft Power BI"],
      salary: "₹4 LPA – ₹9 LPA",
      growth: ["Business Intelligence Engineer", "Data Scientist", "Analytics Manager"],
      roadmap: [
        "Learn Excel & SQL",
        "Python for data (pandas)",
        "Visualization (Power BI/Tableau)",
        "Basic stats & A/B testing",
        "Real-world analysis projects",
      ],
      resources: [
        { name: "Google Data Analytics", link: "https://grow.google/certificates/data-analytics/" },
        { name: "Kaggle", link: "https://www.kaggle.com/" },
      ],
      projects: [
        "Analyze a sales dataset and create insights report",
        "Build dashboards in Power BI/Tableau",
        "Perform A/B testing for a marketing campaign",
      ],
      demand: " High",
      softSkills: ["Analytical Thinking", "Communication", "Problem Solving", "Detail Oriented"],
    },
    "Data Scientist": {
      skills: ["Python", "Machine Learning", "Statistics", "Feature Engineering", "Model Evaluation"],
      certifications: ["IBM Data Science", "Coursera ML"],
      salary: "₹6 LPA – ₹20 LPA",
      growth: ["Senior Data Scientist", "ML Engineer", "Head of Data"],
      roadmap: [
        "Python (numpy, pandas)",
        "Statistics & probability",
        "Supervised & unsupervised ML",
        "Model evaluation & pipelines",
        "Deploy ML models",
      ],
      resources: [
        { name: "Andrew Ng ML", link: "https://www.coursera.org/learn/machine-learning" },
        { name: "Kaggle Learn", link: "https://www.kaggle.com/learn" },
      ],
      projects: [
        "Predict customer churn using ML models",
        "Build a recommendation system",
        "Deploy a machine learning model as API",
      ],
      demand: " High",
      softSkills: ["Problem Solving", "Critical Thinking", "Communication", "Adaptability"],
    },
    "Machine Learning Engineer": {
      skills: ["Python", "TensorFlow / PyTorch", "Model Deployment", "MLOps", "Optimization"],
      certifications: ["TensorFlow Dev Certificate", "AWS ML Specialty"],
      salary: "₹8 LPA – ₹25 LPA",
      growth: ["ML Architect", "AI Research Engineer", "Lead ML Engineer"],
      roadmap: [
        "Deep dive into ML algorithms",
        "Neural networks & frameworks",
        "Model tuning & optimization",
        "Model deployment & monitoring",
        "MLOps best practices",
      ],
      resources: [
        { name: "TensorFlow", link: "https://www.tensorflow.org/" },
        { name: "fast.ai", link: "https://www.fast.ai/" },
      ],
      projects: [
        "Develop a deep learning image classifier",
        "Implement NLP text analysis pipeline",
        "Deploy ML model to cloud",
      ],
      demand: " High",
      softSkills: ["Analytical Thinking", "Problem Solving", "Communication", "Teamwork"],
    },
    "AI Engineer": {
      skills: ["Deep Learning", "NLP / CV", "Large Models", "Distributed Training", "Cloud GPUs"],
      certifications: ["Deep Learning Specialization", "AWS AI certs"],
      salary: "₹10 LPA – ₹35 LPA",
      growth: ["Research Scientist", "AI Architect", "Head of AI"],
      roadmap: [
        "Advanced deep learning",
        "Study NLP/CV architectures",
        "Work with large datasets",
        "Optimize & scale training",
        "Deploy production-grade AI",
      ],
      resources: [
        { name: "Deep Learning Specialization", link: "https://www.coursera.org/specializations/deep-learning" },
      ],
      projects: [
        "Build an NLP chatbot",
        "Train a computer vision model",
        "Deploy AI service for real-time use",
      ],
      demand: " High",
      softSkills: ["Problem Solving", "Critical Thinking", "Innovation", "Collaboration"],
    },
    "Data Engineer": {
      skills: ["ETL pipelines", "SQL & NoSQL", "Spark", "Data Warehousing", "Cloud Data Services"],
      certifications: ["Google Cloud Data Engineer", "Databricks"],
      salary: "₹6 LPA – ₹20 LPA",
      growth: ["Senior Data Engineer", "Data Architect", "Platform Engineer"],
      roadmap: [
        "Learn SQL & databases",
        "ETL & streaming basics",
        "Work with Spark/Hadoop",
        "Design data warehouses",
        "Optimize data pipelines",
      ],
      resources: [
        { name: "Google Cloud - Data Engineering", link: "https://cloud.google.com/training" },
      ],
      projects: [
        "Build a data warehouse for analytics",
        "Implement ETL pipeline for business data",
        "Process streaming data in real-time",
      ],
      demand: " High",
      softSkills: ["Analytical Thinking", "Problem Solving", "Attention to Detail", "Teamwork"],
    },

    /* ---------- UI/UX Design ---------- */
    "UI Designer": {
      skills: ["Figma", "Visual Design", "Typography", "Design Systems", "Responsive UI"],
      certifications: ["Google UX Design", "Adobe courses"],
      salary: "₹3.5 LPA – ₹8 LPA",
      growth: ["Product Designer", "Design Lead", "Creative Director"],
      roadmap: [
        "Design basics & color theory",
        "Master Figma/Sketch",
        "Create UI kit & components",
        "Design accessible interfaces",
        "Publish case studies",
      ],
      resources: [
        { name: "Figma Learn", link: "https://www.figma.com/learn" },
        { name: "UX Collective", link: "https://uxdesign.cc/" },
      ],
      projects: [
        "Design a responsive web app interface",
        "Create a mobile app UI kit",
        "Build a portfolio of UI case studies",
      ],
      demand: " Medium",
      softSkills: ["Creativity", "Attention to Detail", "Collaboration", "Communication"],
    },
    "UX Researcher": {
      skills: ["User Interviews", "Surveys", "Usability Testing", "Qualitative Analysis", "Persona Creation"],
      certifications: ["NNGroup UX Research", "Coursera UX research courses"],
      salary: "₹4 LPA – ₹10 LPA",
      growth: ["Senior UX Researcher", "Product Research Lead"],
      roadmap: [
        "Learn qualitative & quantitative research",
        "Design interview guides",
        "Conduct usability tests",
        "Synthesize findings into insights",
        "Work with product teams",
      ],
      resources: [
        { name: "NN/g Articles", link: "https://www.nngroup.com/articles/" },
      ],
      projects: [
        "Conduct usability study for an app",
        "Create personas and user journey maps",
        "Report insights to stakeholders",
      ],
      demand: " Medium",
      softSkills: ["Empathy", "Analytical Thinking", "Communication", "Collaboration"],
    },
    "Product Designer": {
      skills: ["UI & UX", "Prototyping", "User Flows", "Figma", "Collaboration with PMs"],
      certifications: ["Design Thinking", "Product Design courses"],
      salary: "₹5 LPA – ₹14 LPA",
      growth: ["Senior Product Designer", "Design Manager", "Head of Product Design"],
      roadmap: [
        "Blend UX research with UI execution",
        "Prototype and iterate",
        "Ship user-centered features",
        "Measure product impact",
        "Mentor junior designers",
      ],
      resources: [
        { name: "Product Design by Google", link: "https://developers.google.com/" },
      ],
      projects: [
        "Design end-to-end product experience",
        "Create interactive prototypes for testing",
        "Collaborate with PMs and engineers",
      ],
      demand: " Medium",
      softSkills: ["Creativity", "Problem Solving", "Collaboration", "Communication"],
    },
    "Interaction Designer": {
      skills: ["Microinteractions", "Prototyping", "Motion Design", "User Flows", "Accessibility"],
      certifications: ["Interaction Design Foundation", "Motion design courses"],
      salary: "₹4 LPA – ₹11 LPA",
      growth: ["Senior Interaction Designer", "UX Lead"],
      roadmap: [
        "Learn prototyping & motion",
        "Design microinteractions",
        "Test with users",
        "Integrate with product flows",
        "Create interactive prototypes",
      ],
      resources: [
        { name: "Interaction Design Foundation", link: "https://www.interaction-design.org/" },
      ],
      projects: [
        "Design animations for a web interface",
        "Prototype interactive elements",
        "Improve usability via microinteractions",
      ],
      demand: " Medium",
      softSkills: ["Creativity", "Attention to Detail", "Collaboration", "Communication"],
    },
    "Design Strategist": {
      skills: ["Design Thinking", "Business Strategy", "User Research", "Workshop Facilitation", "Roadmapping"],
      certifications: ["Design Thinking", "Strategy courses"],
      salary: "₹6 LPA – ₹16 LPA",
      growth: ["Head of Design Strategy", "Product Strategy Lead"],
      roadmap: [
        "Master design thinking frameworks",
        "Facilitate stakeholder workshops",
        "Align design with business goals",
        "Create multi-year design roadmaps",
      ],
      resources: [
        { name: "IDEO U", link: "https://www.ideou.com/" },
      ],
      projects: [
        "Define product design strategy",
        "Lead design workshops",
        "Create roadmap aligned with business objectives",
      ],
      demand: " Medium",
      softSkills: ["Leadership", "Strategic Thinking", "Communication", "Collaboration"],
    },

    /* ---------- Digital Marketing ---------- */
    "SEO Specialist": {
      skills: ["Keyword Research", "On-page SEO", "Technical SEO", "Analytics", "Content Strategy"],
      certifications: ["Google Analytics", "HubSpot SEO"],
      salary: "₹3 LPA – ₹7 LPA",
      growth: ["SEO Manager", "Growth Marketer", "Digital Strategist"],
      roadmap: [
        "Learn keyword research & tools",
        "Practice on-page & technical SEO",
        "Analyze traffic & ranking",
        "Run experiments & audits",
        "Scale content strategy",
      ],
      resources: [
        { name: "Moz Beginner's Guide", link: "https://moz.com/beginners-guide-to-seo" },
        { name: "Google Analytics Academy", link: "https://analytics.google.com/" },
      ],
      projects: [
        "Optimize a website for SEO",
        "Conduct a technical SEO audit",
        "Build a keyword strategy",
      ],
      demand: " Medium",
      softSkills: ["Analytical Thinking", "Problem Solving", "Communication", "Attention to Detail"],
    },
    "Content Strategist": {
      skills: ["Content Planning", "SEO writing", "Editorial Calendars", "Analytics", "Storytelling"],
      certifications: ["HubSpot Content Certification", "Copywriting courses"],
      salary: "₹3.5 LPA – ₹9 LPA",
      growth: ["Head of Content", "Content Director"],
      roadmap: [
        "Master content creation & formats",
        "Build editorial calendar",
        "Measure engagement & ROI",
        "Refine voice & positioning",
        "Scale content distribution",
      ],
      resources: [
        { name: "Content Marketing Institute", link: "https://contentmarketinginstitute.com/" },
      ],
      projects: [
        "Create content calendar for a brand",
        "Develop blog and social content",
        "Measure performance using analytics tools",
      ],
      demand: " Medium",
      softSkills: ["Creativity", "Strategic Thinking", "Communication", "Collaboration"],
    },
    "Social Media Manager": {
      skills: ["Community Management", "Content Creation", "Analytics", "Ad Basics", "Campaigns"],
      certifications: ["Meta Blueprint", "Hootsuite Social Media Cert"],
      salary: "₹3 LPA – ₹8 LPA",
      growth: ["Social Lead", "Brand Manager", "Growth Head"],
      roadmap: [
        "Learn platform-specific best practices",
        "Create engaging short-form content",
        "Analyze post performance",
        "Run paid social experiments",
        "Build community & partnerships",
      ],
      resources: [
        { name: "Meta Blueprint", link: "https://www.facebook.com/business/learn" },
      ],
      projects: [
        "Manage social media for a brand",
        "Run ad campaigns on Facebook/Instagram",
        "Engage with community and grow followers",
      ],
      demand: " Medium",
      softSkills: ["Creativity", "Communication", "Collaboration", "Analytical Thinking"],
    },
    "PPC Specialist": {
      skills: ["Google Ads", "Campaign Structuring", "Keyword Bidding", "Analytics", "Conversion Tracking"],
      certifications: ["Google Ads Certification", "Microsoft Advertising"],
      salary: "₹3.5 LPA – ₹10 LPA",
      growth: ["Paid Media Lead", "Growth Marketer", "Acquisition Head"],
      roadmap: [
        "Learn Google Ads basics",
        "Set up conversion tracking",
        "Optimize campaigns & bids",
        "Scale profitable channels",
        "Integrate with analytics",
      ],
      resources: [
        { name: "Google Ads Help", link: "https://support.google.com/google-ads/" },
      ],
      projects: [
        "Create PPC campaigns for a website",
        "Optimize bids for ROI",
        "Analyze ad performance and report",
      ],
      demand: " Medium",
      softSkills: ["Analytical Thinking", "Problem Solving", "Attention to Detail", "Communication"],
    },
    "Digital Marketing Manager": {
      skills: ["Strategy", "Multi-channel Planning", "Analytics", "Leadership", "Budgeting"],
      certifications: ["Google Digital Garage", "Digital Marketing MBA courses"],
      salary: "₹6 LPA – ₹20 LPA",
      growth: ["Head of Marketing", "Growth Director", "CMO"],
      roadmap: [
        "Master core marketing channels",
        "Create integrated campaigns",
        "Measure marketing ROI",
        "Manage teams & budgets",
        "Drive growth strategy",
      ],
      resources: [
        { name: "Google Digital Garage", link: "https://learndigital.withgoogle.com/" },
      ],
      projects: [
        "Lead digital marketing campaigns",
        "Manage marketing team & budget",
        "Analyze multi-channel campaign performance",
      ],
      demand: " High",
      softSkills: ["Leadership", "Strategic Thinking", "Communication", "Problem Solving"],
    },
  };

  // Suggest careers per domain
  const suggestCareer = () => {
    let careerOptions = [];
    let description = "";

    switch (domain) {
      case "webdev":
        description = "Web Development builds interactive, scalable web applications.";
        careerOptions = [
          "Frontend Developer",
          "Backend Developer",
          "Full Stack Developer",
          "Web Designer",
          "DevOps Engineer",
        ];
        break;
      case "datascience":
        description = "Data Science extracts insights and builds models from data.";
        careerOptions = [
          "Data Analyst",
          "Data Scientist",
          "Machine Learning Engineer",
          "AI Engineer",
          "Data Engineer",
        ];
        break;
      case "uiux":
        description = "UI/UX crafts user-centered, usable and delightful experiences.";
        careerOptions = [
          "UI Designer",
          "UX Researcher",
          "Product Designer",
          "Interaction Designer",
          "Design Strategist",
        ];
        break;
      case "marketing":
        description = "Digital Marketing promotes brands through data-driven strategies.";
        careerOptions = [
          "SEO Specialist",
          "Content Strategist",
          "Social Media Manager",
          "PPC Specialist",
          "Digital Marketing Manager",
        ];
        break;
      default:
        description = "";
        careerOptions = ["Please select a domain to see career paths."];
    }

    setDomainDescription(description);
    setCareers(careerOptions);
    setSelectedCareer(null);
  };

  // SkillBar animation
  const SkillBar = ({ skill, idx }) => {
    const seed = [...skill].reduce((acc, ch) => acc + ch.charCodeAt(0), idx);
    const width = 60 + (seed % 31); // 60% - 90%
    const [barWidth, setBarWidth] = useState(0);

    useEffect(() => {
      const timer = setTimeout(() => setBarWidth(width), 100);
      return () => clearTimeout(timer);
    }, [width]);

    return (
      <div style={{ margin: "0.5rem 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <strong style={{ fontSize: "0.95rem", fontFamily: fontStyle }}>{skill}</strong>
          <span style={{ fontSize: "0.85rem", color: isDark ? "#bbb" : "#555" }}>{width}%</span>
        </div>
        <div
          style={{
            height: "8px",
            background: isDark ? "#2a2a2a" : "#e6e6e6",
            borderRadius: "6px",
            marginTop: "6px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${barWidth}%`,
              height: "8px",
              borderRadius: "6px",
              background: "linear-gradient(90deg, #3f51b5, #2196f3)",
              transition: "width 1s ease-in-out",
            }}
          />
        </div>
      </div>
    );
  };

  const GRID_SLOTS = 6;
  const displayCards = careers.slice(0, GRID_SLOTS);
  while (displayCards.length < GRID_SLOTS) displayCards.push(null);

  return (
    <div
      style={{
        fontFamily: fontStyle,
        fontSize: fontSizeMap[fontSize],
        background: "transparent",
        color: isDark ? "#fff" : "#111827",
        minHeight: "100vh",
        transition: "all 0.3s",
        paddingBottom: "3rem",
        paddingLeft: "2rem",
        paddingRight: "2rem",
        paddingTop: "1rem",
      }}
    >
      <h2 style={{ color: isDark ? "#fff" : "#3f51b5", marginBottom: "0.5rem" }}>
        Career Path Suggestion
      </h2>

      <div style={{ maxWidth: "800px" }}>
        <label htmlFor="domainSelect" style={{ color: isDark ? "#fff" : "#111827" }}>Select Your Domain:</label>
        <br />
        <select
          id="domainSelect"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          style={{
            padding: "0.6rem 0.9rem",
            marginTop: "0.6rem",
            borderRadius: "8px",
            border: isDark ? "1px solid #444" : "1px solid #cfcfcf",
            backgroundColor: isDark ? "#0f1316" : "#fff",
            color: isDark ? "#fff" : "#000",
            width: "100%",
            maxWidth: "420px",
            fontFamily: fontStyle,
            fontSize: fontSizeMap[fontSize],
          }}
        >
          <option value="">--Select Domain--</option>
          <option value="webdev">Web Development</option>
          <option value="datascience">Data Science</option>
          <option value="uiux">UI/UX Design</option>
          <option value="marketing">Digital Marketing</option>
        </select>

        <div style={{ marginTop: "1rem" }}>
          <button
            onClick={suggestCareer}
            style={{
              padding: "0.55rem 1rem",
              borderRadius: "8px",
              border: "none",
              background: "linear-gradient(135deg,#3f51b5,#2196f3)",
              color: "#fff",
              cursor: "pointer",
              fontFamily: fontStyle,
              fontSize: fontSizeMap[fontSize],
            }}
          >
            Get Career Paths
          </button>
        </div>

        {domainDescription && (
          <div
            style={{
              marginTop: "1.5rem",
              padding: "1.2rem",
              borderRadius: "10px",
              background: "linear-gradient(135deg,#3f51b5,#2196f3)",
              color: "#fff",
              boxShadow: "0 6px 18px rgba(63,81,181,0.12)",
            }}
          >
            <h3 style={{ margin: 0 }}>
              {domain === "webdev"
                ? "🌐 Web Development"
                : domain === "datascience"
                ? "📊 Data Science"
                : domain === "uiux"
                ? "🎨 UI/UX Design"
                : "📢 Digital Marketing"}
            </h3>
            <p style={{ marginTop: "0.5rem" }}>{domainDescription}</p>
          </div>
        )}
      </div>

      <h3 style={{ marginTop: "2rem", color: isDark ? "#fff" : "#3f51b5" }}>
        Suggested Career Paths:
      </h3>
      {/* --- 3x2 grid --- */}
      <div
        style={{
          marginTop: "1.8rem",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridAutoRows: "1fr",
          gap: "1.8rem",
          justifyItems: "center",
          alignItems: "stretch",
          maxWidth: "900px",
          width: "100%",
          background: "transparent",
        }}
      >
        {displayCards.map((career, idx) => {
          // Placeholder cell (keeps space but not interactive / visible)
          if (!career) {
            return (
              <div
                key={`placeholder-${idx}`}
                aria-hidden="true"
                style={{
                  width: "100%",
                  maxWidth: "240px",
                  minHeight: "120px",
                  borderRadius: "12px",
                  background: "transparent",
                  border: "none",
                  boxShadow: "none",
                  pointerEvents: "none",
                }}
              />
            );
          }

          // Real career card
          return (
            <div
              key={idx}
              onClick={() =>
                setSelectedCareer(careerDetails[career] ? career : null)
              }
              style={{
                width: "100%",
                maxWidth: "240px",
                minHeight: "120px",
                backgroundColor: isDark ? "#0f1316" : "#fff",
                padding: "1rem",
                border: isDark ? "1px solid #2d3748" : "1px solid #e6e6e6",
                borderRadius: "12px",
                boxShadow: isDark ? "none" : "0 6px 18px rgba(0,0,0,0.05)",
                cursor: "pointer",
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                fontFamily: fontStyle,
                fontSize: fontSizeMap[fontSize],
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-6px)";
                if (!isDark) e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                if (!isDark) e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.05)";
              }}
            >
              <h4 style={{ margin: 0, color: isDark ? "#fff" : "#3f51b5" }}>
                {career}
              </h4>
              <p
                style={{
                  marginTop: "0.5rem",
                  color: isDark ? "#bbb" : "#555",
                  fontSize: "0.9rem",
                }}
              >
                Click to view role details
              </p>
            </div>
          );
        })}
      </div>

      {/* Role details panel */}
      {selectedCareer && careerDetails[selectedCareer] && (
        <div style={{ marginTop: "2.2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2 style={{ margin: 0, color: isDark ? "#fff" : "#1f3a8a" }}>{selectedCareer}</h2>
            </div>
            <div>
              <button
                onClick={() => setSelectedCareer(null)}
                style={{
                  padding: "0.45rem 0.8rem",
                  borderRadius: "8px",
                  border: "none",
                  background: isDark ? "#262626" : "#fff",
                  color: isDark ? "#fff" : "#000",
                  boxShadow: isDark ? "none" : "0 2px 8px rgba(0,0,0,0.06)",
                  cursor: "pointer",
                  fontFamily: fontStyle,
                  fontSize: fontSizeMap[fontSize],
                }}
              >
                Close
              </button>
            </div>
          </div>

          <div style={{ marginTop: "1.2rem", display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }}>
            <div>
              <h4 style={{ marginBottom: "0.6rem", color: isDark ? "#fff" : "#111827" }}>🧠 Key Skills</h4>
              {careerDetails[selectedCareer].skills.map((s, i) => (
                <SkillBar key={s + i} skill={s} idx={i} />
              ))}
            </div>

            {careerDetails[selectedCareer].softSkills && (
              <div>
                <h4 style={{ color: isDark ? "#fff" : "#111827" }}>💬 Soft Skills</h4>
                <ul style={{ marginTop: 0, color: isDark ? "#d1d5db" : "#374151" }}>
                  {careerDetails[selectedCareer].softSkills.map((s, i) => (
                    <li key={s + i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {careerDetails[selectedCareer].certifications && (
              <div>
                <h4 style={{ marginBottom: "0.4rem", color: isDark ? "#fff" : "#111827" }}>📜 Certifications (helpful)</h4>
                <ul style={{ marginTop: 0, color: isDark ? "#d1d5db" : "#374151" }}>
                  {careerDetails[selectedCareer].certifications.map((c, i) => (
                    <li key={c + i} style={{ marginBottom: "0.25rem" }}>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h4 style={{ marginBottom: "0.4rem", color: isDark ? "#fff" : "#111827" }}>💰 Typical Salary Range</h4>
              <p style={{ marginTop: 0, color: isDark ? "#d1d5db" : "#374151" }}>{careerDetails[selectedCareer].salary}</p>
            </div>

            {careerDetails[selectedCareer].demand && (
              <div>
                <h4 style={{ color: isDark ? "#fff" : "#111827" }}>🔥 Job Market Demand</h4>
                <p style={{ color: isDark ? "#d1d5db" : "#374151" }}>{careerDetails[selectedCareer].demand}</p>
              </div>
            )}

            <div>
              <h4 style={{ marginBottom: "0.4rem", color: isDark ? "#fff" : "#111827" }}>📈 Career Growth</h4>
              <ul style={{ marginTop: 0, color: isDark ? "#d1d5db" : "#374151" }}>
                {careerDetails[selectedCareer].growth.map((g, i) => (
                  <li key={g + i} style={{ marginBottom: "0.25rem" }}>
                    {g}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 style={{ marginBottom: "0.4rem", color: isDark ? "#fff" : "#111827" }}>🗺️ Roadmap (next steps)</h4>
              <ol style={{ marginTop: 0, color: isDark ? "#d1d5db" : "#374151" }}>
                {careerDetails[selectedCareer].roadmap.map((r, i) => (
                  <li key={r + i} style={{ marginBottom: "0.4rem" }}>
                    {r}
                  </li>
                ))}
              </ol>
            </div>

            {careerDetails[selectedCareer].projects && (
              <div>
                <h4 style={{ marginBottom: "0.4rem", color: isDark ? "#fff" : "#111827" }}>💡 Suggested Projects</h4>
                <ul style={{ marginTop: 0, color: isDark ? "#d1d5db" : "#374151" }}>
                  {careerDetails[selectedCareer].projects.map((p, i) => (
                    <li key={p + i} style={{ marginBottom: "0.25rem" }}>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {careerDetails[selectedCareer].resources && (
              <div>
                <h4 style={{ marginBottom: "0.4rem", color: isDark ? "#fff" : "#111827" }}>🔗 Resources</h4>
                <ul style={{ marginTop: 0 }}>
                  {careerDetails[selectedCareer].resources.map((res, i) => (
                    <li key={res.name + i}>
                      <a
                        href={res.link}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: isDark ? "#60a5fa" : "#1f3a8a" }}
                      >
                        {res.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}