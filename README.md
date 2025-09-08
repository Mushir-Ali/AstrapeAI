
# AstrapeAI

Astrape AI – Your Smart Shopping Companion

Astrape AI helps you shop smarter and easier. It gives you personalized product suggestions based on your tastes, finds the best deals, and makes online shopping faster and more convenient.

With Astrape AI, you can:

Discover products you’ll love.

Compare prices and get the best deals.


Enjoy a smooth, simple shopping experience all in one place.

Astrape AI is like having a personal shopping assistant that makes sure you get the most out of every purchase


## Features
- User Authentication

- Sign up with name, email, password

- Login with email and password

- JWT-based authentication.
## Admin and User roles

- Default User Role

When a new account is created, it is automatically assigned a default role, usually user.

This ensures that every regular user has basic access rights without any special privileges.

To check one such accout ( ID = user@gmail.com , Password = 123456)

- Admin Role via Database

Administrators are not assigned by default; instead, their role is set manually in the database.

This can be done by updating a specific field in the user table, e.g., role = 'admin'.

To check one such accout ( ID = admin@gmail.com , Password = 123456)
## Deployment

The live project is deployed on https://astrapeai-frontend.onrender.com/

## Tech Stack

- Frontend: React, React Router, Tailwind CSS, Lucide Icons, react-hot-toast

- Backend: Node.js, Express.js, MongoDB, Mongoose

- Authentication: JWT (JSON Web Token)
## Backend

Install my-project with npm

```bash
  git clone <your-repo-url>
  cd backend

  npm install
```
    
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MONGO_URI=<your-mongodb-uri>`

`JWT_SECRET=<your-secret-key>`

`PORT=3000`

`Cloudinary_secret`

`Cloudinary_name`

`Cloudinary_api`

## Start backend server

Run backend server by this command

```bash
  nodemon server.js
```

## Frontend

Run frontend server by this command

```bash
  npm run dev
```

