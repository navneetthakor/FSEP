import { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { toast } from "sonner";
import ModalPopup from "@/components/sections/MessagePopUp";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activateModal, setActivateModal] = useState(null);
  
  // const { token } = useParams(); // Get reset token from URL
  // const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Validate password match
    // if (password !== confirmPassword) {
    //   toast.error("Password Mismatch", {
    //     description: "Passwords do not match"
    //   });
    //   return;
    // }

    // setIsLoading(true);

    // try {
      // const response = await fetch('/api/auth/reset-password', {
      //   body: { 
      //       token, 
      //       newPassword: password 
      //     }
      // });
      // console.log(response);
    //    await axios.post('/api/auth/reset-password', { 
    //     token, 
    //     newPassword: password 
    //   });
      
      // toast.success("Password Reset Successful", {
      //   description: "You can now log in with your new password"
      // });

      // Show success toast
      setTimeout(() => {

        setActivateModal({
          type: 'success',
          title: 'Password Reset Successful',
          message: 'You can now log in with your new password ',
          navigatePath: '/login' // The path you want to navigate to
        });
      }, 1000);

      // Redirect to login after successful reset
    //   navigate('/login');
    // } catch (error) {
    //   if (error.response) {
    //     toast.error("Password Reset Failed", {
    //       description: error.response.data.message || "Invalid or expired reset token"
    //     });
    //   } else {
    //     toast.error("Network Error", {
    //       description: "Please check your internet connection"
    //     });
    //   }
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return (
    <div className="container flex justify-center items-center min-h-screen mx-auto px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>
            Create a new password for your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </CardContent>
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
  );
}