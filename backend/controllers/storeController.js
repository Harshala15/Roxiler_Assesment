const db = require('../config/database');

const getStores = async (req, res) => {
  try {
    const { search, sortBy = 'name', sortOrder = 'ASC' } = req.query;

    let query = `
      SELECT s.*, 
             COALESCE(AVG(r.rating), 0) as average_rating,
             COUNT(r.id) as total_ratings
      FROM stores s 
      LEFT JOIN ratings r ON s.id = r.store_id 
      WHERE 1=1
    `;
    const params = [];

    //  search query: name, address, email, owner name
    if (search) {
      query += `
        AND (
          s.name LIKE ? 
          OR s.address LIKE ? 
          OR s.email LIKE ?
          OR EXISTS (
            SELECT 1 FROM users u WHERE u.id = s.user_id AND u.name LIKE ?
          )
        )
      `;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    query += ` GROUP BY s.id `;

    if (['average_rating', 'total_ratings'].includes(sortBy)) {
      query += ` ORDER BY ${sortBy} ${sortOrder}`;
    } else {
      query += ` ORDER BY s.${sortBy} ${sortOrder}`;
    }

    const [stores] = await db.execute(query, params);
    res.json(stores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


const createStore = async (req, res) => {
  try {
    const { name, email, address, user_id } = req.body;

    const [existingStore] = await db.execute('SELECT id FROM stores WHERE email = ?', [email]);
    if (existingStore.length > 0) {
      return res.status(400).json({ message: 'Store already exists' });
    }

    let ownerId = req.user.role === 'admin' ? user_id : req.user.id;

    const [result] = await db.execute(
      'INSERT INTO stores (name, email, address, user_id) VALUES (?, ?, ?, ?)',
      [name, email, address, ownerId]
    );

    res.status(201).json({ message: 'Store created successfully', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


const getStoresByOwner = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const query = `
      SELECT s.*, 
             COALESCE(AVG(r.rating), 0) as average_rating,
             COUNT(r.id) as total_ratings
      FROM stores s 
      LEFT JOIN ratings r ON s.id = r.store_id 
      WHERE s.user_id = ?
      GROUP BY s.id
    `;

    const [stores] = await db.execute(query, [userId]);
    res.json(stores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getStores, createStore, getStoresByOwner };