import React, { useState, useEffect, useContext } from 'react';
import { Container, Form, Button, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import * as taskService from '../services/taskService';

const CreateTaskPage = () => {
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [stages, setStages] = useState([{ name: '' }]);
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { isAdmin } = useContext(AuthContext);
  const history = useHistory();

  // Pobieranie użytkowników, którym administrator może przydzielić zadania
  useEffect(() => {
    if (!isAdmin) {
      history.push('/dashboard');
      return;
    }

    const fetchUsers = async () => {
      try {
        const { data } = await axios.get('/users');
        setUsers(data);
        if (data.length > 0) {
          setAssignedTo(data[0]._id);
        }
      } catch (err) {
        setError('Nie udało się załadować użytkowników: ' + (err.response?.data?.message || err.message));
      } finally {
        setUsersLoading(false);
      }
    };

    fetchUsers();
  }, [isAdmin, history]);

  // Dodawanie nowego etapu
  const addStage = () => {
    setStages([...stages, { name: '' }]);
  };

  // Usuwanie etapu
  const removeStage = (index) => {
    const newStages = [...stages];
    newStages.splice(index, 1);
    setStages(newStages);
  };

  // Obsługa zmiany nazwy etapu
  const handleStageChange = (index, value) => {
    const newStages = [...stages];
    newStages[index].name = value;
    setStages(newStages);
  };

  // Obsługa wysyłania formularza
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Walidacja etapów
    const filteredStages = stages.filter(stage => stage.name.trim() !== '');
    if (filteredStages.length === 0) {
      setError('Dodaj przynajmniej jeden etap dla zadania');
      return;
    }

    try {
      setError('');
      setLoading(true);
      
      // Combine date and time for the due date
      let fullDueDate = new Date(dueDate);
      
      if (dueTime) {
        const [hours, minutes] = dueTime.split(':');
        fullDueDate.setHours(parseInt(hours, 10));
        fullDueDate.setMinutes(parseInt(minutes, 10));
      } else {
        // Set default end of day if no specific time is provided
        fullDueDate.setHours(23, 59, 59);
      }
      
      const taskData = {
        title,
        description,
        assignedTo,
        priority,
        dueDate: fullDueDate.toISOString(),
        stages: filteredStages
      };
      
      const createdTask = await taskService.createTask(taskData);
      history.push(`/tasks/${createdTask._id}`);
    } catch (err) {
      setError('Nie udało się utworzyć zadania: ' + err.toString());
    } finally {
      setLoading(false);
    }
  };

  // Ustawienie minimalnej daty na dzisiaj dla pola terminu
  const today = new Date().toISOString().split('T')[0];

  if (!isAdmin) {
    return null; // To zapobiega migotaniu przed przekierowaniem
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header as="h4">Utwórz nowe zadanie</Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="title" className="mb-3">
                  <Form.Label>Tytuł zadania</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Wprowadź tytuł zadania"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="description" className="mb-3">
                  <Form.Label>Opis</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Wprowadź szczegółowy opis zadania"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="assignedTo" className="mb-3">
                  <Form.Label>Przydziel do</Form.Label>
                  {usersLoading ? (
                    <div className="text-center">
                      <Spinner animation="border" size="sm" />
                      <span className="ms-2">Ładowanie użytkowników...</span>
                    </div>
                  ) : users.length === 0 ? (
                    <Alert variant="warning">
                      Brak dostępnych użytkowników. Upewnij się, że użytkownicy są zarejestrowani.
                    </Alert>
                  ) : (
                    <Form.Select
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      required
                    >
                      {users.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.name} ({user.email})
                        </option>
                      ))}
                    </Form.Select>
                  )}
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group controlId="priority" className="mb-3">
                      <Form.Label>Priorytet</Form.Label>
                      <Form.Select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                      >
                        <option value="low">Niski</option>
                        <option value="medium">Średni</option>
                        <option value="high">Wysoki</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group controlId="dueDate" className="mb-3">
                      <Form.Label>Data terminu</Form.Label>
                      <Form.Control
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        min={today}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="dueTime" className="mb-3">
                      <Form.Label>Godzina terminu</Form.Label>
                      <Form.Control
                        type="time"
                        value={dueTime}
                        onChange={(e) => setDueTime(e.target.value)}
                      />
                      <Form.Text className="text-muted">
                        Opcjonalnie. Domyślnie koniec dnia (23:59).
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group controlId="stages" className="mb-3">
                  <Form.Label>Etapy zadania</Form.Label>
                  <div className="mb-2 text-muted">
                    <small>Zdefiniuj kamienie milowe lub kroki wymagane do ukończenia tego zadania</small>
                  </div>
                  
                  {stages.map((stage, index) => (
                    <Row key={index} className="mb-2">
                      <Col>
                        <Form.Control
                          type="text"
                          placeholder={`Etap ${index + 1}`}
                          value={stage.name}
                          onChange={(e) => handleStageChange(index, e.target.value)}
                          required
                        />
                      </Col>
                      <Col xs="auto">
                        <Button 
                          variant="outline-danger" 
                          onClick={() => removeStage(index)}
                          disabled={stages.length === 1}
                        >
                          Usuń
                        </Button>
                      </Col>
                    </Row>
                  ))}
                  
                  <Button 
                    variant="outline-secondary" 
                    onClick={addStage} 
                    className="mt-2"
                  >
                    Dodaj etap
                  </Button>
                </Form.Group>

                <div className="d-grid gap-2 mt-4">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={loading || usersLoading || users.length === 0}
                  >
                    {loading ? 'Tworzenie...' : 'Utwórz zadanie'}
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => history.push('/dashboard')}
                  >
                    Anuluj
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateTaskPage;