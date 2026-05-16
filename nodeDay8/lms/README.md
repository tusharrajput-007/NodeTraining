# Library Management System (LMS)

A server-side rendered web application built with Node.js, Express, EJS and MySQL.

---

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MySQL, Sequelize ORM
- **Templating:** EJS, express-ejs-layouts
- **Auth:** JWT, bcryptjs, Passport.js (Google OAuth)
- **File Upload:** Multer
- **Email:** Nodemailer
- **Logging:** Winston, Morgan
- **Security:** Helmet, express-rate-limit, hpp

---

## Features

- Login with email/password or Google OAuth
- JWT authorization with httpOnly cookies
- Book management (add, edit, soft delete, image upload/download)
- Student management (add, delete)
- Issue management (issue book, return book)
- Email notification on adding a book
- Master layout with EJS partials
- Client and server side validation
- Flash success/error messages
- Winston + Morgan logging

---

## Pages

### Login (`/`)

- Login with email and password
- Login with Google OAuth
- Client side validation on form fields

### Book List (`/books`)

- Displays all active books in a searchable, paginated table
- Add Book button to navigate to add book form
- Edit and Delete actions on each book row
- Book image shown in first column with download on click
- Success/error flash messages

### Add Book (`/books/add`)

- Form to add a new book with book name, author name, ISBN and image upload
- Client and server side validation
- Duplicate ISBN check
- Sends email notification with book details and image on successful add

### Edit Book (`/books/edit/:id`)

- Pre-filled form with existing book details
- Option to update image or keep existing
- Duplicate ISBN check excluding current book

### Student List (`/students`)

- Displays all students in a searchable, paginated table
- Add Student button to navigate to add student form
- Delete action on each student row
- Success/error flash messages

### Add Student (`/students/add`)

- Form to add a new student with name, roll number, phone, country, state and city
- Client and server side validation
- Duplicate roll number check

### Issue List (`/issues`)

- Displays all issued books with book name, student name, issue date, return date and status
- Issue Book button to navigate to issue book form
- Return button shown for books with issued status
- Success/error flash messages

### Issue Book (`/issues/add`)

- Dropdown to select book and student
- Duplicate issue check (same book cannot be issued twice)
- Client and server side validation

---

## Getting Started

**1. Clone the repository:**

```bash
git clone <your-repo-url>
cd lms
```

**2. Install dependencies:**

```bash
npm install
```

**3. Set up environment variables:**

```bash
cp .env.example .env
```

Fill in all values in `.env`

**4. Create the database:**

```sql
CREATE DATABASE lms;
```

Sequelize will auto-create all tables on server start.

**5. Create admin user:**

```bash
node scripts/hashPassword.js yourpassword
```

Copy the hash and insert in MySQL:

```sql
INSERT INTO users (first_name, last_name, email, username, password, created_at, modified_at)
VALUES ('Admin', 'User', 'admin@lms.com', 'admin', 'paste_hash_here', NOW(), NOW());
```

**6. Run the app:**

```bash
npm run dev
```

Open `http://localhost:3000`

---

## Environment Variables

See `.env.example` for all required variables.
