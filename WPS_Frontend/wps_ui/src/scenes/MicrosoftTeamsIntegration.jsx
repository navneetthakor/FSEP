// import React, { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// // import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

// const MicrosoftTeamsIntegration = () => {
//   const [isIntegrated, setIsIntegrated] = useState(false);

//   const handleTeamsIntegration = async () => {
//     try {
//       // Redirect to backend authentication endpoint
//       window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/teams`;
//     } catch (error) {
//       console.error('Teams integration error:', error);
//     }
//   };

//   return (
//     <Card className="w-full max-w-md mx-auto mt-10">
//       <CardHeader>
//         <CardTitle>Microsoft Teams Integration</CardTitle>
//       </CardHeader>
//       <CardContent className="text-center">
//         {!isIntegrated ? (
//           <div>
//             <p className="mb-4 text-muted-foreground">
//               Click below to integrate your Microsoft Teams account
//             </p>
//             <Button 
//               onClick={handleTeamsIntegration} 
//               className="bg-[#5059BC] hover:bg-[#4147A3] text-white"
//             >
//               Connect Microsoft Teams
//             </Button>
//           </div>
//         ) : (
//           <div className="text-green-600">
//             ✅ Microsoft Teams Successfully Integrated
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default MicrosoftTeamsIntegration;