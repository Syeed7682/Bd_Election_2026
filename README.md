# 🇧🇩 Bangladesh Election 2026 Live Dashboard

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=Leaflet&logoColor=white)

A high-fidelity, real-time electoral analytics platform designed for the 2026 Bangladesh National Elections. This dashboard integrates granular constituency-level data with advanced machine learning models to provide deep insights into voting patterns, party performance, and constitutional reform sentiment.

## 🌟 Key Features

### 1. **National Results Center**
- **Dynamic KPI Cards**: Real-time tracking of seat declarations, majority thresholds, and voter turnout.
- **Seat Share Visualization**: Interactive semi-donut charts showing alliance distributions and majority status.
- **Breaking News Ticker**: A high-impact, animated ticker for live election updates.

### 2. **Interactive Electoral Map**
- **Constituency-Level Detail**: High-resolution Leaflet map with interactive polygons for all administrative divisions.
- **Division Drill-down**: Detailed statistics for Rajshahi, Dhaka, Chittagong, and other key electoral regions.
- **Constituency Explorer**: Searchable and sortable data grid for individual constituency results and candidate performance.

### 3. **Machine Learning & Analysis**
- **Outcome Prediction**: Predictive modeling for BNP vs. Jamaat-e-Islami performance using Logistic Regression, Random Forest, and Decision Trees.
- **K-Means Clustering**: Socio-economic profiling of constituencies into distinct clusters based on literacy, poverty, and turnout.
- **Feature Importance**: Analytical breakdown of the strongest predictors for electoral outcomes (e.g., Margin of Victory, Voter Density).

### 4. **Gonovote 2026 (Referendum)**
- **Constitutional Reform Analytics**: Specialized tracking of the 2026 national referendum results.
- **Demographic Breakdown**: Insights into voting patterns across male, female, and transgender populations.

## 🚀 Technology Stack

- **Core**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS (v4) with custom premium dark-theme design system.
- **Animations**: Framer Motion for smooth transitions and interactive micro-animations.
- **Data Visualization**: 
  - **Recharts**: For complex bar charts, pie charts, and trend analysis.
  - **Leaflet**: For geospatial constituency mapping.
- **Icons**: Lucide React for consistent, high-quality iconography.
- **ML Analysis**: Python-based preprocessing and modeling (Random Forest, K-Means).

## 📂 Project Structure

```bash
├── BD_Election2026_Analysis/  # ML Submodule (Python/Notebooks)
├── src/
│   ├── components/            # UI Components (Map, Explorer, KPI Boxes)
│   ├── data/                  # Electoral data (CSV, JSON, TS constants)
│   ├── lib/                   # Utility functions (cn, tailwind-merge)
│   └── App.tsx                # Main Application Shell & Routing
├── netlify.toml               # Deployment configuration
└── package.json               # Dependencies & Scripts
```

## 🛠️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Syeed7682/Bd_Election_2026.git
   cd bangladesh-election-2026-live-dashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Initialize submodules**:
   ```bash
   git submodule update --init --recursive
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```

## 📊 Machine Learning Model Performance

The latest classification models predict constituency outcomes with high accuracy:
- **Random Forest**: 78.00% Accuracy | 0.8607 AUC-ROC
- **Logistic Regression**: 78.00% Accuracy | 0.8399 AUC-ROC
- **Decision Tree**: 68.00% Accuracy | 0.6736 AUC-ROC

## 📜 License

This project is licensed under the Apache-2.0 License.

---
*Disclaimer: This dashboard is a data visualization project and uses modeled data for analytical purposes based on the 2026 electoral landscape.*
