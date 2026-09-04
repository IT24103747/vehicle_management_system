# 🅿️ ParkSL — Smart Parking Finder & Reservation System

> **SE3090 – Software Engineering Frameworks**  
> **Assignment 2 – Mini Hackathon**  
> **Year 3 | Semester 1 | 2026**

---
1. Git Repository Link
   [PASTE GITHUB LINK HERE]

2. Deployed Application Link
   [PASTE VERCEL/NETLIFY LINK HERE]

3. Two-Minute Demonstration Video Link
   [PASTE VIDEO LINK HERE]


## 👥 Team Members & Contributions

| Name | Student ID | Contribution |
|---|---|---|
| Minduli H.B.C | IT24103747 | Parking Finder, Search & Filters  |
| Daluwatta D.A | IT24104161 |  Home Page, UI Shell & Authentication |
| Dolamulla H.D.K.P.D | IT24103522 |  Parking Owner & Parking Management |
| Semasinghe S.M.B.C | IT24103525 | Parking Reservation |

---

## 📌 1. Project Overview

**ParkSL** is a smart parking finder and reservation web application designed to help drivers in Sri Lankan urban areas find available parking spaces quickly and reserve a slot before arrival.

The application also provides a simple management dashboard for parking operators to manage parking slots, monitor reservations, and update slot availability.

---

## 🇱🇰 2. Selected Sri Lankan Problem

Finding available parking in busy Sri Lankan urban areas such as **Colombo, Malabe, Kaduwela, and Nugegoda** can be difficult.

Drivers may spend unnecessary time travelling around congested areas looking for an available parking space. This can contribute to:

- Increased traffic congestion
- Wasted fuel
- Unnecessary travel time
- Driver frustration
- Difficulty identifying available parking spaces

There is therefore a need for a simple digital solution that allows drivers to check parking availability before reaching their destination.

---

## 💡 3. Proposed Solution

ParkSL provides a simple web-based platform where drivers can:

1. Search for parking locations.
2. Check current parking slot availability.
3. Filter parking locations based on availability.
4. Select an available parking slot.
5. Reserve the selected slot.
6. Calculate the parking cost automatically.
7. Receive a digital reservation ticket.

Parking operators can use a separate dashboard to:

- View parking slot statistics.
- View customer reservations.
- Add new parking slots.
- Change parking slot statuses.
- Mark a reserved slot as occupied when a vehicle arrives.
- Mark an occupied slot as available when a vehicle leaves.

---

## 🚀 4. Main Features

### 🏠 4.1 Home Page

The Home Page introduces ParkSL and explains the parking problem addressed by the application.

**Features:**

- Hero section
- "Find Parking" call-to-action
- Parking statistics
- Sri Lankan parking problem explanation
- Navigation bar
- User registration/login
- Responsive interface

---

### 🔎 4.2 Find Parking

Drivers can search for parking locations and view available parking slots.

**Features:**

- Search by location
- Sri Lankan locations such as Malabe, Colombo, Kaduwela and Nugegoda
- Filter parking locations by:
  - All
  - Available
  - Full
- Display parking price in LKR per hour
- Display available and total slots
- Visual parking slot grid

### Slot Status

| Status | Meaning |
|---|---|
| 🟢 Available | Slot can be reserved |
| 🟡 Reserved | Slot has already been reserved |
| 🔴 Occupied | A vehicle is currently using the slot |

Drivers can select an available slot and continue to the reservation page.

---

### 🎟️ 4.3 Parking Reservation

The Reservation Page allows drivers to reserve their selected parking slot.

**User Inputs:**

- Parking location
- Parking slot
- Vehicle number
- Parking duration

The selected location and parking slot are automatically transferred from the parking finder.

### Input Validation

The system provides friendly validation messages for invalid inputs.

Examples:

- Vehicle number is required.
- Please enter a valid Sri Lankan vehicle number.
- Duration must be greater than 0.
- Please select an available parking slot.

### 💰 Live Price Calculation

The total parking price is automatically calculated using:

**Total Price = Parking Duration × Hourly Rate**

Example:

> Duration: 2 Hours  
> Rate: Rs. 100/hour  
> **Total: Rs. 200**

---

### 🎫 4.4 Digital Reservation Ticket

After successfully completing a reservation, the system generates a digital ticket.

Example:

> **Reservation ID:** PS1024  
> **Location:** SLIIT Malabe  
> **Slot:** P-01  
> **Vehicle:** CAB-1234  
> **Duration:** 2 Hours  
> **Total:** Rs. 200  
> **Status:** Reserved

Users can also cancel an active reservation.

---

### 🅿️ 4.5 Operator Dashboard

Parking operators can manage parking slots and reservations through the Operator Dashboard.

**Dashboard Features:**

- Total slot count
- Available slot count
- Reserved slot count
- Occupied slot count
- Customer reservation list
- Add new parking slot
- Update parking slot status

Operators can perform actions such as:

**Available → Reserved → Occupied → Available**

For example, when a reserved vehicle arrives, the operator can mark its slot as **Occupied**.

When the vehicle leaves, the operator can mark the slot as **Available** again.

---

### 👤 4.6 User Registration & Login

ParkSL provides a simple registration and login interface.

Users can register as:

- Driver
- Parking Operator

Basic user information is stored within the application's local state.

---

## 🛠️ 5. Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend framework |
| Vite | Development and build tool |
| Tailwind CSS / Vanilla CSS | UI styling and responsive design |
| React Router | Application navigation |
| React Context API | Shared application state |
| LocalStorage | Browser-side data persistence |
| Git & GitHub | Version control and collaboration |
| Vercel / Netlify | Application deployment |

---

## 🗃️ 6. Data Management

ParkSL uses **React Context API** to manage shared application state.

Browser **LocalStorage** is used to persist application data between page refreshes.

The application manages:

- Users
- Parking locations
- Parking slots
- Reservations

Sample parking locations include:

- SLIIT Malabe
- Colombo
- Kaduwela
- Nugegoda

---
## 7. Technologies and AI Tools Used

### Technologies Used
- React.js
- Vite
- Tailwind CSS / Vanilla CSS
- React Router
- React Context API
- Browser LocalStorage
- Git
- GitHub
- Vercel / Netlify

### AI Tools Used
- ChatGPT
- Codex
- Antigravity

## 📱 8. Responsive Design

ParkSL is designed to work on both:

- 💻 Desktop screens
- 📱 Mobile devices

Responsive layouts are used for navigation, parking cards, forms, slot grids and the operator dashboard.

---

## 👥 9. Team Members & Contributions

### Member 1 — Home Page, UI & Authentication

**Name:** [Member 1 Name]  
**Student ID:** [Student ID]

**Contribution:**

- Navbar
- Footer
- Home Page
- Hero section
- Sri Lankan problem section
- User registration/login interface
- Responsive application shell

---

### Member 2 — Parking Finder

**Name:** [Member 2 Name]  
**Student ID:** [Student ID]

**Contribution:**

- Location search
- Availability filters
- Parking cards
- Parking slot grid
- Slot availability visualization
- Parking selection flow

---

### Member 3 — Reservation System

**Name:** [Member 3 Name]  
**Student ID:** [Student ID]

**Contribution:**

- Reservation form
- Input validation
- Sri Lankan vehicle-number validation
- Live parking-price calculation
- Digital ticket generation
- Reservation cancellation

---

### Member 4 — Operator Dashboard & Data Management

**Name:** [Member 4 Name]  
**Student ID:** [Student ID]

**Contribution:**

- Operator dashboard
- Parking statistics
- Slot status management
- Add Slot functionality
- Shared Parking Context
- LocalStorage persistence
- Integration and deployment support

---

## 📂 10. Project Structure

```text
park-sl/
│
├── public/
│   └── favicon.ico
│
├── src/
│   ├── assets/
│   │   └── logo.svg
│   │
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ProblemSection.jsx
│   │   ├── AuthModal.jsx
│   │   ├── SearchBar.jsx
│   │   ├── FilterPills.jsx
│   │   ├── ParkingCard.jsx
│   │   ├── SlotGrid.jsx
│   │   ├── ReservationForm.jsx
│   │   ├── TicketModal.jsx
│   │   ├── OperatorStats.jsx
│   │   ├── OperatorSlotRow.jsx
│   │   └── AddSlotModal.jsx
│   │
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── FindParkingPage.jsx
│   │   ├── ReservationPage.jsx
│   │   └── OperatorDashboard.jsx
│   │
│   ├── context/
│   │   └── ParkingContext.jsx
│   │
│   ├── data/
│   │   └── initialData.js
│   │
│   ├── utils/
│   │   └── validation.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── README.md
├── package.json
└── vite.config.js
