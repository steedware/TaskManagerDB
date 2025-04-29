import React, { useState, useEffect, useContext } from 'react';
import { 
  Container, Row, Col, Card, Badge, Button, Alert, Spinner, Form,
  ListGroup, ProgressBar, Accordion
} from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import * as taskService from '../services/taskService';

const TaskDetailsPage = () => {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const { id } = useParams();
  const history = useHistory();
  const { user, isAdmin } = useContext(AuthContext);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const data = await taskService.getTaskById(id);
        setTask(data);
        setError('');
      } catch (err) {
        setError('Nie udało się załadować szczegółów zadania. ' + err.toString());
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [id]);

  // Dodawanie notatki do zadania
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    
    try {
      setSubmitLoading(true);
      const updatedTask = await taskService.addTaskNote(task._id, noteContent);
      setTask(updatedTask);
      setNoteContent('');
    } catch (err) {
      setError('Nie udało się dodać notatki. ' + err.toString());
    } finally {
      setSubmitLoading(false);
    }
  };

  // Aktualizacja statusu zadania
  const handleStatusChange = async (newStatus) => {
    try {
      setSubmitLoading(true);
      const updatedTask = await taskService.updateTask(task._id, { status: newStatus });
      setTask(updatedTask);
    } catch (err) {
      setError('Nie udało się zaktualizować statusu. ' + err.toString());
    } finally {
      setSubmitLoading(false);
    }
  };

  // Przełączanie ukończenia etapu zadania
  const handleToggleStage = async (stageIndex, completed) => {
    try {
      setSubmitLoading(true);
      const updatedTask = await taskService.updateTaskStage(task._id, stageIndex, completed);
      setTask(updatedTask);
    } catch (err) {
      setError('Nie udało się zaktualizować etapu. ' + err.toString());
    } finally {
      setSubmitLoading(false);
    }
  };

  // Zatwierdzanie etapu (tylko admin)
  const handleApproveStage = async (stageIndex) => {
    try {
      setSubmitLoading(true);
      const updatedTask = await taskService.approveTaskStage(task._id, stageIndex);
      setTask(updatedTask);
    } catch (err) {
      setError('Nie udało się zatwierdzić etapu. ' + err.toString());
    } finally {
      setSubmitLoading(false);
    }
  };

  // Usuwanie zadania (tylko admin)
  const handleDeleteTask = async () => {
    if (window.confirm('Czy na pewno chcesz usunąć to zadanie? Tej operacji nie można cofnąć.')) {
      try {
        await taskService.deleteTask(task._id);
        history.push('/dashboard');
      } catch (err) {
        setError('Nie udało się usunąć zadania. ' + err.toString());
      }
    }
  };

  // Funkcje pomocnicze
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'in-progress': return 'primary';
      case 'completed': return 'success';
      case 'reviewed': return 'info';
      default: return 'light';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'light';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Brak';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
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

  // Obliczanie procentu postępu na podstawie ukończonych etapów
  const calculateProgress = () => {
    if (!task.stages || task.stages.length === 0) return 0;
    const completedStages = task.stages.filter(stage => stage.completed).length;
    return Math.round((completedStages / task.stages.length) * 100);
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Ładowanie...</span>
        </Spinner>
        <p className="mt-2">Ładowanie szczegółów zadania...</p>
      </Container>
    );
  }

  if (error && !task) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          {error}
          <div className="mt-3">
            <Button variant="outline-primary" onClick={() => history.push('/dashboard')}>
              Powrót do Panelu głównego
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Row className="mb-4">
        <Col>
          <Button 
            variant="outline-secondary" 
            onClick={() => history.push('/dashboard')}
            className="mb-2"
          >
            &larr; Powrót do Panelu głównego
          </Button>
          <h1>{task.title}</h1>
          <div className="mb-3">
            <Badge bg={getStatusBadge(task.status)} className="me-2">
              {translateStatus(task.status)}
            </Badge>
            <Badge bg={getPriorityBadge(task.priority)}>
              Priorytet {translatePriority(task.priority)}
            </Badge>
          </div>
        </Col>
        {isAdmin && (
          <Col xs="auto">
            <Button 
              variant="danger" 
              onClick={handleDeleteTask}
              disabled={submitLoading}
            >
              Usuń zadanie
            </Button>
          </Col>
        )}
      </Row>

      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Header as="h5">Szczegóły zadania</Card.Header>
            <Card.Body>
              <Card.Text>{task.description}</Card.Text>
              
              <Row className="mt-4">
                <Col md={6}>
                  <p><strong>Przydzielone do:</strong> {task.assignedTo.name}</p>
                  <p><strong>Przydzielone przez:</strong> {task.assignedBy.name}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Utworzono:</strong> {formatDate(task.createdAt)}</p>
                  <p><strong>Termin:</strong> {formatDate(task.dueDate)}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Header as="h5">Postęp</Card.Header>
            <Card.Body>
              <div className="mb-3">
                <ProgressBar 
                  now={calculateProgress()} 
                  label={`${calculateProgress()}%`} 
                  className="mb-2" 
                  variant={calculateProgress() === 100 ? "success" : "primary"}
                />
                <small className="text-muted">
                  {task.stages.filter(stage => stage.completed).length} z {task.stages.length} etapów ukończonych
                </small>
              </div>

              <ListGroup variant="flush">
                {task.stages.map((stage, index) => (
                  <ListGroup.Item key={index} className="py-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <Form.Check 
                          type="checkbox"
                          id={`stage-${index}`}
                          label={stage.name}
                          checked={stage.completed}
                          onChange={() => handleToggleStage(index, !stage.completed)}
                          disabled={!user || (user.role !== 'admin' && task.assignedTo._id !== user._id) || submitLoading}
                        />
                        {stage.completed && (
                          <small className="text-muted d-block">
                            Ukończono {formatDate(stage.completedAt)}
                            {stage.approvedBy && ` - Zatwierdzone przez ${stage.approvedBy.name}`}
                          </small>
                        )}
                      </div>
                      {isAdmin && stage.completed && !stage.approvedBy && (
                        <Button 
                          variant="outline-success" 
                          size="sm"
                          onClick={() => handleApproveStage(index)}
                          disabled={submitLoading}
                        >
                          Zatwierdź
                        </Button>
                      )}
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Header as="h5">Status zadania</Card.Header>
            <Card.Body>
              <p>Obecny status: <Badge bg={getStatusBadge(task.status)}>{translateStatus(task.status)}</Badge></p>
              
              <div className="d-flex flex-wrap gap-2 mt-3">
                <Button
                  variant={task.status === 'pending' ? 'secondary' : 'outline-secondary'}
                  size="sm"
                  onClick={() => handleStatusChange('pending')}
                  disabled={task.status === 'pending' || submitLoading || (!isAdmin && task.assignedTo._id !== user._id)}
                >
                  Oczekujące
                </Button>
                <Button
                  variant={task.status === 'in-progress' ? 'primary' : 'outline-primary'}
                  size="sm"
                  onClick={() => handleStatusChange('in-progress')}
                  disabled={task.status === 'in-progress' || submitLoading || (!isAdmin && task.assignedTo._id !== user._id)}
                >
                  W trakcie
                </Button>
                <Button
                  variant={task.status === 'completed' ? 'success' : 'outline-success'}
                  size="sm"
                  onClick={() => handleStatusChange('completed')}
                  disabled={task.status === 'completed' || submitLoading || (!isAdmin && task.assignedTo._id !== user._id)}
                >
                  Zakończone
                </Button>
                {isAdmin && (
                  <Button
                    variant={task.status === 'reviewed' ? 'info' : 'outline-info'}
                    size="sm"
                    onClick={() => handleStatusChange('reviewed')}
                    disabled={task.status === 'reviewed' || submitLoading}
                  >
                    Sprawdzone
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="mb-4">
            <Card.Header as="h5">Notatki</Card.Header>
            <Card.Body>
              <Form onSubmit={handleAddNote}>
                <Form.Group className="mb-3">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Dodaj notatkę do tego zadania..."
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                  />
                </Form.Group>
                <Button 
                  variant="primary" 
                  type="submit" 
                  disabled={!noteContent.trim() || submitLoading}
                  className="mb-3"
                >
                  {submitLoading ? 'Dodawanie...' : 'Dodaj notatkę'}
                </Button>
              </Form>

              <hr />

              {task.notes.length === 0 ? (
                <p className="text-center text-muted my-4">Brak notatek</p>
              ) : (
                <div className="notes-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  <Accordion defaultActiveKey="0">
                    {task.notes.map((note, index) => (
                      <Accordion.Item key={index} eventKey={index.toString()}>
                        <Accordion.Header>
                          <div>
                            <small className="text-muted">
                              Od {note.createdBy?.name || 'Użytkownik'} - {formatDate(note.createdAt)}
                            </small>
                          </div>
                        </Accordion.Header>
                        <Accordion.Body>{note.content}</Accordion.Body>
                      </Accordion.Item>
                    )).reverse()}
                  </Accordion>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TaskDetailsPage;