// RegistroPruebas.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Table } from 'react-bootstrap';

const RegistroPruebas = () => {
    const [testData, setTestData] = useState([]);
    const [newTest, setNewTest] = useState({
        testName: '',
        description: '',
        status: 'Not Started',
    });

    // Función para obtener todas las pruebas al cargar el componente
    useEffect(() => {
        const fetchTests = async () => {
            try {
                const response = await axios.get('/api/tests');
                setTestData(response.data);
            } catch (error) {
                console.error('Error fetching test data:', error);
            }
        };
        fetchTests();
    }, []);

    // Función para manejar cambios en el formulario de nueva prueba
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewTest((prevTest) => ({
            ...prevTest,
            [name]: value,
        }));
    };

    // Función para enviar el formulario y agregar una nueva prueba
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/tests', newTest);
            setTestData([...testData, response.data]);
            setNewTest({ testName: '', description: '', status: 'Not Started' });
        } catch (error) {
            console.error('Error adding new test:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Registro de Pruebas</h2>
            <Form onSubmit={handleSubmit} className="my-4">
                <Form.Group controlId="formTestName">
                    <Form.Label>Nombre de la Prueba</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Ingrese el nombre de la prueba"
                        name="testName"
                        value={newTest.testName}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formDescription">
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Ingrese una descripción"
                        name="description"
                        value={newTest.description}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">
                    Registrar Prueba
                </Button>
            </Form>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre de la Prueba</th>
                        <th>Descripción</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {testData.map((test) => (
                        <tr key={test.id}>
                            <td>{test.id}</td>
                            <td>{test.testName}</td>
                            <td>{test.description}</td>
                            <td>{test.status}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default RegistroPruebas;
