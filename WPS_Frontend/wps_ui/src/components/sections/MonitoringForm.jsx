import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "../ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "../ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../ui/select";
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
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Label } from "../ui/label";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { AlertTriangle, ChevronDown, Code, Info } from 'lucide-react';
import { useForm } from "react-hook-form";

const CreateMonitorForm = () => {
  const [activeTab, setActiveTab] = useState("basic");
  const [advancedSettingsOpen, setAdvancedSettingsOpen] = useState(false);
  const [maintenanceWindowsOpen, setMaintenanceWindowsOpen] = useState(false);
  
  const form = useForm({
    defaultValues: {
      url: "",
      monitorName: "",
      alertType: "url-unavailable",
      recoveryPeriod: "3",
      confirmationPeriod: "immediate",
      checkFrequency: "3",
      ipVersion: "both",
      sslVerification: true,
      httpMethod: "GET",
      requestTimeout: "30",
      followRedirects: true,
      keepCookies: false,
      regions: ["europe", "north-america", "asia", "australia"],
      maintenanceDays: [],
      maintenanceTimeZone: "Asia/Kolkata", // Chennai timezone
    }
  });

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
    // Here you would typically send the data to your API
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="w-full bg-transparent border dark:border-gray-700 ">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create monitor</CardTitle>
          <CardDescription>
            Configure monitoring settings for your website or API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6 bg-white">
              <TabsTrigger value="basic">Basic Settings</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
            </TabsList>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <TabsContent value="basic" className="space-y-6">
                  {/* What to monitor section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">What to monitor</h3>
                    
                    <FormField
                      control={form.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL</FormLabel>
                          <FormControl>
                            <Input className="dark:border-gray-700 " placeholder="https://example.com" {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter the URL of the website or API you want to monitor
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="alertType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Alert options</FormLabel>
                          <Select 
                          
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue  placeholder="Select alert type"/>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="url-unavailable">URL becomes unavailable</SelectItem>
                              <SelectItem value="status-code">Status code changes</SelectItem>
                              <SelectItem value="response-time">Response time exceeds threshold</SelectItem>
                              <SelectItem value="content-change">Content changes</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* On-call escalation section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">On-call escalation</h3>
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-sm">Set up notification rules</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Configure who gets notified and when for incidents 
                            related to this monitor.
                          </p>
                          <Button variant="outline" className="mt-2 text-sm h-8">
                            Configure notifications
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Collapsible
                    open={advancedSettingsOpen}
                    onOpenChange={setAdvancedSettingsOpen}
                    className="border rounded-md p-4 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Advanced settings</h3>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                          <ChevronDown className={`h-4 w-4 transition-transform ${advancedSettingsOpen ? "transform rotate-180" : ""}`} />
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    
                    <CollapsibleContent className="space-y-4 mt-4">
                      <FormField
                        control={form.control}
                        name="monitorName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Monitor name</FormLabel>
                            <FormControl>
                              <Input placeholder="My Website Monitor" {...field} />
                            </FormControl>
                            <FormDescription>
                              Give your monitor a descriptive name
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="recoveryPeriod"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Recovery period</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select period" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1">1 minute</SelectItem>
                                  <SelectItem value="3">3 minutes</SelectItem>
                                  <SelectItem value="5">5 minutes</SelectItem>
                                  <SelectItem value="10">10 minutes</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="confirmationPeriod"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirmation period</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select period" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="immediate">Immediate start</SelectItem>
                                  <SelectItem value="1">1 minute</SelectItem>
                                  <SelectItem value="3">3 minutes</SelectItem>
                                  <SelectItem value="5">5 minutes</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="checkFrequency"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Check frequency</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select frequency" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1">1 minute</SelectItem>
                                  <SelectItem value="3">3 minutes</SelectItem>
                                  <SelectItem value="5">5 minutes</SelectItem>
                                  <SelectItem value="10">10 minutes</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="ipVersion"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>IP version</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select IP version" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="ipv4">IPv4 only</SelectItem>
                                  <SelectItem value="ipv6">IPv6 only</SelectItem>
                                  <SelectItem value="both">Both IPv4 and IPv6</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="sslVerification"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Enable SSL/TLS verification</FormLabel>
                              <FormDescription>
                                Verify SSL certificates and check for domain validation
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </CollapsibleContent>
                  </Collapsible>
                </TabsContent>
                
                <TabsContent value="advanced" className="space-y-6">
                  {/* SSL & Domain verification */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">SSL & Domain verification</h3>
                    
                    <FormField
                      control={form.control}
                      name="sslVerification"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Enable SSL/TLS verification</FormLabel>
                            <FormDescription>
                              Verify SSL certificates and check for domain validation
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Request parameters */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Request parameters</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="httpMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>HTTP method</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select method" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="GET">GET</SelectItem>
                                <SelectItem value="POST">POST</SelectItem>
                                <SelectItem value="PUT">PUT</SelectItem>
                                <SelectItem value="DELETE">DELETE</SelectItem>
                                <SelectItem value="PATCH">PATCH</SelectItem>
                                <SelectItem value="HEAD">HEAD</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="requestTimeout"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Request timeout (seconds)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="requestBody"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Request body (for POST/PUT/PATCH)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter request body in JSON format"
                              className="font-mono text-sm"
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="followRedirects"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Follow redirects</FormLabel>
                              <FormDescription>
                                Automatically follow HTTP redirects
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="keepCookies"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Keep cookies</FormLabel>
                              <FormDescription>
                                Maintain cookies between redirects
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  {/* Request headers */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Request headers</h3>
                    
                    <div className="rounded-md border p-4">
                      <div className="mb-4 flex items-center gap-2">
                        <Label htmlFor="header-key">Name</Label>
                        <Input id="header-key" placeholder="Authorization" className="w-full" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label htmlFor="header-value">Value</Label>
                        <Input id="header-value" placeholder="Bearer token123" className="w-full" />
                      </div>
                      <Button variant="outline" className="mt-4">
                        Add header
                      </Button>
                    </div>
                  </div>
                  
                  {/* HTTP authentication */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">HTTP authentication</h3>
                    
                    <div className="rounded-md border p-4">
                      <RadioGroup defaultValue="none" className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="none" id="auth-none" />
                          <Label htmlFor="auth-none">None</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="basic" id="auth-basic" />
                          <Label htmlFor="auth-basic">Basic Auth</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="digest" id="auth-digest" />
                          <Label htmlFor="auth-digest">Digest Auth</Label>
                        </div>
                      </RadioGroup>
                      
                      <div className="mt-4 space-y-4">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="auth-username">Username</Label>
                          <Input id="auth-username" className="w-full" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label htmlFor="auth-password">Password</Label>
                          <Input id="auth-password" type="password" className="w-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Maintenance windows */}
                  <Collapsible
                    open={maintenanceWindowsOpen}
                    onOpenChange={setMaintenanceWindowsOpen}
                    className="border rounded-md p-4"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Maintenance windows</h3>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                          <ChevronDown className={`h-4 w-4 transition-transform ${maintenanceWindowsOpen ? "transform rotate-180" : ""}`} />
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    
                    <CollapsibleContent className="space-y-4 mt-4">
                      <FormField
                        control={form.control}
                        name="maintenanceTimeZone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Timezone</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select timezone" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Asia/Kolkata">Chennai (Asia/Kolkata)</SelectItem>
                                <SelectItem value="America/New_York">New York</SelectItem>
                                <SelectItem value="Europe/London">London</SelectItem>
                                <SelectItem value="Australia/Sydney">Sydney</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="maintenanceDays"
                        render={() => (
                          <FormItem>
                            <div className="mb-4">
                              <FormLabel>Day of week</FormLabel>
                              <FormDescription>
                                Select the days when maintenance is scheduled
                              </FormDescription>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                                <FormField
                                  key={day}
                                  control={form.control}
                                  name="maintenanceDays"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={day}
                                        className="flex flex-row items-center space-x-2 space-y-0"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(day.toLowerCase())}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([...field.value, day.toLowerCase()])
                                                : field.onChange(
                                                    field.value?.filter(
                                                      (value) => value !== day.toLowerCase()
                                                    )
                                                  )
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className="text-sm font-normal">
                                          {day.substring(0, 3)}
                                        </FormLabel>
                                      </FormItem>
                                    )
                                  }}
                                />
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Start time</Label>
                          <Input type="time" defaultValue="00:00" />
                        </div>
                        <div>
                          <Label>End time</Label>
                          <Input type="time" defaultValue="06:00" />
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                  
                  {/* Region selection */}
                  <FormField
                    control={form.control}
                    name="regions"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel>Regions</FormLabel>
                          <FormDescription>
                            Select the regions to monitor from
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { id: 'europe', label: 'Europe' },
                            { id: 'north-america', label: 'North America' },
                            { id: 'asia', label: 'Asia' },
                            { id: 'australia', label: 'Australia' }
                          ].map((region) => (
                            <FormField
                              key={region.id}
                              control={form.control}
                              name="regions"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={region.id}
                                    className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(region.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, region.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== region.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel>
                                        {region.label}
                                      </FormLabel>
                                    </div>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* GitHub badge */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">GitHub badge</h3>
                    
                    <div className="rounded-md border p-4 bg-gray-50">
                      <div className="flex items-start gap-3">
                        <Code className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-sm">Add status badge to your README.md</p>
                          <p className="text-sm text-gray-600 mt-1 font-mono bg-gray-100 p-2 rounded">
                            [![WebPulse Status](https://webpulse.example.com/badge/yourmonitor)](https://webpulse.example.com/status/yourmonitor)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Metadata section */}
                  <Accordion type="single" collapsible>
                    <AccordionItem value="metadata">
                      <AccordionTrigger>Metadata</AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <p className="text-sm text-gray-600">
                          Add custom metadata tags to organize and filter your monitors
                        </p>
                        <div className="flex gap-2">
                          <Input placeholder="Key" className="w-1/2" />
                          <Input placeholder="Value" className="w-1/2" />
                        </div>
                        <Button variant="outline" size="sm">
                          Add tag
                        </Button>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </TabsContent>
                
                <div className="flex justify-end pt-4">
                  <Button type="submit" className="px-6">
                    Create monitor
                  </Button>
                </div>
              </form>
            </Form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateMonitorForm;