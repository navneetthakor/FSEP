import { Route, Routes, Link } from 'react-router-dom';
import RootLayout from './RootLayout';
import Home from './Home';
import LoginPage from './Login';
import SignupPage from './SignupPage';
import Temp from './Temp';
import { ThemeProvider } from './components/ui/theme-provider';
import CreateMonitorForm from './components/sections/MonitoringForm';
import WebPulseRequestFlowPage from './Canva';
import RequestFlowCanvas2 from './scenes/PopUpFlow';
import RequestFlowCanvas from './scenes/CanvasFlow';

function App() {

  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="webpulse-theme">
        <Routes>
          <Route path='/' element={<RootLayout />} >
            <Route index element={<Home />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<SignupPage />} />
            <Route path='/dashboard/:rightAria' element={<Temp />} />
            <Route path='/createMonitorForm' element={<CreateMonitorForm />} />
            <Route path='/requestFlow' element={<WebPulseRequestFlowPage />} />
            <Route path='/requestFlow2' element={<RequestFlowCanvas />} />
            <Route path='/requestFlow3' element={<RequestFlowCanvas2 />} />
          </Route>
        </Routes>
</ThemeProvider>
    </>
  )
}

export default App;