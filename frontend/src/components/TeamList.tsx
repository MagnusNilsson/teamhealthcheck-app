import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface Team {
  id: number
  name: string
  description: string
  created_at: string
}

const TeamList = () => {
  const [teams, setTeams] = useState<Team[]>([])
  const [showForm, setShowForm] = useState(false)
  const [newTeam, setNewTeam] = useState({ name: '', description: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    try {
      const response = await fetch('http://localhost:8000/teams/')
      const data = await response.json()
      setTeams(data)
    } catch (error) {
      console.error('Error fetching teams:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:8000/teams/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTeam),
      })
      
      if (response.ok) {
        setNewTeam({ name: '', description: '' })
        setShowForm(false)
        fetchTeams()
      }
    } catch (error) {
      console.error('Error creating team:', error)
    }
  }

  if (loading) {
    return <div className="loading">Loading teams...</div>
  }

  return (
    <div className="team-list">
      <div className="header">
        <h1>Teams</h1>
        <button 
          className="btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add Team'}
        </button>
      </div>

      {showForm && (
        <form className="team-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Team Name</label>
            <input
              type="text"
              id="name"
              required
              value={newTeam.name}
              onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={newTeam.description}
              onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
            />
          </div>
          <button type="submit" className="btn-primary">Create Team</button>
        </form>
      )}

      <div className="teams-grid">
        {teams.map((team) => (
          <div key={team.id} className="team-card">
            <h3>{team.name}</h3>
            <p>{team.description}</p>
            <div className="team-actions">
              <Link to={`/assessment/${team.id}`} className="btn-secondary">
                New Assessment
              </Link>
              <Link to={`/results/${team.id}`} className="btn-outline">
                View Results
              </Link>
            </div>
          </div>
        ))}
      </div>

      {teams.length === 0 && (
        <div className="empty-state">
          <p>No teams yet. Create your first team to get started!</p>
        </div>
      )}
    </div>
  )
}

export default TeamList