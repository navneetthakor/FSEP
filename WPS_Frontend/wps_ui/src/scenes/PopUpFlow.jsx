import React, { useState, useRef, useEffect } from 'react';
import { PlusCircle, Trash2, Code, Save, Play, ArrowRight, Database, FileJson, Server, Loader, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import RequestForm from './RequestForm';
import { WebPulseFlowGenerator } from './FlowGenrator';

// Node types with their configurations
const NODE_TYPES = {
  REQUEST: {
    name: 'HTTP Request',
    icon: <Server className="h-4 w-4" />,
    color: 'bg-blue-100 border-blue-300',
    inputs: ['url', 'method', 'headers', 'body'],
    outputs: ['response']
  },
  CONDITION: {
    name: 'Condition',
    icon: <FileJson className="h-4 w-4" />,
    color: 'bg-yellow-100 border-yellow-300',
    inputs: ['condition'],
    outputs: ['true', 'false']
  },
  TRANSFORM: {
    name: 'Transform',
    icon: <Database className="h-4 w-4" />,
    color: 'bg-green-100 border-green-300',
    inputs: ['input'],
    outputs: ['output']
  }
};

// New component for test flow results
const FlowTestResults = ({ isOpen, onClose, testResults, isLoading }) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Flow Test Results</DialogTitle>
        </DialogHeader>
        
        <div className="max-h-96 overflow-auto">
          {isLoading ? (
            <div className="flex justify-center p-8 items-center">
              <Loader className="h-10 text-blue-500 w-10 animate-spin" />
              <span className="text-lg ml-4">Executing flow...</span>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">Execution Steps</h3>
                {testResults.steps.map((step, index) => (
                  <div 
                    key={index} 
                    className={`border mb-2 rounded-md p-3 ${
                      step.status === 'success' ? 'bg-green-50 border-green-200' : 
                      step.status === 'error' ? 'bg-red-50 border-red-200' : 
                      'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center mb-1">
                      {step.status === 'success' ? (
                        <CheckCircle className="h-5 text-green-500 w-5 mr-2" />
                      ) : step.status === 'error' ? (
                        <XCircle className="h-5 text-red-500 w-5 mr-2" />
                      ) : (
                        <AlertCircle className="h-5 text-gray-500 w-5 mr-2" />
                      )}
                      <span className="font-medium">{step.nodeName} ({step.nodeType})</span>
                    </div>
                    <div className="text-sm ml-7">
                      <div className="mb-1">
                        <span className="font-medium">Input: </span>
                        <code className="bg-gray-100 rounded text-xs px-1">{JSON.stringify(step.input)}</code>
                      </div>
                      <div>
                        <span className="font-medium">Output: </span>
                        <code className="bg-gray-100 rounded text-xs px-1">{JSON.stringify(step.output)}</code>
                      </div>
                      {step.status === 'error' && (
                        <div className="text-red-600 mt-1">
                          <span className="font-medium">Error: </span>
                          {step.error}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">Final Result</h3>
                <div className={`border rounded-md p-4 ${
                  testResults.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center mb-2">
                    {testResults.success ? (
                      <CheckCircle className="h-6 text-green-500 w-6 mr-2" />
                    ) : (
                      <XCircle className="h-6 text-red-500 w-6 mr-2" />
                    )}
                    <span className="text-lg font-medium">
                      {testResults.success ? 'Flow executed successfully' : 'Flow execution failed'}
                    </span>
                  </div>
                  {testResults.finalOutput && (
                    <div className="mt-2">
                      <div className="font-medium mb-1">Output data:</div>
                      <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                        {JSON.stringify(testResults.finalOutput, null, 2)}
                      </pre>
                    </div>
                  )}
                  {!testResults.success && testResults.error && (
                    <div className="mt-2">
                      <div className="text-red-600 font-medium mb-1">Error:</div>
                      <pre className="bg-red-100 p-3 rounded text-sm overflow-auto">
                        {testResults.error}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Close
          </Button>
          {!isLoading && (
            <Button onClick={() => {
              // Export test results
              const exportData = JSON.stringify(testResults, null, 2);
              const blob = new Blob([exportData], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'flow-test-results.json';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }}>
              Export Results
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const RequestFlowCanvas2 = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [isCreatingEdge, setIsCreatingEdge] = useState(false);
  const [startNode, setStartNode] = useState(null);
  const [startPort, setStartPort] = useState(null);
  const [showNodeDialog, setShowNodeDialog] = useState(false);
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [nodeConfig, setNodeConfig] = useState({
    type: 'REQUEST',
    id: '',
    name: '',
    properties: {}
  });
  
  const canvasRef = useRef(null);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [draggedNode, setDraggedNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [generatedCode, setGeneratedCode] = useState('');
  
  // New state for test results visualization
  const [showTestResults, setShowTestResults] = useState(false);
  const [testResults, setTestResults] = useState({ 
    steps: [], 
    success: false, 
    finalOutput: null, 
    error: null 
  });
  const [isTestLoading, setIsTestLoading] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setCanvasOffset({ x: rect.left, y: rect.top });
    }
  }, []);

  // Add a new node to the canvas
  const addNode = (type, position) => {
    const newNode = {
      id: `${type}_${Date.now()}`,
      type,
      name: nodeConfig.name || `${NODE_TYPES[type].name}`,
      position,
      properties: nodeConfig.properties || {}
    };
    setNodes([...nodes, newNode]);
    return newNode;
  };

  // Save the node configuration
  const saveNodeConfig = () => {
    if (selectedNode) {
      // Update existing node
      const updatedNodes = nodes.map(node => 
        node.id === selectedNode.id 
          ? { ...node, name: nodeConfig.name, properties: nodeConfig.properties }
          : node
      );
      setNodes(updatedNodes);
    } else {
      // Create new node in the center of the canvas
      const position = { 
        x: canvasRef.current.clientWidth / 2 - 100, 
        y: 100  // Start from the top for vertical flow
      };
      addNode(nodeConfig.type, position);
    }
    setShowNodeDialog(false);
  };

  // Handle node click
  const handleNodeClick = (node, e) => {
    e.stopPropagation();
    if (isCreatingEdge) {
      // We're connecting nodes
      return;
    }
    setSelectedNode(node);
    setSelectedEdge(null);
    setNodeConfig({
      type: node.type,
      name: node.name,
      properties: { ...node.properties }
    });
  };

  // Handle canvas click
  const handleCanvasClick = () => {
    setSelectedNode(null);
    setSelectedEdge(null);
    if (isCreatingEdge) {
      setIsCreatingEdge(false);
      setStartNode(null);
      setStartPort(null);
    }
  };

  // Handle node drag start
  const handleNodeDragStart = (node, e) => {
    e.stopPropagation();
    if (isCreatingEdge) return;
    
    setDraggedNode(node);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Handle node drag
  const handleNodeDrag = (e) => {
    if (draggedNode && !isCreatingEdge) {
      const updatedNodes = nodes.map(node => {
        if (node.id === draggedNode.id) {
          return {
            ...node,
            position: {
              x: e.clientX - canvasOffset.x - dragOffset.x,
              y: e.clientY - canvasOffset.y - dragOffset.y
            }
          };
        }
        return node;
      });
      setNodes(updatedNodes);
    }
  };

  // Handle node drag end
  const handleNodeDragEnd = () => {
    setDraggedNode(null);
  };

  // Handle port click (for creating edges)
  const handlePortClick = (node, isOutput, portName, e) => {
    e.stopPropagation();
    
    if (!isCreatingEdge) {
      // Start creating an edge
      setIsCreatingEdge(true);
      setStartNode(node);
      setStartPort({ isOutput, name: portName });
    } else {
      // Finish creating an edge
      const endNode = node;
      const endPort = { isOutput, name: portName };
      
      // Can only connect from output to input
      if (startPort.isOutput && !endPort.isOutput) {
        const newEdge = {
          id: `edge_${Date.now()}`,
          source: startNode.id,
          sourcePort: startPort.name,
          target: endNode.id,
          targetPort: endPort.name
        };
        setEdges([...edges, newEdge]);
      }
      
      setIsCreatingEdge(false);
      setStartNode(null);
      setStartPort(null);
    }
  };

  // Delete selected node or edge
  const deleteSelected = () => {
    if (selectedNode) {
      setNodes(nodes.filter(node => node.id !== selectedNode.id));
      setEdges(edges.filter(edge => 
        edge.source !== selectedNode.id && edge.target !== selectedNode.id
      ));
      setSelectedNode(null);
    } else if (selectedEdge) {
      setEdges(edges.filter(edge => edge.id !== selectedEdge.id));
      setSelectedEdge(null);
    }
  };

  // Handle edge click for selection
  const handleEdgeClick = (edge, e) => {
    e.stopPropagation();
    setSelectedNode(null);
    setSelectedEdge(edge);
  };

  // Mock function to execute a node for testing
  const executeNode = async (node, inputData) => {
    return new Promise((resolve, reject) => {
      // Simulate processing time
      setTimeout(() => {
        try {
          switch (node.type) {
            case 'REQUEST':
              // Simulate HTTP request
              const { url, method, headers, body } = node.properties;
              console.log(`Executing ${method} request to ${url}`);
              
              // Simulate successful response (in real implementation, fetch would be used)
              const responseData = {
                status: 200,
                statusText: 'OK',
                headers: { 'content-type': 'application/json' },
                data: { success: true, message: 'Request completed', timestamp: new Date().toISOString() }
              };
              resolve(responseData);
              break;
              
            case 'CONDITION':
              // Evaluate condition
              const condition = node.properties.condition;
              console.log(`Evaluating condition: ${condition}`);
              
              // In real implementation, this would use a safe evaluation of the condition
              // For demo, we'll just simulate
              const result = Math.random() > 0.5; // Random result for demo
              resolve({ conditionResult: result });
              break;
              
            case 'TRANSFORM':
              // Transform the data
              const transform = node.properties.transform;
              console.log(`Applying transformation: ${transform}`);
              
              // Simulate data transformation
              const transformedData = {
                ...inputData,
                transformed: true,
                processedAt: new Date().toISOString()
              };
              resolve(transformedData);
              break;
              
            default:
              reject(new Error(`Unknown node type: ${node.type}`));
          }
        } catch (error) {
          reject(error);
        }
      }, 1000); // Simulate processing delay
    });
  };

  // Test the flow
  const testFlow = async () => {
    console.log("Testing flow:", { nodes, edges });
    
    setTestResults({ steps: [], success: false, finalOutput: null, error: null });
    setIsTestLoading(true);
    setShowTestResults(true);
    
    try {
      // Generate a topological sort of nodes based on edges
      const nodeMap = {};
      nodes.forEach(node => {
        nodeMap[node.id] = { ...node, inDegree: 0, nextNodes: [] };
      });
      
      edges.forEach(edge => {
        if (nodeMap[edge.target]) {
          nodeMap[edge.target].inDegree++;
        }
        if (nodeMap[edge.source]) {
          nodeMap[edge.source].nextNodes.push({
            nodeId: edge.target,
            sourcePort: edge.sourcePort,
            targetPort: edge.targetPort
          });
        }
      });
      
      // Find start nodes (with inDegree of 0)
      const startNodes = Object.values(nodeMap).filter(node => node.inDegree === 0);
      
      if (startNodes.length === 0) {
        throw new Error("No start node found. Flow must have at least one node without incoming connections.");
      }
      
      // Data store to keep track of results
      const dataStore = {};
      const steps = [];
      
      // Execute the flow starting from start nodes
      const executeFlow = async (node, inputData) => {
        console.log(`Executing node: ${node.name} (${node.type})`);
        
        try {
          // Execute the node
          const nodeResult = await executeNode(node, inputData);
          
          // Store the result
          dataStore[node.id] = nodeResult;
          
          // Add to steps
          steps.push({
            nodeId: node.id,
            nodeName: node.name,
            nodeType: node.type,
            input: inputData,
            output: nodeResult,
            status: 'success'
          });
          
          // Find next nodes to execute
          for (const nextNode of node.nextNodes) {
            if (nodeMap[nextNode.nodeId]) {
              await executeFlow(nodeMap[nextNode.nodeId], nodeResult);
            }
          }
          
          return nodeResult;
        } catch (error) {
          console.error(`Error executing node ${node.name}:`, error);
          
          // Add error to steps
          steps.push({
            nodeId: node.id,
            nodeName: node.name,
            nodeType: node.type,
            input: inputData,
            output: null,
            status: 'error',
            error: error.message
          });
          
          throw error;
        }
      };
      
      // Execute all start nodes
      let finalOutput = null;
      for (const startNode of startNodes) {
        // Start with empty input for start nodes
        const result = await executeFlow(startNode, {});
        finalOutput = result; // Last result becomes the final output
      }
      
      setTestResults({
        steps,
        success: true,
        finalOutput,
        error: null
      });
      
    } catch (error) {
      console.error("Flow execution error:", error);
      
      setTestResults(prev => ({
        ...prev,
        success: false,
        error: error.message
      }));
    } finally {
      setIsTestLoading(false);
    }
  };

  // Schedule the flow
  const scheduleFlow = () => {
    console.log("Scheduling flow:", { nodes, edges });
    
    // Implement schedule functionality
  };

  // Clear the canvas
  const clearCanvas = () => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setSelectedEdge(null);
  };

  // Generate code
  const generateCode = () => {
    const myFlow = {
      nodes: nodes || [],
      edges: edges || []
    };

    const generator = new WebPulseFlowGenerator();
    generator.importFlow(myFlow);

    const code = generator.generateCode({
      includeComments: true,
      includeExampleUsage: true,
      functionName: 'myCustomFlow',
      errorHandling: 'advanced'
    });

    setGeneratedCode(code);
    setShowCodeDialog(true);
  };

  // Render the node
  const renderNode = (node) => {
    const nodeType = NODE_TYPES[node.type];
    const isSelected = selectedNode && selectedNode.id === node.id;
    
    return (
      <div
        key={node.id}
        className={`absolute ${nodeType.color} border-2 rounded-md shadow-md ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
        style={{
          left: node.position.x,
          top: node.position.y,
          width: 200,
          zIndex: isSelected ? 10 : 1
        }}
        onClick={(e) => handleNodeClick(node, e)}
        onMouseDown={(e) => handleNodeDragStart(node, e)}
      >
        <div className="flex bg-opacity-50 bg-white border-b border-gray-300 justify-between p-2 font-medium items-center">
          <div className="flex gap-2 items-center">
            {nodeType.icon}
            <div className="flex flex-col">
              <span className="text-sm font-semibold truncate">{node.name}</span>
              <span className="text-gray-500 text-xs">{nodeType.name}</span>
            </div>
          </div>
        </div>
        
        {/* Input ports */}
        <div className="p-2 text-xs">
          <div className="mb-2">
            <div className="text-gray-500 mb-1">Inputs:</div>
            {nodeType.inputs.map(input => (
              <div key={`${node.id}-in-${input}`} className="flex items-center mb-1">
                <button 
                  className={`w-4 h-4 rounded-full border border-gray-500 flex items-center justify-center bg-white hover:bg-blue-100 ${isCreatingEdge && !startPort?.isOutput ? 'bg-blue-200' : ''}`}
                  onClick={(e) => handlePortClick(node, false, input, e)}
                >
                  <div className="bg-gray-500 h-2 rounded-full w-2"></div>
                </button>
                <span className="ml-2">{input}</span>
              </div>
            ))}
          </div>
          
          {/* Output ports */}
          <div>
            <div className="text-gray-500 mb-1">Outputs:</div>
            {nodeType.outputs.map(output => (
              <div key={`${node.id}-out-${output}`} className="flex justify-between items-center mb-1">
                <span className="mr-2">{output}</span>
                <button 
                  className={`w-4 h-4 rounded-full border border-gray-500 flex items-center justify-center bg-white hover:bg-blue-100 ${isCreatingEdge && startPort?.isOutput ? 'bg-blue-200' : ''}`}
                  onClick={(e) => handlePortClick(node, true, output, e)}
                >
                  <div className="bg-gray-500 h-2 rounded-full w-2"></div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render edges between nodes
  const renderEdges = () => {
    return edges.map(edge => {
      const sourceNode = nodes.find(node => node.id === edge.source);
      const targetNode = nodes.find(node => node.id === edge.target);
      
      if (!sourceNode || !targetNode) return null;
      
      const sourceType = NODE_TYPES[sourceNode.type];
      const targetType = NODE_TYPES[targetNode.type];
      
      // Find the index of the port to calculate position
      const sourcePortIndex = sourceType.outputs.indexOf(edge.sourcePort);
      const targetPortIndex = targetType.inputs.indexOf(edge.targetPort);
      
      if (sourcePortIndex === -1 || targetPortIndex === -1) return null;
      
      // Calculate start position (output port)
      const startX = sourceNode.position.x + 200; // Node width
      const startY = sourceNode.position.y + 50 + (sourcePortIndex * 20); // Base + offset
      
      // Calculate end position (input port)
      const endX = targetNode.position.x;
      const endY = targetNode.position.y + 50 + (targetPortIndex * 20); // Base + offset
      
      // Create a path
      const midX = (startX + endX) / 2;
      const path = `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;
      
      const isSelected = selectedEdge && selectedEdge.id === edge.id;
      
      return (
        <svg
          key={edge.id}
          className="h-full w-full absolute left-0 top-0"
          style={{ zIndex: 0 }}
        >
          <path
            d={path}
            fill="none"
            stroke={isSelected ? "#3b82f6" : "#9ca3af"}
            strokeWidth={isSelected ? 3 : 2}
            className="cursor-pointer"
            onClick={(e) => handleEdgeClick(edge, e)}
            markerEnd="url(#arrowhead)"
          />
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill={isSelected ? "#3b82f6" : "#9ca3af"} />
            </marker>
          </defs>
        </svg>
      );
    });
  };

  return (
    <div className="flex flex-col h-full w-3/4 ml-auto" style={{ minHeight: "calc(100vh - 64px)" }}>
      <div className="flex border-b justify-between p-4 items-center">
        <h2 className="text-xl font-semibold">Flow Designer</h2>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowNodeDialog(true)}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Node
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={deleteSelected}
            disabled={!selectedNode && !selectedEdge}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete {selectedEdge ? "Edge" : selectedNode ? "Node" : ""}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={generateCode}
          >
            <Code className="h-4 w-4 mr-2" />
            Generate Code
          </Button>
        </div>
      </div>
      
      <div className="flex-1 relative">
        <div 
          ref={canvasRef}
          className="bg-gray-50 h-full w-full dark:bg-gray-800 overflow-auto relative"
          onClick={handleCanvasClick}
          onMouseMove={handleNodeDrag}
          onMouseUp={handleNodeDragEnd}
        >
          {nodes.map(renderNode)}
          {renderEdges()}
        </div>
        
        {/* Bottom right action buttons */}
        <div className="flex absolute bottom-4 right-4 space-x-2">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={testFlow}
          >
            <Play className="h-4 w-4 mr-1" />
            Test
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={scheduleFlow}
          >
            Schedule
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={clearCanvas}
          >
            Clear
          </Button>
        </div>
      </div>
      
      {/* Node Configuration Dialog */}
      <Dialog open={showNodeDialog} onOpenChange={setShowNodeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedNode ? 'Edit Node' : 'Add New Node'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 gap-4 items-center">
              <label htmlFor="nodeType" className="text-right">Type:</label>
              <Select 
                value={nodeConfig.type} 
                onValueChange={(value) => setNodeConfig({...nodeConfig, type: value})}
                disabled={!!selectedNode}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(NODE_TYPES).map(type => (
                    <SelectItem key={type} value={type}>
                      {NODE_TYPES[type].name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 gap-4 items-center">
              <label htmlFor="nodeName" className="text-right">Name:</label>
              <Input
                id="nodeName"
                className="col-span-3"
                value={nodeConfig.name}
                onChange={(e) => setNodeConfig({...nodeConfig, name: e.target.value})}
                placeholder={NODE_TYPES[nodeConfig.type]?.name || "Node name"}
              />
            </div>
            
            {/* Dynamic properties based on node type */}
            {nodeConfig.type === 'REQUEST' && (
              <RequestForm 
                nodeConfig={nodeConfig} 
                setNodeConfig={setNodeConfig}
              />
            )}
            
            {nodeConfig.type === 'CONDITION' && (
              <div className="grid grid-cols-4 gap-4 items-center">
                <label htmlFor="condition" className="text-right">Condition:</label>
                <Input
                  id="condition"
                  className="col-span-3"
                  value={nodeConfig.properties?.condition || ''}
                  onChange={(e) => setNodeConfig({
                    ...nodeConfig,
                    properties: {...nodeConfig.properties, condition: e.target.value}
                  })}
                  placeholder="dataStore.someNode.body.status === 'success'"
                />
              </div>
            )}
            
             {nodeConfig.type === 'TRANSFORM' && (
                          <div className="grid grid-cols-4 gap-4 items-center">
                            <label htmlFor="transform" className="text-right">Transform:</label>
                            <textarea
                              id="transform"
                              className="col-span-3 border p-2 rounded min-h-24"
                              value={nodeConfig.properties?.transform || ''}
                              onChange={(e) => setNodeConfig({
                                ...nodeConfig,
                                properties: {...nodeConfig.properties, transform: e.target.value}
                              })}
                              placeholder="// Transform the data\nconst result = {...};\nreturn result;"
                            />
                          </div>
                        )}
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowNodeDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={saveNodeConfig}>
                          {selectedNode ? 'Update' : 'Add'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  {/* Generated Code Dialog */}
                  <Dialog open={showCodeDialog} onOpenChange={setShowCodeDialog}>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>Generated Flow Code</DialogTitle>
                      </DialogHeader>
                      
                      <div className="bg-gray-100 p-4 rounded max-h-96 overflow-auto">
                        <pre className="text-sm whitespace-pre-wrap">
                          {generatedCode}
                        </pre>
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCodeDialog(false)}>
                          Close
                        </Button>
                        <Button onClick={() => {
                          navigator.clipboard.writeText(generatedCode);
                          // You would show a toast here
                        }}>
                          Copy to Clipboard
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              );
            };
            
            export default RequestFlowCanvas2;