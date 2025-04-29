import React, { useContext, useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const history = useHistory();

  // Przekieruj do panelu głównego, jeśli użytkownik jest już zalogowany
  useEffect(() => {
    if (isAuthenticated) {
      history.push('/dashboard');
    }
  }, [isAuthenticated, history]);

  return (
    <Container className="py-5">
      <Row className="justify-content-center text-center">
        <Col md={8}>
          <h1 className="display-4 mb-4">Witaj w Menadżerze Zadań</h1>
          <p className="lead">
            Kompleksowe rozwiązanie do zarządzania zadaniami, śledzenia postępów i współpracy z zespołem.
          </p>
          <div className="d-grid gap-3 d-md-flex justify-content-md-center mt-4">
            <Link to="/login">
              <Button variant="primary" size="lg">
                Zaloguj się
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline-primary" size="lg">
                Zarejestruj się
              </Button>
            </Link>
          </div>
        </Col>
      </Row>

      <Row className="my-5">
        <h2 className="text-center mb-4">Funkcje</h2>
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Przydzielanie zadań</Card.Title>
              <Card.Text>
                Administratorzy mogą przydzielać zadania członkom zespołu, ustalać terminy i śledzić postępy.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Śledzenie postępów</Card.Title>
              <Card.Text>
                Monitoruj wykonanie zadań poprzez zdefiniowane etapy i śledź produktywność zespołu.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Współpraca</Card.Title>
              <Card.Text>
                Członkowie zespołu mogą dodawać notatki, komentarze i aktualizować status zadań w miarę postępów.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;