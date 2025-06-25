import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './components/Home'
import TeamList from './components/TeamList'
import Assessment from './components/Assessment'
import Results from './components/Results'
import Navigation from './components/Navigation'

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/teams" element={<TeamList />} />
            <Route path="/assessment/:teamId" element={<Assessment />} />
            <Route path="/results/:teamId" element={<Results />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
