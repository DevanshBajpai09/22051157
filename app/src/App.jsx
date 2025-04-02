import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Topuser from './Component/Topuser'
import TrendingPost from './Component/TrendingPost'
import Navbar from './Component/Navbar'
import Calculator from './Component/Calculator'

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/users" element={<Topuser />} />
          <Route path="/trending" element={<TrendingPost />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/" element={<div className="flex items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Welcome to Our App</h1>
    </div>} />
        </Routes>
      </Router>
    </>
  )
}

export default App