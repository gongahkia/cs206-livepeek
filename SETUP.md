# LivePeek Setup Guide 🚀

This guide will help you get LivePeek running locally on your machine.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js** (version 18 or higher)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`

- **pnpm** (recommended package manager)
  - Install: `npm install -g pnpm`
  - Verify installation: `pnpm --version`
  - Alternative: You can use `npm` or `yarn` instead

### System Requirements
- **Operating System**: Windows 10+, macOS 10.15+, or Linux
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 500MB free space for dependencies

## 🛠️ Installation Steps

### 1. Download the Project

**Option A: Download ZIP**
1. Download the project ZIP file
2. Extract to your desired location
3. Open terminal/command prompt in the extracted folder

**Option B: Clone Repository (if available)**
```bash
git clone <repository-url>
cd livepeek
```

### 2. Install Dependencies

Navigate to the project directory and install dependencies:

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install

# Or using yarn
yarn install
```

This will install all required packages including:
- React 19
- Vite
- Tailwind CSS
- shadcn/ui components
- Lucide React icons

### 3. Start Development Server

```bash
# Using pnpm
pnpm dev

# Or using npm
npm run dev

# Or using yarn
yarn dev
```

### 4. Open in Browser

Once the server starts, you'll see output like:
```
  VITE v6.3.5  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open your browser and navigate to `http://localhost:5173/`

## 🎯 First Run Experience

### What You'll See
1. **Login/Registration Page**: Create a new account or use any credentials (mock authentication)
2. **Onboarding Flow**: 4-step setup process including language selection
3. **Interactive Demo**: Try the sliding translation feature
4. **Main Application**: Explore Japanese content with interactive features

### Test Account
Since this is a demo version, you can use any credentials:
- **Email**: `test@example.com`
- **Password**: `password123`
- **Name**: `Test User`

## 🔧 Development Commands

### Available Scripts

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Lint code
pnpm lint

# Install new dependencies
pnpm add <package-name>
```

### Hot Reload
The development server supports hot reload - changes to your code will automatically refresh the browser.

## 📁 Project Structure Overview

```
livepeek/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── Auth.jsx        # Login/Registration
│   │   ├── Onboarding.jsx  # User onboarding
│   │   ├── NewsFeed.jsx    # Main content feed
│   │   └── Profile.jsx     # User profile
│   ├── App.jsx             # Main app component
│   └── main.jsx           # Entry point
├── public/                 # Static assets
├── package.json           # Dependencies
└── vite.config.js        # Build configuration
```

## 🎮 Using the Application

### Key Features to Test

1. **Authentication**
   - Try both login and registration flows
   - Test form validation

2. **Onboarding**
   - Complete the 4-step setup
   - Try the interactive translation slider
   - Experiment with different translation levels

3. **Content Feed**
   - Browse Japanese posts with mixed language content
   - Click on any Japanese or English word for translation
   - Try the "Add to Dictionary" feature

4. **Comments System**
   - Click on comment buttons to see language learning discussions
   - Test the AI writing suggestions
   - Browse the personal dictionary

5. **Profile Management**
   - Click your profile avatar to access settings
   - Explore all 4 tabs (General, Learning, Notifications, Privacy)
   - Update your learning preferences

## 🐛 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
Error: Port 5173 is already in use
```
Solution: Use a different port
```bash
pnpm dev --port 3000
```

**Dependencies Installation Failed**
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**Build Errors**
```bash
# Check Node.js version
node --version  # Should be 18+

# Clear build cache
rm -rf dist
pnpm build
```

**Browser Not Opening Automatically**
- Manually navigate to `http://localhost:5173/`
- Check if your firewall is blocking the port

### Performance Issues

**Slow Loading**
- Ensure you have a stable internet connection for image loading
- Try clearing browser cache
- Check if other applications are using system resources

**Memory Issues**
- Close other applications to free up RAM
- Restart the development server: `Ctrl+C` then `pnpm dev`

## 🔧 Customization

### Changing Colors
Edit `src/App.css` or component files to modify the orange/yellow theme.

### Adding Content
Mock data is in the component files. Look for arrays like `japaneseArticles` in `NewsFeed.jsx`.

### Modifying Languages
Update language options in:
- `Onboarding.jsx` (language selection)
- `Profile.jsx` (profile settings)
- `App.jsx` (header dropdown)

## 📱 Mobile Testing

Test responsive design:
1. Open browser developer tools (F12)
2. Toggle device toolbar
3. Test different screen sizes
4. Verify touch interactions work properly

## 🚀 Building for Production

When ready to deploy:

```bash
# Build the application
pnpm build

# The built files will be in the 'dist' folder
# Upload the contents of 'dist' to your web server
```

## 💡 Tips for Development

1. **Use Browser DevTools**: Inspect elements and check console for errors
2. **Component Structure**: Each major feature is a separate component
3. **State Management**: Uses React hooks for local state
4. **Styling**: Tailwind CSS classes for styling
5. **Icons**: Lucide React for consistent iconography

## 🆘 Getting Help

If you encounter issues:

1. **Check the Console**: Open browser DevTools (F12) and look for error messages
2. **Restart the Server**: Stop (`Ctrl+C`) and restart (`pnpm dev`)
3. **Clear Cache**: Clear browser cache and restart
4. **Check Dependencies**: Ensure all packages installed correctly

## 🎉 Success!

If you can see the LivePeek login page and complete the onboarding flow, you're all set! 

Enjoy exploring the language learning platform and feel free to customize it for your needs.

---

**Happy Learning!** 🌍✨

