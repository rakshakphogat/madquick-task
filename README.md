# Madquick Task - Password Manager

A secure password manager application built with Next.js and Node.js featuring user authentication, password generation, and encrypted vault storage.

## Features

- **User Authentication**: Secure login and signup system
- **Password Generator**: Customizable password generation with various options
- **Secure Vault**: Encrypted storage for passwords and sensitive information
- **Clipboard Integration**: Enhanced clipboard functionality with fallbacks
- **Auto-clear**: Passwords automatically cleared from clipboard after 15 seconds
- **Search**: Quick search through vault items
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

### Frontend

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Crypto-JS** - Client-side encryption

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **TypeScript** - Type-safe development
- **JWT** - Authentication tokens

## Project Structure

```
madquick-task/
├── frontend/          # Next.js frontend application
│   ├── app/          # App router pages
│   ├── components/   # Reusable components
│   └── package.json
├── backend/          # Node.js backend API
│   ├── src/
│   │   ├── models/   # Database models
│   │   ├── routes/   # API routes
│   │   └── server.ts # Server entry point
│   └── package.json
└── .gitignore        # Git ignore rules
```

## Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/madquick-password-manager
   JWT_SECRET=your-super-secret-jwt-key-here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features Implemented

### 🔐 Security Features

- Client-side encryption for stored passwords
- JWT-based authentication
- Secure password generation with customizable options
- Auto-clear clipboard functionality

### 🎯 Clipboard Enhancements

- **Fixed NotAllowedError**: Proper permission handling for clipboard API
- **Fallback Support**: Uses `document.execCommand` for older browsers
- **Performance Optimization**: Reduced auto-clear time from 30s to 15s
- **User Feedback**: Visual notifications for copy operations

### 💾 Data Management

- CRUD operations for vault items
- Search functionality across titles, usernames, and URLs
- Encrypted storage of sensitive information

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Vault Management

- `GET /api/vault` - Get user's vault items
- `POST /api/vault` - Create new vault item
- `PUT /api/vault/:id` - Update vault item
- `DELETE /api/vault/:id` - Delete vault item

## Development Notes

### Recent Improvements

- Enhanced clipboard functionality with proper error handling
- Reduced password exposure time by 15 seconds
- Added visual feedback for copy operations
- Implemented fallback methods for better browser compatibility

### Security Considerations

- Environment variables are properly excluded via `.gitignore`
- Passwords are encrypted before storage
- JWT tokens are used for secure authentication
- Auto-clear functionality minimizes clipboard exposure

## Deployment

The application is ready for deployment on platforms like:

- **Frontend**: Vercel, Netlify
- **Backend**: Railway, Render, Heroku
- **Database**: MongoDB Atlas

Make sure to set up environment variables on your chosen platform.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
