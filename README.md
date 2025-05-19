# 🎁 GiftListic – Backend

**GiftListic** is a web application for planning festive events with the ability to send personalized invitations and manage wishlists. This repository contains the backend part of the application, built using **NestJS**, **Prisma**, and **PostgreSQL**.

---

## ⚙️ Technologies

- **NestJS** – Node.js server-side framework
- **Prisma ORM** – PostgreSQL database interaction
- **PostgreSQL** – Relational database
- **JWT** – Token-based authentication
- **Google OAuth2** – Google account authentication
- **Argon2** – Password hashing
- **Nodemailer** – Email sending service
- **Swagger** – API documentation generation
- **Jest** – Unit testing
- **TypeScript** – Static typing

---

## 📁 Project Structure

```
src/
├── auth/               # Authentication, JWT, Google OAuth
├── users/              # User registration, updates
├── events/             # Event creation, viewing, editing
├── event-gift/         # Event gifts management
├── mailer/             # Email service (password reset)
├── common/             # DTOs, filters, guards, interceptors
├── prisma/             # PrismaService
├── main.ts             # Entry point
└── app.module.ts       # Root module
```

---

## 🛠️ Setup Instructions

1. **Clone the repository**:

```bash
git clone https://github.com/VladyslavHlushchuk/giftlistic-backend
cd giftlistic-backend
```

2. **Install dependencies**:

```bash
npm install
```

3. **Configure the `.env` file**:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/giftlistic
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=3600s
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FRONTEND_URL=http://localhost:3000
```

4. **Run Prisma migrations**:

```bash
npx prisma migrate dev --name init
```

5. **Start the development server**:

```bash
npm run start:dev
```

---

## 📄 API Documentation

Available after starting the server:

```
http://localhost:3001/api
```

(Generated with Swagger)

---

## ✅ Testing

Unit tests are written using **Jest**:

```bash
npm run test
```

---

## 🧪 Test Coverage

To check code coverage:

```bash
npm run test:cov
```

---

## 📬 Email Functionality

- **Request password reset**: `/auth/forgot-password`
- **Reset password using token**: `/auth/reset-password`
- Emails are sent via **Nodemailer**.

---

## 🔐 Authentication

- Email-based registration and login
- Google OAuth2 login
- Protected routes via `JwtAuthGuard`

---

## 🖼️ Additional Notes

- All DTOs are validated with `class-validator`
- `ConfigService` is used for managing environment configs
- Global error filter handles exceptions

---

## 📚 Author

Developer: Vladyslav Hlushchuk  
Bachelor’s degree project in Software Engineering, 2025

---

## 📌 License

This project is licensed under the MIT License. Free to use under the terms of the license.
>>>>>>> e01d653 (Add unit tests for AuthService, UserService, EventGiftService)
