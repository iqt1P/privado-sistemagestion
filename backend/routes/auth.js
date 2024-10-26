// auth.js (en el backend)

const express = require('express');
const router = express.Router();
const pool = require('../db'); // Asegúrate de estar usando la conexión correcta a la base de datos

// Ruta de login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query(
            `SELECT userID, name, email, role 
             FROM users 
             WHERE email = $1 AND password = $2`,
            [email, password]
        );

        if (result.rows.length > 0) {
            const user = result.rows[0];
            res.json({
                userID: user.userid,
                name: user.name,
                email: user.email,
                role: user.role,
            });
        } else {
            res.status(401).json({ message: 'Credenciales incorrectas' });
        }
    } catch (error) {
        console.error('Error en la autenticación:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;
