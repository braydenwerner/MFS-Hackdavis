import { HomePage, SignIn } from './components/exports'
import Nav from './components/Nav/Nav'
import './App.scss'
import Leaderboard from './components/Leaderboard/Leaderboard'

function App() {
  return (
    <>
      <Nav />
      <div id="component-container">
        <HomePage />
        <SignIn />
        <Leaderboard />
      </div>
    </>
  )
}

export default App
