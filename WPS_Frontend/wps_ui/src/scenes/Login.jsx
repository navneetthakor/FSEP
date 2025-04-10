import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FaGoogle, FaGithub, FaMicrosoft } from "react-icons/fa";
import Navbar from "@/components/sections/Navbar";
import ModalPopup from "@/components/sections/MessagePopUp";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activateModal, setActivateModal] = useState(null);

  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password });
    // Add authentication logic here

    setTimeout(() => {

      setActivateModal({
        type: 'success',
        title: 'Login Successful',
        message: ' Redirecting to Dashboard ... ',
        navigatePath: '/dashboard/monitor' // The path you want to navigate to
      });
    }, 1000);
  };
  
  return (
    <>
  
    <Navbar />
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center items-center min-h-[80vh]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-1">
            <CardTitle className="text-2xl font-bold">Log in to WebPulse</CardTitle>
            <CardDescription>
              Welcome back! Please enter your details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Remember me
                  </Label>
                </div>
                <Link to="/forgotPassword" className="text-indigo-600 text-sm font-medium hover:text-indigo-500">
                  Forgot password?
                </Link>
              </div>
              
              <Button type="submit" className="w-full">
                Log in
              </Button>
            </form>
            
            <div className="my-6 relative">
              <div className="flex absolute inset-0 items-center">
                <span className="border-gray-200 border-t w-full" />
              </div>
              <div className="flex justify-center text-sm relative">
                <span className="bg-white text-gray-500 px-2">or</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <Button variant="outline" className="w-full">
                <FaGoogle className="h-4 w-4 mr-2" />
              </Button>
              <Button variant="outline" className="w-full">
                <FaGithub className="h-4 w-4 mr-2" />
              </Button>
              <Button variant="outline" className="w-full">
                <FaMicrosoft className="h-4 w-4 mr-2" />
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-gray-500 text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-indigo-600 font-medium hover:text-indigo-500">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
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