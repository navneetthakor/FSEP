import { Route, Routes, Link } from 'react-router-dom';
import RootLayout from './RootLayout';
import Home from './scenes/Home';
import LoginPage from './scenes/Login';
import SignupPage from './scenes/SignupPage';
import DashboardLayout from './scenes/DashboardLayout';
import { ThemeProvider } from './components/ui/theme-provider';
import ForgotPasswordPage from './scenes/ForgotPasswordPage';
import ResetPasswordPage from './scenes/ResetPassword';
import MicrosoftTeamsIntegration from './scenes/MicrosoftTeamsIntegration';
import RightSideDashBoard from './components/sections/RightSideDashBoard';


function App() {

  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="webpulse-theme">
        <Routes>
          <Route path='/' element={<RootLayout />} >
            <Route index element={<Home />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<SignupPage />} />
            <Route path='/dashboard/:rightAria' element={<DashboardLayout />} />
            <Route path='/responseTimeGraph' element={<RightSideDashBoard />} />
            <Route path='/forgotPassword' element={<ForgotPasswordPage />} />
            <Route path='/resetPassword/:resetToken' element={<ResetPasswordPage />} />
            <Route path='/integration/mstems' element={<MicrosoftTeamsIntegration />} />
            {/* <Route path='/createMonitorForm' element={<CreateMonitorForm />} /> */}
            {/* <Route path='/requestFlow' element={<WebPulseRequestFlowPage />} /> */}
            {/* <Route path='/requestFlow2' element={<RequestFlowCanvas />} /> */}
          </Route>
        </Routes>
</ThemeProvider>
    </>
  )
}

export default App;