# ♻️ EcoSmart Waste Management System

**Smart & Sustainable Waste Management for Urban Areas**

---
<p align="center">
  <img src="./assets/images/bin.jpeg" alt="EcoSmart Waste Management System" width="800"/>
</p>
---

## 📘 Overview

The **EcoSmart Waste Management System** is an intelligent, IoT-enabled platform designed to optimize urban waste management through automation, analytics, and real-time monitoring. It empowers residents, collection staff, and waste authorities to manage waste efficiently, promoting sustainability and transparency.

This system was developed as part of the **Case Studies in Software Engineering (SE3070)** course – Year 3, Semester 1.

---

## 🚀 Features

### 👥 User Roles

* **Guest User:** View About Us, Services, and Contact pages.
* **Registered User (Resident/Business):** Manage smart bins, payments, and view collection reports.
* **Collection Staff:** Record and track waste collection using RFID/barcode scanning.
* **Waste Management Authority (WMA):** Analyze operational data and generate performance reports.

### 🧩 Key Functional Modules

1. **Waste Account & Bin Tracking**

   * Link smart bins to user accounts via RFID/barcode sensors.
   * Auto-update user profiles with bin data.

2. **Record & Track Collections**

   * Real-time bin scanning and pickup logging.
   * Automatic alerts for overfilled or contaminated bins.

3. **Process Billing & Payments**

   * Automatic invoice generation and rebate calculation.
   * Integrated payment gateway with retry and credit carry-forward handling.

4. **Analyze & Optimize Operations**

   * Data-driven dashboards for WMA.
   * Generate analytical reports: User, Payment, Waste Collection, Operational.

---

## 🛠️ System Architecture

* **Frontend:** React.js
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **External Services:** Payment Gateway (mock integration)
* **Version Control:** GitHub

---

## 🧱 UML Artifacts

| Diagram          | Description                                       | Link         |
| ---------------- | ------------------------------------------------- | ------------ |
| Use Case Diagram | Refined actor relationships and logical flows     | View Diagram |
| Class Diagram    | Improved data modeling and class responsibilities | View Diagram |

---

## 🧠 Improvements Summary

* Removed inappropriate inheritance between Guest and Registered Users.
* Added About Us, Services, and Contact pages for non-registered access.
* Simplified login flow and connections.
* Enhanced Payment Processing with realistic flows and gateway handling.
* Added Analytics and Reporting for WMA with visualization and export options.
* Improved UI with a professional color palette, sidebar navigation, and card views.

---

## 🧾 Use Case Scenarios

| # | Use Case                      | Summary                                                     |
| - | ----------------------------- | ----------------------------------------------------------- |
| 1 | Waste Account & Bin Tracking  | Residents manage smart bins and linked devices.             |
| 2 | Record & Track Collections    | Staff scan bins, record data, and update system analytics.  |
| 3 | Process Billing & Payments    | Residents make payments, handle rebates, and view receipts. |
| 4 | Analyze & Optimize Operations | WMA analyzes reports and monitors overall performance.      |

---

## 💻 Installation Guide

### Prerequisites

* Node.js ≥ 18
* MongoDB (Atlas or local)
* npm or yarn
* Web browser (Chrome/Edge)

### Setup Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/Nisal2522/manage_waste.git
   ```

2. **Backend Setup**

   ```bash
   cd backend
   npm install
   ```

   * Create `.env` file and configure:

     ```
     MONGO_URI=<your_mongodb_connection_string>
     PORT=5000
     ```
   * Run the server:

     ```bash
     npm start
     ```

3. **Frontend Setup**

   ```bash
   cd frontend
   npm install
   npm start
   ```

   * Opens at `http://localhost:3000/`

---

## 🧭 System Pages Overview

| Page               | Description                                                            |
| ------------------ | ---------------------------------------------------------------------- |
| Landing Page       | Introduces EcoSmart with navigation and “Get Started” options.         |
| About Us           | Explains project mission, goals, and sustainability focus.             |
| Services           | Highlights features like Smart Bin Monitoring and Analytics Dashboard. |
| Contact Us         | Allows visitors to send queries or support messages.                   |
| Login/Register     | Handles user authentication and account creation.                      |
| Admin Dashboard    | Displays total waste, users, and system analytics.                     |
| User Management    | Admin controls user accounts and permissions.                          |
| Waste Collection   | Manage routes, bins, and pickup logs.                                  |
| Payments Dashboard | View transactions, revenue, and payment history.                       |

---

## 📸 UI Preview

Screenshots of major pages:

* Landing Page
* About Us
* Services
* Contact
* Login/Register
* Admin Dashboard
* Waste Collection
* Payments

*(Refer to the `screenshots` folder or project documentation.)*

---

## 📊 Future Enhancements

* Mobile App Integration
* Real-time GPS tracking for collection trucks
* AI-powered route optimization
* Citizen feedback & gamification features

---

## 🌐 Repository

* **GitHub Repo:** [https://github.com/Nisal2522/manage_waste](https://github.com/Nisal2522/manage_waste)

---

