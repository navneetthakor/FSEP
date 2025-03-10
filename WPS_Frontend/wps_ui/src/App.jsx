import {Route, Routes, Link} from 'react-router-dom';
import RootLayout from './RootLayout';
import Home from './Home';
import LoginPage from './Login';
import SignupPage from './SignupPage';

function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<RootLayout />} >
      <Route index element={<Home />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<SignupPage />} />
      </Route>
    </Routes>
    </>
  )
}

export default App
