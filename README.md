# Team Health Check Application

A web application for conducting team health assessments based on Google's research on successful teams. Evaluate your team across four key dimensions: Psychological Safety, Dependability, Structure & Clarity, and Meaning & Impact.

## Features

- **Team Management**: Create and manage teams
- **Health Assessments**: Conduct comprehensive team health evaluations
- **Results Dashboard**: View team performance metrics and insights
- **Anonymous Feedback**: Support for confidential team assessments
- **Action Items**: Get recommendations for team improvement

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development and building
- React Router for navigation
- Modern CSS with responsive design

### Backend
- FastAPI (Python)
- SQLAlchemy ORM
- SQLite database
- CORS enabled for frontend integration

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd teamhealthcheck-app
```

2. Set up the backend:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Set up the frontend:
```bash
cd ../frontend
npm install
```

### Running the Application

1. Start the backend server:
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python seed_data.py  # Seed the database with questions
python main.py
```
The API will be available at `http://localhost:8000`

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```
The application will be available at `http://localhost:5173`

### API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation.

## Usage

1. **Create a Team**: Start by creating a team with a name and description
2. **Conduct Assessment**: Team members take individual assessments answering questions across four categories
3. **View Results**: See aggregated team scores and personalized improvement recommendations
4. **Track Progress**: Conduct regular assessments to monitor team health over time

## Assessment Categories

### 1. Psychological Safety
Can team members take risks and be vulnerable without feeling insecure or embarrassed?

### 2. Dependability
Can team members count on each other to do high quality work on time?

### 3. Structure & Clarity
Are goals, roles, and execution plans clear to everyone on the team?

### 4. Meaning & Impact
Does the work have personal meaning and create positive impact?

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

Based on research from Google's Project Aristotle on what makes teams effective.