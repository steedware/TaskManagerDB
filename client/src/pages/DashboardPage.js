import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Badge, Button, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import * as taskService from '../services/taskService';

const DashboardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { isAdmin } = useContext(AuthContext);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await taskService.getAllTasks();
        setTasks(data);
        setError('');
      } catch (err) {
        setError('Nie udało się załadować zadań. ' + err.toString());
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Get status badge variant
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'in-progress':
        return 'primary';
      case 'completed':
        return 'success';
      case 'reviewed':
        return 'info';
      default:
        return 'light';
    }
  };

  // Get priority badge variant
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'light';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Tłumaczenia statusów
  const translateStatus = (status) => {
    switch (status) {
      case 'pending':
        return 'Oczekujące';
      case 'in-progress':
        return 'W trakcie';
      case 'completed':
        return 'Zakończone';
      case 'reviewed':
        return 'Sprawdzone';
      default:
        return status;
    }
  };

  // Tłumaczenia priorytetów
  const translatePriority = (priority) => {
    switch (priority) {
      case 'high':
        return 'Wysoki';
      case 'medium':
        return 'Średni';
      case 'low':
        return 'Niski';
      default:
        return priority;
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Ładowanie...</span>
        </Spinner>
        <p className="mt-2">Ładowanie zadań...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1>Panel główny</h1>
          <p className="lead">
            {isAdmin 
              ? 'Zarządzaj zadaniami i śledź postępy zespołu' 
              : 'Przeglądaj i zarządzaj przydzielonymi zadaniami'}
          </p>
        </Col>
        {isAdmin && (
          <Col xs="auto" className="align-self-center">
            <Link to="/create-task">
              <Button variant="primary">Utwórz zadanie</Button>
            </Link>
          </Col>
        )}
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {tasks.length === 0 ? (
        <Alert variant="info">
          {isAdmin 
            ? 'Nie utworzono jeszcze żadnych zadań. Utwórz swoje pierwsze zadanie!' 
            : 'Nie masz przydzielonych żadnych zadań.'}
        </Alert>
      ) : (
        <Row>
          {tasks.map((task) => (
            <Col key={task._id} md={6} lg={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{task.title}</Card.Title>
                  <div className="mb-2">
                    <Badge bg={getStatusBadge(task.status)} className="me-2">
                      {translateStatus(task.status)}
                    </Badge>
                    <Badge bg={getPriorityBadge(task.priority)}>
                      Priorytet {translatePriority(task.priority)}
                    </Badge>
                  </div>
                  <Card.Text className="mb-1">
                    <strong>Przydzielone do:</strong> {task.assignedTo.name}
                  </Card.Text>
                  <Card.Text className="mb-3">
                    <strong>Termin:</strong> {formatDate(task.dueDate)}
                  </Card.Text>
                  <Link to={`/tasks/${task._id}`}>
                    <Button variant="outline-primary" size="sm" className="w-100">
                      Zobacz szczegóły
                    </Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default DashboardPage;