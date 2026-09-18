# 🧭 Tourist Offer Activation App – Internship Project

## 📌 Overview
This project is part of a 4-week internship program designed to provide hands-on experience in building a simple full-stack web application.

Interns will **develop both backend and frontend components** of an application that allows users (tourists) to:
- Browse available telecom tourist offers
- Select an offer
- Enter personal details for identification
- Simulate a payment process
- Activate the offer and view a confirmation summary

---

## 🎯 Objectives
By completing this project, interns will:
- Learn backend development using **Java & Spring Boot**
- Build and consume **REST APIs**
- Develop **frontend applications (React or HTML/JavaScript)**
- Implement **UI flows and user interactions**
- Handle **form validation and state management**
- Understand **end-to-end application architecture**

---

## 🧑‍💻 Responsibilities

Interns are expected to:
- Implement backend APIs and business logic
- Develop frontend UI screens and flows
- Integrate frontend with backend APIs
- Handle user interaction and validation
- Ensure a clean and user-friendly experience

---

## 🗓️ Internship Plan

### ✅ Week 1: Setup & Fundamentals

**Topics**
- Environment setup (IDE, Git, JDK, Node.js)
- Java basics (OOP, collections)
- REST API introduction
- Spring Boot structure
- Frontend basics (React or HTML/JS)

**Tasks**
- Set up backend and frontend projects
- Backend:
  - Implement `GET /api/offers`
- Frontend:
  - Display list of offers (cards or simple list UI)

**Outcome**
- Basic full-stack app with visible data from backend

---

### ✅ Week 2: Offer Selection & User Input

**Topics**
- Backend layers (Controller, Service, DTO)
- POST requests and validation
- Frontend forms and input handling

**Tasks**
- Backend:
  - Implement `POST /api/activate`
  - Add input validation
- Frontend:
  - Build form for:
    - Offer selection
    - User details input
  - Manage form state

**Outcome**
- Users can select an offer and submit personal data

---

### ✅ Week 3: Payment Flow & Activation

**Topics**
- Multi-step UI flows
- API response handling
- Payment simulation
- Frontend state & feedback

**Tasks**
- Backend:
  - Implement `POST /api/pay`
- Frontend:
  - Create payment step UI
  - Handle loading, success, and error states
  - Show activation summary screen

**Outcome**
- Complete user journey from selection → payment → activation

---

### ✅ Week 4: Finalization & Demo

**Topics**
- Validation improvements
- Basic security practices
- API documentation (Swagger/OpenAPI)
- UI/UX improvements
- Code refactoring

**Tasks**
- Backend:
  - Add Swagger documentation
  - Improve validation & error handling
- Frontend:
  - Polish UI (spacing, feedback, usability)
  - Improve user experience (navigation, states)
- Prepare demo

**Outcome**
- Clean, user-friendly, demo-ready application

---

## 📦 Deliverables
- ✅ Spring Boot backend
- ✅ Frontend application (React or HTML/JS)
- ✅ Integrated full flow (frontend + backend)
- ✅ API documentation (Swagger/OpenAPI)
- ✅ GitHub repository
- ✅ Final demo presentation

---

## 📊 Example Data

```json
[
  {
    "id": 1,
    "name": "Tourist Pack",
    "price": 2400,
    "internetGB": 40,
    "minutes": 1000,
    "validityDays": 21
  },
  {
    "id": 2,
    "name": "Tourist Giga Pack",
    "price": 2700,
    "internetGB": 100,
    "minutes": "Unlimited",
    "validityDays": 21
  }
]