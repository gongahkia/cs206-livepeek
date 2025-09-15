# LivePeek 🌍

A social language learning platform that helps intermediate to advanced learners immerse themselves in authentic content from around the world. Starting with Japanese and expanding to more languages.

![LivePeek Platform](https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop)

## 🎯 Overview

LivePeek bridges the gap between beginner language apps and native content by providing:

- **Authentic Social Content**: Real posts from social media platforms (Twitter, Reddit, Instagram, LINE, TikTok, Facebook)
- **Interactive Translation**: Tap any word for instant translation and dictionary building
- **Cultural Immersion**: Learn languages through genuine cultural discussions
- **Global Community**: Connect with learners and native speakers worldwide
- **Smart Learning Tools**: AI-powered comment suggestions and personal dictionary

## 🚀 Features

### 🔐 User Authentication
- Professional registration and login system
- Comprehensive user profiles with learning preferences
- Privacy controls and notification settings

### 📱 Interactive Learning
- **Word-Level Translation**: Click any Japanese or English word for instant translation
- **Mixed Language Content**: Intermediate-level posts with hiragana/katakana in Japanese, kanji in English
- **Personal Dictionary**: Save and review vocabulary while learning
- **AI Writing Assistant**: Get comment suggestions from LivePeek AI

### 🌍 Social Features
- **Authentic Posts**: 8 diverse Japanese posts with cultural content
- **Rich Comments**: 10+ comments per post from international learners
- **User Badges**: Language learner levels (Beginner, Intermediate, Advanced, Native)
- **Source Attribution**: Clear badges showing content origin (Twitter, Reddit, etc.)

### 🎓 Onboarding Experience
- Language selection and learning goals
- Interactive translation demo with sliding scale
- Skill level assessment and expectations setting

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Build Tool**: Vite
- **Package Manager**: pnpm

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd livepeek
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

## 🏗️ Build for Production

```bash
# Build the application
pnpm build

# Preview the build
pnpm preview
```

The built files will be in the `dist/` directory.

## 📁 Project Structure

```
livepeek/
├── src/
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── Auth.jsx           # Authentication system
│   │   ├── Onboarding.jsx     # User onboarding flow
│   │   ├── NewsFeed.jsx       # Main content feed
│   │   ├── Profile.jsx        # User profile management
│   │   ├── CommentSystem.jsx  # Language learning comments
│   │   └── EnhancedCommentSystem.jsx
│   ├── App.jsx                # Main application component
│   ├── App.css               # Global styles
│   └── main.jsx              # Application entry point
├── public/                    # Static assets
├── index.html                # HTML template
├── package.json              # Dependencies and scripts
├── vite.config.js            # Vite configuration
├── components.json           # shadcn/ui configuration
└── README.md                 # This file
```

## 🎮 Usage

### For New Users
1. **Register/Login**: Create an account or sign in
2. **Onboarding**: Complete language selection and demo
3. **Explore Content**: Browse authentic Japanese posts
4. **Learn Interactively**: Click words for translation, build your dictionary
5. **Engage**: Comment on posts using AI suggestions and your vocabulary

### For Developers
1. **Component Development**: All UI components are in `src/components/`
2. **Styling**: Uses Tailwind CSS with shadcn/ui components
3. **State Management**: React hooks for local state
4. **Adding Languages**: Extend the platform by adding new language data structures

## 🌟 Key Components

### Authentication (`Auth.jsx`)
- Dual login/registration forms
- Social login integration ready
- Form validation and loading states

### Onboarding (`Onboarding.jsx`)
- 4-step guided setup process
- Interactive translation demo
- Language preference collection

### News Feed (`NewsFeed.jsx`)
- Mixed Japanese/English content
- Source badge system
- Word-level translation functionality

### Profile Management (`Profile.jsx`)
- 4-tab interface (General, Learning, Notifications, Privacy)
- Language learning preferences
- Privacy and notification controls

### Comment System (`EnhancedCommentSystem.jsx`)
- Language learning focused discussions
- Personal dictionary integration
- AI-powered writing assistance

## 🔧 Configuration

### Environment Variables
Currently, the app runs with mock data. For production deployment:

1. Set up news API integration
2. Configure authentication backend
3. Add real translation services
4. Set up user data persistence

### Customization
- **Colors**: Modify Tailwind config for brand colors
- **Languages**: Add new language support in data structures
- **Content**: Update mock data with real API integration

## 🚀 Deployment

The application is designed to be deployed as a static site:

1. **Build the project**: `pnpm build`
2. **Deploy the `dist/` folder** to any static hosting service:
   - Vercel
   - Netlify
   - GitHub Pages
   - AWS S3 + CloudFront

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **shadcn/ui** for beautiful UI components
- **Tailwind CSS** for utility-first styling
- **Lucide** for consistent iconography
- **Unsplash** for high-quality images
- **React community** for excellent tooling and ecosystem

## 🔮 Roadmap

### Phase 1 (Current)
- ✅ Japanese language support
- ✅ Interactive translation
- ✅ Social learning features
- ✅ User authentication

### Phase 2 (Coming Soon)
- 🔄 Korean language support
- 🔄 Real-time translation API
- 🔄 User-generated content
- 🔄 Mobile app development

### Phase 3 (Future)
- 📅 Chinese language support
- 📅 Spanish language support
- 📅 Advanced AI tutoring
- 📅 Live conversation features

---

**LivePeek** - Discover the world through language 🌍✨

For questions or support, please open an issue or contact the development team.

