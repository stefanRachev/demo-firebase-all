import Header from './components/Header'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='min-h-screen flex flex-col bg-gray-100'>
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-6">
        <Content />
      </main>

    </div>
  )
}

export default App
