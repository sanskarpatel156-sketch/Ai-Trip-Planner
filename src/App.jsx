import './App.css'
import Hero from './components/custom/Hero'
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

function App() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const dest = searchParams.get('destination')
    if (dest) navigate('/create-trip', { state: { destination: dest } })
  }, [])

  return <Hero />
}

export default App