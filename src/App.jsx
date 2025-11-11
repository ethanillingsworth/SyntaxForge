import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Home from './pages/Home'
import Playground from './pages/Playground'
import Courses from './pages/Courses'


function App() {

    return (
        <>
            <Router>
                <Header />
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/playground' element={<Playground />} />
                    <Route path='/courses' element={<Courses/>}/>
                </Routes>
            </Router>
        </>
    )
}

export default App
