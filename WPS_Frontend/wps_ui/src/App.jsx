import {Route, Routes, Link} from 'react-router-dom';
import RootLayout from './RootLayout';

function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<RootLayout />}   >
      </Route>
    </Routes>
    </>
  )
}

export default App
