const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../models/userModel');
const pool = require('../db'); // Подключаем pool для работы с БД
const authenticate = require("../middleware/authMiddleware");
const router = express.Router();

// Регистрация
router.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await createUser({ ...req.body, password: hashedPassword });
    res.status(201).json({ message: 'User created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Логин
router.post('/login', async (req, res) => {
    try {
      const user = await findUserByEmail(req.body.email);
      if (!user) {
        console.warn('Login attempt failed: Email not found');
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      const validPassword = await bcrypt.compare(req.body.password, user.password);
      if (!validPassword) {
        console.warn('Login attempt failed: Invalid password');
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      console.log('JWT_SECRET:', process.env.JWT_SECRET);
      const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.json({ token });
    } catch (error) {
      console.error('LOGIN ERROR:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});
  

// Получение данных о пользователе (требуется токен)
router.get('/me', authenticate, async (req, res) => {
    try {
      console.log('Authenticated User:', req.user); // Проверяем, есть ли `req.user`
  
      const [user] = await pool.query('SELECT * FROM users WHERE user_id = ?', [req.user.userId]);
  
      if (!user.length) return res.status(404).json({ error: 'User not found' });
  
      res.json(user[0]);
    } catch (error) {
      console.error('GET /me Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

module.exports = router;
