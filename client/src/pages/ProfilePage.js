import React, { useContext } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <Container className="py-5 text-center">
        <p>Zaloguj się, aby zobaczyć swój profil.</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header as="h4">Profil użytkownika</Card.Header>
            <Card.Body>
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
                  
                  <div className="mb-2">
                    <strong>Konto utworzone: </strong>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;