// import React, { useState } from 'react';
// import { 
//   Card, 
//   CardContent, 
//   CardHeader, 
//   CardTitle, 
//   CardDescription 
// } from "../ui/card";
// import { 
//   Tabs, 
//   TabsContent, 
//   TabsList, 
//   TabsTrigger 
// } from "../ui/tabs";
// import { 
//   Select, 
//   SelectContent, 
//   SelectItem, 
//   SelectTrigger, 
//   SelectValue 
// } from "../ui/select";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "../ui/form";
// import { Input } from "../ui/input";
// import { Button } from "../ui/button";
// import { Switch } from "../ui/switch";
// import { Textarea } from "../ui/textarea";
// import { Checkbox } from "../ui/checkbox";
// import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
// import { 
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "../ui/accordion";
// import { Label } from "../ui/label";
// import { 
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "../ui/collapsible";
// import { AlertTriangle, ChevronDown, Code, Info } from 'lucide-react';
// import { useForm } from "react-hook-form";

// const CreateMonitorForm = () => {
//   const [activeTab, setActiveTab] = useState("basic");
//   const [advancedSettingsOpen, setAdvancedSettingsOpen] = useState(false);
//   const [maintenanceWindowsOpen, setMaintenanceWindowsOpen] = useState(false);
  
//   const form = useForm({
//     defaultValues: {
//       url: "",
//       monitorName: "",
//       alertType: "url-unavailable",
//       recoveryPeriod: "3",
//       confirmationPeriod: "immediate",
//       checkFrequency: "3",
//       ipVersion: "both",
//       sslVerification: true,
//       httpMethod: "GET",
//       requestTimeout: "30",
//       followRedirects: true,
//       keepCookies: false,
//       regions: ["europe", "north-america", "asia", "australia"],
//       maintenanceDays: [],
//       maintenanceTimeZone: "Asia/Kolkata", // Chennai timezone
//     }
//   });

//   const onSubmit = (data) => {
//     console.log("Form submitted:", data);
//     // Here you would typically send the data to your API
//   };

//   return (
//     <div className="container p-4 max-w-4xl mx-auto">
//       <Card className="bg-transparent border w-full dark:border-gray-700">
//         <CardHeader>
//           <CardTitle className="text-2xl font-bold">Create monitor</CardTitle>
//           <CardDescription>
//             Configure monitoring settings for your website or API
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//             <TabsList className="grid grid-cols-2 bg-white mb-6">
//               <TabsTrigger value="basic">Basic Settings</TabsTrigger>
//               <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
//             </TabsList>
            
//             <Form {...form}>
//               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//                 <TabsContent value="basic" className="space-y-6">
//                   {/* What to monitor section */}
//                   <div className="space-y-4">
//                     <h3 className="text-lg font-semibold">What to monitor</h3>
                    
//                     <FormField
//                       control={form.control}
//                       name="url"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>URL</FormLabel>
//                           <FormControl>
//                             <Input className="dark:border-gray-700" placeholder="https://example.com" {...field} />
//                           </FormControl>
//                           <FormDescription>
//                             Enter the URL of the website or API you want to monitor
//                           </FormDescription>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
                    
//                     <FormField
//                       control={form.control}
//                       name="alertType"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Alert options</FormLabel>
//                           <Select 
                          
//                             onValueChange={field.onChange} 
//                             defaultValue={field.value}
//                           >
//                             <FormControl>
//                               <SelectTrigger>
//                                 <SelectValue  placeholder="Select alert type"/>
//                               </SelectTrigger>
//                             </FormControl>
//                             <SelectContent>
//                               <SelectItem value="url-unavailable">URL becomes unavailable</SelectItem>
//                               <SelectItem value="status-code">Status code changes</SelectItem>
//                               <SelectItem value="response-time">Response time exceeds threshold</SelectItem>
//                               <SelectItem value="content-change">Content changes</SelectItem>
//                             </SelectContent>
//                           </Select>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>
                  
//                   {/* On-call escalation section */}
//                   <div className="space-y-4">
//                     <h3 className="text-lg font-semibold">On-call escalation</h3>
//                     <div className="bg-gray-50 border border-gray-200 p-4 rounded-md">
//                       <div className="flex gap-3 items-start">
//                         <AlertTriangle className="h-5 text-amber-500 w-5 mt-0.5" />
//                         <div>
//                           <p className="text-sm font-medium">Set up notification rules</p>
//                           <p className="text-gray-600 text-sm mt-1">
//                             Configure who gets notified and when for incidents 
//                             related to this monitor.
//                           </p>
//                           <Button variant="outline" className="h-8 text-sm mt-2">
//                             Configure notifications
//                           </Button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <Collapsible
//                     open={advancedSettingsOpen}
//                     onOpenChange={setAdvancedSettingsOpen}
//                     className="border p-4 rounded-md dark:border-gray-700"
//                   >
//                     <div className="flex justify-between items-center">
//                       <h3 className="text-lg font-semibold">Advanced settings</h3>
//                       <CollapsibleTrigger asChild>
//                         <Button variant="ghost" size="sm" className="h-8 p-0 w-8">
//                           <ChevronDown className={`h-4 w-4 transition-transform ${advancedSettingsOpen ? "transform rotate-180" : ""}`} />
//                         </Button>
//                       </CollapsibleTrigger>
//                     </div>
                    
//                     <CollapsibleContent className="mt-4 space-y-4">
//                       <FormField
//                         control={form.control}
//                         name="monitorName"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Monitor name</FormLabel>
//                             <FormControl>
//                               <Input placeholder="My Website Monitor" {...field} />
//                             </FormControl>
//                             <FormDescription>
//                               Give your monitor a descriptive name
//                             </FormDescription>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
                      
//                       <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                         <FormField
//                           control={form.control}
//                           name="recoveryPeriod"
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Recovery period</FormLabel>
//                               <Select 
//                                 onValueChange={field.onChange} 
//                                 defaultValue={field.value}
//                               >
//                                 <FormControl>
//                                   <SelectTrigger>
//                                     <SelectValue placeholder="Select period" />
//                                   </SelectTrigger>
//                                 </FormControl>
//                                 <SelectContent>
//                                   <SelectItem value="1">1 minute</SelectItem>
//                                   <SelectItem value="3">3 minutes</SelectItem>
//                                   <SelectItem value="5">5 minutes</SelectItem>
//                                   <SelectItem value="10">10 minutes</SelectItem>
//                                 </SelectContent>
//                               </Select>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
                        
//                         <FormField
//                           control={form.control}
//                           name="confirmationPeriod"
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Confirmation period</FormLabel>
//                               <Select 
//                                 onValueChange={field.onChange} 
//                                 defaultValue={field.value}
//                               >
//                                 <FormControl>
//                                   <SelectTrigger>
//                                     <SelectValue placeholder="Select period" />
//                                   </SelectTrigger>
//                                 </FormControl>
//                                 <SelectContent>
//                                   <SelectItem value="immediate">Immediate start</SelectItem>
//                                   <SelectItem value="1">1 minute</SelectItem>
//                                   <SelectItem value="3">3 minutes</SelectItem>
//                                   <SelectItem value="5">5 minutes</SelectItem>
//                                 </SelectContent>
//                               </Select>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                       </div>
                      
//                       <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                         <FormField
//                           control={form.control}
//                           name="checkFrequency"
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Check frequency</FormLabel>
//                               <Select 
//                                 onValueChange={field.onChange} 
//                                 defaultValue={field.value}
//                               >
//                                 <FormControl>
//                                   <SelectTrigger>
//                                     <SelectValue placeholder="Select frequency" />
//                                   </SelectTrigger>
//                                 </FormControl>
//                                 <SelectContent>
//                                   <SelectItem value="1">1 minute</SelectItem>
//                                   <SelectItem value="3">3 minutes</SelectItem>
//                                   <SelectItem value="5">5 minutes</SelectItem>
//                                   <SelectItem value="10">10 minutes</SelectItem>
//                                 </SelectContent>
//                               </Select>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
                        
//                         <FormField
//                           control={form.control}
//                           name="ipVersion"
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>IP version</FormLabel>
//                               <Select 
//                                 onValueChange={field.onChange} 
//                                 defaultValue={field.value}
//                               >
//                                 <FormControl>
//                                   <SelectTrigger>
//                                     <SelectValue placeholder="Select IP version" />
//                                   </SelectTrigger>
//                                 </FormControl>
//                                 <SelectContent>
//                                   <SelectItem value="ipv4">IPv4 only</SelectItem>
//                                   <SelectItem value="ipv6">IPv6 only</SelectItem>
//                                   <SelectItem value="both">Both IPv4 and IPv6</SelectItem>
//                                 </SelectContent>
//                               </Select>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                       </div>
                      
//                       <FormField
//                         control={form.control}
//                         name="sslVerification"
//                         render={({ field }) => (
//                           <FormItem className="flex flex-row border p-4 rounded-md items-start space-x-3 space-y-0">
//                             <FormControl>
//                               <Checkbox
//                                 checked={field.value}
//                                 onCheckedChange={field.onChange}
//                               />
//                             </FormControl>
//                             <div className="leading-none space-y-1">
//                               <FormLabel>Enable SSL/TLS verification</FormLabel>
//                               <FormDescription>
//                                 Verify SSL certificates and check for domain validation
//                               </FormDescription>
//                             </div>
//                           </FormItem>
//                         )}
//                       />
//                     </CollapsibleContent>
//                   </Collapsible>
//                 </TabsContent>
                
//                 <TabsContent value="advanced" className="space-y-6">
//                   {/* SSL & Domain verification */}
//                   <div className="space-y-4">
//                     <h3 className="text-lg font-semibold">SSL & Domain verification</h3>
                    
//                     <FormField
//                       control={form.control}
//                       name="sslVerification"
//                       render={({ field }) => (
//                         <FormItem className="flex flex-row border p-4 rounded-md items-start space-x-3 space-y-0">
//                           <FormControl>
//                             <Checkbox
//                               checked={field.value}
//                               onCheckedChange={field.onChange}
//                             />
//                           </FormControl>
//                           <div className="leading-none space-y-1">
//                             <FormLabel>Enable SSL/TLS verification</FormLabel>
//                             <FormDescription>
//                               Verify SSL certificates and check for domain validation
//                             </FormDescription>
//                           </div>
//                         </FormItem>
//                       )}
//                     />
//                   </div>
                  
//                   {/* Request parameters */}
//                   <div className="space-y-4">
//                     <h3 className="text-lg font-semibold">Request parameters</h3>
                    
//                     <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                       <FormField
//                         control={form.control}
//                         name="httpMethod"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>HTTP method</FormLabel>
//                             <Select 
//                               onValueChange={field.onChange} 
//                               defaultValue={field.value}
//                             >
//                               <FormControl>
//                                 <SelectTrigger>
//                                   <SelectValue placeholder="Select method" />
//                                 </SelectTrigger>
//                               </FormControl>
//                               <SelectContent>
//                                 <SelectItem value="GET">GET</SelectItem>
//                                 <SelectItem value="POST">POST</SelectItem>
//                                 <SelectItem value="PUT">PUT</SelectItem>
//                                 <SelectItem value="DELETE">DELETE</SelectItem>
//                                 <SelectItem value="PATCH">PATCH</SelectItem>
//                                 <SelectItem value="HEAD">HEAD</SelectItem>
//                               </SelectContent>
//                             </Select>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
                      
//                       <FormField
//                         control={form.control}
//                         name="requestTimeout"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Request timeout (seconds)</FormLabel>
//                             <FormControl>
//                               <Input type="number" {...field} />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                     </div>
                    
//                     <FormField
//                       control={form.control}
//                       name="requestBody"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Request body (for POST/PUT/PATCH)</FormLabel>
//                           <FormControl>
//                             <Textarea
//                               placeholder="Enter request body in JSON format"
//                               className="text-sm font-mono"
//                               rows={4}
//                               {...field}
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
                    
//                     <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                       <FormField
//                         control={form.control}
//                         name="followRedirects"
//                         render={({ field }) => (
//                           <FormItem className="flex flex-row border justify-between p-4 rounded-md items-center">
//                             <div className="space-y-0.5">
//                               <FormLabel className="text-base">Follow redirects</FormLabel>
//                               <FormDescription>
//                                 Automatically follow HTTP redirects
//                               </FormDescription>
//                             </div>
//                             <FormControl>
//                               <Switch
//                                 checked={field.value}
//                                 onCheckedChange={field.onChange}
//                               />
//                             </FormControl>
//                           </FormItem>
//                         )}
//                       />
                      
//                       <FormField
//                         control={form.control}
//                         name="keepCookies"
//                         render={({ field }) => (
//                           <FormItem className="flex flex-row border justify-between p-4 rounded-md items-center">
//                             <div className="space-y-0.5">
//                               <FormLabel className="text-base">Keep cookies</FormLabel>
//                               <FormDescription>
//                                 Maintain cookies between redirects
//                               </FormDescription>
//                             </div>
//                             <FormControl>
//                               <Switch
//                                 checked={field.value}
//                                 onCheckedChange={field.onChange}
//                               />
//                             </FormControl>
//                           </FormItem>
//                         )}
//                       />
//                     </div>
//                   </div>
                  
//                   {/* Request headers */}
//                   <div className="space-y-4">
//                     <h3 className="text-lg font-semibold">Request headers</h3>
                    
//                     <div className="border p-4 rounded-md">
//                       <div className="flex gap-2 items-center mb-4">
//                         <Label htmlFor="header-key">Name</Label>
//                         <Input id="header-key" placeholder="Authorization" className="w-full" />
//                       </div>
//                       <div className="flex gap-2 items-center">
//                         <Label htmlFor="header-value">Value</Label>
//                         <Input id="header-value" placeholder="Bearer token123" className="w-full" />
//                       </div>
//                       <Button variant="outline" className="mt-4">
//                         Add header
//                       </Button>
//                     </div>
//                   </div>
                  
//                   {/* HTTP authentication */}
//                   <div className="space-y-4">
//                     <h3 className="text-lg font-semibold">HTTP authentication</h3>
                    
//                     <div className="border p-4 rounded-md">
//                       <RadioGroup defaultValue="none" className="space-y-4">
//                         <div className="flex items-center space-x-2">
//                           <RadioGroupItem value="none" id="auth-none" />
//                           <Label htmlFor="auth-none">None</Label>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <RadioGroupItem value="basic" id="auth-basic" />
//                           <Label htmlFor="auth-basic">Basic Auth</Label>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <RadioGroupItem value="digest" id="auth-digest" />
//                           <Label htmlFor="auth-digest">Digest Auth</Label>
//                         </div>
//                       </RadioGroup>
                      
//                       <div className="mt-4 space-y-4">
//                         <div className="flex gap-2 items-center">
//                           <Label htmlFor="auth-username">Username</Label>
//                           <Input id="auth-username" className="w-full" />
//                         </div>
//                         <div className="flex gap-2 items-center">
//                           <Label htmlFor="auth-password">Password</Label>
//                           <Input id="auth-password" type="password" className="w-full" />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* Maintenance windows */}
//                   <Collapsible
//                     open={maintenanceWindowsOpen}
//                     onOpenChange={setMaintenanceWindowsOpen}
//                     className="border p-4 rounded-md"
//                   >
//                     <div className="flex justify-between items-center">
//                       <h3 className="text-lg font-semibold">Maintenance windows</h3>
//                       <CollapsibleTrigger asChild>
//                         <Button variant="ghost" size="sm" className="h-8 p-0 w-8">
//                           <ChevronDown className={`h-4 w-4 transition-transform ${maintenanceWindowsOpen ? "transform rotate-180" : ""}`} />
//                         </Button>
//                       </CollapsibleTrigger>
//                     </div>
                    
//                     <CollapsibleContent className="mt-4 space-y-4">
//                       <FormField
//                         control={form.control}
//                         name="maintenanceTimeZone"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Timezone</FormLabel>
//                             <Select 
//                               onValueChange={field.onChange} 
//                               defaultValue={field.value}
//                             >
//                               <FormControl>
//                                 <SelectTrigger>
//                                   <SelectValue placeholder="Select timezone" />
//                                 </SelectTrigger>
//                               </FormControl>
//                               <SelectContent>
//                                 <SelectItem value="Asia/Kolkata">Chennai (Asia/Kolkata)</SelectItem>
//                                 <SelectItem value="America/New_York">New York</SelectItem>
//                                 <SelectItem value="Europe/London">London</SelectItem>
//                                 <SelectItem value="Australia/Sydney">Sydney</SelectItem>
//                               </SelectContent>
//                             </Select>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
                      
//                       <FormField
//                         control={form.control}
//                         name="maintenanceDays"
//                         render={() => (
//                           <FormItem>
//                             <div className="mb-4">
//                               <FormLabel>Day of week</FormLabel>
//                               <FormDescription>
//                                 Select the days when maintenance is scheduled
//                               </FormDescription>
//                             </div>
//                             <div className="grid grid-cols-4 gap-2">
//                               {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
//                                 <FormField
//                                   key={day}
//                                   control={form.control}
//                                   name="maintenanceDays"
//                                   render={({ field }) => {
//                                     return (
//                                       <FormItem
//                                         key={day}
//                                         className="flex flex-row items-center space-x-2 space-y-0"
//                                       >
//                                         <FormControl>
//                                           <Checkbox
//                                             checked={field.value?.includes(day.toLowerCase())}
//                                             onCheckedChange={(checked) => {
//                                               return checked
//                                                 ? field.onChange([...field.value, day.toLowerCase()])
//                                                 : field.onChange(
//                                                     field.value?.filter(
//                                                       (value) => value !== day.toLowerCase()
//                                                     )
//                                                   )
//                                             }}
//                                           />
//                                         </FormControl>
//                                         <FormLabel className="text-sm font-normal">
//                                           {day.substring(0, 3)}
//                                         </FormLabel>
//                                       </FormItem>
//                                     )
//                                   }}
//                                 />
//                               ))}
//                             </div>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
                      
//                       <div className="grid grid-cols-2 gap-4">
//                         <div>
//                           <Label>Start time</Label>
//                           <Input type="time" defaultValue="00:00" />
//                         </div>
//                         <div>
//                           <Label>End time</Label>
//                           <Input type="time" defaultValue="06:00" />
//                         </div>
//                       </div>
//                     </CollapsibleContent>
//                   </Collapsible>
                  
//                   {/* Region selection */}
//                   <FormField
//                     control={form.control}
//                     name="regions"
//                     render={() => (
//                       <FormItem>
//                         <div className="mb-4">
//                           <FormLabel>Regions</FormLabel>
//                           <FormDescription>
//                             Select the regions to monitor from
//                           </FormDescription>
//                         </div>
//                         <div className="grid grid-cols-2 gap-4">
//                           {[
//                             { id: 'europe', label: 'Europe' },
//                             { id: 'north-america', label: 'North America' },
//                             { id: 'asia', label: 'Asia' },
//                             { id: 'australia', label: 'Australia' }
//                           ].map((region) => (
//                             <FormField
//                               key={region.id}
//                               control={form.control}
//                               name="regions"
//                               render={({ field }) => {
//                                 return (
//                                   <FormItem
//                                     key={region.id}
//                                     className="flex flex-row border p-4 rounded-md items-start space-x-3 space-y-0"
//                                   >
//                                     <FormControl>
//                                       <Checkbox
//                                         checked={field.value?.includes(region.id)}
//                                         onCheckedChange={(checked) => {
//                                           return checked
//                                             ? field.onChange([...field.value, region.id])
//                                             : field.onChange(
//                                                 field.value?.filter(
//                                                   (value) => value !== region.id
//                                                 )
//                                               )
//                                         }}
//                                       />
//                                     </FormControl>
//                                     <div className="leading-none space-y-1">
//                                       <FormLabel>
//                                         {region.label}
//                                       </FormLabel>
//                                     </div>
//                                   </FormItem>
//                                 )
//                               }}
//                             />
//                           ))}
//                         </div>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
                  
//                   {/* GitHub badge */}
//                   <div className="space-y-4">
//                     <h3 className="text-lg font-semibold">GitHub badge</h3>
                    
//                     <div className="bg-gray-50 border p-4 rounded-md">
//                       <div className="flex gap-3 items-start">
//                         <Code className="h-5 text-blue-500 w-5 mt-0.5" />
//                         <div>
//                           <p className="text-sm font-medium">Add status badge to your README.md</p>
//                           <p className="bg-gray-100 p-2 rounded text-gray-600 text-sm font-mono mt-1">
//                             [![WebPulse Status](https://webpulse.example.com/badge/yourmonitor)](https://webpulse.example.com/status/yourmonitor)
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* Metadata section */}
//                   <Accordion type="single" collapsible>
//                     <AccordionItem value="metadata">
//                       <AccordionTrigger>Metadata</AccordionTrigger>
//                       <AccordionContent className="space-y-4">
//                         <p className="text-gray-600 text-sm">
//                           Add custom metadata tags to organize and filter your monitors
//                         </p>
//                         <div className="flex gap-2">
//                           <Input placeholder="Key" className="w-1/2" />
//                           <Input placeholder="Value" className="w-1/2" />
//                         </div>
//                         <Button variant="outline" size="sm">
//                           Add tag
//                         </Button>
//                       </AccordionContent>
//                     </AccordionItem>
//                   </Accordion>
//                 </TabsContent>
                
//                 <div className="flex justify-end pt-4">
//                   <Button type="submit" className="px-6">
//                     Create monitor
//                   </Button>
//                 </div>
//               </form>
//             </Form>
//           </Tabs>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default CreateMonitorForm;

import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "../ui/card";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Zod schema for form validation
const formSchema = z.object({
  server_name: z.string().min(1, { message: "Server name is required" }),
  method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"], {
    required_error: "HTTP method is required"
  }),
  url: z.string().url({ message: "Invalid URL" }),
  headers: z.array(
    z.object({
      key: z.string().min(1, "Header key is required"),
      value: z.string().min(1, "Header value is required")
    })
  ).optional(),
  body: z.string().optional(),
  type_of_check: z.enum(['UBU', 'URHSCOT', 'UCK', 'UNCK', 'URTGT'], {
    required_error: "Check type is required"
  }),
  check_frequency: z.enum(['TS', 'FFS', 'OM', 'TWOM', 'THRM', 'FIVM', 'TENM', 'FIFM', 'HAFH', 'OH'], {
    required_error: "Check frequency is required"
  }),
  keyword: z.string().optional(),
  status_codes: z.array(z.number()).optional()
});

const CreateMonitorForm = () => {
  // Initialize form with zod resolver
  const form = useForm({
    // resolver: zodResolver(formSchema),
    defaultValues: {
      server_name: "",
      method: "GET",
      url: "",
      headers: [],
      body: "",
      type_of_check: "UBU",
      check_frequency: "TS",
      keyword: "",
      status_codes: []
    }
  });

  // Handle form submission
  const onSubmit = (data) => {
    console.log("Form submitted:", data);
    // Here you would typically send the data to your API
  };

  return (
    <div className="container p-4 max-w-2xl mx-auto">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create Monitor</CardTitle>
          <CardDescription>
            Configure monitoring settings for your server or endpoint
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-6">
              {/* Server Name */}
              <FormField
                control={form.control}
                name="server_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Server Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter server name" {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide a descriptive name for the server or endpoint
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* HTTP Method */}
              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>HTTP Method</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select HTTP method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"].map(method => (
                          <SelectItem key={method} value={method}>{method}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* URL */}
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/endpoint" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the full URL of the endpoint to monitor
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Headers */}
              <FormField
                control={form.control}
                name="headers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Headers</FormLabel>
                    <FormDescription>
                      Add optional HTTP headers for the request
                    </FormDescription>
                    {field.value?.map((header, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <Input 
                          placeholder="Header Key" 
                          value={header.key}
                          onChange={(e) => {
                            const newHeaders = [...field.value];
                            newHeaders[index].key = e.target.value;
                            form.setValue('headers', newHeaders);
                          }}
                        />
                        <Input 
                          placeholder="Header Value" 
                          value={header.value}
                          onChange={(e) => {
                            const newHeaders = [...field.value];
                            newHeaders[index].value = e.target.value;
                            form.setValue('headers', newHeaders);
                          }}
                        />
                        <Button 
                          type="button" 
                          variant="destructive" 
                          onClick={() => {
                            const newHeaders = field.value.filter((_, i) => i !== index);
                            form.setValue('headers', newHeaders);
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        form.setValue('headers', [
                          ...(field.value || []),
                          { key: '', value: '' }
                        ]);
                      }}
                    >
                      Add Header
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Request Body */}
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Request Body (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter request body (JSON, XML, etc.)" 
                        {...field} 
                        className="font-mono"
                      />
                    </FormControl>
                    <FormDescription>
                      Provide request body for POST, PUT, or PATCH methods
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Type of Check */}
              <FormField
                control={form.control}
                name="type_of_check"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type of Check</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select check type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="UBU">URL Becomes Unavailable</SelectItem>
                        <SelectItem value="URHSCOT">URL Response Has Specific Content of Type</SelectItem>
                        <SelectItem value="UCK">URL Contains Keyword</SelectItem>
                        <SelectItem value="UNCK">URL Not Contains Keyword</SelectItem>
                        <SelectItem value="URTGT">URL Response Time Greater Than</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Check Frequency */}
              <FormField
                control={form.control}
                name="check_frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Check Frequency</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select check frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="TS">Ten Seconds</SelectItem>
                        <SelectItem value="FFS">Fifteen Seconds</SelectItem>
                        <SelectItem value="OM">One Minute</SelectItem>
                        <SelectItem value="TWOM">Two Minutes</SelectItem>
                        <SelectItem value="THRM">Three Minutes</SelectItem>
                        <SelectItem value="FIVM">Five Minutes</SelectItem>
                        <SelectItem value="TENM">Ten Minutes</SelectItem>
                        <SelectItem value="FIFM">Fifteen Minutes</SelectItem>
                        <SelectItem value="HAFH">Half an Hour</SelectItem>
                        <SelectItem value="OH">One Hour</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Keyword (Optional) */}
              <FormField
                control={form.control}
                name="keyword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keyword (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter keyword to search" {...field} />
                    </FormControl>
                    <FormDescription>
                      Optional keyword to search for in the response
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status Codes */}
              <FormField
                control={form.control}
                name="status_codes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status Codes (Optional)</FormLabel>
                    <div className="flex gap-2 mb-2">
                      {field.value?.map((code, index) => (
                        <div key={index} className="flex gap-2">
                          <Input 
                            type="number"
                            placeholder="Status Code" 
                            value={code}
                            onChange={(e) => {
                              const newCodes = [...field.value];
                              newCodes[index] = parseInt(e.target.value);
                              form.setValue('status_codes', newCodes);
                            }}
                          />
                          <Button 
                            type="button" 
                            variant="destructive" 
                            onClick={() => {
                              const newCodes = field.value.filter((_, i) => i !== index);
                              form.setValue('status_codes', newCodes);
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          form.setValue('status_codes', [
                            ...(field.value || []),
                            200
                          ]);
                        }}
                      >
                        Add Status Code
                      </Button>
                    </div>
                    <FormDescription>
                      Optional list of status codes to check against
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button type="submit" className="px-6">
                  Create Monitor
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateMonitorForm;