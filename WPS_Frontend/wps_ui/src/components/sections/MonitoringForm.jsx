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
    resolver: zodResolver(formSchema),
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
    <div className="container p-4 max-w-2xl mx-auto h-[95vh] overflow-y-scroll">
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
                        <SelectItem value="URHSCOT">URL Returns Status Codes Other Then</SelectItem>
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