# 🌊 MissingTube - YouTube Playlist Analyzer

<div align="center">

![MissingTube Banner](https://via.placeholder.com/800x400/0ea5e9/ffffff?text=MissingTube+-+YouTube+Playlist+Analyzer)

[![PWA](https://img.shields.io/badge/PWA-enabled-blue.svg)](https://web.dev/progressive-web-apps/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

**A modern, feature-rich Progressive Web App for analyzing YouTube playlists and recovering missing video titles**

[🚀 Live Demo](https://missingtube.app) • [📱 Install as PWA](#-pwa-installation) • [🔧 Getting Started](#-getting-started) • [📖 Documentation](#-features)

</div>

## ✨ Features

### 🎯 Core Functionality
- **📊 Comprehensive Playlist Analysis** - Get detailed insights into your YouTube playlists
- **🔍 Missing Video Recovery** - Identify and recover titles of unavailable/deleted videos
- **📱 Grid & Table Views** - Switch between beautiful card layouts and detailed table views
- **🔄 Smart Filtering** - Filter by available, unavailable, or all videos
- **📋 Backup & Restore** - Export your playlist data and import previous backups
- **🔗 Multi-Platform Search** - Search for missing videos across Internet Archive, Brave, Twitter, and Reddit

### 🎨 Design & User Experience
- **🌊 Beautiful Ocean Theme** - Stunning animated gradients with floating flares and sparkles
- **🌓 Dark/Light Mode** - Automatic system detection with manual override
- **📱 Responsive Design** - Perfect experience on mobile, tablet, and desktop
- **♿ Accessibility First** - Built with Material Design 3 principles
- **⚡ Smooth Animations** - Delightful micro-interactions and transitions
- **🎭 Progressive Web App** - Install on any device for native-like experience

### 🔧 Technical Features
- **🔐 Secure API Key Management** - Encrypted local storage of YouTube API credentials
- **💾 Smart Caching** - Offline support with service worker implementation
- **📈 Real-time Statistics** - Live playlist analytics and insights
- **🔄 File Comparison** - Compare current playlist with backup files
- **📱 Install Prompts** - Smart PWA installation suggestions
- **🎯 Performance Optimized** - Fast loading with code splitting and lazy loading

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- YouTube Data API v3 key ([Get it here](https://developers.google.com/youtube/v3/getting-started))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/missingtube.git
   cd missingtube
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

### Building for Production

```bash
# Build the app
npm run build

# Preview the build
npm run preview
```

## 📱 PWA Installation

MissingTube can be installed as a Progressive Web App on any device:

### Desktop (Chrome, Edge, Safari)
1. Visit the website
2. Look for the install icon in the address bar
3. Click "Install MissingTube"
4. The app will appear in your applications folder

### Mobile (iOS/Android)
1. Open the website in your browser
2. Tap the share button
3. Select "Add to Home Screen"
4. The app will appear on your home screen

### Features When Installed
- **📱 Native-like experience** - Runs in its own window
- **⚡ Faster loading** - Cached resources load instantly
- **🔄 Offline support** - Basic functionality works without internet
- **📬 Push notifications** - Get updates about new features (coming soon)

## 🎯 How to Use

### 1. Configure API Key
- Click the "API Key" button in the navigation
- Enter your YouTube Data API v3 key
- The key is encrypted and stored locally

### 2. Analyze a Playlist
- Paste any YouTube playlist URL or ID
- Click "Analyze Playlist"
- Wait for the analysis to complete

### 3. Explore Results
- View playlist statistics and insights
- Switch between grid and table views
- Filter by video availability
- Search for missing videos using external platforms

### 4. Backup & Compare
- Download your playlist data as JSON
- Compare with previous backups to find recovered titles
- Merge data from multiple sources

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Material Design 3** - Google's latest design system
- **Lucide React** - Beautiful, customizable icons

### PWA Features
- **Service Worker** - Offline support and caching
- **Web App Manifest** - Native app-like installation
- **Background Sync** - Data synchronization when back online
- **Cache API** - Smart resource caching strategy

### Build Tools
- **Vite** - Fast build tool and development server
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing and optimization

### APIs & Services
- **YouTube Data API v3** - Playlist and video information
- **Web APIs** - Fetch, Cache, Service Worker, Intersection Observer

## 🎨 Customization

### Color Scheme
The app uses a beautiful ocean-inspired color palette. To customize:

1. Edit `src/index.css` CSS variables:
   ```css
   :root {
     --md-sys-color-primary: 14 165 233; /* Sky Blue */
     --md-sys-color-secondary: 6 182 212; /* Cyan */
     --md-sys-color-tertiary: 16 185 129; /* Emerald */
   }
   ```

2. Update `tailwind.config.js` for additional customizations

### Background Effects
The animated background can be customized in `src/index.css`:
- `oceanGradient` animation for the main gradient
- `floatingFlares` for the floating light effects
- `sparkles` for the twinkling stars

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for local development:

```env
VITE_APP_NAME=MissingTube
VITE_APP_VERSION=1.0.0
VITE_APP_URL=https://missingtube.app
```

### PWA Manifest
Edit `public/manifest.json` to customize:
- App name and description
- Icons and screenshots
- Theme colors
- Display mode
- Shortcuts

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Use TypeScript for all new code
- Follow the existing code style
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google** - For the YouTube Data API and Material Design
- **Tailwind Labs** - For the amazing Tailwind CSS framework
- **Lucide** - For the beautiful icon library
- **The React Team** - For the incredible React framework
- **All Contributors** - Thank you for making this project better!

## 🔗 Links

- **Website**: [https://missingtube.app](https://missingtube.app)
- **Documentation**: [Wiki](https://github.com/yourusername/missingtube/wiki)
- **Bug Reports**: [Issues](https://github.com/yourusername/missingtube/issues)
- **Feature Requests**: [Discussions](https://github.com/yourusername/missingtube/discussions)

## 📊 Statistics

- ⭐ **Stars**: Help us grow by starring the repo!
- 🍴 **Forks**: See all the amazing forks
- 🐛 **Issues**: Check current issues and help fix them
- 📈 **Contributors**: Join our amazing community

---

<div align="center">
  <p>Made with ❤️ by the MissingTube team</p>
  <p>
    <a href="https://github.com/yourusername/missingtube/stargazers">⭐ Star us on GitHub</a> •
    <a href="https://twitter.com/missingtube">🐦 Follow on Twitter</a> •
    <a href="https://discord.gg/missingtube">💬 Join Discord</a>
  </p>
</div>