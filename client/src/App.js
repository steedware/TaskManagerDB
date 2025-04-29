import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Page Components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TaskDetailsPage from './pages/TaskDetailsPage';
import CreateTaskPage from './pages/CreateTaskPage';
import ProfilePage from './pages/ProfilePage';

// Context
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <main className="py-3">
          <Container>
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route path="/login" component={LoginPage} />
              <Route path="/register" component={RegisterPage} />
              <Route path="/dashboard" component={DashboardPage} />
              <Route path="/tasks/:id" component={TaskDetailsPage} />
              <Route path="/create-task" component={CreateTaskPage} />
              <Route path="/profile" component={ProfilePage} />
              <Route render={() => <Redirect to="/" />} />
            </Switch>
          </Container>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
};

export default App;
