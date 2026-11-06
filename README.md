
# Task Management Board (Trello / Jira Clone)

<img width="1080" height="607" alt="lead-demo" src="https://github.com/user-attachments/assets/afd6896c-22c8-4aec-834f-a7fa0cb8a410" />

<img width="1080" height="607" alt="member-demo" src="https://github.com/user-attachments/assets/d27fa545-03b5-4404-902f-2d00747e32fb" />

A fully functional project management web application inspired by Trello and Jira. This project focuses on complex UI interactions, global state management, and user role constraints. 

## Key Features

- **Interactive Kanban Board:** Seamless drag-and-drop functionality for moving tasks between different columns and statuses.
- **State Persistence:** Efficient global state management and data propagation utilizing the React Context API.
- **Role-Based Access Control (RBAC):** Built-in 'Teamlead' access level for managing permissions and assigning tasks.
- **Dynamic User Interface:** Auto-generated initialed user avatars and responsive UI elements.

## Tech Stack

- **Framework:** React (Functional Components, Hooks)
- **State Management:** Context API
- **Interactions:** Drag-and-Drop integration

## Quick Start Guide

To test this project locally, follow these instructions:

### 1. Clone the repository
```bash
git clone [https://github.com/Pe4er23/trello-copy.git](https://github.com/Pe4er23/trello-copy.git)
cd trello-copy
```
### 2. Install dependencies
```bash
npm install
```
### 3. Start the development server
```bash
npm run dev
```
or run a **"start React.bat"** file and type **start**

### 4. Start the database
Open another console in this folder and type
``` bash
npx json-server db.json watch --port 3001
```
or run a **"start DB.bat"** file and type **start**
