// WebPulseRequestFlowPage.jsx
import React, { useState } from 'react';
import { Button } from './components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import RequestFlowCanvas from './scenes/CanvasFlow';
import { WebPulseFlowGenerator } from './scenes/FlowGenrator';

const WebPulseRequestFlowPage = () => {
  const [flowData, setFlowData] = useState({
    nodes: [],
    edges: []
  });
  const [generatedCode, setGeneratedCode] = useState('');
  const [currentTab, setCurrentTab] = useState('design');
  const [codeFormat, setCodeFormat] = useState('function');
  
  // Update flow data from canvas
  const handleFlowUpdate = (updatedFlow) => {
    setFlowData(updatedFlow);
  };
  
  // Generate code based on the current flow
  const generateCode = () => {
    const generator = new WebPulseFlowGenerator();
    generator.importFlow(flowData);
    
    let code;
    if (codeFormat === 'function') {
      code = generator.generateCode({
        includeComments: true,
        includeExampleUsage: true
      });
    } else if (codeFormat === 'module') {
      code = generator.generateModule({
        moduleType: 'esm',
        includeUtils: false
      });
    } else {
      // Standalone package with utils
      code = {
        main: generator.generateModule({
          moduleType: 'esm',
          includeUtils: true
        }),
        utils: generator.generateUtilsModule('esm')
      };
      
      // Format as string for display
      code = `// Main Module (webpulse-flow.js)\n\n${code.main}\n\n// Utils Module (webpulse-utils.js)\n\n${code.utils}`;
    }
    
    setGeneratedCode(code);
    setCurrentTab('code');
  };
  
  // Execute the flow for testing
  const executeFlow = async () => {
    try {
      // Get the generated code
      const generator = new WebPulseFlowGenerator();
      generator.importFlow(flowData);
      const code = generator.generateCode();
      
      // Create a function from the code
      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
      const flowFn = new AsyncFunction(`
        ${code}
        return executeRequestFlow();
      `);
      
      // Execute the function
      const result = await flowFn();
      console.log('Flow execution result:', result);
      
      // Display result (you could show this in a modal/panel)
      alert('Flow executed successfully! Check console for details.');
    } catch (error) {
      console.error('Error executing flow:', error);
      alert(`Error executing flow: ${error.message}`);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">WebPulse Request Flow Designer</h1>
        <p className="text-gray-600">
          Design HTTP request flows visually and generate executable JavaScript code
        </p>
      </div>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="design">Design Canvas</TabsTrigger>
            <TabsTrigger value="code">Generated Code</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            {currentTab === 'design' && (
              <>
                <Button variant="outline" onClick={generateCode}>
                  Generate Code
                </Button>
                <Button variant="default" onClick={executeFlow}>
                  Execute Flow
                </Button>
              </>
            )}
            
            {currentTab === 'code' && (
              <>
                <select 
                  className="border rounded p-2"
                  value={codeFormat}
                  onChange={(e) => setCodeFormat(e.target.value)}
                >
                  <option value="function">Single Function</option>
                  <option value="module">ES Module</option>
                  <option value="package">Complete Package</option>
                </select>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    navigator.clipboard.writeText(generatedCode);
                    // Show a toast notification here
                  }}
                >
                  Copy Code
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    // Create file download
                    const blob = new Blob([generatedCode], { type: 'text/javascript' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = codeFormat === 'package' ? 'webpulse-flow-package.js' : 'webpulse-flow.js';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                >
                  Download
                </Button>
              </>
            )}
          </div>
        </div>
        
        <TabsContent value="design" className="flex-1">
          <div className="h-full border rounded-md overflow-hidden">
            <RequestFlowCanvas onUpdate={handleFlowUpdate} />
          </div>
        </TabsContent>
        
        <TabsContent value="code" className="flex-1">
          <div className="h-full border rounded-md overflow-hidden bg-gray-50 p-4">
            <pre className="h-full overflow-auto">
              {generatedCode}
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WebPulseRequestFlowPage;