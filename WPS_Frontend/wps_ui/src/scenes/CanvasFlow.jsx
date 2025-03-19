// RequestFlowCanvas.jsx
import React, { useState, useRef, useEffect } from 'react';
import { PlusCircle, Trash2, Code, Save, Play, ArrowRight, Database, FileJson, Server } from 'lucide-react';
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
import { WebPulseFlowGenerator } from './FlowGenrator2';

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

const RequestFlowCanvas = () => {
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
  const [currentTab, setCurrentTab] = useState('design');
  
  const canvasRef = useRef(null);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [draggedNode, setDraggedNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [generatedCode, setGeneratedCode] = useState('');

  useEffect(() => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setCanvasOffset({ x: rect.left, y: rect.top });
    }
  }, []);

  // Add a new node to the canvas
  const addNode = (type, position) => {
    // const nodeType = NODE_TYPES[type];
    const newNode = {
      id: nodeConfig.name,
      type,
      // name: `${nodeType.name} ${nodes.length + 1}`,
      position,
      properties: nodeConfig.properties
    };
    console.log(newNode);
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
        y: canvasRef.current.clientHeight / 2 - 50 
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
    if (!isCreatingEdge) {
      setSelectedNode(null);
      setSelectedEdge(null);
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

  // Generate code for the flow
  // const generateCode = () => {
  //   // Sort nodes to ensure dependencies are processed in correct order
  //   const sortedNodes = [...nodes];
    
  //   let code = `// Generated by WebPulse Request Flow Designer\n`;
  //   code += `// ${new Date().toISOString()}\n\n`;
  //   code += `async function executeRequestFlow(initialData = {}) {\n`;
  //   code += `  // Initialize data store\n`;
  //   code += `  const dataStore = { ...initialData };\n`;
  //   code += `  let currentStep = null;\n\n`;
    
  //   // Generate code for each node
  //   sortedNodes.forEach(node => {
  //     code += `  // ${node.name} (${node.id})\n`;
      
  //     switch (node.type) {
  //       case 'REQUEST':
  //         code += `  currentStep = '${node.id}';\n`;
  //         code += `  try {\n`;
  //         code += `    console.log('Executing HTTP request: ${node.name}');\n`;
  //         code += `    const response_${node.id.replace(/-/g, '_')} = await fetch(\n`;
  //         code += `      ${JSON.stringify(node.properties.url || 'https://example.com')},\n`;
  //         code += `      {\n`;
  //         code += `        method: ${JSON.stringify(node.properties.method || 'GET')},\n`;
  //         code += `        headers: ${JSON.stringify(node.properties.headers || {})},\n`;
  //         code += `        body: ${node.properties.method !== 'GET' ? 
  //           `JSON.stringify(${JSON.stringify(node.properties.body || {})})` : 'undefined'},\n`;
  //         code += `      }\n`;
  //         code += `    );\n`;
  //         code += `    dataStore.${node.id} = {\n`;
  //         code += `      status: response_${node.id.replace(/-/g, '_')}.status,\n`;
  //         code += `      headers: Object.fromEntries(response_${node.id.replace(/-/g, '_')}.headers.entries()),\n`;
  //         code += `      body: await response_${node.id.replace(/-/g, '_')}.json()\n`;
  //         code += `    };\n`;
  //         code += `  } catch (error) {\n`;
  //         code += `    dataStore.${node.id}_error = error;\n`;
  //         code += `    console.error('Error in ${node.name}:', error);\n`;
  //         code += `  }\n\n`;
  //         break;
          
  //       case 'CONDITION':
  //         code += `  currentStep = '${node.id}';\n`;
  //         code += `  try {\n`;
  //         code += `    console.log('Evaluating condition: ${node.name}');\n`;
  //         code += `    const condition_${node.id.replace(/-/g, '_')} = (() => {\n`;
  //         code += `      try {\n`;
  //         code += `        return ${node.properties.condition || 'false'};\n`;
  //         code += `      } catch (e) {\n`;
  //         code += `        console.error('Error evaluating condition:', e);\n`;
  //         code += `        return false;\n`;
  //         code += `      }\n`;
  //         code += `    })();\n`;
  //         code += `    dataStore.${node.id}_result = condition_${node.id.replace(/-/g, '_')};\n`;
  //         code += `  } catch (error) {\n`;
  //         code += `    dataStore.${node.id}_error = error;\n`;
  //         code += `    console.error('Error in ${node.name}:', error);\n`;
  //         code += `  }\n\n`;
  //         break;
          
  //       case 'TRANSFORM':
  //         code += `  currentStep = '${node.id}';\n`;
  //         code += `  try {\n`;
  //         code += `    console.log('Executing transform: ${node.name}');\n`;
  //         code += `    const transform_${node.id.replace(/-/g, '_')} = (() => {\n`;
  //         code += `      try {\n`;
  //         code += `        ${node.properties.transform || '// No transform specified\nreturn dataStore;'};\n`;
  //         code += `      } catch (e) {\n`;
  //         code += `        console.error('Error in transform:', e);\n`;
  //         code += `        return null;\n`;
  //         code += `      }\n`;
  //         code += `    })();\n`;
  //         code += `    dataStore.${node.id}_output = transform_${node.id.replace(/-/g, '_')};\n`;
  //         code += `  } catch (error) {\n`;
  //         code += `    dataStore.${node.id}_error = error;\n`;
  //         code += `    console.error('Error in ${node.name}:', error);\n`;
  //         code += `  }\n\n`;
  //         break;
  //     }
  //   });
    
  //   // Add flow logic for edges
  //   if (edges.length > 0) {
  //     code += `  // Define the flow logic\n`;
  //     code += `  const flowLogic = {\n`;
  //     nodes.forEach(node => {
  //       const nodeEdges = edges.filter(edge => edge.source === node.id);
  //       if (nodeEdges.length > 0) {
  //         code += `    '${node.id}': {\n`;
  //         nodeEdges.forEach(edge => {
  //           code += `      '${edge.sourcePort}': '${edge.target}',\n`;
  //         });
  //         code += `    },\n`;
  //       }
  //     });
  //     code += `  };\n\n`;
  //   }
    
  //   code += `  // Return the final data store\n`;
  //   code += `  return dataStore;\n`;
  //   code += `}\n\n`;
  //   code += `// Example usage:\n`;
  //   code += `// executeRequestFlow().then(result => console.log(result));\n`;
    
  //   setGeneratedCode(code);
  //   setShowCodeDialog(true);
  // };

  const generateCode = () => {

    // const flow configuration
    const myFlow = {
      nodes: nodes || [],
      edges: edges || []
    }

    const generator = new WebPulseFlowGenerator();
    generator.importFlow(myFlow);

    // generating code
    const code = generator.generateCode({
      includeComments: true,
      includeExampleUsage: true,
      functionName: 'myCustomFlow',
      errorHandling: 'advanced'
    });

    // show code in ui component 
    setGeneratedCode(code);
    setShowCodeDialog(true);

  }

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
        <div className="p-2 font-medium bg-white bg-opacity-50 flex items-center justify-between border-b border-gray-300">
          <div className="flex items-center gap-2">
            {nodeType.icon}
            <span className="text-sm truncate">{node.name}</span>
          </div>
        </div>
        
        {/* Input ports */}
        <div className="p-2 text-xs">
          <div className="mb-2">
            <div className="text-gray-500 mb-1">Inputs:</div>
            {nodeType.inputs.map(input => (
              <div key={`${node.id}-in-${input}`} className="flex items-center mb-1">
                <div 
                  className={`w-3 h-3 rounded-full border border-gray-500 bg-white ${isCreatingEdge && !startPort.isOutput ? 'bg-blue-200' : ''}`}
                  onClick={(e) => handlePortClick(node, false, input, e)}
                ></div>
                <span className="ml-2">{input}</span>
              </div>
            ))}
          </div>
          
          {/* Output ports */}
          <div>
            <div className="text-gray-500 mb-1">Outputs:</div>
            {nodeType.outputs.map(output => (
              <div key={`${node.id}-out-${output}`} className="flex items-center justify-between mb-1">
                <span className="mr-2">{output}</span>
                <div 
                  className={`w-3 h-3 rounded-full border border-gray-500 bg-white ${isCreatingEdge && startPort.isOutput ? 'bg-blue-200' : ''}`}
                  onClick={(e) => handlePortClick(node, true, output, e)}
                ></div>
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
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{ zIndex: 0 }}
        >
          <path
            d={path}
            fill="none"
            stroke={isSelected ? "#3b82f6" : "#9ca3af"}
            strokeWidth={isSelected ? 2 : 1.5}
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
              <polygon points="0 0, 10 3.5, 0 7" fill="#9ca3af" />
            </marker>
          </defs>
        </svg>
      );
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold">Request Flow Designer</h2>
        <div className="flex items-center space-x-2">
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
          </Tabs>
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
            Delete
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={generateCode}
          >
            <Code className="h-4 w-4 mr-2" />
            Generate Code
          </Button>
          <Button variant="outline" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button variant="primary" size="sm">
            <Play className="h-4 w-4 mr-2" />
            Run
          </Button>
        </div>
      </div>
      
      <div className="flex-1 relative">
        <TabsContent value="design" className="h-full">
          <div 
            ref={canvasRef}
            className="bg-gray-50 dark:bg-gray-800 h-full w-full relative overflow-auto"
            onClick={handleCanvasClick}
            onMouseMove={handleNodeDrag}
            onMouseUp={handleNodeDragEnd}
          >
            {nodes.map(renderNode)}
            {renderEdges()}
          </div>
        </TabsContent>
        
        <TabsContent value="preview" className="h-full p-4">
          <Card className="h-full p-4 overflow-auto">
            <pre className="text-sm">
              {JSON.stringify({ nodes, edges }, null, 2)}
            </pre>
          </Card>
        </TabsContent>
      </div>
      
      {/* Node Configuration Dialog */}
      <Dialog open={showNodeDialog} onOpenChange={setShowNodeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedNode ? 'Edit Node' : 'Add New Node'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
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
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="nodeName" className="text-right">Name:</label>
              <Input
                id="nodeName"
                className="col-span-3"
                value={nodeConfig.name}
                onChange={(e) => setNodeConfig({...nodeConfig, name: e.target.value})}
              />
            </div>
            
            {/* Dynamic properties based on node type */}
            {nodeConfig.type === 'REQUEST' && (
              <RequestForm nodeConfig={nodeConfig} />
            )}
            
            {nodeConfig.type === 'CONDITION' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="condition" className="text-right">Condition:</label>
                <Input
                  id="condition"
                  className="col-span-3"
                  value={nodeConfig.properties.condition || ''}
                  onChange={(e) => setNodeConfig({
                    ...nodeConfig,
                    properties: {...nodeConfig.properties, condition: e.target.value}
                  })}
                  placeholder="dataStore.someNode.body.status === 'success'"
                />
              </div>
            )}
            
            {nodeConfig.type === 'TRANSFORM' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="transform" className="text-right">Transform:</label>
                <textarea
                  id="transform"
                  className="col-span-3 min-h-24 p-2 border rounded"
                  value={nodeConfig.properties.transform || ''}
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

export default RequestFlowCanvas;

            // <>
              //   <div className="grid grid-cols-4 items-center gap-4">
              //     <label htmlFor="url" className="text-right">URL:</label>
              //     <Input
              //       id="url"
              //       className="col-span-3"
              //       value={nodeConfig.properties.url || ''}
              //       onChange={(e) => setNodeConfig({
              //         ...nodeConfig,
              //         properties: {...nodeConfig.properties, url: e.target.value}
              //       })}
              //       placeholder="https://api.example.com/endpoint"
              //     />
              //   </div>
                
              //   <div className="grid grid-cols-4 items-center gap-4">
              //     <label htmlFor="method" className="text-right">Method:</label>
              //     <Select 
              //       value={nodeConfig.properties.method || 'GET'} 
              //       onValueChange={(value) => setNodeConfig({
              //         ...nodeConfig,
              //         properties: {...nodeConfig.properties, method: value}
              //       })}
              //     >
              //       <SelectTrigger className="col-span-3">
              //         <SelectValue placeholder="HTTP Method" />
              //       </SelectTrigger>
              //       <SelectContent>
              //         {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map(method => (
              //           <SelectItem key={method} value={method}>{method}</SelectItem>
              //         ))}
              //       </SelectContent>
              //     </Select>
              //   </div>
              // </>