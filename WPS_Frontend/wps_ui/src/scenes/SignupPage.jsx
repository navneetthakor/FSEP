import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FaGoogle, FaGithub, FaMicrosoft } from "react-icons/fa";
import Navbar from "@/components/sections/Navbar";
import ModalPopup from "@/components/sections/MessagePopUp";
import UserContext from "@/context/UserContext";

export default function SignupPage() {

  // state variable to store form data 
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    contact_num: "",
    profileImage: File || null
  });

  // state variable to set activstate of modal 
  const [activateModal, setActivateModal] = useState(null);

  // accessing userContext
  const {RegisterHelper} = useContext(UserContext);
  
  // handler to handle onChange event for each entry of form
  const handleChange = (e) => {
    const { id, value, files } = e.target;
    
    if (id === 'profileImage' && files) {
      setFormData(prev => ({
        ...prev,
        profileImage: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [id]: value
      }));
    }
  };
  
  // hanler for onSubmiting event of form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Password validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    } 
    
    // Prepare form data for submission
    const submissionData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      contact_num: formData.contact_num,
      profileImage: formData.profileImage
    };

    let isSuccess = await RegisterHelper(submissionData);

    if(isSuccess){
      setActivateModal({
        type: 'success',
        title: 'Registration Successful',
        message: ' Redirecting to Login ... ',
        navigatePath: '/login' // The path you want to navigate to
      });
      setTimeout(()=>{
        setActivateModal(null);

      },3000);
    }else{
      setActivateModal({
        type: 'error',
        title: 'Registration UnSuccessful',
        message: 'Please Try again',
        navigatePath: null // The path you want to navigate to
      });
      setTimeout(()=>{
        setActivateModal(null);

      },3000);
    }


  };
  
  return (<>
  
    <Navbar />
    <div className="container flex justify-center items-center mx-auto px-4 py-8">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-bold">Create your account</CardTitle>
          <CardDescription>
            Sign up to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* <div className="mb-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Account Registration</span>
              <span className="text-indigo-600 font-medium">100%</span>
            </div>
            <Progress value={100} className="h-1" />
          </div> */}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Choose a unique username"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Create a strong password"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Repeat your password"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number (Optional)</Label>
              <Input
                id="contactNumber"
                type="tel"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="Enter your contact number"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="profileImage">Profile Image (Optional)</Label>
              <Input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={handleChange}
              />
            </div>
            
            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </form>
          
          <div className="my-6 relative">
            <div className="flex absolute inset-0 items-center">
              <span className="border-gray-200 border-t w-full" />
            </div>
            <div className="flex justify-center text-sm relative">
              <span className="bg-white text-gray-500 px-2">or sign up with</span>
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
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-medium hover:text-indigo-500">
              Log in
            </Link>
          </p>
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