# Task Tracker

A full-stack task management application built with React for the front end and ASP.NET Core Web API for the back end. This project demonstrates CRUD operations, real-time UI updates, CORS setup, HTTPS configuration, and deployment to Azure.

---

## Features

- Create, read, update, and delete tasks
- Tasks can have optional due dates
- Tasks are displayed in two columns: tasks with deadlines and no-rush tasks
- Tasks are color-coded based on completion and urgency status
- Responsive design with clean UI
- Confirmation dialogs for updates and deletions using SweetAlert2
- Back-end API secured with CORS to allow frontend access
- HTTPS enabled for secure communication
- Deployment-ready with environment variable support for API URLs

---

## Tech Stack

- Front end: React, JavaScript, CSS
- Back end: ASP.NET Core Web API (C#)
- Database: SQL Server
- Deployment: Azure App Service (Backend), Azure Static Web Apps (Frontend)

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- .NET 7 SDK or later
- Git

### Running Locally

1. Clone the repo:

```bash
git clone https://github.com/ajcalvet/task-tracker.git
cd task-tracker
```

2. Set up back end:

```
cd TaskTrackerAPI
dotnet restore
dotnet run
```

3. Setup front end:

Open a new terminal window/tab:

```
cd task-tracker-frontend
npm install
npm start
```

4. Open your browser at http://localhost:3000 to use the app.

### Deployment

The app is configured to be deployed on Azure:

Back-end API deployed via Azure App Service

Front-end React app deployed via Azure Static Web Apps

Update environment variables accordingly to point the front end to the live back-end URL.

---

## Folder Structure

```
/TaskTrackerProject
  /TaskTrackerAPI          # .NET back end source code
  /tasktracker-frontend    # React front end source code
  README.md
```

---

## Author

Abel J. Calvet