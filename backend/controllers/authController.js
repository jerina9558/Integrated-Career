const db = require("../config/db");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const RESET_TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// ----------------------------
// SIGNUP
// ----------------------------
exports.signupStudent = async (req, res) => {
  const { username, email, password, phone } = req.body;
  if (!username || !email || !password || !phone) return res.status(400).json({ error: "All fields required" });

  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO students (username, email, password, phone) VALUES (?, ?, ?, ?)",
    [username, email, hashedPassword, phone],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Signup failed" });
      res.json({ message: "Student registered successfully" });
    }
  );
};

exports.signupEmployer = async (req, res) => {
  const { username, email, password, phone } = req.body;
  if (!username || !email || !password || !phone) return res.status(400).json({ error: "All fields required" });

  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO employers (username, email, password, phone) VALUES (?, ?, ?, ?)",
    [username, email, hashedPassword, phone],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Signup failed" });
      res.json({ message: "Employer registered successfully" });
    }
  );
};

// ----------------------------
// LOGIN
// ----------------------------
exports.loginStudent = (req, res) => {
  const { email, password } = req.body;
  db.query("SELECT * FROM students WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (!results.length) return res.status(400).json({ error: "Invalid credentials" });

    const student = results[0];
    const match = await bcrypt.compare(password, student.password);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    res.json({ id: student.id, username: student.username, email: student.email, role: "student" });
  });
};

exports.loginEmployer = (req, res) => {
  const { email, password } = req.body;
  db.query("SELECT * FROM employers WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (!results.length) return res.status(400).json({ error: "Invalid credentials" });

    const employer = results[0];
    const match = await bcrypt.compare(password, employer.password);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    res.json({ id: employer.id, username: employer.username, email: employer.email, role: "employer" });
  });
};

// ----------------------------
// FORGOT PASSWORD
// ----------------------------
exports.forgotPasswordStudent = (req, res) => handleForgotPassword(req, res, "students", "student");
exports.forgotPasswordEmployer = (req, res) => handleForgotPassword(req, res, "employers", "employer");

const handleForgotPassword = (req, res, table, role) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  db.query(`SELECT * FROM ${table} WHERE email = ?`, [email], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (!results.length) return res.json({ message: "If this email exists, a reset link has been sent." });

    const user = results[0];
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY);

    db.query("DELETE FROM password_resets WHERE email = ?", [email], (delErr) => {
      if (delErr) return res.status(500).json({ error: "Failed to reset token" });

      const insertSql = `INSERT INTO password_resets (user_id, email, role, token, expires_at) VALUES (?, ?, ?, ?, ?)`;
      db.query(insertSql, [user.id, email, role, token, expiresAt], (saveErr) => {
        if (saveErr) return res.status(500).json({ error: "Token save failed" });

        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
        const mailOptions = {
          from: process.env.GMAIL_USER,
          to: email,
          subject: "Password Reset",
          html: `<p>Click <a href="${resetLink}">here</a> to reset your password. Link expires in 1 hour.</p>`,
        };

        transporter.sendMail(mailOptions, (error) => {
          if (error) return res.status(500).json({ error: "Failed to send email" });
          return res.json({ message: "If this email exists, a reset link has been sent." });
        });
      });
    });
  });
};

// ----------------------------
// RESET PASSWORD
// ----------------------------
exports.resetPassword = (req, res) => {
  const { email, token, newPassword } = req.body;
  if (!email || !token || !newPassword) return res.status(400).json({ error: "Missing required fields" });

  db.query("SELECT * FROM password_resets WHERE email = ? AND token = ?", [email, token], async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (!results.length) return res.status(400).json({ error: "Invalid or expired token" });

    const resetRecord = results[0];
    if (new Date(resetRecord.expires_at) < new Date()) return res.status(400).json({ error: "Token expired" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const table = resetRecord.role === "student" ? "students" : "employers";

    db.query(`UPDATE ${table} SET password = ? WHERE id = ?`, [hashedPassword, resetRecord.user_id], (updateErr) => {
      if (updateErr) return res.status(500).json({ error: "Password update failed" });

      db.query("DELETE FROM password_resets WHERE email = ?", [email]);
      return res.json({ message: "Password has been reset successfully." });
    });
  });
};
