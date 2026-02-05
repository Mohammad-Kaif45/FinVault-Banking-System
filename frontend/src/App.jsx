import { useState, useEffect } from 'react'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function App() {
  const [message, setMessage] = useState("Loading...")
  const [error, setError] = useState("")

  useEffect(() => {
    // Attempt to contact the Backend
    // Note: We use User ID 1 just to test the connection
    axios.get('http://localhost:8080/users/1')
      .then(response => {
        setMessage("✅ Success! Connected to User: " + response.data.fullName)
      })
      .catch(err => {
        console.error(err);
        setError("❌ Connection Failed. Is API Gateway running on Port 8080?")
        setMessage("")
      })
  }, [])

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h2>FinVault Dashboard 🏦</h2>
        </div>
        <div className="card-body">
          <h4 className="card-title">System Status:</h4>
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}
        </div>
      </div>
    </div>
  )
}

export default App