# 🏦 FinVault - Enterprise Digital Banking System

FinVault is a secure, scalable, and highly available digital banking platform built on a **Microservices Architecture**. It simulates a premium, enterprise-grade banking experience, allowing users to manage accounts, perform secure transactions, track real-time spending limits, and generate official account statements.

![Microservices](https://img.shields.io/badge/Architecture-Microservices-blue)
![Spring Boot](https://img.shields.io/badge/Backend-Spring_Boot_3-6DB33F?logo=spring)
![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?logo=react)
![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?logo=mysql)

---

## ✨ Current Features (Completed)

### 🔐 Security & Identity
* **JWT Authentication:** Stateless, secure token-based login and authorization.
* **Role-Based Access Control (RBAC):** Foundation laid for standard users and future administrative roles.
* **Profile Management:** Secure password updates, profile detail edits, and persistent avatar staging.

### 💳 Core Banking Operations
* **Account Management:** Dynamic dashboard displaying available balances, account numbers, and virtual cards (Debit & Corporate Credit).
* **Transaction Engine:** Support for internal transfers, cash deposits, and ATM-style withdrawals.
* **Real-Time Limit Tracking:** Bulletproof logic to track daily transfer and withdrawal limits based on real-time ledger data.

### 📊 Data & Reporting
* **Ledger History:** Comprehensive, paginated transaction history showing counterparties, amounts, and statuses.
* **Statement Generation:** Client-side PDF generation of official, formatted bank statements using `jsPDF`.
* **Premium Executive UI:** A sleek, responsive, carbon-and-gold themed React frontend designed for high-net-worth individual portals.

---

## 🏗️ System Architecture

FinVault utilizes a distributed microservices architecture to ensure high fault tolerance and independent scaling.

### Project Structure (Directory Mapping)
* 📁 `service-registry`: **Eureka Server** - Acts as the central directory for all microservices to discover each other.
* 📁 `api-gateway`: **Spring Cloud Gateway** - The single entry point for the frontend. Handles CORS, routing, and token validation.
* 📁 `user-service`: Manages user authentication, registration, profiles, and JWT generation.
* 📁 `account-service`: Handles bank account creation, balances, and virtual card linking.
* 📁 `transaction-service`: Processes the core ledger logic (deposits, withdrawals, transfers) with ACID compliance.
* 📁 `notification-service`: *(In Progress)* Designed to handle asynchronous alerts for transactions.
* 📁 `frontend`: The React.js (Vite) client application.

---

## 🛠️ Technology Stack

**Frontend:**
* React.js (Vite)
* Axios (API Client)
* jsPDF & jspdf-autotable (Reporting)

**Backend:**
* Java 21 & Spring Boot 3.x
* Spring Cloud (Netflix Eureka, API Gateway)
* Spring Security (JWT)
* Hibernate / Spring Data JPA

**Infrastructure & Database:**
* MySQL (Database-per-service pattern)
* Docker & Docker Compose (Containerization)

---

## 🚀 Future Roadmap (Upcoming Features)

We are actively expanding FinVault to include advanced, industry-grade financial technologies:

1. **Event-Driven Architecture:** Implementing **Apache Kafka / RabbitMQ** to decouple the `transaction-service` and `notification-service` for asynchronous email/SMS alerts.
2. **Financial Analytics:** Adding interactive pie charts and bar graphs (via Recharts) to the dashboard for visual spending insights.
3. **Anti-Fraud & Rate Limiting:** Integrating **Redis** to automatically freeze accounts if suspicious velocity (e.g., 5 transfers in 10 seconds) is detected.
4. **Admin God-Mode Portal:** Building a dedicated frontend route for bank administrators to monitor total systemic liquidity and freeze/unfreeze compromised accounts.
5. **Distributed Tracing:** Adding **Zipkin and Micrometer** to trace individual transaction lifecycles across multiple microservices.

---

## ⚙️ Local Development Setup

To run FinVault locally, follow these steps to configure the databases, boot up the microservices in the correct sequence, and launch the frontend.

### Prerequisites
* **Java 21** or higher
* **Node.js** (v18+) & npm
* **MySQL** Server (Running locally on port 3306)
* **Maven** (For building backend services)

### Step 1: Database Configuration
FinVault uses a "Database-per-service" architecture. You need to create separate schemas in your local MySQL instance.

1. Open your MySQL client (e.g., MySQL Workbench) and run the following commands:
   ```sql
   CREATE DATABASE finvault_user_db;
   CREATE DATABASE finvault_account_db;
   CREATE DATABASE finvault_transaction_db;
   
2.Update the src/main/resources/application.properties (or .yml) in each microservice (user-service, account-service, transaction-service) with your local MySQL username and password.

### Step 2: Booting the Backend Microservices
1. Service Registry (Eureka): 
   Navigate to the service-registry directory and start it first. This runs on port 8761. All other services will register here.
   ```
   cd service-registry
   mvn spring-boot:run
2. API Gateway:
   Navigate to api-gateway and start it. This runs on port 8080 (or your configured port) and routes frontend traffic to the correct microservice.
   ```
   cd ../api-gateway
   mvn spring-boot:run
3. Core Services:
   Start the remaining microservices in separate terminal windows (or via your IDE's Run dashboard).
   ```
   cd ../user-service && mvn spring-boot:run
   cd ../account-service && mvn spring-boot:run
   cd ../transaction-service && mvn spring-boot:run

### Step 3: Launching the React Frontend
Once the backend gateway and core services are running, you can start the client application.

1. Open a new terminal and navigate to the frontend directory.

2. Install the necessary dependencies:

   ```
   cd frontend
   npm install
3. Start the Vite development server:
   ```
   npm run dev
   
4. Open your browser and navigate to the URL provided in the terminal (usually http://localhost:5173).