# Travel Guide

A modern, responsive, and dynamic Travel Guide application built with React, vite and Tailwind CSS. Explore countries, cities, and attractions with interactive maps and curated collections.

## Features

-   **Dynamic Routing**: Seamless navigation between countries, cities, and attractions.
-   **Interactive Maps**: Integrated Leaflet maps with clustering for exploring destinations.
-   **Search & Discovery**: Powerful search functionality and curated "Explore by Interest" collections.
-   **Wishlist**: Save your favorite destinations for later.
-   **Responsive Design**: Fully optimized for mobile, tablet, and desktop devices.
-   **Modern UI**: Premium aesthetic with smooth animations, glassmorphism, and dark mode support.
-   **Data Driven**: Centralized data management for countries, cities, and attractions.

## Tech Stack

-   **Framework**: [React 19](https://react.dev/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
-   **Routing**: [React Router 7](https://reactrouter.com/)
-   **Maps**: [Leaflet](https://leafletjs.com/) & [React Leaflet](https://react-leaflet.js.org/)
-   **Icons**: [Remix Icon](https://remixicon.com/)
-   **Carousel**: [Swiper](https://swiperjs.com/)
-   **Fonts**: [DM Sans](https://fontsource.org/fonts/dm-sans) & [Playfair Display](https://fontsource.org/fonts/playfair-display)

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (Latest LTS recommended)
-   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/travel-guide.git
    cd travel-guide
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Running Locally

Start the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

-   `npm run dev`: Starts the development server.
-   `npm run build`: Builds the app for production.
-   `npm run preview`: Previews the production build locally.
-   `npm run lint`: Runs ESLint to check for code quality issues.

## Project Structure

```
src/
├── api/            # API simulation and data fetching
├── assets/         # Static assets (images, icons)
├── components/     # Reusable UI components
├── context/        # React Context (e.g., Global State)
├── data/           # Static data files
├── pages/          # Application pages (Home, Country, City, etc.)
└── main.jsx        # Entry point
```

## License

This project is licensed under the MIT License.
