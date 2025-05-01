# 🎓 Student Portal Platform

A full-stack university student portal built with **React (frontend)** and **Flask (backend)**. It supports role-based dashboards for **Students**, **Lecturers**, and **Admins**, and provides features like academic unit registration, hostel booking, grade viewing/posting, fee payments, document requests, and clearance tracking.

---

## 📌 Features

### 👨‍🎓 Students
- Register for academic units by semester
- Book hostel rooms and accommodations
- View fee structure and make payments
- Check clearance status
- Request documents (e.g., transcripts)
- View personal academic grades
- Receive announcements and alerts

### 👩‍🏫 Lecturers
- View assigned courses
- View enrolled students per course
- Post and update grades
- Post announcements

### 🛠️ Admins
- Manage users (students, lecturers)
- Set up semesters and programs
- Assign rooms and manage hostels
- Approve fee clearance
- Create fee structures
- View analytics and audit logs

---

## 🧱 Tech Stack

| Layer     | Technology |
|-----------|------------|
| Frontend  | React, Axios, React Router |
| Backend   | Flask, SQLAlchemy, Marshmallow, Flask-JWT-Extended |
| Database  | PostgreSQL / MySQL / SQLite |
| Styling   | TailwindCSS or Bootstrap |
| Auth      | JWT (JSON Web Tokens) |
| Deployment| Render / Vercel / Heroku |

---

## 🚀 Getting Started

### 🧰 Prerequisites
- Python 3.9+
- Node.js 16+
- PostgreSQL (or SQLite for local testing)

---

### 🖥️ Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

Create a .env file in /backend:

env
Copy
Edit
FLASK_ENV=development
DATABASE_URL=sqlite:///portal.db
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-key
Run the server:

bash
Copy
Edit
flask db init
flask db migrate
flask db upgrade
flask run
💻 Frontend Setup
bash
Copy
Edit
cd frontend
npm install
npm run dev
🗂️ Project Structure
🔙 Backend (/backend)
models/ → SQLAlchemy models

routes/ → Flask Blueprints for API routes

schemas/ → Marshmallow validation schemas

utils/ → JWT handling, decorators, utilities

extensions.py → JWT, Marshmallow, CORS setup

main.py → Flask entrypoint

🔜 Frontend (/frontend)
pages/ → Student, Lecturer, and Admin views

components/ → Reusable UI components

api/ → Axios config + API call handlers

contexts/ → Auth & shared state

App.jsx → Router config

🧪 API Endpoints Summary

Area	Path	Method
Auth	/api/register, /api/login	POST
Courses	/api/courses, /api/registration	GET/POST/DELETE
Hostels	/api/hostels, /api/bookings	GET/POST/DELETE
Fees	/api/feestructure, /api/payments	GET/POST
Clearance	/api/clearance/<student_id>	GET/PUT
Grades	/api/grades, /api/grades/<id>	GET/POST/PUT
Announcements	/api/announcements	GET/POST
Admin Functions	/api/admin/users, /admin/semesters, etc.	GET/POST/DELETE
Full API documentation coming soon via Swagger/Postman!

🙋 Contribution Guide
Fork the repo

Create a new branch (git checkout -b feature-name)

Commit your changes (git commit -m 'Add feature')

Push to your branch (git push origin feature-name)

Open a pull request

📄 License
This project is open-source and available under the MIT License.

🙌 Acknowledgments
Special thanks to:

Flask & React communities

Open source contributors

You, for building something meaningful!

📬 Contact
For feedback, ideas, or collaboration: 📧 Email:mutsjoy1693@gmail.com.com
