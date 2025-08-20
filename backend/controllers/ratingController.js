const db = require('../config/database');

const submitRating = async (req, res) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user.id;

    // Check if rating already exists
    const [existingRating] = await db.execute(
      'SELECT id FROM ratings WHERE user_id = ? AND store_id = ?',
      [userId, storeId]
    );

    if (existingRating.length > 0) {
      // Update existing rating
      await db.execute(
        'UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?',
        [rating, userId, storeId]
      );
      res.json({ message: 'Rating updated successfully' });
    } else {
      // Create new rating
      await db.execute(
        'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)',
        [userId, storeId, rating]
      );
      res.status(201).json({ message: 'Rating submitted successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserRatings = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [ratings] = await db.execute(
      `SELECT r.*, s.name as store_name 
       FROM ratings r 
       JOIN stores s ON r.store_id = s.id 
       WHERE r.user_id = ?`,
      [userId]
    );

    res.json(ratings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getStoreRatings = async (req, res) => {
  try {
    const { storeId } = req.params;
    
    const [ratings] = await db.execute(
      `SELECT r.*, u.name as user_name 
       FROM ratings r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.store_id = ?`,
      [storeId]
    );

    res.json(ratings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const [userCount] = await db.execute('SELECT COUNT(*) as count FROM users');
    const [storeCount] = await db.execute('SELECT COUNT(*) as count FROM stores');
    const [ratingCount] = await db.execute('SELECT COUNT(*) as count FROM ratings');

    res.json({
      totalUsers: userCount[0].count,
      totalStores: storeCount[0].count,
      totalRatings: ratingCount[0].count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { submitRating, getUserRatings, getStoreRatings, getDashboardStats };