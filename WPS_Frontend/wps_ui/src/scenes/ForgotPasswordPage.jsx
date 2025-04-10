import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner"; // Assuming you're using sonner for notifications
import Navbar from "@/components/sections/Navbar";
import ModalPopup from "@/components/sections/MessagePopUp";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activateModal, setActivateModal] = useState(null);


  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5002/User/forgotPassword', {
        method: 'POST',
        body: {email : email}
      } )
    //   await axios.post('/api/auth/forgot-password', { email });
      console.log(response);

      // Show success toast
      setTimeout(() => {

        setActivateModal({
          type: 'success',
          title: 'Password reset link sent',
          message: ' Check your email for instructions to reset your password. ',
          navigatePath: '/' // The path you want to navigate to
        });
      }, 1000);

    } catch (error) {
      // Handle error scenarios
      if (error.response) {
        toast.error("Password Reset Failed", {
          description: error.response.data.message || "Unable to send reset link"
        });
      } else {
        toast.error("Network Error", {
          description: "Please check your internet connection"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
  
    <Navbar />
    <div className="container flex justify-center items-center min-h-screen mx-auto px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email to receive a password reset link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Reset Password"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link 
            to="/login" 
            className="text-indigo-600 text-sm font-medium hover:text-indigo-500"
          >
            Back to Login
          </Link>
        </CardFooter>
      </Card>
      {activateModal && (
        <ModalPopup
          type={activateModal.type}
          title={activateModal.title}
          message={activateModal.message}
          navigatePath={activateModal.navigatePath}
          duration={3000} // 3 seconds auto-close
        />
      )}
    </div>
    </>
  );
}