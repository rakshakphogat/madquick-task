# Madquick Task - Password Manager

A secure password manager application built with Next.js featuring user authentication, password generation, and encrypted vault storage.

## 🔗 Repository

**GitHub**: [https://github.com/rakshakphogat/madquick-task](https://github.com/rakshakphogat/madquick-task)

## Features

- **User Authentication**: Secure login and signup system with JWT tokens
- **Password Generator**: Customizable password generation with various options
- **Secure Vault**: Client-side encrypted storage for passwords and sensitive information
- **Clipboard Integration**: Enhanced clipboard functionality with fallbacks
- **Auto-clear**: Passwords automatically cleared from clipboard after 15 seconds
- **Search**: Quick search through vault items
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

- **Next.js 15** - Full-stack React framework with App Router and API routes
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication tokens with HTTP-only cookies
- **Crypto-JS** - Client-side AES encryption for password storage
- **bcrypt** - Server-side password hashing

## 🔐 Encryption & Security

**Client-Side Encryption**: We use **Crypto-JS AES encryption** to encrypt passwords before storing them in the database. This ensures that even if the database is compromised, stored passwords remain encrypted and unreadable. The encryption happens in the browser using a master key, providing an additional layer of security beyond server-side protections.

## Project Structure

```
madquick-task/
├── my-app/                 # Next.js full-stack application
│   ├── app/               # App router pages and API routes
│   │   ├── api/          # Serverless API endpoints
│   │   │   ├── auth/     # Authentication routes
│   │   │   └── vault/    # Vault management routes
│   │   ├── auth/         # Authentication pages
│   │   ├── dashboard/    # Dashboard page
│   │   └── page.tsx      # Main application
│   ├── lib/              # Utility functions
│   │   ├── auth.ts       # JWT authentication
│   │   └── mongodb.ts    # Database connection
│   ├── models/           # MongoDB models
│   │   ├── User.ts       # User model
│   │   └── VaultItem.ts  # Vault item model
│   └── package.json
└── README.md
```

## Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Quick Start

1. **Clone the repository**:

   ```bash
   git clone https://github.com/rakshakphogat/madquick-task.git
   cd madquick-task
   ```

2. **Navigate to the application directory**:

   ```bash
   cd my-app
   ```

3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Create environment file**:
   Create a `.env` file in the `my-app` directory:

   ```env
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/password-manager
   JWT_SECRET=your-super-secret-jwt-key-change--this-in-production
   NODE_ENV=development
   ```

5. **Start the development server**:

   ```bash
   npm run dev
   ```

6. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## Features Implemented

### 🔐 Security Features

- **Client-side AES encryption** for stored passwords using Crypto-JS
- **JWT-based authentication** with HTTP-only cookies
- **bcrypt password hashing** for user account passwords
- **Secure password generation** with customizable options
- **Auto-clear clipboard functionality** (15-second timeout)

### 🎯 Clipboard Enhancements

- **Fixed NotAllowedError**: Proper permission handling for clipboard API
- **Fallback Support**: Uses `document.execCommand` for older browsers
- **Performance Optimization**: Reduced auto-clear time from 30s to 15s
- **User Feedback**: Visual notifications for copy operations

### 💾 Data Management

- CRUD operations for vault items
- Search functionality across titles, usernames, and URLs
- Client-side encrypted storage of sensitive information
- Real-time data synchronization

### 🚀 Architecture

- **Serverless API Routes**: Next.js API routes for seamless deployment
- **MongoDB Connection Pooling**: Optimized for serverless environments
- **Full-stack TypeScript**: End-to-end type safety

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

- **Complete Architecture Migration**: Migrated from Express.js to Next.js API routes for better Vercel compatibility
- **Enhanced clipboard functionality** with proper error handling and fallbacks
- **Reduced password exposure time** by 15 seconds (from 30s to 15s)
- **Added visual feedback** for copy operations
- **Implemented fallback methods** for better browser compatibility
- **Fixed Vercel deployment issues** by using serverless architecture

### Security Considerations

- **Environment variables** are properly excluded via `.gitignore`
- **Client-side password encryption** using AES before database storage
- **JWT tokens** stored in HTTP-only cookies for security
- **Auto-clear functionality** minimizes clipboard exposure
- **bcrypt hashing** for user authentication passwords

### Crypto Implementation Details

**Why Crypto-JS AES Encryption?**
We implemented client-side AES encryption using Crypto-JS to ensure that sensitive passwords are encrypted before being sent to the server. This adds an extra security layer - even if someone gains access to the database or intercepts network traffic, the stored passwords remain encrypted and unreadable without the encryption key.

## Deployment

The application is designed for **Vercel deployment** with serverless architecture:

- **Vercel**: Optimal deployment platform (recommended)
- **Netlify**: Alternative deployment option
- **Database**: MongoDB Atlas (cloud)

### Vercel Deployment Steps

1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Set environment variables in Vercel dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
4. Deploy automatically on push

### Environment Variables Required

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=production
```

## Technology Choices & Implementation

### Why Next.js Full-Stack?

- **Serverless Architecture**: Perfect for Vercel deployment, eliminates server management
- **API Routes**: Built-in serverless functions replace traditional Express.js backend
- **Performance**: Optimized builds, automatic code splitting, and edge functions
- **TypeScript Integration**: Seamless full-stack type safety

### Why Crypto-JS for Client-Side Encryption?

- **Zero-Trust Security**: Passwords encrypted before leaving the browser
- **AES-256 Encryption**: Industry-standard encryption algorithm
- **Browser Compatibility**: Works across all modern browsers
- **Lightweight**: Minimal bundle size impact

### Why MongoDB with Mongoose?

- **Flexible Schema**: Easy to modify data structures as features evolve
- **Serverless Friendly**: Connection pooling optimized for serverless functions
- **Atlas Integration**: Seamless cloud deployment and scaling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
