const express = require('express');
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");

router.get('/', async (req, res) => {
    try {
      console.log("Request User:", req.user); // Проверяем `req.user`
      
      if (!req.user || !req.user.userId) {
        return res.status(401).json({ error: "Unauthorized: No userId found" });
      }

      const [appointments] = await pool.query(
        `SELECT a.appointment_id, a.appointment_date, a.reason, 
                d.first_name AS doctor_first_name, d.surname AS doctor_surname
         FROM appointments a
         JOIN doctors d ON a.doctor_id = d.doctor_id
         WHERE a.user_id = ?`,
        [req.user.userId]
      );

      console.log("Fetched Appointments:", appointments); // Проверяем данные из БД
      res.json(appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});

module.exports = router;
