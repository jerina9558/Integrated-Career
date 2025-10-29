require("dotenv").config();
const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const nodemailer = require("nodemailer");
const fs = require("fs");
const { OAuth2Client } = require('google-auth-library');
const appTrackerRouter = express.Router();


const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // serve resumes
// Serve both resumes and projects
app.use("/uploads/resumes", express.static(path.join(__dirname, "uploads/resumes")));
app.use("/uploads/projects", express.static(path.join(__dirname, "uploads/projects")));

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const CLIENT_ID = process.env.CLIENT_ID;
const JWT_SECRET = process.env.JWT_SECRET;

const client = new OAuth2Client(CLIENT_ID);

// ─────────────── MySQL Connection ───────────────
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) console.error("❌ DB Connection Failed:", err.message);
  else console.log("✅ MySQL Connected");
});

// ─────────────── Ensure Tables Exist ───────────────
const tableQueries = [
  `CREATE TABLE IF NOT EXISTS students (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      phone VARCHAR(20)
  )`,
  `CREATE TABLE IF NOT EXISTS employers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      phone VARCHAR(20)
  )`,
  `CREATE TABLE IF NOT EXISTS jobs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      employer_id INT NOT NULL,
      title VARCHAR(255) NOT NULL,
      domain VARCHAR(100) NOT NULL,
      location VARCHAR(100) NOT NULL,
      duration VARCHAR(50) NOT NULL,
      description TEXT,
      posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (employer_id) REFERENCES employers(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS applications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT NOT NULL,
      job_id INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      college VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      resume VARCHAR(255) NOT NULL,
      linkedin VARCHAR(255),
      github VARCHAR(255),
      graduation_year VARCHAR(20) NOT NULL,
      skills TEXT NOT NULL,
      domain VARCHAR(255),
      duration VARCHAR(255),
      status VARCHAR(50) DEFAULT 'Pending',
      applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id),
      FOREIGN KEY (job_id) REFERENCES jobs(id),
      UNIQUE KEY unique_application (job_id, email)
  )`,
  `CREATE TABLE IF NOT EXISTS password_resets (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      email VARCHAR(255) NOT NULL,
      role VARCHAR(20) NOT NULL,
      token VARCHAR(255) NOT NULL,
      expires_at DATETIME NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS resumes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255),
      phone VARCHAR(50),
      address VARCHAR(255),
      linkedin VARCHAR(255),
      github VARCHAR(255),
      summary TEXT,
      skills TEXT,
      education TEXT,
      experience TEXT,
      certifications TEXT,
      hobbies TEXT,
      languages TEXT,
      photo LONGBLOB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS skill_tests (
      id INT AUTO_INCREMENT PRIMARY KEY,
      employer_id INT NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      test_date DATE,
      test_time TIME,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (employer_id) REFERENCES employers(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS skill_questions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      test_id INT NOT NULL,
      question_text TEXT NOT NULL,
      option_1 VARCHAR(255) NOT NULL,
      option_2 VARCHAR(255) NOT NULL,
      option_3 VARCHAR(255) NOT NULL,
      option_4 VARCHAR(255) NOT NULL,
      correct_answer VARCHAR(255) NOT NULL,
      FOREIGN KEY (test_id) REFERENCES skill_tests(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS student_test_attempts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT NOT NULL,
      test_id INT NOT NULL,
      score INT NOT NULL,
      attempt_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
      FOREIGN KEY (test_id) REFERENCES skill_tests(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS student_medals (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT NOT NULL,
      medals INT DEFAULT 0,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS personal_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`,
`CREATE TABLE IF NOT EXISTS employer_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employer_name VARCHAR(255) NOT NULL,
    employer_email VARCHAR(255) NOT NULL,
    employer_phone VARCHAR(50),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`,
  
];

tableQueries.forEach(query => {
  db.query(query, (err) => { if(err) console.error("Table creation error:", err); });
});


// ─────────────── Nodemailer Setup ───────────────
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

transporter.verify((err) => {
  if (err) console.error("❌ Mail transporter error:", err);
  else console.log("✅ Mail transporter ready");
});

// ─────────────── JWT Middleware ───────────────
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid or expired token" });
    req.user = decoded;
    next();
  });
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role)
      return res.status(403).json({ error: `Only ${role}s can access this route` });
    next();
  };
}

// ─────────────── Multer Setup ───────────────

// Resume upload
const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = path.join(__dirname, "uploads/resumes");
    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: (req, file, cb) =>
    cb(null, Date.now() + "_" + file.originalname.replace(/\s/g, "_")),
});

const resumeFilter = (req, file, cb) => {
  const allowed = /pdf|doc|docx/;
  if (allowed.test(file.originalname.toLowerCase())) cb(null, true);
  else cb(new Error("Only PDF, DOC, DOCX files are allowed"));
};

const uploadResume = multer({ storage: resumeStorage, fileFilter: resumeFilter });

// Project upload

const projectStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = path.join(__dirname, "uploads/projects");
    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: (req, file, cb) =>
    cb(null, Date.now() + "_" + file.originalname.replace(/\s/g, "_")),
});

const projectFilter = (req, file, cb) => {
  if (file.originalname.toLowerCase().endsWith(".zip")) cb(null, true);
  else cb(new Error("Only ZIP files are allowed"));
};

const uploadProject = multer({ storage: projectStorage, fileFilter: projectFilter });



// ─────────────── Auth Routes ───────────────

// Student Signup/Login
app.post("/signup/student", async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;
    if (!username || !email || !password || !phone)
      return res.status(400).json({ error: "All fields required" });

    db.query("SELECT id FROM students WHERE email = ?", [email], async (err, results) => {
      if (err) return res.status(500).json({ error: err.sqlMessage });
      if (results.length > 0) return res.status(400).json({ error: "Email already registered" });

      const hashed = await bcrypt.hash(password, 10);
      db.query("INSERT INTO students (username, email, password, phone) VALUES (?, ?, ?, ?)", [username, email, hashed, phone], (err2) => {
        if (err2) return res.status(500).json({ error: err2.sqlMessage || "DB error" });
        res.json({ message: "✅ Student registered successfully" });
      });
    });
  } catch (e) { res.status(500).json({ error: "Server error" }); }
});

app.post("/login/student", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });

  db.query("SELECT * FROM students WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    if (results.length === 0) return res.status(401).json({ error: "Student not found" });

    const user = results[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, role: "student" }, JWT_SECRET, { expiresIn: "3h" });
    res.json({ token, role: "student", id: user.id, username: user.username, email: user.email });
  });
});

// Employer Signup/Login
app.post("/signup/employer", async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;
    if (!username || !email || !password || !phone) return res.status(400).json({ error: "All fields required" });

    db.query("SELECT id FROM employers WHERE email = ?", [email], async (err, results) => {
      if (err) return res.status(500).json({ error: err.sqlMessage });
      if (results.length > 0) return res.status(400).json({ error: "Email already registered" });

      const hashed = await bcrypt.hash(password, 10);
      db.query("INSERT INTO employers (username, email, password, phone) VALUES (?, ?, ?, ?)", [username, email, hashed, phone], (err2) => {
        if (err2) return res.status(500).json({ error: err2.sqlMessage || "DB error" });
        res.json({ message: "✅ Employer registered successfully" });
      });
    });
  } catch (e) { res.status(500).json({ error: "Server error" }); }
});

app.post("/login/employer", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });

  db.query("SELECT * FROM employers WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    if (results.length === 0) return res.status(401).json({ error: "Employer not found" });

    const user = results[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, role: "employer" }, JWT_SECRET, { expiresIn: "3h" });
    res.json({ token, role: "employer", id: user.id, username: user.username, email: user.email });
  });
});

// ─────────────── CONTINUE WITH GOOGLE ───────────────
app.post("/api/google-login", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    // Detect role by email
    const role = email.toLowerCase().includes("emp") ? "employer" : "student";

    if (role === "employer") {
      // ───── EMPLOYER LOGIN ─────
      db.query("SELECT id, email, username FROM employers WHERE email = ?", [email], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: "Database error" });

        if (result.length > 0) {
          // Existing employer
          const employer = result[0];
          const token = jwt.sign({ id: employer.id, role: "employer" }, JWT_SECRET, { expiresIn: "2h" });

          return res.json({
            success: true,
            token,
            user: { id: employer.id, name: employer.username, email: employer.email, role: "employer" },
          });
        } else {
          // New employer — insert into DB
          db.query("INSERT INTO employers (username, email, password) VALUES (?, ?, ?)", [name, email, "GOOGLE_AUTH"], (err2, insertRes) => {
            if (err2) return res.status(500).json({ success: false, message: "Error creating employer" });

            const employerId = insertRes.insertId;
            const token = jwt.sign({ id: employerId, role: "employer" }, JWT_SECRET, { expiresIn: "2h" });

            return res.json({
              success: true,
              token,
              user: { id: employerId, name, email, role: "employer" },
            });
          });
        }
      });
    } else {
      // ───── STUDENT LOGIN ─────
      db.query("SELECT id, email, username FROM students WHERE email = ?", [email], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: "Database error" });

        if (result.length > 0) {
          const student = result[0];
          const token = jwt.sign({ id: student.id, role: "student" }, JWT_SECRET, { expiresIn: "2h" });

          return res.json({
            success: true,
            token,
            user: { id: student.id, name: student.username, email: student.email, role: "student" },
          });
        } else {
          // New student — insert into DB
          db.query("INSERT INTO students (username, email, password) VALUES (?, ?, ?)", [name, email, "GOOGLE_AUTH"], (err2, insertRes) => {
            if (err2) return res.status(500).json({ success: false, message: "Error creating student" });

            const studentId = insertRes.insertId;
            const token = jwt.sign({ id: studentId, role: "student" }, JWT_SECRET, { expiresIn: "2h" });

            return res.json({
              success: true,
              token,
              user: { id: studentId, name, email, role: "student" },
            });
          });
        }
      });
    }
  } catch (error) {
    console.error("❌ Google token verification failed:", error);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
});

// ─────────────── Forgot/Reset Password ───────────────

// Reusable forgot password function
function forgotPassword(role) {
  return (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const table = role === "student" ? "students" : "employers";

    db.query(`SELECT * FROM ${table} WHERE email = ?`, [email], (err, results) => {
      if (err) return res.status(500).json({ error: err.sqlMessage });
      if (results.length === 0) return res.status(404).json({ error: "Email not found" });

      const user = results[0];
      const token = jwt.sign({ id: user.id, role }, JWT_SECRET, { expiresIn: "1h" });
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      // 🧹 Remove expired tokens
      db.query("DELETE FROM password_resets WHERE expires_at < NOW()", () => {
        db.query(
          "INSERT INTO password_resets (user_id, email, role, token, expires_at, used_at) VALUES (?, ?, ?, ?, ?, NULL)",
          [user.id, email, role, token, expiresAt],
          (insertErr) => {
            if (insertErr) {
              console.error("❌ Password reset insert error:", insertErr.sqlMessage || insertErr);
              return res.status(500).json({ error: "Failed to initiate password reset" });
            }

            console.log("✅ Password reset stored for:", email);

            const resetLink = `${FRONTEND_URL}/reset-password?token=${encodeURIComponent(token)}&email=${user.email}&role=${role}`;

            transporter.sendMail(
              {
                from: process.env.GMAIL_USER,
                to: email,
                subject: "Password Reset Request",
                html: `
                  <h3>Hello ${user.username || "User"}</h3>
                  <p>You requested a password reset. Click below to reset your password:</p>
                  <p><a href="${resetLink}" style="color:#1a73e8;">Reset Password</a></p>
                  <p>This link will expire in 1 hour.</p>
                `,
              },
              (mailErr) => {
                if (mailErr) {
                  console.error("❌ Email send error:", mailErr);
                  return res.status(500).json({ error: "Failed to send email" });
                }
                res.json({ message: "✅ Password reset email sent successfully!" });
              }
            );
          }
        );
      });
    });
  };
}

// ✅ Single endpoint to handle both student and employer
app.post("/forgot", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  // Check which table the email belongs to
  db.query("SELECT * FROM students WHERE email = ?", [email], (err, studentResults) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });

    if (studentResults.length > 0) {
      return forgotPassword("student")(req, res);
    } else {
      db.query("SELECT * FROM employers WHERE email = ?", [email], (err2, employerResults) => {
        if (err2) return res.status(500).json({ error: err2.sqlMessage });

        if (employerResults.length > 0) {
          return forgotPassword("employer")(req, res);
        } else {
          return res.status(404).json({ error: "Email not found in any account" });
        }
      });
    }
  });
});

// ✅ Reset password
app.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password)
    return res.status(400).json({ error: "Token and new password are required" });

  // Remove expired tokens first
  db.query("DELETE FROM password_resets WHERE expires_at < NOW()", () => {
    db.query(
      "SELECT * FROM password_resets WHERE token = ? ORDER BY id DESC LIMIT 1",
      [token],
      async (err, results) => {
        if (err) return res.status(500).json({ error: err.sqlMessage });
        if (results.length === 0)
          return res.status(400).json({ error: "Invalid or expired token" });

        const reset = results[0];
        if (new Date(reset.expires_at) < new Date()) {
          db.query("UPDATE password_resets SET used_at = NOW() WHERE id = ?", [reset.id]);
          return res.status(400).json({ error: "Token expired" });
        }

        const hashed = await bcrypt.hash(password, 10);
        const table = reset.role === "student" ? "students" : "employers";

        db.query(`UPDATE ${table} SET password = ? WHERE id = ?`, [hashed, reset.user_id], (err2) => {
          if (err2) return res.status(500).json({ error: err2.sqlMessage });

          db.query("UPDATE password_resets SET used_at = NOW() WHERE id = ?", [reset.id]);
          res.json({ message: "✅ Password updated successfully!" });
        });
      }
    );
  });
});

// ─────────────── Job Routes ───────────────

// Employer
app.post("/employer/jobs", verifyToken, requireRole("employer"), (req, res) => {
  const employerId = req.user.id;
  const { title, domain, location, duration, description } = req.body;
  if (!title || !domain || !location || !duration)
    return res.status(400).json({ error: "Please fill all required fields" });

  db.query(
    "INSERT INTO jobs (employer_id, title, domain, location, duration, description) VALUES (?, ?, ?, ?, ?, ?)",
    [employerId, title, domain, location, duration, description],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.sqlMessage });
      res.json({ message: "✅ Job posted!", jobId: result.insertId });
    }
  );
});

app.get("/employer/jobs", verifyToken, requireRole("employer"), (req, res) => {
  db.query(
    "SELECT * FROM jobs WHERE employer_id = ? ORDER BY posted_at DESC",
    [req.user.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.sqlMessage });
      res.json(results);
    }
  );
});

app.delete(
  "/employer/jobs/:id",
  verifyToken,
  requireRole("employer"),
  (req, res) => {
    const jobId = req.params.id;

    // 1️⃣ Delete related applications first
    db.query(
      "DELETE FROM applications WHERE job_id = ?",
      [jobId],
      (err) => {
        if (err) return res.status(500).json({ error: err.sqlMessage });

        // 2️⃣ Delete the job itself
        db.query(
          "DELETE FROM jobs WHERE id = ? AND employer_id = ?",
          [jobId, req.user.id],
          (err, result) => {
            if (err) return res.status(500).json({ error: err.sqlMessage });
            if (result.affectedRows === 0)
              return res
                .status(404)
                .json({ error: "Job not found or not owned by you" });

            res.json({ message: "🗑️ Job and related applications deleted!" });
          }
        );
      }
    );
  }
);


// Student
app.get("/jobs", verifyToken, requireRole("student"), (req, res) => {
  db.query(
    "SELECT j.*, e.username AS employer_name FROM jobs j JOIN employers e ON j.employer_id = e.id ORDER BY j.posted_at DESC",
    (err, results) => {
      if (err) return res.status(500).json({ error: err.sqlMessage });
      res.json(results);
    }
  );
});

app.get("/applied-jobs", verifyToken, requireRole("student"), (req, res) => {
  db.query(
    "SELECT job_id FROM applications WHERE student_id = ?",
    [req.user.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.sqlMessage });
      res.json(results);
    }
  );
});

// Get personal info of a student
app.get("/student/personal-info/:id", verifyToken, requireRole("student"), (req, res) => {
  const studentId = req.params.id;
  db.query("SELECT * FROM students WHERE id = ?", [studentId], (err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    if (results.length === 0) return res.status(404).json({ error: "Student not found" });
    res.json(results[0]);
  });
});

// Apply
app.post("/apply/:jobId", verifyToken, requireRole("student"), uploadResume.single("resume"), (req, res) => {
  const studentId = req.user.id;
  const jobId = req.params.jobId;
  const { name, email, college, linkedin, github, graduationYear, skills } = req.body;

  if (!name || !email || !college || !graduationYear || !skills || !req.file)
    return res.status(400).json({ error: "Missing required fields" });

  const resumePath = req.file.path;
  db.query("SELECT * FROM jobs WHERE id = ?", [jobId], (err, jobResults) => {
    if (err) return res.status(500).json({ error: "Server error fetching job" });
    if (jobResults.length === 0) return res.status(404).json({ error: "Job not found" });

    const job = jobResults[0];
    db.query(
      `INSERT INTO applications (student_id, job_id, name, college, email, resume, linkedin, github, graduation_year, skills, domain, duration) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        studentId,
        jobId,
        name,
        college,
        email,
        resumePath,
        linkedin || "",
        github || "",
        graduationYear,
        skills,
        job.domain,
        job.duration,
      ],
      (err2) => {
        if (err2) {
          if (err2.code === "ER_DUP_ENTRY") return res.status(400).json({ error: "Already applied" });
          return res.status(500).json({ error: "Failed to apply" });
        }

        // Send confirmation email
        transporter.sendMail(
          {
            from: process.env.GMAIL_USER,
            to: email,
            subject: `Application Received – ${job.title} Internship`,
            html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <p>Hi <b>${name}</b>,</p>
                <p>Thank you for applying for the <b>${job.title}</b> internship.</p>
                <p>We have received your application and our team will review it soon.</p>
                <h3 style="margin-top:20px;">📌 Application Details:</h3>
                <ul>
                  <li><b>College:</b> ${college}</li>
                  <li><b>Graduation Year:</b> ${graduationYear}</li>
                  <li><b>Skills:</b> ${skills}</li>
                  <li><b>Duration:</b> ${job.duration}</li>
                </ul>
                <p style="margin-top:20px;">Best of luck! 🚀</p>
              </div>
            `,
          },
          () => res.json({ message: "✅ Applied successfully!" })
        );
      }
    );
  });
});

// ─────────────── Resume Routes ───────────────
app.post("/resume", verifyToken, requireRole("student"), (req, res) => {
  const studentId = req.user.id;
  const {
    name, email, phone, address, linkedin,
    github, summary, skills, education,
    experience, certifications, hobbies,
    languages, photo
  } = req.body;

  if (!name || !email || !phone)
    return res.status(400).json({ error: "Name, email, and phone required" });

  db.query(
    `INSERT INTO resumes 
      (student_id, name, email, phone, address, linkedin, github, summary, skills, education, experience, certifications, hobbies, languages, photo) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      studentId, name, email, phone, address,
      linkedin, github, summary, skills,
      education, experience, certifications,
      hobbies, languages,
      photo ? Buffer.from(photo, "base64") : null
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Failed to save resume" });
      res.json({ message: "✅ Resume saved successfully!", resumeId: result.insertId });
    }
  );
});
// ─────────────── Application Tracker Routes ───────────────


// Apply for job


// Fetch student applications
// 🔹 Fetch all applications for logged-in student (with project + evaluation info)
appTrackerRouter.get("/student/applications", verifyToken, requireRole("student"), async (req, res) => {
  try {
    const studentId = req.user.id;

    const [rows] = await db.promise().query(
      `SELECT 
          a.id,
          a.student_id,
          a.job_id,
          a.name,
          a.college,
          a.email,
          a.resume,
          a.linkedin,
          a.github,
          a.graduation_year,
          a.skills,
          a.domain,
          a.duration AS jobDuration,
          a.status,
          a.applied_at,
          a.project_file,
          j.title AS jobTitle,
          e.username AS employerName,
          ev.communication,
          ev.technical,
          ev.teamwork,
          ev.creativity,
          ev.punctuality
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       JOIN employers e ON j.employer_id = e.id
       LEFT JOIN evaluations ev ON ev.application_id = a.id
       WHERE a.student_id = ?`,
      [studentId]
    );

    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching student applications:", err);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});


// Upload project for an application
app.post(
  "/tracker/student/upload/:appId",
  verifyToken,
  uploadProject.single("projectZip"),
  async (req, res) => {
    try {
      const appId = req.params.appId;

      if (!req.file) return res.status(400).json({ error: "No file uploaded" });

      const filename = req.file.filename; // e.g., 1697071234567_project.zip
      const filepath = `/uploads/projects/${filename}`;

      // Save file path in applications table
      await db.promise().query(
        "UPDATE applications SET project_file = ? WHERE id = ?",
        [filepath, appId]
      );

      res.json({ message: "Project uploaded successfully", file: filepath });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to upload project" });
    }
  }
);
// 🔹 Fetch all applications submitted to this employer
appTrackerRouter.get("/employer/applications", verifyToken, requireRole("employer"), async (req, res) => {
  try {
    const employerId = req.user.id;

    const [rows] = await db.promise().query(
      `SELECT a.id,
              a.name AS studentName,
              a.email,
              a.status,
              a.project_file,
              j.title AS jobTitle,
              j.duration AS jobDuration
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       WHERE j.employer_id = ?
       ORDER BY a.applied_at DESC`,
      [employerId]
    );

    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching employer applications:", err);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

// 🔹 Employer submits evaluation for a student
appTrackerRouter.post("/employer/evaluate/:appId", verifyToken, requireRole("employer"), async (req, res) => {
  try {
    const appId = req.params.appId;
    const { communication, technical, teamwork, creativity, punctuality } = req.body;
       console.log("Received evaluation data:", req.body); // 👈 ADD THIS

    if (
      [communication, technical, teamwork, creativity, punctuality].some(
        (v) => v === undefined || v === null
      )
    ) {
      return res.status(400).json({ error: "All evaluation fields are required" });
    }

    // Insert or update (if already exists)
    const sql = `
      INSERT INTO evaluations (application_id, communication, technical, teamwork, creativity, punctuality)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        communication = VALUES(communication),
        technical = VALUES(technical),
        teamwork = VALUES(teamwork),
        creativity = VALUES(creativity),
        punctuality = VALUES(punctuality)
    `;

    await db.promise().query(sql, [appId, communication, technical, teamwork, creativity, punctuality]);
    res.json({ message: "✅ Evaluation saved successfully!" });
  } catch (err) {
    console.error("❌ Error saving evaluation:", err);
    res.status(500).json({ error: "Failed to save evaluation" });
  }
});

app.use("/tracker", appTrackerRouter);
// ─────────────── Save Student Application ───────────────
app.post("/student/applications", (req, res) => {
  const { student_name, email, jobTitle, jobDuration, employerName } = req.body;

  if (!student_name || !email || !jobTitle) {
    return res.status(400).json({ error: "Student name, email, and job title are required" });
  }

  const sql = `
    INSERT INTO student_applications
    (student_name, email, jobTitle, jobDuration, employerName, resultData)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const resultData = JSON.stringify([]); // default empty array

  db.query(
    sql,
    [student_name, email, jobTitle, jobDuration || "1 month", employerName || "—", resultData],
    (err, result) => {
      if (err) {
        console.error("❌ DB Error:", err);
        return res.status(500).json({ error: "Failed to save application" });
      }
      res.json({
        message: "Application saved successfully!",
        id: result.insertId,
      });
    }
  );
});



// ─────────────── Student Test Attempts Routes ───────────────

// Save a student’s attempt
app.post("/student/attempts", verifyToken, requireRole("student"), (req, res) => {
  const { test_id, score } = req.body;

  if (!test_id || score == null) {
    return res.status(400).json({ error: "Test ID and score are required" });
  }

  db.query(
    "INSERT INTO student_test_attempts (student_id, test_id, score) VALUES (?, ?, ?)",
    [req.user.id, test_id, score],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.sqlMessage });
      res.json({ message: "✅ Attempt saved successfully", attemptId: result.insertId });
    }
  );
});

// Get all attempts for employer (to see students’ scores on their tests)
app.get("/employer/attempts", verifyToken, requireRole("employer"), (req, res) => {
  const query = `
    SELECT a.id, a.student_id, a.test_id, a.score, a.attempt_date,
           s.username AS student_name, s.email AS student_email,
           t.title AS testTitle
    FROM student_test_attempts a
    JOIN students s ON a.student_id = s.id
    JOIN skill_tests t ON a.test_id = t.id
    WHERE t.employer_id = ?
    ORDER BY a.attempt_date DESC
  `;
  db.query(query, [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json(results);
  });
});

// Get all attempts for logged-in student (their own history)
app.get("/student/attempts", verifyToken, requireRole("student"), (req, res) => {
  const query = `
    SELECT a.id, a.test_id, a.score, a.attempt_date,
           t.title AS testTitle
    FROM student_test_attempts a
    JOIN skill_tests t ON a.test_id = t.id
    WHERE a.student_id = ?
    ORDER BY a.attempt_date DESC
  `;
  db.query(query, [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json(results);
  });
});






// ─────────────── Employer Skill Test Routes ───────────────


// Middleware: verifyToken, requireRole assumed already defined

// Create a skill test (already in your code, no change)
app.post("/employer/skills", verifyToken, requireRole("employer"), (req, res) => {
  const { title, description, questions } = req.body;

  if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ error: "Title and at least one question are required" });
  }

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    if (!q.question || !q.answer || !Array.isArray(q.options) || q.options.length !== 4) {
      return res.status(400).json({ 
        error: `Question ${i + 1} is invalid. Ensure question text, answer, and exactly 4 options are provided.` 
      });
    }
  }

  db.beginTransaction(err => {
    if (err) return res.status(500).json({ error: "Failed to start transaction" });

    db.query(
      "INSERT INTO skill_tests (employer_id, title, description, test_date, test_time) VALUES (?, ?, ?, CURDATE(), CURTIME())",
      [req.user.id, title, description || ""],
      (err, result) => {
        if (err) return db.rollback(() => res.status(500).json({ error: err.sqlMessage }));

        const testId = result.insertId;
        const qValues = questions.map(q => [
          testId,
          q.question,
          q.options[0],
          q.options[1],
          q.options[2],
          q.options[3],
          q.answer
        ]);
        const placeholders = qValues.map(() => "(?, ?, ?, ?, ?, ?, ?)").join(", ");

        db.query(
          `INSERT INTO skill_questions (test_id, question_text, option_1, option_2, option_3, option_4, correct_answer) VALUES ${placeholders}`,
          qValues.flat(),
          (err2) => {
            if (err2) return db.rollback(() => res.status(500).json({ error: err2.sqlMessage }));

            db.commit(err3 => {
              if (err3) return db.rollback(() => res.status(500).json({ error: "Failed to commit transaction" }));
              res.json({ message: "✅ Skill test saved with all questions!", testId });
            });
          }
        );
      }
    );
  });
});

// Get all employer skill tests (for employer & student view)
app.get("/employer/skills", verifyToken, (req, res) => {
  const isEmployer = req.user.role === "employer";

  let query = `
    SELECT t.id, t.title, t.description, t.employer_id, t.test_date, t.test_time,
           JSON_ARRAYAGG(JSON_OBJECT(
             'question', q.question_text,
             'options', JSON_ARRAY(q.option_1, q.option_2, q.option_3, q.option_4),
             'answer', q.correct_answer
           )) AS questions
    FROM skill_tests t
    LEFT JOIN skill_questions q ON t.id = q.test_id
  `;
  const params = [];

  if (isEmployer) {
    query += " WHERE t.employer_id = ?";
    params.push(req.user.id);
  }

  query += " GROUP BY t.id ORDER BY t.test_date DESC, t.test_time DESC";

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json(results);
  });
});

// Delete a skill test (THIS IS THE FIX YOU NEED)
app.delete("/employer/skills/:id", verifyToken, requireRole("employer"), (req, res) => {
  const testId = req.params.id;

  if (!testId) return res.status(400).json({ error: "Test ID is required" });

  // Transaction to delete test and questions together
  db.beginTransaction(err => {
    if (err) return res.status(500).json({ error: "Failed to start transaction" });

    // 1️⃣ Delete questions first
    db.query("DELETE FROM skill_questions WHERE test_id = ?", [testId], (err) => {
      if (err) return db.rollback(() => res.status(500).json({ error: err.sqlMessage }));

      // 2️⃣ Delete test
      db.query("DELETE FROM skill_tests WHERE id = ? AND employer_id = ?", [testId, req.user.id], (err, result) => {
        if (err) return db.rollback(() => res.status(500).json({ error: err.sqlMessage }));
        if (result.affectedRows === 0) return db.rollback(() => res.status(404).json({ error: "Test not found or not owned by you" }));

        db.commit(err => {
          if (err) return db.rollback(() => res.status(500).json({ error: "Failed to commit transaction" }));
          res.json({ message: "✅ Test deleted successfully" });
        });
      });
    });
  });
});
// ─────────────── Career ───────────────

const insertQuery = `
  INSERT INTO career_suggestions ( domain, career_paths) VALUES
  ( 'webdev', '["Frontend Developer","Backend Developer","Full Stack Developer","DevOps Engineer","Mobile App Developer"]'),
  ( 'datascience', '["Data Analyst","Machine Learning Engineer","Data Engineer","Business Intelligence Analyst","Research Scientist"]'),
  ( 'uiux', '["UI Designer","UX Designer","Product Designer","Interaction Designer","Creative Director"]'),
  ( 'marketing', '["SEO Specialist","Content Marketer","Social Media Manager","Email Marketing Specialist","Brand Manager"]')
`;
db.query(insertQuery, (err, results) => {
  if (err) {
    console.error("Insert error:", err);
  } 
});
// ─────────────── Student Personal Information ───────────────

// Save student info
app.post("/student/personal-info", (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and Email are required" });
  }

  const sql = `
    INSERT INTO personal_info (name, email, phone)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [name, email, phone], (err, result) => {
    if (err) {
      console.error("❌ DB Error:", err);
      return res.status(500).json({ error: "Failed to save student info" });
    }
    res.json({ message: "Student info saved successfully!", id: result.insertId });
  });
});

// Get student info by id
app.get("/student/personal-info/:id", (req, res) => {
  const id = req.params.id;

  const sql = `
    SELECT name, email, phone
    FROM personal_info
    WHERE id = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("❌ DB Error:", err);
      return res.status(500).json({ error: "Failed to fetch student info" });
    }
    if (result.length === 0) return res.json({});
    res.json(result[0]);
  });
});



// ─────────────── Employer Personal Information ───────────────

// Save employer info
app.post("/employer/personal-info", (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and Email are required" });
  }

  const sql = `
    INSERT INTO employer_info (employer_name, employer_email, employer_phone)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [name, email, phone], (err, result) => {
    if (err) {
      console.error("❌ DB Error:", err);
      return res.status(500).json({ error: "Failed to save employer info" });
    }
    res.json({ message: "Employer info saved successfully!", id: result.insertId });
  });
});

// Get employer info by id
app.get("/employer/personal-info/:id", (req, res) => {
  const id = req.params.id;

  const sql = `
    SELECT employer_name AS name, employer_email AS email, employer_phone AS phone
    FROM employer_info
    WHERE id = ?
  `;
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("❌ DB Error:", err);
      return res.status(500).json({ error: "Failed to fetch employer info" });
    }
    if (result.length === 0) return res.json({});
    res.json(result[0]);
  });
});


// ─────────────── Change Password (Student Only) ───────────────
app.post("/student/change-password", verifyToken, async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: "New passwords do not match" });
    }

    const userId = req.user.id;
    const role = req.user.role;

    if (role !== "student") {
      return res.status(403).json({ success: false, message: "Access denied. Only students can change passwords." });
    }

    // ✅ Fetch the student's existing password hash
    db.query("SELECT password FROM students WHERE id = ?", [userId], async (err, results) => {
      if (err) {
        console.error("❌ Database error:", err);
        return res.status(500).json({ success: false, message: "Database error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ success: false, message: "Student not found" });
      }

      const currentHashed = results[0].password;
      const isMatch = await bcrypt.compare(oldPassword, currentHashed);

      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Incorrect current password" });
      }

      // ✅ Hash and update the new password
      const hashedNew = await bcrypt.hash(newPassword, 10);

      db.query("UPDATE students SET password = ? WHERE id = ?", [hashedNew, userId], async (updateErr) => {
        if (updateErr) {
          console.error("❌ Update error:", updateErr);
          return res.status(500).json({ success: false, message: "Failed to update password" });
        }

        // ✅ Log this change to student_password_changes
        db.query(
          "INSERT INTO student_password_changes (student_id, current_password, new_password, confirm_password) VALUES (?, ?, ?, ?)",
          [userId, currentHashed, hashedNew, hashedNew],
          (logErr) => {
            if (logErr) {
              console.error("⚠️ Failed to log password change:", logErr);
            }
          }
        );

        res.json({
          success: true,
          message: "Password changed successfully and recorded in student_password_changes",
        });
      });
    });
  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
// ─────────────── Change Password (Employer Only) ───────────────
app.post("/employer/change-password", verifyToken, async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: "New passwords do not match" });
    }

    const userId = req.user.id;
    const role = req.user.role;

    if (role !== "employer") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only employers can change passwords.",
      });
    }

    // ✅ Fetch employer's existing password
    db.query("SELECT password FROM employers WHERE id = ?", [userId], async (err, results) => {
      if (err) {
        console.error("❌ Database error (employer):", err);
        return res.status(500).json({ success: false, message: "Database error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ success: false, message: "Employer not found" });
      }

      const currentHashed = results[0].password;
      const isMatch = await bcrypt.compare(oldPassword, currentHashed);

      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Incorrect current password" });
      }

      // ✅ Hash new password
      const hashedNew = await bcrypt.hash(newPassword, 10);

      // ✅ Update employer table
      db.query("UPDATE employers SET password = ? WHERE id = ?", [hashedNew, userId], (updateErr) => {
        if (updateErr) {
          console.error("❌ Update error (employer):", updateErr);
          return res.status(500).json({
            success: false,
            message: "Failed to update password",
          });
        }

        // ✅ Log change in employer_password_changes table
        db.query(
          "INSERT INTO employer_password_changes (employer_id, current_password, new_password, confirm_password) VALUES (?, ?, ?, ?)",
          [userId, currentHashed, hashedNew, hashedNew],
          (logErr) => {
            if (logErr) {
              console.error("⚠️ Failed to log employer password change:", logErr);
            }
          }
        );

        res.json({
          success: true,
          message: "Employer password changed successfully and recorded in employer_password_changes",
        });
      });
    });
  } catch (err) {
    console.error("❌ Server error (employer):", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
// ─────────────── Feedback ───────────────


app.post("/feedback", (req, res) => {
  const { name, type, rating, message, role, userId } = req.body;

  console.log("📥 Feedback received:", req.body);

  // Validation
  if (!name || !type || !rating || !message || !role || !userId) {
    return res.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }

  // Select correct table
  const table =
    role.toLowerCase() === "employer"
      ? "employer_feedbacks"
      : "student_feedbacks";

  const sql = `
    INSERT INTO ${table} (name, type, rating, message, role, userId)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [name, type, rating, message, role, userId], (err) => {
    if (err) {
      console.error("❌ Error inserting feedback:", err);
      return res.status(500).json({
        success: false,
        message: "Database insert error.",
      });
    }
    res.json({ success: true, message: "✅ Feedback submitted successfully." });
  });
});

app.post("/feedback", (req, res) => {
  const { name, type, rating, message, role, userId } = req.body;

  console.log("📥 Received feedback:", req.body);

  // Validate input
  if (!name || !type || !rating || !message || !role || !userId) {
    return res.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }

  // Pick correct table based on role
  const table =
    role.toLowerCase() === "employer"
      ? "employer_feedbacks"
      : "student_feedbacks";

  // Use backticks around column names in SQL to prevent reserved keyword issues
  const sql = `
    INSERT INTO ${table} (\`name\`, \`type\`, \`rating\`, \`message\`, \`role\`, \`userId\`)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [name, type, rating, message, role, userId], (err) => {
    if (err) {
      console.error("❌ Database insert error:", err.sqlMessage || err);
      return res.status(500).json({
        success: false,
        message: "Database insert error: " + err.sqlMessage,
      });
    }

    console.log("✅ Feedback inserted successfully");
    res.json({ success: true, message: "Feedback submitted successfully." });
  });
});
// ─────────────── Delete Account ───────────────
app.delete("/delete/student", verifyToken, requireRole("student"), (req, res) => {
  const studentId = req.user.id;

  db.query("DELETE FROM students WHERE id = ?", [studentId], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to delete student account" });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Student not found" });
    res.json({ message: "Student account deleted successfully" });
  });
});

app.delete("/delete/employer", verifyToken, requireRole("employer"), (req, res) => {
  const employerId = req.user.id;

  db.query("DELETE FROM employers WHERE id = ?", [employerId], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to delete employer account" });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Employer not found" });
    res.json({ message: "Employer account deleted successfully" });
  });
});

// ─────────────── Start Server ───────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));