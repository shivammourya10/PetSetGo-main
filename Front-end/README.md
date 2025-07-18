# PetSetGo Frontend

A modern frontend application for the PetSetGo pet management platform, featuring pet profiles, adoption services, breeding matching, medical records, community forum, and veterinary articles.

## Features

- 🐾 **Pet Management**: Create and manage detailed pet profiles
- 🏠 **Adoption Platform**: Find pets available for adoption or list your pet
- ❤️ **Pet Breeding**: Match compatible pets for breeding
- 🩺 **Medical Records**: Track your pet's health history and appointments
- 💬 **Community Forum**: Engage with other pet owners in discussions
- 📚 **Veterinary Articles**: Access expert articles on pet care

## Tech Stack

- **React**: UI library for building the user interface
- **Vite**: Fast build tool and development environment
- **Framer Motion**: Advanced animations and transitions
- **React Router**: Client-side routing
- **Axios**: API request handling
- **Tailwind CSS**: Utility-first CSS framework for styling
- **React Icons**: Icon library

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/PetSetGo.git
cd PetSetGo/Front-end
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. The application will be available at `http://localhost:5173`

## Project Structure

```
Front-end/
├── src/
│   ├── assets/         # Images, fonts, and other static files
│   ├── Blocks/         # Animation and UI block components
│   ├── components/     # Reusable UI components
│   ├── context/        # React context providers (Auth, etc.)
│   ├── Pages/          # Application pages
│   ├── services/       # API service integrations
│   ├── App.jsx         # Main application component
│   ├── main.jsx        # Application entry point with routing
│   └── index.css       # Global styles
├── public/             # Public assets
├── package.json        # Project dependencies and scripts
└── vite.config.js      # Vite configuration
```

## Key Pages

- **Login/Register**: User authentication
- **Home**: Dashboard with overview of pets and activities
- **Pets**: Manage your pet profiles
- **Adoption**: Find or list pets for adoption
- **Breeding**: Match pets for breeding
- **Forum**: Community discussions and topics
- **Medical Records**: Track pet health records
- **Articles**: Veterinary articles and resources

## API Integration

The frontend connects to a Node.js/Express backend API. All API calls are organized in service modules:

- `AuthService.js`: User authentication
- `PetService.js`: Pet profile management
- `AdoptionService.js`: Adoption listings and applications
- `BreedingService.js`: Breeding matches and requests
- `ForumService.js`: Community forum posts and comments
- `MedicalService.js`: Medical records and appointments
- `ArticleService.js`: Veterinary articles
  ],
})
 }

 {
    in index.js

# @import "tailwindcss";
 }
 npm run dev 