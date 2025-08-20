const bcrypt = require("bcryptjs");
const db = require("../config/database");

const getUsers = async (req, res) => {
  try {
    const { search, role, sortBy = "name", sortOrder = "ASC" } = req.query;

    let query = `
  SELECT u.id, u.name, u.email, u.address, u.role,
         CASE 
           WHEN u.role = 'store_owner' THEN (
             SELECT COALESCE(AVG(r.rating),0)
             FROM stores s
             LEFT JOIN ratings r ON s.id = r.store_id
             WHERE s.user_id = u.id
           )
           ELSE NULL
         END as average_rating
  FROM users u
  WHERE 1=1
`;

    const params = [];

    if (search) {
      query += " AND (name LIKE ? OR email LIKE ? OR address LIKE ?)";
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (role) {
      query += " AND role = ?";
      params.push(role);
    }

    query += ` ORDER BY ${sortBy} ${sortOrder}`;

    const [users] = await db.execute(query, params);
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, address, role = "user" } = req.body;

    const [existingUser] = await db.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, address, role]
    );

    res
      .status(201)
      .json({ message: "User created successfully", id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const [users] = await db.execute(
      "SELECT password FROM users WHERE id = ?",
      [userId]
    );
    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, users[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.execute("UPDATE users SET password = ? WHERE id = ?", [
      hashedPassword,
      userId,
    ]);

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const [users] = await db.execute(
      "SELECT id, name, email, address, role FROM users WHERE id = ?",
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(users[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getUsers, createUser, updatePassword, getProfile };
