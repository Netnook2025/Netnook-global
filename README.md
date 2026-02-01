# NetNook - Global Cache Network

NetNook is an offline-first, decentralized content caching application built with React, TypeScript, and Firebase.

## Features

- **Offline-First:** Works without internet connection using local caching.
- **Global Sync:** Syncs data to a global Firebase node when online.
- **P2P Sharing:** Generate QR codes for local content sharing.
- **Categories:** Education, News, and Entertainment feeds.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/netnook-global-cache.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

Start the development server:

```bash
npm run dev
```

The app will run at `http://localhost:5173`.

### Building for Production

To create a production build:

```bash
npm run build
```

The output will be in the `dist` folder.

## Deployment

This project is configured for deployment on Vercel or Netlify.

- **Vercel:** Simply import the repository and it will detect Vite settings automatically.
- **Netlify:** Drag and drop the `dist` folder or connect to GitHub.
