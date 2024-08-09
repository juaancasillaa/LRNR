import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Quiz from './pages/Quiz';
import Account from './pages/Account';
import Notfound from './pages/NotFound';
import Navbar from './components/Navbar';

function App() {
  return (
    <>
      <Router>
        <div>
          <Navbar />
          <Routes>
            <Route path='/' element={<Quiz />} />
            <Route path='/Account' element={<Account />} />
            <Route path="*" element={<Notfound />} />
          </Routes> 
        </div>
      </Router>
    </>
  );
}

export default App;