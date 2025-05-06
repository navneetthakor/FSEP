import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Plus } from 'lucide-react';

const RequestForm = (props) => {
  // extracting props 
  const nodeConfig = props.nodeConfig;

  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [bodyType, setBodyType] = useState('json');
  const [body, setBody] = useState('');
  const [headers, setHeaders] = useState([{ key: '', value: '' }]);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
    nodeConfig.properties.headers = [...headers, { key: '', value: '' }]
  };

  const removeHeader = (index) => {
    const newHeaders = [...headers];
    newHeaders.splice(index, 1);
    setHeaders(newHeaders);

    nodeConfig.properties.headers = newHeaders;
  };

  const updateHeaderKey = (index, value) => {
    const newHeaders = [...headers];
    newHeaders[index].key = value;
    setHeaders(newHeaders);
    nodeConfig.properties.headers = newHeaders;
  };

  const updateHeaderValue = (index, value) => {
    const newHeaders = [...headers];
    newHeaders[index].value = value;
    setHeaders(newHeaders);
    nodeConfig.properties.headers = newHeaders;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      // Prepare headers
      const requestHeaders = {};
      headers.forEach(header => {
        if (header.key.trim()) {
          requestHeaders[header.key] = header.value;
        }
      });

      // Prepare body based on bodyType
      let requestBody = undefined;
      let contentTypeHeader = '';

      if (method !== 'GET' && method !== 'HEAD') {
        if (bodyType === 'json' && body.trim()) {
          try {
            requestBody = body;
            contentTypeHeader = 'application/json';
          } catch (e) {
            console.log(e);
            setError('Invalid JSON format');
            setLoading(false);
            return;
          }
        } else if (bodyType === 'formData' && body.trim()) {
          const formData = new FormData();
          try {
            // Assume body is formatted as key=value&key2=value2...
            const pairs = body.split('&');
            pairs.forEach(pair => {
              const [key, value] = pair.split('=');
              if (key) formData.append(key, value || '');
            });
            requestBody = formData;
            // Don't set content-type for FormData, browser will set it with boundary
          } catch (e) {
            console.log(e);
            setError('Invalid form data format');
            setLoading(false);
            return;
          }
        } else if (bodyType === 'text' && body.trim()) {
          requestBody = body;
          contentTypeHeader = 'text/plain';
        } else if (bodyType === 'urlencoded' && body.trim()) {
          contentTypeHeader = 'application/x-www-form-urlencoded';
          requestBody = body; // Browser will handle this
        }
      }

      // Add content-type header if set and not already defined by user
      if (contentTypeHeader && !requestHeaders['Content-Type']) {
        requestHeaders['Content-Type'] = contentTypeHeader;
      }

      // Make the request
      const requestOptions = {
        method,
        headers: requestHeaders,
        body: (method !== 'GET' && method !== 'HEAD') ? requestBody : undefined
      };

      const response = await fetch(url, requestOptions);

      // Handle response
      const contentType = response.headers.get('content-type');
      let responseData;

      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      setResponse({
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries([...response.headers.entries()]),
        data: responseData
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Web Pulse Request</CardTitle>
          <CardDescription>Configure your HTTP request with custom headers and body</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* URL and Method Row */}
            <div className="flex gap-2">
              <div className="w-1/5">
                <Select value={method} onValueChange={(e) =>  {
                  setMethod(e);
                  nodeConfig.properties.method = e;
                  }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                    <SelectItem value="HEAD">HEAD</SelectItem>
                    <SelectItem value="OPTIONS">OPTIONS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Input
                  placeholder="Enter URL"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    nodeConfig.properties.url = e.target.value;
                  }}
                  required
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send'}
              </Button>
            </div>

            {/* Headers Section */}
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Headers</h3>
              {headers.map((header, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    placeholder="Header name"
                    value={header.key}
                    onChange={(e) => updateHeaderKey(index, e.target.value)}
                    className="w-1/2"
                  />
                  <Input
                    placeholder="Value"
                    value={header.value}
                    onChange={(e) => updateHeaderValue(index, e.target.value)}
                    className="w-1/2"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeHeader(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addHeader}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Header
              </Button>
            </div>

            {/* Request Body Section - Shown only for non-GET methods */}
            {method !== 'GET' && method !== 'HEAD' && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium">Request Body</h3>
                  <Select value={bodyType} onValueChange={(e) => {
                    setBodyType(e);
                    nodeConfig.properties.bodyType = e;
                  }}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Body Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="formData">Form Data</SelectItem>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="urlencoded">URL Encoded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Textarea
                  placeholder={
                    bodyType === 'json'
                      ? '{"key": "value"}'
                      : bodyType === 'formData'
                        ? 'key1=value1&key2=value2'
                        : bodyType === 'urlencoded'
                          ? 'key1=value1&key2=value2'
                          : 'Enter your request body'
                  }
                  value={body}
                  onChange={(e) => {
                    setBody(e.target.value);
                    nodeConfig.properties.body = e.target.value;
                  }
                  }
                  rows={5}
                  className="font-mono text-sm"
                />
                {bodyType === 'json' && (
                  <p className="text-sm text-gray-500 mt-1">
                    Enter valid JSON format
                  </p>
                )}
                {bodyType === 'formData' && (
                  <p className="text-sm text-gray-500 mt-1">
                    Enter as key=value pairs separated by &
                  </p>
                )}
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Response Section */}
      {error && (
        <Card className="mb-6 border-red-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      )}

      {response && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>
              Response <span className={response.status < 400 ? "text-green-500" : "text-red-500"}>
                {response.status} {response.statusText}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="response">
              <TabsList>
                <TabsTrigger value="response">Body</TabsTrigger>
                <TabsTrigger value="headers">Headers</TabsTrigger>
              </TabsList>
              <TabsContent value="response" className="mt-2 ">
                <div className="p-4 rounded-md overflow-x-auto text-sm font-mono h-[20vh] w-[30vw] border-5 overflow-y-scroll">
                  {typeof response.data === 'object'
                    ? JSON.stringify(response.data, null, 2)
                    : response.data}
                </div>
              </TabsContent>
              <TabsContent value="headers" className="mt-2 h-[10vh] w-[30vw] overflow-y-auto">
                <div className="p-4 rounded-md">
                  {Object.entries(response.headers).map(([key, value]) => (
                    <div key={key} className="mb-1">
                      <span className="font-medium">{key}:</span> {value}
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RequestForm;