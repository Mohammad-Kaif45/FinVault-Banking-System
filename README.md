# 🏦 FinVault | Secure Enterprise Digital Banking

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen.svg?logo=springboot)
![React](https://img.shields.io/badge/React-18.x-blue.svg?logo=react)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg?logo=mysql)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

> A highly scalable, distributed digital banking platform built with a microservices architecture. FinVault provides secure user authentication, real-time transaction processing, interactive virtual cards, and automated statement generation.

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/2c89db89-60a1-4139-8c39-5b13782c3782" />


---

## ✨ Core Features

* **Distributed Microservices Architecture:** Independent services for Users, Accounts, and Transactions, orchestrated via an API Gateway and Netflix Eureka Service Registry.
* **Secure Authentication:** JWT-based stateless authentication and authorization with role-based access control.
* **Real-Time Ledger System:** Instantly process deposits, withdrawals, and peer-to-peer transfers with ACID compliance.
* **Interactive Virtual Cards:** Hardware-accelerated 3D flipping UI for virtual debit and corporate credit cards.
* **Dynamic Daily Limits:** Real-time tracking of daily transfer (₹5,00,000) and withdrawal (₹1,00,000) limits based on the daily transaction array.
* **Automated Statement Generation:** One-click PDF generation for official account statements using `jsPDF` and `autoTable`.

---

## 🛠️ Technology Stack

### Frontend
* **Framework:** React.js (Vite)
* **Styling:** Pure Inline Styles / CSS3 (Custom Corporate Theme)
* **HTTP Client:** Axios
* **Utilities:** jsPDF (Document Generation)

### Backend
* **Core:** Java 17, Spring Boot 3.x
* **Architecture:** Spring Cloud (API Gateway, Netflix Eureka)
* **Security:** Spring Security, JSON Web Tokens (JWT)
* **Database:** MySQL (Separate databases per microservice)
* **ORM:** Spring Data JPA / Hibernate

---

## 🏗️ System Architecture



The backend operates on a strict microservices design pattern:
1. **Service Registry (`port 8761`):** Netflix Eureka server tracking all live instances.
2. **API Gateway (`port 8080`):** Single entry point routing requests to appropriate services.
3. **User Service (`port 8082`):** Handles JWT generation, registration, and user profiles.
4. **Account Service (`port 8085`):** Manages account balances, types, and virtual card generation.
5. **Transaction Service (`port 8081`):** Immutable ledger for transfers, deposits, and withdrawals.

---

## 📸 Application Gallery

| User Dashboard | Interactive Virtual Card |
| :---: | :---: |
| <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/e4b44b86-044f-40d9-8491-16272ae51c07" />
 |
| <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/13b1e36d-9d13-4492-840b-73a436b0191e" />
 |

| Security & Profile | PDF Statement Generation |
| :---: | :---: |
| ![Profile](docs/profile-placeholder.png) | ![PDF](docs/pdf-placeholder.png) |
| *Live daily limits, active sessions, and password management.* | *Automated, branded PDF statements.* |

---

## 🚀 Getting Started (Local Development)

### Prerequisites
* Java Development Kit (JDK) 17+
* Node.js (v18+) and npm
* MySQL Server (Running on default port 3306)
* Maven

### 1. Database Setup
Ensure MySQL is running and execute the following to create the isolated microservice databases:
```sql
CREATE DATABASE finvault_user_db;
CREATE DATABASE finvault_account_db;
CREATE DATABASE finvault_transaction_db;
