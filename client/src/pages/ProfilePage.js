import React, { useContext, useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, Modal, Alert } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { useHistory } from 'react-router-dom';

const ProfilePage = () => {
  const { user, updateProfile, deleteAccount } = useContext(AuthContext);
  const history = useHistory();
  
  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!user) {
    return (
      <Container className="py-5 text-center">
        <p>Zaloguj się, aby zobaczyć swój profil.</p>
      </Container>
    );
  }

  // Handle update profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    // Clear previous messages
    setError('');
    setSuccess('');
    
    // Validate passwords match
    if (password && password !== confirmPassword) {
      setError('Hasła nie są zgodne');
      return;
    }
    
    try {
      setLoading(true);
      
      // Only include password if it was provided
      const userData = {
        name,
        email,
        ...(password && { password })
      };
      
      await updateProfile(userData);
      setSuccess('Profil został zaktualizowany');
      setEditMode(false);
      // Reset password fields
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle account deletion
  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      await deleteAccount();
      setShowDeleteModal(false);
      history.push('/');
    } catch (err) {
      setError(err.message);
      setShowDeleteModal(false);
    } finally {
      setLoading(false);
    }
  };
  
  // Cancel edit mode
  const handleCancelEdit = () => {
    setEditMode(false);
    setName(user.name);
    setEmail(user.email);
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  return (
    <Container className="py-5">
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header as="h4" className="d-flex justify-content-between align-items-center">
              Profil użytkownika
              {!editMode && (
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={() => setEditMode(true)}
                >
                  Edytuj profil
                </Button>
              )}
            </Card.Header>
            <Card.Body>
              {!editMode ? (
                <Row>
                  <Col md={3}>
                    <div className="text-center mb-4">
                      <div 
                        className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto"
                        style={{ width: '100px', height: '100px', fontSize: '2.5rem' }}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  </Col>
                  <Col md={9}>
                    <h2>{user.name}</h2>
                    <p className="text-muted">{user.email}</p>
                    
                    <hr className="my-3" />
                    
                    <div className="mb-2">
                      <strong>Rola: </strong>
                      <Badge bg={user.role === 'admin' ? 'danger' : 'info'}>
                        {user.role === 'admin' ? 'Administrator' : 'Członek zespołu'}
                      </Badge>
                    </div>
                    
                    <div className="mb-3">
                      <strong>Konto utworzone: </strong>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                    
                    <Button 
                      variant="outline-danger" 
                      onClick={() => setShowDeleteModal(true)}
                    >
                      Usuń konto
                    </Button>
                  </Col>
                </Row>
              ) : (
                <Form onSubmit={handleUpdateProfile}>
                  <Form.Group className="mb-3" controlId="formName">
                    <Form.Label>Imię i nazwisko</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      required 
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Adres e-mail</Form.Label>
                    <Form.Control 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Nowe hasło (pozostaw puste, jeśli nie chcesz zmieniać)</Form.Label>
                    <Form.Control 
                      type="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3" controlId="formConfirmPassword">
                    <Form.Label>Potwierdź nowe hasło</Form.Label>
                    <Form.Control 
                      type="password" 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={!password} 
                    />
                  </Form.Group>
                  
                  <div className="d-flex gap-2">
                    <Button variant="primary" type="submit" disabled={loading}>
                      {loading ? 'Aktualizowanie...' : 'Zapisz zmiany'}
                    </Button>
                    <Button variant="outline-secondary" onClick={handleCancelEdit} disabled={loading}>
                      Anuluj
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Delete Account Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Potwierdź usunięcie konta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-danger fw-bold">Uwaga! Ta operacja jest nieodwracalna.</p>
          <p>Czy na pewno chcesz usunąć swoje konto? Wszystkie Twoje dane zostaną trwale usunięte.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Anuluj
          </Button>
          <Button variant="danger" onClick={handleDeleteAccount} disabled={loading}>
            {loading ? 'Usuwanie...' : 'Usuń konto'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProfilePage;