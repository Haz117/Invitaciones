import Confetti   from './components/Confetti'
import Invitation from './components/Invitation'

export default function App() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-10"
      style={{
        background: 'linear-gradient(145deg, #fde8f0 0%, #fef3e2 50%, #eaf0fd 100%)',
      }}
    >
      <Confetti />
      <Invitation />
    </div>
  )
}
