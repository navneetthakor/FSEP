import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "../ui/card";
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
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import ModalPopup from './MessagePopUp';

// Validation schema using Yup
const validationSchema = Yup.object({
  server_name: Yup.string().required("Server name is required"),
  method: Yup.string()
    .oneOf(["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"], "Invalid HTTP method")
    .required("HTTP method is required"),
  url: Yup.string().url("Invalid URL").required("URL is required"),
  headers: Yup.array().of(
    Yup.object().shape({
      key: Yup.string().required("Header key is required"),
      value: Yup.string().required("Header value is required")
    })
  ),
  body: Yup.string(),
  type_of_check: Yup.string()
    .oneOf(['UBU', 'URHSCOT', 'UCK', 'UNCK', 'URTGT'], "Invalid check type")
    .required("Check type is required"),
  check_frequency: Yup.string()
    .oneOf(['TS', 'FFS', 'OM', 'TWOM', 'THRM', 'FIVM', 'TENM', 'FIFM', 'HAFH', 'OH'], "Invalid check frequency")
    .required("Check frequency is required"),
  keyword: Yup.string(),
  status_codes: Yup.array().of(Yup.number())
});

// Form Label component
const FormLabel = ({ children }) => (
  <label className="block text-sm font-medium text-gray-700 mb-1">{children}</label>
);

// Form Description component
const FormDescription = ({ children }) => (
  <p className="mt-1 text-sm text-gray-500">{children}</p>
);

// Error Message component
const FormErrorMessage = ({ name }) => (
  <ErrorMessage name={name}>
    {(msg) => <p className="mt-1 text-sm text-red-500">{msg}</p>}
  </ErrorMessage>
);

const CreateMonitorForm = () => {
  // Status modal (success / failure)
  const [activateModal, setActivateModal] = useState(false);

  // Initial form values
  const initialValues = {
    server_name: "",
    method: "GET",
    url: "",
    headers: [],
    body: "",
    type_of_check: "UBU",
    check_frequency: "TS",
    keyword: "",
    status_codes: []
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Preparing URL
      // eslint-disable-next-line no-undef
      let url = `${import.meta.env.VITE_BACKEND_URL}/Server/addServer`;

      const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "usertoken": localStorage.getItem('usertoken')
        },
        body: JSON.stringify({
          server_name: values.server_name,
          method: values.method,
          server_url: values.url,
          Headers: values.headers,
          body: values.body,
          type_of_check: values.type_of_check,
          check_frequency: values.check_frequency,
          keyword: values.keyword,
          status_codes: values.status_codes,
        })
      });

      const jsonResp = await response.json();
      console.log("register response", jsonResp);

      if (!jsonResp.IsError) {
        setActivateModal({
          type: 'success',
          title: 'Monitor scheduled Successfully',
          message: ' Redirecting to Dashboard ...',
          navigatePath: '/dashboard/monitorsHome' // The path you want to navigate to
        });
        setTimeout(() => {
          setActivateModal(null);
        }, 3000);
      } else {
        setActivateModal({
          type: 'error',
          title: 'Scheduling went UnSuccessful',
          message: 'Please Try later',
          navigatePath: null // The path you want to navigate to
        });
        setTimeout(() => {
          setActivateModal(null);
        }, 3000);
      }
    } catch (error) {
      console.error("Submission error:", error);
      setActivateModal({
        type: 'error',
        title: 'Error',
        message: 'An error occurred. Please try again later.',
        navigatePath: null
      });
      setTimeout(() => {
        setActivateModal(null);
      }, 3000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container p-4 max-w-2xl mx-auto h-[95vh] overflow-y-scroll">
      {activateModal && (
        <ModalPopup
          type={activateModal.type}
          title={activateModal.title}
          message={activateModal.message}
          navigatePath={activateModal.navigatePath}
          duration={3000} // 3 seconds auto-close
        />
      )}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create Monitor</CardTitle>
          <CardDescription>
            Configure monitoring settings for your server or endpoint
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, isSubmitting, setFieldValue }) => (
              <Form className="space-y-6">
                {/* Server Name */}
                <div className="space-y-1">
                  <FormLabel>Server Name</FormLabel>
                  <Field
                    as={Input}
                    name="server_name"
                    placeholder="Enter server name"
                    className={errors.server_name && touched.server_name ? "border-red-500" : ""}
                  />
                  <FormDescription>
                    Provide a descriptive name for the server or endpoint
                  </FormDescription>
                  <FormErrorMessage name="server_name" />
                </div>

                {/* HTTP Method */}
                <div className="space-y-1">
                  <FormLabel>HTTP Method</FormLabel>
                  <Field name="method">
                    {({ field }) => (
                      <Select
                        onValueChange={(value) => setFieldValue("method", value)}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select HTTP method" />
                        </SelectTrigger>
                        <SelectContent>
                          {["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"].map(method => (
                            <SelectItem key={method} value={method}>{method}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </Field>
                  <FormErrorMessage name="method" />
                </div>

                {/* URL */}
                <div className="space-y-1">
                  <FormLabel>URL</FormLabel>
                  <Field
                    as={Input}
                    name="url"
                    placeholder="https://example.com/endpoint"
                    className={errors.url && touched.url ? "border-red-500" : ""}
                  />
                  <FormDescription>
                    Enter the full URL of the endpoint to monitor
                  </FormDescription>
                  <FormErrorMessage name="url" />
                </div>

                {/* Headers */}
                <div className="space-y-1">
                  <FormLabel>Headers</FormLabel>
                  <FormDescription>
                    Add optional HTTP headers for the request
                  </FormDescription>
                  <FieldArray name="headers">
                    {({ push, remove }) => (
                      <div>
                        {values.headers && values.headers.length > 0 && values.headers.map((header, index) => (
                          <div key={index} className="flex gap-2 mb-2">
                            <Field
                              as={Input}
                              name={`headers.${index}.key`}
                              placeholder="Header Key"
                              className={
                                errors.headers?.[index]?.key && touched.headers?.[index]?.key
                                  ? "border-red-500"
                                  : ""
                              }
                            />
                            <Field
                              as={Input}
                              name={`headers.${index}.value`}
                              placeholder="Header Value"
                              className={
                                errors.headers?.[index]?.value && touched.headers?.[index]?.value
                                  ? "border-red-500"
                                  : ""
                              }
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              onClick={() => remove(index)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => push({ key: '', value: '' })}
                        >
                          Add Header
                        </Button>
                      </div>
                    )}
                  </FieldArray>
                </div>

                {/* Request Body */}
                <div className="space-y-1">
                  <FormLabel>Request Body (Optional)</FormLabel>
                  <Field
                    as={Textarea}
                    name="body"
                    placeholder="Enter request body (JSON, XML, etc.)"
                    className="font-mono"
                  />
                  <FormDescription>
                    Provide request body for POST, PUT, or PATCH methods
                  </FormDescription>
                  <FormErrorMessage name="body" />
                </div>

                {/* Type of Check */}
                <div className="space-y-1">
                  <FormLabel>Type of Check</FormLabel>
                  <Field name="type_of_check">
                    {({ field }) => (
                      <Select
                        onValueChange={(value) => setFieldValue("type_of_check", value)}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select check type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UBU">URL Becomes Unavailable</SelectItem>
                          <SelectItem value="URHSCOT">URL Returns Status Codes Other Then</SelectItem>
                          <SelectItem value="UCK">URL Contains Keyword</SelectItem>
                          <SelectItem value="UNCK">URL Not Contains Keyword</SelectItem>
                          <SelectItem value="URTGT">URL Response Time Greater Than</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </Field>
                  <FormErrorMessage name="type_of_check" />
                </div>

                {/* Check Frequency */}
                <div className="space-y-1">
                  <FormLabel>Check Frequency</FormLabel>
                  <Field name="check_frequency">
                    {({ field }) => (
                      <Select
                        onValueChange={(value) => setFieldValue("check_frequency", value)}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select check frequency" />
                        </SelectTrigger>
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
                    )}
                  </Field>
                  <FormErrorMessage name="check_frequency" />
                </div>

                {/* Keyword (Optional) */}
                <div className="space-y-1">
                  <FormLabel>Keyword (Optional)</FormLabel>
                  <Field
                    as={Input}
                    name="keyword"
                    placeholder="Enter keyword to search"
                  />
                  <FormDescription>
                    Optional keyword to search for in the response
                  </FormDescription>
                  <FormErrorMessage name="keyword" />
                </div>

                {/* Status Codes */}
                <div className="space-y-1">
                  <FormLabel>Status Codes (Optional)</FormLabel>
                  <FieldArray name="status_codes">
                    {({ push, remove }) => (
                      <div>
                        <div className="flex gap-2 mb-2 flex-wrap">
                          {values.status_codes && values.status_codes.length > 0 && values.status_codes.map((code, index) => (
                            <div key={index} className="flex gap-2">
                              <Field
                                as={Input}
                                type="number"
                                name={`status_codes.${index}`}
                                placeholder="Status Code"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                onClick={() => remove(index)}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => push(200)}
                        >
                          Add Status Code
                        </Button>
                      </div>
                    )}
                  </FieldArray>
                  <FormDescription>
                    Optional list of status codes to check against
                  </FormDescription>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <Button type="submit" className="px-6" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Monitor"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateMonitorForm;