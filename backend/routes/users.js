// users.js (o el archivo donde manejas usuarios en el backend)
const express = require('express');
const router = express.Router();
const pool = require('../db'); // Reemplaza con la conexión correcta

// Ruta para cambiar la contraseña
router.post('/change-password', async (req, res) => {
    const { userID, currentPassword, newPassword } = req.body;

    try {
        // Verificar la contraseña actual
        const result = await pool.query(
            'SELECT * FROM users WHERE userID = $1 AND password = $2',
            [userID, currentPassword]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Contraseña actual incorrecta' });
        }

        // Actualizar la contraseña
        await pool.query(
            'UPDATE users SET password = $1 WHERE userID = $2',
            [newPassword, userID]
        );

        res.json({ message: 'Contraseña actualizada con éxito' });
    } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        res.status(500).json({ message: 'Error al cambiar la contraseña' });
    }
});

module.exports = router;
