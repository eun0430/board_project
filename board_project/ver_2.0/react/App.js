import {BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Main from './pages/main';
import Write from './pages/write';
import Detail from './pages/detail';
import Rewrite from './pages/rewrite';
import Spinner from './Spinner';


function App() {
  
  return (
   <BrowserRouter>
    <Routes>
      <Route exact path='/' element={<Login />} />
      <Route exact path='/main' element={<Main />} />
      <Route exact path='/write' element={<Write />} />
      <Route exact path='/detail' element={<Detail />} />
      <Route exact path='/rewrite/:no' element={<Rewrite />} />
    </Routes>
   </BrowserRouter>
  
  );
}

export default App;
