// src/pages/CreateProject.js
import React, { useState } from 'react';

const CreateProject = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newProject = {
            name,
            description,
            startDate,
            endDate
        };

        try {
            const response = await fetch('http://localhost:5000/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Asegura que se envíe el token JWT si el backend lo requiere
                },
                body: JSON.stringify(newProject)
            });

            if (response.ok) {
                alert('Proyecto creado exitosamente');
                // Reiniciar el formulario después de crear el proyecto
                setName('');
                setDescription('');
                setStartDate('');
                setEndDate('');
            } else {
                const errorData = await response.json();
                alert(`Error al crear el proyecto: ${errorData.msg}`);
            }
        } catch (error) {
            console.error('Error al crear el proyecto:', error);
            alert('Hubo un problema al conectarse con el servidor');
        }
    };

    return (
        <div className="container mt-4">
            <h1>Crear Nuevo Proyecto</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="projectName" className="form-label">Nombre del Proyecto</label>
                    <input
                        type="text"
                        className="form-control"
                        id="projectName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Descripción</label>
                    <textarea
                        className="form-control"
                        id="description"
                        rows="3"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>

                <div className="mb-3">
                    <label htmlFor="startDate" className="form-label">Fecha de Inicio</label>
                    <input
                        type="date"
                        className="form-control"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="endDate" className="form-label">Fecha de Finalización</label>
                    <input
                        type="date"
                        className="form-control"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-success">Crear Proyecto</button>
            </form>
        </div>
    );
};

export default CreateProject;
