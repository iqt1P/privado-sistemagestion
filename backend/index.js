// index.js
const express = require("express");
//const cors = require("cors");
require("dotenv").config();
const pool = require("./db");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");
const projectRoutes = require("./routes/projects");
const userRoutes = require('./routes/users');


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
//app.use(cors());
app.use(express.json()); // Permitir manejar JSON

// Rutas
app.use("/api/auth", authRoutes); // rutas de autenticación
app.use("/api/tasks", taskRoutes); // rutas de tareas
app.use("/api/projects", projectRoutes); // rutas de proyectos
app.use("/api/users", userRoutes); // rutas de usuarios
const cors = require('cors');
app.use(cors({
  origin: 'https://privado-sistemagestion.onrender.com'  // Reemplaza con la URL exacta de tu frontend
}));



// Ruta de prueba para verificar conexión
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente");
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
