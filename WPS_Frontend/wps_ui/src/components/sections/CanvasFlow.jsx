import React, { useState, useRef, useEffect } from 'react';
import { PlusCircle, Trash2, Code, FileJson, Server } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import RequestForm from './RequestForm';
import WebPulseNodeFlowGenerator from '@/lib/NodesGenrator';
import ModalPopup from './MessagePopUp';
import Loader from './Loader';

// Node types with their configurations
const NODE_TYPES = {
  REQUEST: {
    name: 'HTTP Request',
    icon: <Server className="h-4 w-4" />,
    color: 'bg-blue-100 border-blue-300',
    inputs: ['input'],
    outputs: ['true']
  },
  CONDITION: {
    name: 'Condition',
    icon: <FileJson className="h-4 w-4" />,
    color: 'bg-yellow-100 border-yellow-300',
    inputs: ['condition'],
    outputs: ['true', 'false']
  },
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
  const [flowName, setFlowName] = useState("Default Flow Name");
  const [checkFrequency, setCheckFrequency] = useState('OH');
  const [nodeConfig, setNodeConfig] = useState({
    type: 'REQUEST',
    id: '',
    name: '',
    properties: {}
  });
  const [activateModal, setActivateModal] = useState(null);
  const [loading, setLoading] = useState(false);


  const canvasRef = useRef(null);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [draggedNode, setDraggedNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // for canvas setup 
  useEffect(() => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setCanvasOffset({ x: rect.left, y: rect.top });
    }
  }, []);

  // Add a new node to the canvas
  const addNode = (type, position) => {
    const newNode = {
      id: nodeConfig.name || `${NODE_TYPES[type].name}`,
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

  // Test the flow
  // const testFlow = async () => {
  //   console.log("Testing flow:", { nodes, edges });
  //   // const flow configuration
  //   const myFlow = {
  //     nodes: nodes || [],
  //     edges: edges || []
  //   }

  //   const generator = new WebPulseFlowGenerator();
  //   generator.importFlow(myFlow);

  //   // generating code
  //   const code = generator.generateCode({
  //     includeComments: true,
  //     includeExampleUsage: true,
  //     functionName: 'myCustomFlow',
  //     errorHandling: 'advanced'
  //   });

  //   // show code in ui component 
  //   setGeneratedCode(code);
  //   setShowCodeDialog(false);
  //   let eval_result = await eval(code);
  //   eval_result = Array.of(eval_result);
  //   console.log("eval completed : ", eval_result);

  //   setShowTestDialog(true);
  //   setTestResult(eval_result || []);
  //   console.dir(eval_result.length);
  //   // Implement test functionality
  // };

  // Schedule the flow
  const scheduleFlow = async () => {

    try{
    setLoading(true);

    //#region  actual test
    // object of node flow generater
    const flow = new WebPulseNodeFlowGenerator();

    // Add all nodes first
    for (const node of nodes) {
      // console.log(node);
      switch (node.type) {
        case 'REQUEST':
          flow.addRequestNode(
            node.id,
            node.name,
            node.properties
          );
          console.log(flow.nodes)
          break;

        case 'CONDITION':
          flow.addConditionNode(
            node.id,
            node.name,
            node.properties.conditionExpression
          );
          break;

        // Add other node types as needed
        default:
          console.warn(`Unknown node type: ${node.type} for node ID: ${node.id}`);
      }
    }

    // // Connect nodes with edges
    for (const edge of edges) {
      // If condition is provided, use it, otherwise default to empty string
      const condition = edge.sourcePort || 'true';
      flow.addEdge(edge.sourceId, edge.targetId, condition);
    }

    // console.log("edges : ", edges);
    console.log(flow);

    // return flow;
    //#endregion

    // url of backend     
    const url = `${import.meta.env.VITE_BACKEND_URL}/apiFlow/add`;

    let body = {
      nodes: flow.nodes,
      edges: flow.edges,
      api_flow_name: flowName,
      status: 'R',
      check_frequency: checkFrequency || 'OH'
    }

    // send request to backend to register apiFlow testing service 
    let result = await fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "usertoken": localStorage.getItem('usertoken')
      },
      body: JSON.stringify(body)
    })
    result = result.json();

    setLoading(false);


    if (result.IsError) {
      setActivateModal({
        type: 'error',
        title: result.ErrorMessage,
        message: 'Please try after some time',
        navigatePath: '/dashboard/APIFlowHome' // The path you want to navigate to
      });
    } else {
      setTimeout(() => {

        setActivateModal({
          type: 'success',
          title: 'API flow scheduled',
          message: ' please check your email where you got test email reagrding this API flow ',
          navigatePath: '/dashboard/APIFlowHome' // The path you want to navigate to
        });
      }, 5000);
    }
  }catch(e){
    console.log(e);
    setLoading(false);
  }
    //#endregion

    // Implement schedule functionality
  };

  // Clear the canvas
  const clearCanvas = () => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setSelectedEdge(null);
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
        <div className="flex bg-opacity-50 bg-white border-b border-gray-800 justify-between p-2 font-medium items-center">
          <div className="flex gap-2 text-black items-center">
            {nodeType.icon}
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-black truncate">{node.name}</span>
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
                <span className="ml-2 text-black">{input}</span>
              </div>
            ))}
          </div>

          {/* Output ports */}
          <div>
            <div className="text-gray-500 mb-1">Outputs:</div>
            {nodeType.outputs.map(output => (
              <div key={`${node.id}-out-${output}`} className="flex justify-between items-center mb-1">
                <span className="mr-2 text-black">{output}</span>
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
                onValueChange={(value) => setNodeConfig({ ...nodeConfig, type: value })}
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
                onChange={(e) => setNodeConfig({ ...nodeConfig, name: e.target.value })}
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
                    properties: { ...nodeConfig.properties, condition: e.target.value }
                  })}
                  placeholder="dataStore.someNode.body.status === 'success'"
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

      {activateModal && (
        <ModalPopup
          type={activateModal.type}
          title={activateModal.title}
          message={activateModal.message}
          navigatePath={activateModal.navigatePath}
          duration={3000} // 3 seconds auto-close
        />
      )}

      {loading && (<Loader isLoading={loading} />)}
    </div>
  );
};

export default RequestFlowCanvas;