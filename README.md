# SimpleShop - React E-commerce Web App

A modern, scalable, and performant React e-commerce web application built with TypeScript, Vite, and Tailwind CSS. Features both customer-facing shopping experience and admin dashboard for order and product management.

## 🚀 Features

### Customer Features
- **Product Catalog**: Browse and search products with pagination
- **Product Details**: Detailed product view with image gallery
- **Shopping Cart**: Add/remove items, quantity management
- **Order Placement**: Secure checkout with customer information
- **Responsive Design**: Mobile-first, elegant UI

### Admin Features
- **Dashboard**: Real-time statistics and analytics
- **Order Management**: View, filter, and update order status
- **Product Management**: CRUD operations for products
- **Authentication**: Secure JWT-based admin login
- **Responsive Admin Panel**: Mobile-friendly admin interface

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Query + Context API
- **Routing**: React Router v6
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Build Tool**: Vite

## ⚙️ Environment Variables

The application supports customization through environment variables:

### Required Variables
- `VITE_API_BASE_URL` - Backend API base URL

### Optional Variables
- `VITE_SITE_NAME` - Website name (default: "Shop 506")
- `VITE_SITE_DESCRIPTION` - Website description (default: "Online Store")

### Example Environment Files
- Copy `env.example` to `.env` for development
- Copy `env.production.example` to `.env.production` for production
- **Linting**: ESLint + TypeScript ESLint

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd onlineshop-react-web-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your API configuration:
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   VITE_APP_NAME=SimpleShop
   VITE_APP_VERSION=1.0.0
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components (Button, Input, Card, etc.)
│   ├── layout/         # Layout components (Header, Layout)
│   ├── products/       # Product-related components
│   ├── cart/           # Shopping cart components
│   ├── admin/          # Admin dashboard components
│   └── auth/           # Authentication components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── services/           # API service layer
├── types/              # TypeScript type definitions
├── App.tsx             # Main App component
└── main.tsx            # Application entry point
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🎨 Design System

The application uses a custom design system built on Tailwind CSS with:

- **Color Palette**: Primary, secondary, success, warning, and error colors
- **Typography**: Inter font family with consistent sizing
- **Components**: Reusable UI components with consistent styling
- **Animations**: Smooth transitions and hover effects
- **Responsive**: Mobile-first design approach

## 🔐 Authentication

The admin panel uses JWT-based authentication:

- **Login**: Username/password authentication
- **Token Storage**: Secure localStorage with automatic cleanup
- **Protected Routes**: Route protection for admin areas
- **Auto-logout**: Automatic logout on token expiration

## 📱 API Integration

The app integrates with a REST API supporting:

- **Products**: CRUD operations with pagination and search
- **Orders**: Order creation and management
- **Authentication**: JWT token-based auth
- **Dashboard**: Real-time statistics

## 🚀 Performance Features

- **Code Splitting**: Automatic code splitting with Vite
- **Lazy Loading**: Route-based lazy loading
- **Image Optimization**: Optimized product images
- **Caching**: React Query for intelligent data caching
- **Bundle Optimization**: Tree shaking and minification

## 🔒 Security Features

- **Input Validation**: Form validation with React Hook Form
- **XSS Protection**: Sanitized user inputs
- **CSRF Protection**: Token-based request validation
- **Secure Storage**: Proper token storage and cleanup
- **Error Handling**: Comprehensive error boundaries

## 📱 Responsive Design

- **Mobile First**: Designed for mobile devices first
- **Breakpoints**: sm, md, lg, xl responsive breakpoints
- **Touch Friendly**: Optimized for touch interactions
- **Cross Browser**: Compatible with modern browsers

## 🧪 Development

### Code Quality
- **TypeScript**: Full type safety
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting (recommended)
- **Husky**: Git hooks for quality checks (optional)

### Testing
- **Unit Tests**: Component testing (to be implemented)
- **Integration Tests**: API integration testing (to be implemented)
- **E2E Tests**: End-to-end testing (to be implemented)

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support, email support@simpleshop.com or create an issue in the repository.

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**
