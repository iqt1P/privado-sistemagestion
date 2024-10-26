// Perfil.js
import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Perfil = () => {
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userRole, setUserRole] = useState('');
    const [userID, setUserID] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const userNameFromStorage = localStorage.getItem('name');
        const userEmailFromStorage = localStorage.getItem('email');
        const userRoleFromStorage = localStorage.getItem('role');
        const userIDFromStorage = localStorage.getItem('userID');

        setUserName(userNameFromStorage || 'Usuario');
        setUserEmail(userEmailFromStorage || 'usuario@ejemplo.com');
        setUserRole(userRoleFromStorage || 'Sin rol definido');
        setUserID(userIDFromStorage || '');
    }, []);

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setErrorMessage('Las contraseñas no coinciden.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/users/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userID, currentPassword, newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage('Contraseña actualizada con éxito.');
                setShowModal(false);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setErrorMessage(data.message || 'Error al cambiar la contraseña. Verifica tus datos.');
            }
        } catch (error) {
            console.error('Error al cambiar la contraseña:', error);
            setErrorMessage('Ocurrió un error. Intenta nuevamente.');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login', { replace: true });
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Nav className="col-md-2 d-md-block bg-light sidebar"
                activeKey="/perfil"
                style={{ height: '100vh', position: 'fixed', top: 0, left: 0, paddingTop: '60px', width: '200px' }}>
                <Nav.Item className="p-3">
                    <Nav.Link href="/dashboard">Proyectos</Nav.Link>
                </Nav.Item>
                <Nav.Item className="p-3">
                    <Nav.Link href="/tasks">Tareas</Nav.Link>
                </Nav.Item>
                <Nav.Item className="p-3">
                    <Nav.Link href="/registro-pruebas">Registro de Pruebas</Nav.Link>
                </Nav.Item>
                <Nav.Item className="p-3">
                    <Nav.Link href="/perfil">Perfil</Nav.Link>
                </Nav.Item>
            </Nav>

            <div className="main-content" style={{ marginLeft: '200px', width: 'calc(100% - 200px)' }}>
                <Navbar bg="dark" variant="dark" className="mb-4" expand="lg" style={{ width: '100%' }}>
                    <Container fluid>
                        <Navbar.Brand>Bienvenido, {userName}</Navbar.Brand>
                        <Nav className="ml-auto">
                            <Nav.Link onClick={handleLogout}>Cerrar sesión</Nav.Link>
                        </Nav>
                    </Container>
                </Navbar>

                <Container>
                    <h3>Perfil de Usuario</h3>
                    <p><strong>Nombre:</strong> {userName}</p>
                    <p><strong>Correo Electrónico:</strong> {userEmail}</p>
                    <p><strong>Rol:</strong> {userRole}</p>
                    <p><strong>ID:</strong> {userID}</p>
                    <Button variant="primary" onClick={() => setShowModal(true)}>Cambiar Contraseña</Button>
                </Container>

                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Cambiar Contraseña</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Contraseña Actual</Form.Label>
                            <Form.Control
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Label>Nueva Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Label>Confirmar Nueva Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </Form.Group>
                        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={handleChangePassword}>
                            Guardar Cambios
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default Perfil;
