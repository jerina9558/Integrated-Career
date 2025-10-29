import { useEffect, useState } from "react";
import { 
  ChevronRight, CheckCircle2, 
  Circle, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Award, 
  ExternalLink,
  Search,
  ArrowLeft,
  PlayCircle,
  Download,
  Share2,
  Star,
  Clock,
  Users,
  Zap,
  BarChart3,
  Lightbulb,
  Rocket,
  Globe,
  Code,
  Palette,
  Megaphone
} from "lucide-react";

export default function Career() {
  const [domain, setDomain] = useState(null);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [careerProgress, setCareerProgress] = useState({});
  const [expandedLevel, setExpandedLevel] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [stats, setStats] = useState({ total: 0, completed: 0, inProgress: 0 });
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const interviewLevels = [
    "LEVEL 1 — Aptitude & Logical Round",
    "LEVEL 2 — Technical (Coding & Domain)",
    "LEVEL 3 — HR & Behavioural Round",
  ];

  const domains = {
    "Web Development": {
      logo: "🌐",
      icon: <Code className="domain-icon" />,
      description: "Master frontend and backend skills to build interactive websites.",
      careers: [
        "Frontend Developer",
        "Backend Developer",
        "Full Stack Developer",
        "Web Designer",
        "DevOps Engineer",
      ],
      color: "#2563eb",
      gradient: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
    },
    "Data Science": {
      logo: "📊",
      icon: <BarChart3 className="domain-icon" />,
      description: "Learn data analysis, machine learning, and predictive modeling.",
      careers: [
        "Data Analyst",
        "Data Scientist",
        "ML Engineer",
        "AI Engineer",
        "Data Engineer",
      ],
      color: "#2563eb",
      gradient: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
    },
    "UI/UX Design": {
      logo: "🎨",
      icon: <Palette className="domain-icon" />,
      description: "Design intuitive interfaces and enhance user experience.",
      careers: [
        "UI Designer",
        "UX Researcher",
        "Product Designer",
        "Interaction Designer",
        "Design Strategist",
      ],
      color: "#2563eb",
      gradient: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
    },
    "Digital Marketing": {
      logo: "📱",
      icon: <Megaphone className="domain-icon" />,
      description: "Grow brands online using SEO, ads, and social media campaigns.",
      careers: [
        "SEO Specialist",
        "Content Strategist",
        "Social Media Manager",
        "PPC Specialist",
        "Email Marketer",
      ],
      color: "#2563eb",
      gradient: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
    },
  };

 
  const levelDetails = {
    "Frontend Developer": {
      levels: [
        {
          title: "Level 1 — Aptitude & Logical",
          topics: ["Quantitative Aptitude, Logical Reasoning, Basic Computer Fundamentals (HTML/CSS)"],
          resources: [
            { name: "Indiabix (Aptitude)", link: "https://www.indiabix.com/" },
            { name: "RS Aggarwal - Quantitative Aptitude PDF", link: "https://www.pdfdrive.com/quantitative-aptitude-by-r-s-aggarwal-d18834153.html" },
          ],
        },
        {
          title: "Level 2 — Technical (Coding & Frontend)",
          topics: ["JavaScript ES6+, DOM, React (components, hooks), CSS Flex/Grid, mini projects"],
          resources: [
            { name: "JavaScript.info", link: "https://javascript.info/" },
            { name: "React Official Docs", link: "https://react.dev/" },
            { name: "Frontend Interview Handbook", link: "https://frontendinterviewhandbook.com/" },
            { name: "LeetCode Easy JS Problems", link: "https://leetcode.com/problemset/all/?difficulty=Easy&topicSlugs=javascript" },
          ],
        },
        {
          title: "Level 3 — HR & Behavioural",
          topics: ["STAR method, project walkthrough, teamwork, communication"],
          resources: [
            { name: "PrepInsta HR Q&A", link: "https://prepinsta.com/" },
            { name: "YouTube HR Interview Tips", link: "https://www.youtube.com/results?search_query=hr+interview+questions" },
          ],
        },
      ],
    },
    "Backend Developer": {
      levels: [
        {
          title: "Level 1 — Aptitude & Logical",
          topics: ["Aptitude: quantitative & reasoning, DBMS & OS basics, OOP fundamentals"],
          resources: [
            { name: "RS Aggarwal - Quantitative Aptitude PDF", link: "https://www.pdfdrive.com/quantitative-aptitude-by-r-s-aggarwal-d18834153.html" },
            { name: "Indiabix (Aptitude)", link: "https://www.indiabix.com/" },
          ],
        },
        {
          title: "Level 2 — Technical (Backend)",
          topics: ["Java + Spring Boot or Node.js + Express, REST API design, DB optimization, deployment"],
          resources: [
            { name: "Spring Boot Guides", link: "https://spring.io/guides" },
            { name: "Node.js Official Docs", link: "https://nodejs.org/en/docs/" },
            { name: "PostgreSQL Tutorials", link: "https://www.postgresqltutorial.com/" },
          ],
        },
        {
          title: "Level 3 — HR & Behavioural",
          topics: ["Explain design decisions, past bugs resolved, team interactions"],
          resources: [
            { name: "PrepInsta HR", link: "https://prepinsta.com/" },
            { name: "YouTube HR Interview Tips", link: "https://www.youtube.com/results?search_query=hr+interview+questions" },
          ],
        },
      ],
    },
    "Full Stack Developer": {
      levels: [
        {
          title: "Level 1 — Aptitude & Logical",
          topics: ["Basic web fundamentals, logical reasoning, basic DB concepts"],
          resources: [
            { name: "Indiabix (Aptitude)", link: "https://www.indiabix.com/" },
            { name: "RS Aggarwal - Quantitative Aptitude PDF", link: "https://www.pdfdrive.com/quantitative-aptitude-by-r-s-aggarwal-d18834153.html" },
          ],
        },
        {
          title: "Level 2 — Technical (Fullstack)",
          topics: ["React + Node/Java basics, API integration, deployment, CRUD project"],
          resources: [
            { name: "FreeCodeCamp Full Stack Tutorials", link: "https://www.freecodecamp.org/learn/" },
            { name: "React Official Docs", link: "https://react.dev/" },
            { name: "Node.js Official Docs", link: "https://nodejs.org/en/docs/" },
          ],
        },
        {
          title: "Level 3 — HR & Behavioural",
          topics: ["Project walkthrough, team-fit & conflict-resolution examples"],
          resources: [
            { name: "YouTube: HR Interviews", link: "https://www.youtube.com/results?search_query=HR+interview+tips" },
            { name: "PrepInsta HR", link: "https://prepinsta.com/" },
          ],
        },
      ],
    },
    "Web Designer": {
      levels: [
        {
          title: "Level 1 — Aptitude & Logical",
          topics: ["Visual reasoning, color theory, design layouts"],
          resources: [
            { name: "Interaction Design Foundation - Design Basics", link: "https://www.interaction-design.org/courses/design-thinking" },
          ],
        },
        {
          title: "Level 2 — Technical (Design Tools)",
          topics: ["Figma/Adobe XD, wireframing, prototyping, responsive design"],
          resources: [
            { name: "Figma Learn", link: "https://www.figma.com/learn" },
            { name: "Adobe XD Tutorials", link: "https://helpx.adobe.com/xd/tutorials.html" },
          ],
        },
        {
          title: "Level 3 — HR & Behavioural",
          topics: ["Presentation skills, defending design choices"],
          resources: [
            { name: "Design Case Studies", link: "https://www.behance.net/" },
          ],
        },
      ],
    },
    "DevOps Engineer": {
      levels: [
        {
          title: "Level 1 — Aptitude & Logical",
          topics: ["Linux basics, shell logic, troubleshooting"],
          resources: [
            { name: "Linux Tutorials", link: "https://www.tutorialspoint.com/unix/index.htm" },
          ],
        },
        {
          title: "Level 2 — Technical (DevOps Tools)",
          topics: ["Git, Jenkins/GitHub Actions, Docker, Kubernetes, Cloud basics"],
          resources: [
            { name: "Git Docs", link: "https://git-scm.com/doc" },
            { name: "Jenkins Tutorials", link: "https://www.jenkins.io/doc/tutorials/" },
            { name: "Docker Docs", link: "https://docs.docker.com/" },
            { name: "Kubernetes Docs", link: "https://kubernetes.io/docs/home/" },
          ],
        },
        {
          title: "Level 3 — HR & Behavioural",
          topics: ["Incident handling, collaboration with devs & SREs"],
          resources: [
            { name: "DevOps Case Studies", link: "https://www.atlassian.com/devops/case-studies" },
          ],
        },
      ],
    },
    "Data Analyst": {
      levels: [
        {
          title: "Level 1 — Aptitude & Logical",
          topics: ["Statistics basics, logical reasoning, Excel proficiency"],
          resources: [
            { name: "Khan Academy Statistics", link: "https://www.khanacademy.org/math/statistics-probability" },
            { name: "SQL Basics Tutorial", link: "https://www.w3schools.com/sql/" },
          ],
        },
        {
          title: "Level 2 — Technical (Data Analysis)",
          topics: ["Python (pandas, numpy), SQL queries, data cleaning, visualization (Tableau/PowerBI)"],
          resources: [
            { name: "Kaggle Learn (Python & Pandas)", link: "https://www.kaggle.com/learn/pandas" },
            { name: "Tableau Training", link: "https://www.tableau.com/learn/training" },
            { name: "Power BI Tutorials", link: "https://learn.microsoft.com/en-us/power-bi/guided-learning/" },
          ],
        },
        {
          title: "Level 3 — HR & Behavioural",
          topics: ["Present insights story, explain trade-offs, stakeholder communication"],
          resources: [
            { name: "Storytelling with Data", link: "https://www.storytellingwithdata.com/" },
          ],
        },
      ],
    },
  
  
    "Data Scientist": {
      goal: "Design, train and validate predictive models and communicate outcomes.",
      levels: [
        {
          title: "Level 1 — Aptitude & Logical",
          topics: ["Probability, statistics, hypothesis testing"],
          resources: [
            { name: "Khan Academy Probability & Statistics", link: "https://www.khanacademy.org/math/statistics-probability" },
          ],
        },
        {
          title: "Level 2 — Technical (ML)",
          topics: ["ML algorithms, model selection, feature engineering, Python/Scikit-learn"],
          resources: [
            { name: "Coursera ML by Andrew Ng", link: "https://www.coursera.org/learn/machine-learning" },
            { name: "Scikit-learn Docs", link: "https://scikit-learn.org/stable/" },
          ],
        },
        {
          title: "Level 3 — HR & Behavioural",
          topics: ["Explain models in business terms, reproducibility, limitations"],
          resources: [
            { name: "Kaggle Competitions & Writeups", link: "https://www.kaggle.com/competitions" },
          ],
        },
      ],
    },
    "ML Engineer": {
      goal: "Take ML models to production — training, optimization, deployment.",
      levels: [
        {
          title: "Level 1 — Aptitude & Logical",
          topics: ["Linear algebra basics, probability, debugging logic"],
          resources: [
            { name: "Khan Academy Linear Algebra", link: "https://www.khanacademy.org/math/linear-algebra" },
          ],
        },
        {
          title: "Level 2 — Technical (ML Engineering)",
          topics: ["TensorFlow/PyTorch basics, model optimization, deployment patterns"],
          resources: [
            { name: "TensorFlow Tutorials", link: "https://www.tensorflow.org/tutorials" },
            { name: "PyTorch Tutorials", link: "https://pytorch.org/tutorials/" },
          ],
        },
        {
          title: "Level 3 — HR & Behavioural",
          topics: ["Performance trade-offs, monitoring models, incident scenarios"],
          resources: [
            { name: "MLOps Resources", link: "https://ml-ops.org/" },
          ],
        },
      ],
    },
    "AI Engineer": {
      goal: "Build specialized AI solutions (NLP, CV) and integrate them to products.",
      levels: [
        {
          title: "Level 1 — Aptitude & Logical",
          topics: ["Neural network intuition, logic reasoning"],
          resources: [
            { name: "AI For Everyone (Coursera)", link: "https://www.coursera.org/specializations/ai-for-everyone" },
          ],
        },
        {
          title: "Level 2 — Technical (AI Models)",
          topics: ["Deep learning architectures, transfer learning, frameworks"],
          resources: [
            { name: "Fast.ai", link: "https://www.fast.ai/" },
            { name: "DeepLearning.ai", link: "https://www.deeplearning.ai/" },
          ],
        },
        {
          title: "Level 3 — HR & Behavioural",
          topics: ["Ethics, trade-offs, deployment strategies"],
          resources: [
            { name: "AI Ethics Readings", link: "https://plato.stanford.edu/entries/ethics-ai/" },
          ],
        },
      ],
    },
    "Data Engineer": {
      goal: "Design & implement robust data pipelines and storage structures.",
      levels: [
        {
          title: "Level 1 — Aptitude & Logical",
          topics: ["SQL fundamentals, ETL logic, logical puzzles"],
          resources: [
            { name: "SQLZoo", link: "https://sqlzoo.net/" },
          ],
        },
        {
          title: "Level 2 — Technical (Data Engineering)",
          topics: ["ETL tools, Spark/Hadoop basics, workflow orchestration (Airflow)"],
          resources: [
            { name: "Apache Spark Docs", link: "https://spark.apache.org/docs/latest/" },
            { name: "Airflow Docs", link: "https://airflow.apache.org/docs/" },
          ],
        },
        {
          title: "Level 3 — HR & Behavioural",
          topics: ["Explain pipeline design choices, scalability considerations"],
          resources: [
            { name: "Data Engineering Podcast & Case Studies", link: "https://www.dataengineeringpodcast.com/" },
          ],
        },
      ],
    },
    "UI Designer": {
      goal: "Create visually consistent, accessible UI components & mockups.",
      levels: [
        {
          title: "Level 1 — Aptitude & Logical",
          topics: ["Typography, color theory, layout reasoning"],
          resources: [
            { name: "Material Design Guidelines", link: "https://material.io/" },
            { name: "Khan Academy Art & Design Basics", link: "https://www.khanacademy.org/arts" },
          ],
        },
        {
          title: "Level 2 — Technical (UI Tools)",
          topics: ["Figma/Sketch, component libraries, responsive patterns"],
          resources: [
            { name: "Figma Learn", link: "https://www.figma.com/learn" },
            { name: "Sketch Tutorials", link: "https://www.sketch.com/docs/" },
            { name: "UI Design Patterns", link: "https://uidesigndaily.com/" },
          ],
        },
        {
          title: "Level 3 — HR & Behavioural",
          topics: ["Pitching designs, receiving feedback, iteration stories"],
          resources: [
            { name: "Design Presentation Tips", link: "https://www.interaction-design.org/courses/design-thinking" },
          ],
        },
      ],
    },
    "UX Researcher": {
      goal: "Conduct user research, translate data into UX improvements.",
      levels: [
        {
          title: "Level 1 — Aptitude & Logical",
          topics: ["Research methodology, logic & sampling basics"],
          resources: [
            { name: "Interaction Design Foundation - UX Research", link: "https://www.interaction-design.org/literature/topics/ux-research" },
            { name: "Coursera UX Research Courses", link: "https://www.coursera.org/courses?query=ux%20research" },
          ],
        },
        {
          title: "Level 2 — Technical (UX Research)",
          topics: ["Interviewing, surveys, journey mapping, usability testing"],
          resources: [
            { name: "NNGroup Articles", link: "https://www.nngroup.com/articles/" },
            { name: "Usability.gov Research Methods", link: "https://www.usability.gov/how-to-and-tools/methods/" },
          ],
        },
        {
          title: "Level 3 — HR & Behavioural",
          topics: ["Presenting findings to stakeholders, synthesis stories"],
          resources: [
            { name: "UX Case Studies", link: "https://uxdesign.cc/" },
          ],
        },
      ],
    },
    "Product Designer": {
      goal: "Define product UX & UI to solve user problems end-to-end.",
      levels: [
        {
          title: "Level 1 — Aptitude & Logical",
          topics: ["Design thinking, market reasoning, user empathy"],
          resources: [
            { name: "IDEO Design Thinking", link: "https://www.ideou.com/pages/design-thinking" },
          ],
        },
        {
          title: "Level 2 — Technical (Product Design)",
          topics: ["Personas, wireframes, high-fidelity prototypes"],
          resources: [
            { name: "Design Workshops & Tutorials", link: "https://uxdesign.cc/" },
            { name: "Figma Learn", link: "https://www.figma.com/learn" },
          ],
        },
        {
          title: "Level 3 — HR & Behavioural",
          topics: ["Stakeholder negotiation, product roadmap stories"],
          resources: [
            { name: "Product Case Studies", link: "https://www.behance.net/" },
          ],
        },
      ],
    },
    "Interaction Designer": {
      goal: "Design micro-interactions and motion for delightful UX.",
      levels: [
        {
          title: "Level 1 — Aptitude & Logical",
          topics: ["Motion logic, timing, spatial reasoning"],
          resources: [
            { name: "Interaction Design Foundation", link: "https://www.interaction-design.org/literature/topics/interaction-design" },
          ],
        },
        {
          title: "Level 2 — Technical (Interaction)",
          topics: ["Micro-interactions, prototyping with animation tools"],
          resources: [
            { name: "Principle / Framer Tutorials", link: "https://www.framer.com/learn/" },
            { name: "Motion Design School Tutorials", link: "https://motiondesign.school/" },
          ],
        },
        {
          title: "Level 3 — HR & Behavioural",
          topics: ["Explain interaction decisions & usability feedback"],
          resources: [
            { name: "Animation Case Studies", link: "https://uxdesign.cc/" },
          ],
        },
      ],
    },
    "Design Strategist": {
      goal: "Plan design systems and align them with business strategy.",
      levels: [
        {
          title: "Level 1 — Aptitude & Logical",
          topics: ["Market reasoning, brand logic, competitor analysis"],
          resources: [
            { name: "HBR Strategy Articles", link: "https://hbr.org/" },
          ],
        },
        {
          title: "Level 2 — Technical (Strategy)",
          topics: ["Design systems, governance, cross-team alignment"],
          resources: [
            { name: "Design Systems Resources", link: "https://www.designsystems.com/" },
            { name: "Smashing Magazine Design Systems", link: "https://www.smashingmagazine.com/category/design-systems/" },
          ],
        },
        {
          title: "Level 3 — HR & Behavioural",
          topics: ["Presenting strategy decks, stakeholder persuasion"],
          resources: [
            { name: "Slideshare Presentations", link: "https://www.slideshare.net/" },
          ],
        },
      ],
    },
    "SEO Specialist": {
      goal: "Improve organic traffic through on-page & off-page SEO skills.",
      levels: [
        {
          title: "Level 1 — Aptitude & Logical",
          topics: ["Analytical aptitude, keyword reasoning, basic marketing logic"],
          resources: [
            { name: "Google Search Central", link: "https://developers.google.com/search" },
          ],
        },
        {
          title: "Level 2 — Technical (SEO)",
          topics: ["Keyword research, on-page SEO, analytics"],
          resources: [
            { name: "Ahrefs Blog", link: "https://ahrefs.com/blog" },
            { name: "Moz Beginner's Guide to SEO", link: "https://moz.com/beginners-guide-to-seo" },
          ],
        },
        {
          title: "Level 3 — HR & Behavioural",
          topics: ["Explain campaigns, ROI thinking, client interactions"],
          resources: [
            { name: "SEO Case Studies", link: "https://backlinko.com/seo-case-studies" },
          ],
        },
      ],
    },
    "Content Strategist": {
      goal: "Plan high-impact content & distribution strategies.",
      levels: [
        {
          title: "Level 1 — Aptitude & Logical",
          topics: ["Content planning logic, storytelling basics"],
          resources: [
            { name: "Content Marketing Institute", link: "https://contentmarketinginstitute.com/" },
          ],
        },
        {
          title: "Level 2 — Technical (Content)",
          topics: ["SEO copywriting, editorial calendars, analytics"],
          resources: [
            { name: "Copyblogger", link: "https://copyblogger.com/" },
          ],
        },
        {
          title: "Level 3 — HR & Behavioural",
          topics: ["Campaign wins/losses, iteration stories"],
          resources: [
            { name: "Campaign Case Studies", link: "https://contently.com/resources/case-studies/" },
          ],
        },
      ],
    },
    "Social Media Manager": {
      goal: "Drive engagement & growth across social platforms.",
      levels: [
        {
          title: "Level 1 — Aptitude & Logical",
          topics: ["Platform analytics basics, creative problem solving"],
          resources: [
            { name: "Sprout Social Insights", link: "https://sproutsocial.com/insights/social-media-analytics/" },
          ],
        },
        {
          title: "Level 2 — Technical (Social Ads)",
          topics: ["Ad campaign setup, content calendars, UTM tracking"],
          resources: [
            { name: "Facebook Blueprint", link: "https://www.facebook.com/business/learn" },
          ],
        },
        {
          title: "Level 3 — HR & Behavioural",
          topics: ["Brand voice examples, crisis handling stories"],
          resources: [
            { name: "Social Media Case Studies", link: "https://www.socialmediaexaminer.com/case-studies/" },
          ],
        },
      ],
    },
    "PPC Specialist": {
      goal: "Run cost-efficient paid campaigns and measure ROI.",
      levels: [
        {
          title: "Level 1 — Aptitude & Logical",
          topics: ["Analytical aptitude, understanding metrics (CPC, CTR) basics"],
          resources: [
            { name: "Google Ads Help", link: "https://support.google.com/google-ads" },
          ],
        },
        {
          title: "Level 2 — Technical (PPC)",
          topics: ["Bid strategies, A/B testing, optimization loops"],
          resources: [
            { name: "Google Skillshop", link: "https://skillshop.withgoogle.com/" },
          ],
        },
        {
          title: "Level 3 — HR & Behavioural",
          topics: ["Campaign post-mortem stories, budget trade-offs"],
          resources: [
            { name: "PPC Case Studies", link: "https://www.wordstream.com/blog/ws/2019/08/06/ppc-case-studies" },
          ],
        },
      ],
    },
    "Email Marketer": {
      goal: "Design automated, conversion-focused email flows.",
      levels: [
        {
          title: "Level 1 — Aptitude & Logical",
          topics: ["Segmentation logic, metrics (open, CTR) basics"],
          resources: [
            { name: "Mailchimp Guides", link: "https://mailchimp.com/resources/" },
          ],
        },
        {
          title: "Level 2 — Technical (Email Tools)",
          topics: ["Automation & workflows, A/B testing, deliverability"],
          resources: [
            { name: "Campaign Monitor Resources", link: "https://www.campaignmonitor.com/resources/" },
          ],
        },
        {
          title: "Level 3 — HR & Behavioural",
          topics: ["Campaign case studies, copy & design collaboration stories"],
          resources: [
            { name: "Email Campaign Case Studies", link: "https://www.campaignmonitor.com/resources/case-studies/" },
          ],
        },
      ],
    },
    // Add other careers similarly...
  };

 
// Restore progress
useEffect(() => {
  const saved = localStorage.getItem("careerProgress_v1");
  if (saved) {
    try {
      setCareerProgress(JSON.parse(saved));
    } catch {}
  }
}, []);

// Save progress
useEffect(() => {
  localStorage.setItem("careerProgress_v1", JSON.stringify(careerProgress));
}, [careerProgress]);

useEffect(() => {
  // Initial theme load
  const savedTheme = localStorage.getItem("theme") || "light";
  setIsDarkMode(savedTheme === "dark");

  // Listen for theme changes from account settings
  const handleThemeChange = () => {
    const currentTheme = localStorage.getItem("theme") || "light";
    setIsDarkMode(currentTheme === "dark");
  };

  // Add event listener for custom theme change events
  window.addEventListener('themeChange', handleThemeChange);
  
  // Also check for changes periodically (fallback)
  const interval = setInterval(() => {
    const currentTheme = localStorage.getItem("theme") || "light";
    if ((currentTheme === "dark") !== isDarkMode) {
      setIsDarkMode(currentTheme === "dark");
    }
  }, 1000);

  return () => {
    window.removeEventListener('themeChange', handleThemeChange);
    clearInterval(interval);
  };
}, [isDarkMode]);

// Force component update when theme changes
useEffect(() => {
  // This will trigger a re-render when isDarkMode changes
}, [isDarkMode]);

const toggleCompletion = (career, levelIndex) => {
const key = `${career}-L${levelIndex}`;
  setCareerProgress((prev) => ({ ...prev, [key]: !prev[key] }));
};

const getProgress = (career) => {
  const total = interviewLevels.length;
  let completed = 0;
  for (let i = 0; i < total; i++) {
    if (careerProgress[`${career}-L${i}`]) completed++;
  }
  return Math.round((completed / total) * 100);
};

const markAll = (career) => {
  const updates = {};
  for (let i = 0; i < interviewLevels.length; i++) {
    updates[`${career}-L${i}`] = true;
  }
  setCareerProgress((prev) => ({ ...prev, ...updates }));
};

const resetProgress = (career,levelCount) => {
  const updates = {};
  for (let i = 0; i < interviewLevels.length; i++) {
    updates[`${career}-L${i}`] = false;
  }
  setCareerProgress((prev) => ({ ...prev, ...updates }));
};

const toggleExpand = (levelIndex) => {
  setExpandedLevel(expandedLevel === levelIndex ? null : levelIndex);
};

const filteredCareers = domain ? domains[domain].careers.filter(career => 
  career.toLowerCase().includes(searchTerm.toLowerCase())
) : [];

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case "Beginner": return "#10b981";
    case "Intermediate": return "#f59e0b";
    case "Advanced": return "#ef4444";
    default: return "#6b7280";
  }
};

const getResourceTypeColor = (type) => {
  switch (type) {
    case "Practice": return "#3b82f6";
    case "Book": return "#8b5cf6";
    case "Tutorial": return "#10b981";
    case "Documentation": return "#f59e0b";
    case "Guide": return "#ef4444";
    case "Video": return "#ec4899";
    case "Case Study": return "#8b5cf6";
    default: return "#6b7280";
  }
};

return (
  <>
    <style>
  {`
    .career-portal {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0;
      font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
      line-height: 1.6;
      min-height: 100vh;
      background: ${isDarkMode ? '#1a202c' : '#ffffff'};
      color: ${isDarkMode ? '#ffffff' : '#111827'};
      transition: all 0.3s ease;
      margin-left: 50px;
      padding: 40px 60px;
    }

    /* Domain Selection */
    .domain-selection {
      padding: 0;
      background: transparent;
      color: ${isDarkMode ? '#ffffff' : '#111827'};
      border-radius: 0;
      margin-bottom: 48px;
    }

    /* Hero Section */
    .portal-header {
      background: ${isDarkMode 
        ? 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)'
        : 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)'};
      padding: 48px 40px;
      border-radius: 16px;
      margin-bottom: 48px;
      border: 1px solid ${isDarkMode ? '#4a5568' : '#c7d2fe'};
      position: relative;
      overflow: hidden;
      text-align: center;
      max-width: 100%;
    }

    .portal-header::before {
      content: '';
      position: absolute;
      top: -50px;
      right: -50px;
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, rgba(63, 81, 181, 0.15) 0%, transparent 70%);
      border-radius: 50%;
    }

    .portal-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: ${isDarkMode ? '#4a5568' : '#ede9fe'};
      padding: 8px 16px;
      border-radius: 20px;
      margin-bottom: 16px;
      font-weight: 600;
      font-size: 0.875rem;
      color: ${isDarkMode ? '#c3dafe' : '#5b21b6'};
      position: relative;
      z-index: 1;
    }

    .portal-header h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 12px;
      background: ${isDarkMode 
        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        : 'linear-gradient(135deg, #3f51b5 0%, #5a67d8 100%)'};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1.2;
      position: relative;
      z-index: 1;
    }

    .portal-subtitle {
      font-size: 1.1rem;
      color: ${isDarkMode ? '#a0aec0' : '#6b7280'};
      line-height: 1.5;
      font-weight: 400;
      max-width: 700px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }

    .domains-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 28px;
      max-width: 100%;
      margin: 0 auto;
    }

    .domain-card {
      background: ${isDarkMode ? '#2d3748' : '#ffffff'};
      border-radius: 16px;
      padding: 32px;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      box-shadow: ${isDarkMode 
        ? '0 10px 30px rgba(0, 0, 0, 0.4)'
        : '0 6px 20px rgba(0, 0, 0, 0.08)'};
      border: 1px solid ${isDarkMode ? '#4a5568' : '#e5e7eb'};
    }

    .domain-card::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 120px;
      height: 120px;
      background: linear-gradient(135deg, #3f51b5 0%, #5a67d8 100%);
      opacity: 0.08;
      border-radius: 0 0 0 100%;
    }

    .domain-card:hover {
      transform: translateY(-6px);
      box-shadow: ${isDarkMode
        ? '0 16px 40px rgba(0, 0, 0, 0.5)'
        : '0 12px 30px rgba(0, 0, 0, 0.12)'};
      border-color: #3f51b5;
    }

    .domain-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 20px;
      position: relative;
      z-index: 1;
    }

    .domain-icon-wrapper {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      background: linear-gradient(135deg, #3f51b5 0%, #5a67d8 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.4rem;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(63, 81, 181, 0.3);
    }

    .domain-card:hover .domain-icon-wrapper {
      transform: scale(1.1);
      box-shadow: 0 6px 16px rgba(63, 81, 181, 0.4);
    }

    .domain-card h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: ${isDarkMode ? '#90cdf4' : '#3f51b5'};
      margin: 0;
      line-height: 1.3;
    }

    .domain-card p {
      color: ${isDarkMode ? '#cbd5e0' : '#4b5563'};
      margin-bottom: 24px;
      line-height: 1.7;
      font-size: 1rem;
      position: relative;
      z-index: 1;
      min-height: 48px;
    }

    .domain-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      z-index: 1;
    }

    .career-count {
      display: flex;
      align-items: center;
      gap: 6px;
      color: ${isDarkMode ? '#a0aec0' : '#6b7280'};
      font-weight: 600;
      font-size: 0.875rem;
      background: ${isDarkMode ? '#4a5568' : '#f9fafb'};
      padding: 6px 14px;
      border-radius: 20px;
    }

    .explore-link {
      display: flex;
      align-items: center;
      gap: 6px;
      color: white;
      font-weight: 600;
      padding: 10px 20px;
      background: #3f51b5;
      border-radius: 10px;
      transition: all 0.3s ease;
      font-size: 0.875rem;
      box-shadow: 0 4px 12px rgba(63, 81, 181, 0.3);
    }

    .domain-card:hover .explore-link {
      background: #303f9f;
      transform: translateX(4px);
      box-shadow: 0 6px 16px rgba(63, 81, 181, 0.4);
    }

    /* Career Selection */
    .career-selection {
      padding: 0;
      background: transparent;
    }

    .back-button {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: ${isDarkMode ? '#2d3748' : '#ffffff'};
      border: 1px solid ${isDarkMode ? '#4a5568' : '#e5e7eb'};
      border-radius: 10px;
      padding: 12px 20px;
      cursor: pointer;
      color: ${isDarkMode ? '#ffffff' : '#111827'};
      transition: all 0.2s ease;
      margin-bottom: 24px;
      font-weight: 600;
      font-size: 0.95rem;
      box-shadow: ${isDarkMode 
        ? '0 4px 12px rgba(0, 0, 0, 0.3)'
        : '0 2px 8px rgba(0, 0, 0, 0.06)'};
    }

    .back-button:hover {
      border-color: #3f51b5;
      color: #3f51b5;
      transform: translateX(-3px);
      box-shadow: ${isDarkMode 
        ? '0 6px 16px rgba(0, 0, 0, 0.4)'
        : '0 4px 12px rgba(0, 0, 0, 0.08)'};
    }

    .career-header {
      background: ${isDarkMode 
        ? 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)'
        : 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)'};
      padding: 32px 40px;
      border-radius: 16px;
      margin-bottom: 40px;
      border: 1px solid ${isDarkMode ? '#4a5568' : '#c7d2fe'};
      position: relative;
      overflow: hidden;
      box-shadow: ${isDarkMode 
        ? '0 10px 30px rgba(0, 0, 0, 0.4)'
        : '0 6px 20px rgba(0, 0, 0, 0.08)'};
    }

    .career-header::before {
      content: '';
      position: absolute;
      top: -50px;
      right: -50px;
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, rgba(63, 81, 181, 0.15) 0%, transparent 70%);
      border-radius: 50%;
    }

    .career-title {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 24px;
      position: relative;
      z-index: 1;
    }

    .domain-avatar {
      width: 64px;
      height: 64px;
      border-radius: 14px;
      background: linear-gradient(135deg, #3f51b5 0%, #5a67d8 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.75rem;
      color: white;
      box-shadow: 0 6px 16px rgba(63, 81, 181, 0.3);
    }

    .career-title h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: ${isDarkMode ? '#90cdf4' : '#3f51b5'};
      margin: 0 0 6px 0;
    }

    .career-title p {
      font-size: 1rem;
      color: ${isDarkMode ? '#a0aec0' : '#6b7280'};
      margin: 0;
    }

    .search-section {
      display: flex;
      gap: 12px;
      align-items: center;
      flex-wrap: wrap;
      position: relative;
      z-index: 1;
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: 10px;
      background: ${isDarkMode ? '#1a202c' : '#ffffff'};
      border: 2px solid ${isDarkMode ? '#4a5568' : '#d1d5db'};
      border-radius: 10px;
      padding: 12px 16px;
      min-width: 280px;
      flex: 1;
      transition: all 0.2s ease;
      box-shadow: ${isDarkMode 
        ? '0 4px 12px rgba(0, 0, 0, 0.3)'
        : '0 2px 8px rgba(0, 0, 0, 0.06)'};
    }

    .search-box:focus-within {
      border-color: #3f51b5;
      box-shadow: 0 0 0 3px rgba(63, 81, 181, 0.1);
    }

    .search-box input {
      border: none;
      outline: none;
      width: 100%;
      font-size: 0.95rem;
      color: ${isDarkMode ? '#ffffff' : '#111827'};
      background: transparent;
      font-weight: 500;
    }

    .search-box input::placeholder {
      color: ${isDarkMode ? '#a0aec0' : '#9ca3af'};
    }

    .filter-buttons {
      display: flex;
      gap: 10px;
    }

    .filter-btn {
      padding: 10px 18px;
      border: 2px solid ${isDarkMode ? '#4a5568' : '#d1d5db'};
      border-radius: 10px;
      background: ${isDarkMode ? '#2d3748' : '#ffffff'};
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: 600;
      font-size: 0.875rem;
      color: ${isDarkMode ? '#ffffff' : '#111827'};
      box-shadow: ${isDarkMode 
        ? '0 4px 12px rgba(0, 0, 0, 0.3)'
        : '0 2px 8px rgba(0, 0, 0, 0.06)'};
    }

    .filter-btn:hover {
      border-color: #3f51b5;
      transform: translateY(-2px);
    }

    .filter-btn.active {
      background: #3f51b5;
      color: white;
      border-color: #3f51b5;
      box-shadow: 0 6px 16px rgba(63, 81, 181, 0.4);
    }

    .careers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 28px;
    }

    .career-card {
      background: ${isDarkMode ? '#2d3748' : '#ffffff'};
      color: ${isDarkMode ? '#ffffff' : '#111827'};
      padding: 32px;
      border-radius: 16px;
      box-shadow: ${isDarkMode 
        ? '0 10px 30px rgba(0, 0, 0, 0.4)'
        : '0 6px 20px rgba(0, 0, 0, 0.08)'};
      border: 1px solid ${isDarkMode ? '#4a5568' : '#e5e7eb'};
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      cursor: pointer;
    }

    .career-card::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 120px;
      height: 120px;
      background: linear-gradient(135deg, #3f51b5 0%, #5a67d8 100%);
      opacity: 0.08;
      border-radius: 0 0 0 100%;
    }

    .career-card:hover {
      transform: translateY(-6px);
      box-shadow: ${isDarkMode
        ? '0 16px 40px rgba(0, 0, 0, 0.5)'
        : '0 12px 30px rgba(0, 0, 0, 0.12)'};
      border-color: #3f51b5;
    }

    .career-card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
      position: relative;
      z-index: 1;
    }

    .career-card h4 {
      font-size: 1.5rem;
      font-weight: 700;
      color: ${isDarkMode ? '#90cdf4' : '#3f51b5'};
      margin: 0;
      flex: 1;
      line-height: 1.3;
    }

    .completion-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      background: #10b981;
      color: white;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }

    .progress-section {
      margin: 20px 0;
      position: relative;
      z-index: 1;
    }

    .progress-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .progress-text {
      font-weight: 600;
      color: ${isDarkMode ? '#e2e8f0' : '#374151'};
      font-size: 0.95rem;
    }

    .progress-percent {
      font-weight: 700;
      color: #3f51b5;
      font-size: 1.1rem;
    }

    .progress-bar {
      height: 8px;
      background: ${isDarkMode ? '#4a5568' : '#e5e7eb'};
      border-radius: 8px;
      overflow: hidden;
      position: relative;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(135deg, #3f51b5 0%, #5a67d8 100%);
      border-radius: 8px;
      transition: width 0.8s ease-in-out;
      box-shadow: 0 2px 8px rgba(63, 81, 181, 0.3);
    }

    .progress-stats {
      display: flex;
      justify-content: space-between;
      color: ${isDarkMode ? '#a0aec0' : '#6b7280'};
      font-size: 0.875rem;
      font-weight: 600;
      margin-top: 10px;
    }

    .career-card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid ${isDarkMode ? '#4a5568' : '#e5e7eb'};
      position: relative;
      z-index: 1;
    }

    .level-count {
      display: flex;
      align-items: center;
      gap: 6px;
      color: ${isDarkMode ? '#a0aec0' : '#6b7280'};
      font-weight: 600;
      font-size: 0.875rem;
      background: ${isDarkMode ? '#4a5568' : '#f9fafb'};
      padding: 6px 14px;
      border-radius: 20px;
    }

    .start-learning {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #3f51b5;
      font-weight: 600;
      transition: all 0.2s ease;
      font-size: 0.875rem;
    }

    .career-card:hover .start-learning {
      transform: translateX(4px);
    }

    /* Level Details */
    .level-details {
      padding: 0;
      background: transparent;
    }

    .level-header-actions {
      margin-bottom: 24px;
    }

    .career-progress-card {
      background: ${isDarkMode ? '#2d3748' : '#ffffff'};
      border-radius: 16px;
      padding: 32px;
      box-shadow: ${isDarkMode 
        ? '0 10px 30px rgba(0, 0, 0, 0.4)'
        : '0 6px 20px rgba(0, 0, 0, 0.08)'};
      margin-bottom: 32px;
      border: 1px solid ${isDarkMode ? '#4a5568' : '#e5e7eb'};
    }

    .progress-overview {
      display: flex;
      align-items: center;
      gap: 24px;
    }

    .progress-circle {
      width: 90px;
      height: 90px;
      position: relative;
      flex-shrink: 0;
    }

    .circle-bg {
      fill: none;
      stroke: ${isDarkMode ? '#4a5568' : '#e5e7eb'};
      stroke-width: 8;
    }

    .circle-progress {
      fill: none;
      stroke: #3f51b5;
      stroke-width: 8;
      stroke-linecap: round;
      transform: rotate(-90deg);
      transform-origin: 50% 50%;
      transition: stroke-dashoffset 0.8s ease-in-out;
    }

    .progress-text-circle {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
    }

    .progress-percent-circle {
      font-size: 1.4rem;
      font-weight: 700;
      color: ${isDarkMode ? '#ffffff' : '#111827'};
    }

    .progress-label {
      font-size: 0.75rem;
      color: ${isDarkMode ? '#a0aec0' : '#6b7280'};
      font-weight: 600;
    }

    .progress-details {
      flex: 1;
    }

    .progress-details h3 {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 10px;
      color: ${isDarkMode ? '#90cdf4' : '#3f51b5'};
    }

    .progress-details p {
      color: ${isDarkMode ? '#cbd5e0' : '#4b5563'};
      margin-bottom: 20px;
      font-size: 1rem;
      line-height: 1.6;
    }

    .action-buttons {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
      font-size: 0.95rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }

    .btn-primary {
      background: #3f51b5;
      color: white;
    }

    .btn-primary:hover {
      background: #303f9f;
    }

    .btn-secondary {
      background: ${isDarkMode ? '#4a5568' : '#f3f4f6'};
      color: ${isDarkMode ? '#ffffff' : '#111827'};
      border: 1px solid ${isDarkMode ? '#4a5568' : '#d1d5db'};
    }

    .btn-secondary:hover {
      background: ${isDarkMode ? '#2d3748' : '#e5e7eb'};
    }

    .levels-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .level-card {
      background: ${isDarkMode ? '#2d3748' : '#ffffff'};
      border-radius: 16px;
      overflow: hidden;
      box-shadow: ${isDarkMode 
        ? '0 10px 30px rgba(0, 0, 0, 0.4)'
        : '0 6px 20px rgba(0, 0, 0, 0.08)'};
      border: 1px solid ${isDarkMode ? '#4a5568' : '#e5e7eb'};
      transition: all 0.2s ease;
    }

    .level-card.expanded {
      box-shadow: ${isDarkMode
        ? '0 16px 40px rgba(0, 0, 0, 0.5)'
        : '0 12px 30px rgba(0, 0, 0, 0.12)'};
      border-color: #3f51b5;
    }

    .level-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .level-card-header:hover {
      background: ${isDarkMode ? '#374151' : '#f9fafb'};
    }

    .level-info {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      flex: 1;
    }

    .completion-indicator {
      margin-top: 2px;
    }

    .completed {
      color: #10b981;
    }

    .incomplete {
      color: ${isDarkMode ? '#a0aec0' : '#9ca3af'};
    }

    .level-content-main {
      flex: 1;
    }

    .level-title {
      font-size: 1.15rem;
      font-weight: 600;
      margin-bottom: 8px;
      color: ${isDarkMode ? '#ffffff' : '#111827'};
    }

    .level-meta {
      display: flex;
      gap: 12px;
      margin-bottom: 8px;
      flex-wrap: wrap;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.875rem;
      color: ${isDarkMode ? '#a0aec0' : '#6b7280'};
      font-weight: 600;
    }

    .difficulty-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      color: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    .level-description {
      font-size: 0.875rem;
      color: ${isDarkMode ? '#a0aec0' : '#6b7280'};
      margin: 0;
    }

    .expand-arrow {
      transition: transform 0.2s ease;
      color: ${isDarkMode ? '#a0aec0' : '#9ca3af'};
    }

    .expand-arrow.expanded {
      transform: rotate(90deg);
      color: #3f51b5;
    }

    .level-card-content {
      padding: 0 24px 24px;
      border-top: 1px solid ${isDarkMode ? '#4a5568' : '#e5e7eb'};
    }

    .topics-section, .resources-section {
      margin-bottom: 24px;
      padding-top: 24px;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 16px;
      color: ${isDarkMode ? '#ffffff' : '#111827'};
    }

    .topics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
    }

    .topic-item {
      background: ${isDarkMode ? '#374151' : '#f9fafb'};
      padding: 14px 16px;
      border-radius: 10px;
      border-left: 4px solid #3f51b5;
      transition: all 0.2s ease;
      font-size: 0.875rem;
      color: ${isDarkMode ? '#ffffff' : '#111827'};
      font-weight: 500;
    }

    .topic-item:hover {
      background: ${isDarkMode ? '#4a5568' : '#e5e7eb'};
      transform: translateX(4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .resources-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
    }

    .resource-card {
      background: ${isDarkMode ? '#374151' : '#ffffff'};
      border: 1px solid ${isDarkMode ? '#4a5568' : '#e5e7eb'};
      border-radius: 12px;
      padding: 20px;
      transition: all 0.3s ease;
      text-decoration: none;
      color: inherit;
      position: relative;
      overflow: hidden;
      box-shadow: ${isDarkMode 
        ? '0 4px 12px rgba(0, 0, 0, 0.3)'
        : '0 2px 8px rgba(0, 0, 0, 0.06)'};
    }

    .resource-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: #3f51b5;
      transform: scaleX(0);
      transition: transform 0.3s ease;
    }

    .resource-card:hover {
      border-color: #3f51b5;
      transform: translateY(-4px);
      box-shadow: ${isDarkMode
        ? '0 8px 20px rgba(0, 0, 0, 0.4)'
        : '0 6px 16px rgba(0, 0, 0, 0.1)'};
    }

    .resource-card:hover::before {
      transform: scaleX(1);
    }

    .resource-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
      gap: 12px;
    }

    .resource-name {
      font-weight: 600;
      color: ${isDarkMode ? '#ffffff' : '#111827'};
      flex: 1;
      font-size: 0.95rem;
      line-height: 1.4;
    }

    .resource-type {
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      color: white;
      white-space: nowrap;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    .resource-link {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #3f51b5;
      font-weight: 600;
      font-size: 0.875rem;
      margin-top: 12px;
      transition: all 0.2s ease;
    }

    .resource-card:hover .resource-link {
      transform: translateX(4px);
    }

    .level-actions {
      display: flex;
      gap: 12px;
      padding-top: 20px;
      border-top: 1px solid ${isDarkMode ? '#4a5568' : '#e5e7eb'};
      flex-wrap: wrap;
    }

    .toggle-btn {
      padding: 12px 24px;
      border: none;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.95rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .toggle-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }

    .btn-complete {
      background: #10b981;
      color: white;
    }

    .btn-complete:hover {
      background: #059669;
    }

    .btn-incomplete {
      background: ${isDarkMode ? '#4a5568' : '#f3f4f6'};
      color: ${isDarkMode ? '#ffffff' : '#111827'};
      border: 1px solid ${isDarkMode ? '#4a5568' : '#d1d5db'};
    }

    .btn-incomplete:hover {
      background: ${isDarkMode ? '#2d3748' : '#e5e7eb'};
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .career-portal {
        margin-left: 0;
        padding: 30px 40px;
      }

      .domains-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .careers-grid {
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      }
    }

    @media (max-width: 768px) {
      .career-portal {
        padding: 20px;
        margin-left: 0;
      }

      .portal-header {
        padding: 32px 24px;
        border-radius: 12px;
        margin-bottom: 32px;
      }

      .portal-header h1 {
        font-size: 1.75rem;
      }

      .portal-subtitle {
        font-size: 0.95rem;
      }

      .domains-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .domain-card {
        padding: 24px;
      }

      .domain-icon-wrapper {
        width: 48px;
        height: 48px;
        font-size: 1.2rem;
      }

      .domain-card h3 {
        font-size: 1.25rem;
      }

      .career-header {
        padding: 24px;
        flex-direction: column;
        gap: 20px;
      }

      .career-title {
        flex-direction: column;
        gap: 12px;
        text-align: center;
        width: 100%;
      }

      .career-title h2 {
        font-size: 1.5rem;
      }

      .search-section {
        flex-direction: column;
        width: 100%;
      }

      .search-box {
        min-width: auto;
        width: 100%;
      }

      .filter-buttons {
        width: 100%;
        justify-content: center;
      }

      .careers-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .career-card {
        padding: 24px;
      }

      .career-card h4 {
        font-size: 1.25rem;
      }

      .career-progress-card {
        padding: 24px;
      }

      .progress-overview {
        flex-direction: column;
        text-align: center;
        gap: 20px;
      }

      .progress-details h3 {
        font-size: 1.25rem;
      }

      .action-buttons {
        flex-direction: column;
        width: 100%;
      }

      .btn {
        width: 100%;
        justify-content: center;
      }

      .level-card-header {
        padding: 20px;
      }

      .level-info {
        gap: 12px;
      }

      .level-title {
        font-size: 1rem;
      }

      .level-card-content {
        padding: 0 20px 20px;
      }

      .topics-grid {
        grid-template-columns: 1fr;
      }

      .resources-grid {
        grid-template-columns: 1fr;
      }

      .level-actions {
        flex-direction: column;
      }

      .toggle-btn {
        width: 100%;
        justify-content: center;
      }
    }

    @media (max-width: 480px) {
      .career-portal {
        padding: 16px;
      }

      .portal-header {
        padding: 24px 20px;
      }

      .portal-header h1 {
        font-size: 1.5rem;
      }

      .portal-badge {
        font-size: 0.75rem;
        padding: 6px 12px;
      }

      .domain-card {
        padding: 20px;
      }

      .domain-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .domain-icon-wrapper {
        width: 44px;
        height: 44px;
        font-size: 1.1rem;
      }

      .domain-card h3 {
        font-size: 1.15rem;
      }

      .domain-footer {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
      }

      .explore-link {
        width: 100%;
        justify-content: center;
      }

      .career-header {
        padding: 20px;
      }

      .domain-avatar {
        width: 56px;
        height: 56px;
        font-size: 1.5rem;
      }

      .career-title h2 {
        font-size: 1.35rem;
      }

      .filter-buttons {
        flex-wrap: wrap;
      }

      .filter-btn {
        flex: 1;
        min-width: 80px;
        text-align: center;
        padding: 8px 12px;
        font-size: 0.8rem;
      }

      .career-card {
        padding: 20px;
      }

      .career-card h4 {
        font-size: 1.15rem;
      }

      .career-progress-card {
        padding: 20px;
      }

      .progress-circle {
        width: 80px;
        height: 80px;
      }

      .progress-percent-circle {
        font-size: 1.2rem;
      }

      .progress-details h3 {
        font-size: 1.15rem;
      }

      .progress-details p {
        font-size: 0.9rem;
      }

      .level-card-header {
        padding: 16px;
      }

      .level-card-content {
        padding: 0 16px 16px;
      }

      .section-title {
        font-size: 0.95rem;
      }

      .topic-item {
        padding: 12px;
        font-size: 0.8rem;
      }

      .resource-card {
        padding: 16px;
      }

      .resource-name {
        font-size: 0.875rem;
      }
    }

    /* Additional utility classes */
    .text-gradient {
      background: linear-gradient(135deg, #3f51b5 0%, #5a67d8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .shadow-elevated {
      box-shadow: ${isDarkMode 
        ? '0 16px 40px rgba(0, 0, 0, 0.5)'
        : '0 12px 30px rgba(0, 0, 0, 0.12)'};
    }

    .border-gradient {
      border: 1px solid;
      border-image: linear-gradient(135deg, #3f51b5 0%, #5a67d8 100%) 1;
    }

    /* Smooth scrolling */
    html {
      scroll-behavior: smooth;
    }

    /* Custom scrollbar */
    ::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }

    ::-webkit-scrollbar-track {
      background: ${isDarkMode ? '#1a202c' : '#f1f1f1'};
    }

    ::-webkit-scrollbar-thumb {
      background: ${isDarkMode ? '#4a5568' : '#c1c1c1'};
      border-radius: 5px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: ${isDarkMode ? '#718096' : '#a8a8a8'};
    }

    /* Selection colors */
    ::selection {
      background: rgba(63, 81, 181, 0.3);
      color: ${isDarkMode ? '#ffffff' : '#111827'};
    }

    ::-moz-selection {
      background: rgba(63, 81, 181, 0.3);
      color: ${isDarkMode ? '#ffffff' : '#111827'};
    }

    /* Focus visible for accessibility */
    *:focus-visible {
      outline: 2px solid #3f51b5;
      outline-offset: 2px;
    }

    /* Animations */
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .fade-in {
      animation: fadeIn 0.3s ease-in-out;
    }

    @keyframes slideIn {
      from {
        transform: translateX(-20px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .slide-in {
      animation: slideIn 0.3s ease-out;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.7;
      }
    }

    .pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
  `}
</style>

    <div className={`career-portal ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* Domain Selection View */}
      {!domain && (
        <div className="domain-selection">
          <div className="portal-header">
           
            <h1>Launch Your Dream Career</h1>
            <p className="portal-subtitle">
              Select your domain, choose a career path, and follow our comprehensive 3-level preparation roadmap. Your progress is automatically saved and tracked.
            </p>
          </div>

          <div className="domains-grid">
            {Object.entries(domains).map(([key, info]) => (
              <div 
                key={key} 
                className="domain-card"
                onClick={() => setDomain(key)}
                style={{
                  '--domain-color': info.color,
                  '--domain-gradient': info.gradient,
                }}
              >
                <div className="domain-header">
                  <div className="domain-icon-wrapper">
                    {info.icon}
                  </div>
                  <h3>{key}</h3>
                </div>
                <p>{info.description}</p>
                <div className="domain-footer">
                  <div className="career-count">
                    <Users size={14} />
                    {info.careers.length} career paths
                  </div>
                  <div className="explore-link">
                    <span>Explore careers</span>
                    <ChevronRight size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Career Selection View */}
      {domain && !selectedCareer && (
        <div className="career-selection">
          <button 
            className="back-button"
            onClick={() => setDomain(null)}
          >
            <ArrowLeft size={14} />
            Back to Domains
          </button>

          <div className="career-header">
            <div className="career-title">
              <div 
                className="domain-avatar"
                style={{ background: domains[domain].gradient }}
              >
                {domains[domain].logo}
              </div>
              <div>
                <h2>Career Paths in {domain}</h2>
                <p>Choose your specialization and start your journey</p>
              </div>
            </div>
            
            <div className="search-section">
              <div className="search-box">
                <Search size={16} />
                <input
                  type="text"
                  placeholder={`Search ${domain} careers...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="filter-buttons">
                <button 
                  className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('all')}
                >
                  All
                </button>
                <button 
                  className={`filter-btn ${activeFilter === 'inProgress' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('inProgress')}
                >
                  In Progress
                </button>
                <button 
                  className={`filter-btn ${activeFilter === 'completed' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('completed')}
                >
                  Completed
                </button>
              </div>
            </div>
          </div>

          <div className="careers-grid">
            {filteredCareers.map((career) => {
              const progress = getProgress(career);
              const shouldShow = activeFilter === 'all' ||
                (activeFilter === 'inProgress' && progress > 0 && progress < 100) ||
                (activeFilter === 'completed' && progress === 100);

              if (!shouldShow) return null;

              return (
                <div 
                  key={career} 
                  className="career-card"
                  onClick={() => setSelectedCareer(career)}
                  style={{
                    '--domain-color': domains[domain].color,
                    '--domain-gradient': domains[domain].gradient,
                  }}
                >
                  <div className="career-card-header">
                    <h4>{career}</h4>
                    {progress === 100 && (
                      <div className="completion-badge">
                        <Award size={12} />
                        Complete
                      </div>
                    )}
                  </div>
                  
                  <div className="progress-section">
                    <div className="progress-header">
                      <span className="progress-text">Preparation Progress</span>
                      <span className="progress-percent">{progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="progress-stats">
                      <span>{Math.round(progress/100 * 3)}/3 levels</span>
                      <span>{progress === 100 ? "Ready! 🎉" : "Keep going! 💪"}</span>
                    </div>
                  </div>

                  <div className="career-card-footer">
                    <div className="level-count">
                      <BookOpen size={12} />
                      {interviewLevels.length} Levels
                    </div>
                    <div className="start-learning">
                      <span>Start Learning</span>
                      <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Level Details View */}
      {selectedCareer && (
        <div className="level-details">
          <div className="level-header-actions">
            <button 
              className="back-button"
              onClick={() => setSelectedCareer(null)}
            >
              <ArrowLeft size={14} />
              Back to {domain}
            </button>
          </div>

          <div 
            className="career-progress-card"
            style={{
              '--domain-color': domains[domain].color,
              '--domain-gradient': domains[domain].gradient,
            }}
          >
            <div className="progress-overview">
              <div className="progress-circle">
                <svg width="80" height="80" viewBox="0 0 80 80">
                  <circle className="circle-bg" cx="40" cy="40" r="36" />
                  <circle 
                    className="circle-progress" 
                    cx="40" 
                    cy="40" 
                    r="36" 
                    strokeDasharray="226.194"
                    strokeDashoffset={226.194 * (1 - getProgress(selectedCareer) / 100)}
                  />
                </svg>
                <div className="progress-text-circle">
                  <div className="progress-percent-circle">{getProgress(selectedCareer)}%</div>
                  <div className="progress-label">Complete</div>
                </div>
              </div>
              <div className="progress-details">
                <h3>{selectedCareer}</h3>
                <p>
                  Follow this comprehensive roadmap to master your interview preparation. 
                  Complete all levels to become interview-ready.
                </p>
                <div className="action-buttons">
                  <button 
                    className="btn btn-primary"
                    onClick={() => markAll(selectedCareer)}
                  >
                    <CheckCircle2 size={14} />
                    Mark All Complete
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => resetProgress(selectedCareer)}
                  >
                    Reset Progress
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="levels-container">
            {levelDetails[selectedCareer]?.levels?.map((level, index) => (
              <div 
                key={index} 
                className={`level-card ${expandedLevel === index ? 'expanded' : ''}`}
                style={{
                  '--domain-color': domains[domain].color,
                }}
              >
                <div 
                  className="level-card-header"
                  onClick={() => toggleExpand(index)}
                >
                  <div className="level-info">
                    <div className="completion-indicator">
                      {careerProgress[`${selectedCareer}-L${index}`] ? (
                        <CheckCircle2 className="completed" size={18} />
                      ) : (
                        <Circle className="incomplete" size={18} />
                      )}
                    </div>
                    <div className="level-content-main">
                      <h3 className="level-title">{level.title}</h3>
                      <div className="level-meta">
                        <div className="meta-item">
                          <Clock size={12} />
                          {level.duration}
                        </div>
                        <div 
                          className="difficulty-badge"
                          style={{ background: getDifficultyColor(level.difficulty) }}
                        >
                          {level.difficulty}
                        </div>
                      </div>
                      <p className="level-description">
                        {expandedLevel === index ? 'Click to collapse details' : 'Click to expand details'}
                      </p>
                    </div>
                  </div>
                  <ChevronRight 
                    className={`expand-arrow ${expandedLevel === index ? 'expanded' : ''}`}
                    size={16}
                  />
                </div>

                {expandedLevel === index && (
                  <div className="level-card-content">
                    <div className="topics-section">
                      <h4 className="section-title">
                        <PlayCircle size={14} />
                        Topics & Focus Areas
                      </h4>
                      <div className="topics-grid">
                        {level.topics.map((topic, i) => (
                          <div key={i} className="topic-item">
                            {topic}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="resources-section">
                      <h4 className="section-title">
                        <ExternalLink size={14} />
                        Learning Resources
                      </h4>
                      <div className="resources-grid">
                        {level.resources.map((resource, i) => (
                          <a
                            key={i}
                            href={resource.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="resource-card"
                          >
                            <div className="resource-header">
                              <div className="resource-name">{resource.name}</div>
                              <div 
                                className="resource-type"
                                style={{ background: getResourceTypeColor(resource.type) }}
                              >
                                {resource.type}
                              </div>
                            </div>
                            <div className="resource-link">
                              <span>Open Resource</span>
                              <ExternalLink size={12} />
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>

                    <div className="level-actions">
                      <button
                        onClick={() => toggleCompletion(selectedCareer, index)}
                        className={`toggle-btn ${
                          careerProgress[`${selectedCareer}-L${index}`] ? 'btn-complete' : 'btn-incomplete'
                        }`}
                      >
                        {careerProgress[`${selectedCareer}-L${index}`] 
                          ? 'Mark Incomplete' 
                          : 'Mark Complete'
                        }
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </>
);
}