// src/pages/Projects.js
import React, { useState, useEffect } from 'react';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const userID = localStorage.getItem('userID');  // Obtener el userID desde el localStorage

    useEffect(() => {
        const fetchProjects = async () => {
            if (!userID) {
                console.error('No userID found. Please log in.');
                return;
            }

            try {
                // Asegúrate de usar comillas invertidas para interpolar el userID
                const response = await fetch(`http://localhost:5000/api/projects/${userID}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                const data = await response.json();
                if (response.ok) {
                    setProjects(data);  // Guardar los proyectos en el estado
                } else {
                    console.error('Error al obtener los proyectos:', data.msg);
                }
            } catch (error) {
                console.error('Error al conectar con el servidor:', error);
            }
        };

        fetchProjects();
    }, [userID]);

    return (
        <div className="container mt-4">
            <h1>Proyectos Asignados</h1>
            {projects.length === 0 ? (
                <p>No tienes proyectos asignados por el momento.</p>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Nombre del Proyecto</th>
                            <th>Descripción</th>
                            <th>Estado</th>
                            <th>Cambiar Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((project) => (
                            <tr key={project.projectid}>
                                <td>{project.projectname}</td>
                                <td>{project.description}</td>
                                <td>{project.status}</td>
                                <td>
                                    <button className="btn btn-primary">
                                        Cambiar Estado
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Projects;
