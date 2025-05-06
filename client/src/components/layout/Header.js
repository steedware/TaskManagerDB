import React, { useContext } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';
import { useHistory } from 'react-router-dom';

const Header = () => {
  const { user, logout, isAuthenticated, isAdmin } = useContext(AuthContext);
  const history = useHistory();

  const handleLogout = () => {
    logout();
    history.push('/'); // Przekierowanie do strony głównej po wylogowaniu
  };

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>Menadżer Zadań</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {isAuthenticated ? (
                <>
                  <LinkContainer to="/dashboard">
                    <Nav.Link>
                      <i className="fas fa-tasks"></i> Panel główny
                    </Nav.Link>
                  </LinkContainer>
                  
                  {isAdmin && (
                    <LinkContainer to="/create-task">
                      <Nav.Link>
                        <i className="fas fa-plus"></i> Utwórz zadanie
                      </Nav.Link>
                    </LinkContainer>
                  )}
                  
                  <NavDropdown title={user?.name || 'Użytkownik'} id="username">
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>Profil</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={handleLogout}>
                      Wyloguj się
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <>
                  <LinkContainer to="/login">
                    <Nav.Link>
                      <i className="fas fa-user"></i> Zaloguj się
                    </Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/register">
                    <Nav.Link>
                      <i className="fas fa-user-plus"></i> Zarejestruj się
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;