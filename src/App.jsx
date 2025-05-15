import Header from './components/Header'
import Content from './layout/Content'
import { AuthProvider } from "./context/AuthProvider"
import './App.css'

function App() {


  return (
    <div className='min-h-screen flex flex-col bg-gray-100'>
      <AuthProvider>
        <Header />
        <main className="flex-1 container mx-auto p-4 md:p-6">
          <Content />
        </main>
      </AuthProvider>
    </div>
  )
}

export default App
