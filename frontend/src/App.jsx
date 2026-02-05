import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div>
      {/* Simple Navbar */}
      <nav className="navbar navbar-dark bg-dark mb-4">
        <div className="container">
          <span className="navbar-brand mb-0 h1">🏦 FinVault Banking</span>
        </div>
      </nav>

      {/* Render the Dashboard */}
      <Dashboard />
    </div>
  )
}

export default App;