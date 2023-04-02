import './App.css';
import Login from './Components/Login';
import Register from './Components/Register';
import Venues from './Components/Venues';
import Venue from './Components/Venue';
import SubmitPaper from './Components/SubmitPaper';
import ResearchPaper from './Components/ResearchPaper';
import Profile from './Components/Profile';
import Chat from './Components/Chat';
import Notifications from './Components/Notifications';
import ShowSearch from './Components/ShowSearch';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Venues />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/venues/:Venue_name' element={<Venue />} />
        <Route path='/venues/:Venue_name/submit' element={<SubmitPaper />} />
        <Route path='/venues/:Venue_name/:Paper' element={<ResearchPaper />} />
        <Route path='/profile/:username' element={<Profile />} />
        <Route path='/chat/:paper' element={<Chat />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path='/search/:Paper' element={<ShowSearch />} />
      </Routes>
    </Router>
  );
}

export default App;
