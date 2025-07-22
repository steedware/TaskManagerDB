# Task Management System

**Author**: steedware

A comprehensive task management system built using React, Node.js, Express, and MongoDB.

## Features

- **User Authentication**: Secure login and registration system using JWT
- **Role-Based Access Control**: Separate permissions for administrators and regular users
- **Task Management**: Create, view, update, and delete tasks
- **Task Assignment**: Administrators can assign tasks to team members
- **Progress Tracking**: Monitor task execution through defined stages
- **Notes and Comments**: Add notes to tasks for collaboration
- **Status Updates**: Update task status (pending, in progress, completed, verified)
- **Stage Approval**: Administrators can approve completed stages
- **Deadlines**: Set dates and times by which tasks must be completed
- **Priority Levels**: Assign low, medium, or high priority to tasks
- **Profile Editing**: Users can update their personal information and password
- **Account Deletion**: Ability to delete user account with appropriate security measures

## Technologies

- **Frontend**: React, React Router, React Bootstrap
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **API Communication**: Axios

## Application Structure

- `client/`: React frontend application
- `server/`: Node.js backend API

## Requirements

- Node.js (v14.x or newer)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## Installation

### Backend Setup

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/task-manager
   NODE_ENV=development
   ```

4. Start the server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Open a new terminal and navigate to the client directory:
   ```
   cd client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the React development server:
   ```
   npm start
   ```

## Running the Application

1. Start the MongoDB service on your local machine (if using local MongoDB)
2. Start the backend server: `cd server && npm run dev`
3. Start the frontend application: `cd client && npm start`
4. Access the application in your browser at `http://localhost:3000`

## Initial Setup

When running the application for the first time, you need to create an administrator user:

1. Register a new user through the registration page
2. Access the MongoDB database and manually change the user's role from "user" to "admin"

## User Roles

- **Administrator**: Can create tasks, assign them to users, monitor progress, approve stages, and manage all tasks
- **User**: Can view assigned tasks, update task status, add notes, and mark task stages as completed

## Account Management

- Users can edit their profile information, including first name, last name, and email address
- Ability to change password with appropriate validation
- Account deletion feature with security measures:
  - Users with assigned tasks must complete them before deleting their account
  - The last administrator in the system cannot be deleted

## Task Management

- Detailed task definition with descriptions and deadlines
- Set precise deadlines with date and time
- Progress visualization through progress bars
- Ability to add notes and comments to tasks

## License

This project is licensed under the MIT License.

## Author

steedware
