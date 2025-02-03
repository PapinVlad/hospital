const pool = require('../db');

async function createUser(user) {
  try {
    const { first_name, surname, email, tel, address, dob, password } = user;
    const result = await pool.query(
      'INSERT INTO users (first_name, surname, email, tel, address, dob, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [first_name, surname, email, tel, address, dob, password]
    );
    return result;
  } catch (error) {
    console.error('DATABASE ERROR (createUser):', error);
    throw error;
  }
}

async function findUserByEmail(email) {
  try {
    const [user] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return user.length ? user[0] : null;
  } catch (error) {
    console.error('DATABASE ERROR (findUserByEmail):', error);
    throw error;
  }
}

module.exports = { createUser, findUserByEmail };
