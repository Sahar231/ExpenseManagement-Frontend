# Expense Portal – Professional Expense Management Application

## Overview

Expense Portal is a full-stack web application designed to simplify the management of professional expenses. Employees can create and submit expense reports, while managers can review, approve, or reject them through a secure and structured workflow.

The system is built around role-based access control, ensuring that each user can only access the features and data relevant to their responsibilities.

### Expense Workflow

1. An employee logs into the application.
2. The employee creates an expense report.
3. The report is submitted for validation.
4. The manager reviews the request.
5. The manager approves or rejects the expense report.
6. The employee can track the status of the request at any time.

---

## Key Features

### Employee Features

- Secure authentication and authorization
- Create expense reports
- Edit reports while they are in **Draft** or **Rejected** status
- Submit expenses for validation
- View expense history and track status

### Manager Features

- Review submitted expense reports
- Approve expense requests
- Reject requests with comments
- Review validation history
- Manage expenses related to assigned missions

### Expense Statuses

- Draft
- Submitted
- Approved
- Rejected

---

## Tech Stack

### Frontend

- Angular
- TypeScript
- RxJS
- Bootstrap 5
- Bootstrap Icons
- HTML5
- CSS3

### Backend

- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- JWT Authentication

---

## Architecture

Expense Portal follows a three-tier architecture:

```text
Frontend (Angular) -> Backend (ASP.NET Core Web API) -> Database (SQL Server)
```

This structure ensures a clean separation between presentation, business logic, and data persistence.


### Main Entities

#### User

Represents an employee or a manager using the application.

- `Id` : Unique identifier
- `Nom` : User's last name
- `Prénom` : User's first name
- `Email` : User's email address
- `MotDePasse` : Encrypted password
- `Rôle` : Employee or Manager

---

#### Mission

Represents a professional mission associated with expense reports.

- `Id` : Unique identifier
- `Nom` : Mission name
- `ManagerId` : Identifier of the assigned manager
- `Lieu` : Mission location
- `DateDebut` : Mission start date
- `DateFin` : Mission end date

---

#### Expense

Represents an expense report submitted by an employee.

- `Id` : Unique identifier
- `EmployeeId` : Identifier of the employee
- `MissionId` : Associated mission
- `Montant` : Expense amount
- `Date` : Expense date
- `Catégorie` : Expense category
- `Statut` : Current status (Draft, Submitted, Approved, Rejected)
- `Commentaire` : Additional information or rejection comment

---

#### Approval

Represents the history of approval decisions.

- `Id` : Unique identifier
- `ExpenseId` : Associated expense report
- `Status` : Validation status
- `Comment` : Manager's comment
- `ReviewedBy` : Identifier of the reviewer
- `ReviewedAt` : Review date and time

## Project Structure


## Project Structure

```text
expense-portal/
├── public/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   └── services/
│   │   │       ├── auth.ts
│   │   │       ├── auth.guard.ts
│   │   │       ├── jwt.interceptor.ts
│   │   │       ├── frais.ts
│   │   │       ├── auth.spec.ts
│   │   │       └── frais.spec.ts
│   │   │
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   └── signup/
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── dashboard.ts
│   │   │   │   ├── dashboard.html
│   │   │   │   └── dashboard.css
│   │   │   │
│   │   │   └── frais/
│   │   │       ├── liste/
│   │   │       └── validation/
│   │   │
│   │   ├── app.ts
│   │   ├── app.html
│   │   ├── app.css
│   │   ├── app.routes.ts
│   │   └── app.config.ts
│   │
│   ├── index.html
│   ├── main.ts
│   └── styles.css
│
├── angular.json
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```
---

## Application Routes

| Route | Description | Access |
| :--- | :--- | :--- |
| `/login` | User login page | Public |
| `/signup` | User registration page | Public |
| `/dashboard` | Main dashboard | Authenticated |
| `/dashboard/frais/liste` | Display employee expenses | Employee |
| `/dashboard/frais/validation` | Validate submitted expenses | Manager |

---

## Application Roles

### Employee
- Authenticate and access the application
- Create expense reports
- Edit expenses in **Draft** or **Rejected** status
- Submit expenses for approval
- Track expense history and status

### Manager
- Access submitted expense reports
- Approve expenses
- Reject expenses with comments
- Review validation history
- Manage expenses related to assigned missions

---

## Security

The application uses **JWT (JSON Web Tokens)** for authentication and role-based authorization.


---

## Installation

### Prerequisites
- Node.js
- npm

### Install dependencies
```bash
npm install
```

### Run the application
```bash
npm start
```

Then open your browser at:
```text
http://localhost:4200/
```

### Build for production
```bash
npm run build
```

### Run tests
```bash
npm test
```

---

## Conclusion

Expense Portal is a practical solution for managing professional expenses in a secure, structured, and role-aware environment. It is designed to support both employees and managers throughout the approval workflow.


- Employees can only access their own expense reports.
- Managers can only validate expenses related to the missions they supervise.
- Protected routes are secured using Angular Guards and JWT Interceptors.
- Expense reports can only be edited when their status is **Draft** or **Rejected**.



---

## Academic Context

This project was developed during a summer internship at **Inetum Tunisia**.

It was designed to strengthen skills in:

- Full-stack web development.
- Angular application development.
- REST API design with ASP.NET Core.
- Database management with SQL Server.
- Authentication and authorization using JWT.
- Software architecture and best practices.
- Team collaboration and version control.

---

## Getting Started

### Prerequisites

Before running the application, ensure that the following tools are installed:

- Node.js
- npm
- Angular CLI
- .NET 8 SDK
- SQL Server

### Clone the repository

```bash
git clone https://github.com/Sahar231/ExpenseManagement-Frontend
```

### Install dependencies

```bash
npm install
```

### Run the frontend

```bash
ng serve
```

The frontend will be available at:

```text
http://localhost:4200
```

### Run the backend

```bash
dotnet restore

dotnet ef database update

dotnet run
```

The API will be available at:

```text
https://localhost:7212
```

### Run tests

Frontend:

```bash
npm test
```

Backend:

```bash
dotnet test
```

---

## Acknowledgment

Special thanks to **Inetum Tunisia**, mentors, and everyone who contributed to the development of this project.

We also acknowledge the Angular, ASP.NET Core, and SQL Server communities for their documentation and resources.

---
![Angular](https://img.shields.io/badge/Angular-18-red)

![ASP.NET](https://img.shields.io/badge/ASP.NET_Core-8-blue)

![SQL Server](https://img.shields.io/badge/SQL_Server-2022-green)

![Bootstrap](https://img.shields.io/badge/Bootstrap-5-purple)

© 2026 Expense Portal — Internship Project at Inetum Tunisia.