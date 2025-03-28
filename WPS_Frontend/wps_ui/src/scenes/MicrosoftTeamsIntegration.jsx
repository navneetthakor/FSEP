import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';
// import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const MicrosoftTeamsIntegration = () => {
  const [isIntegrated, setIsIntegrated] = useState(false);

  // Authentication Service

const initiateTeamsAuth = async () => {
  try {
    // Get the authentication token (e.g., from localStorage or your auth mechanism)
    // const token = localStorage.getItem('authToken');
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjdlNjZjYzhiNDM3Zjg2NjU3MmIzZDZmIn0sImlhdCI6MTc0MzE1NDM5OX0.H0GqbAPsbbhXIm9PEHqQtcM4OpC4yaqI4qjGkiU50No";

    // If no token, redirect to login
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Set up the request with the token in headers
    const response = await axios.get('https://fsep-navneetkumar-ramanbhai-thakors-projects.vercel.app/auth/teams/init', {
      headers: {
        'usertoken':token
      }
    });

    // The response should contain the Microsoft Teams auth URL
    if (response.data.authUrl) {
      // Redirect to Microsoft Teams authentication
      window.location.href = response.data.authUrl;
    }
    setIsIntegrated(true);
  } catch (error) {
    console.error('Teams authentication initiation failed:', error);
    // Handle error (e.g., show error message, redirect to login)
  }
};
  return (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>Microsoft Teams Integration</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        {!isIntegrated ? (
          <div>
            <p className="mb-4 text-muted-foreground">
              Click below to integrate your Microsoft Teams account
            </p>
            <Button 
              onClick={initiateTeamsAuth} 
              className="bg-[#5059BC] hover:bg-[#4147A3] text-white"
            >
              Connect Microsoft Teams
            </Button>
          </div>
        ) : (
          <div className="text-green-600">
            ✅ Microsoft Teams Successfully Integrated
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MicrosoftTeamsIntegration;