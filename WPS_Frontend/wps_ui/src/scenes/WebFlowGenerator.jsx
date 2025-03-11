import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Draggable from 'react-draggable';

const RequestNode = ({ id, data, onChange, response }) => {
  return (
    <Draggable>
      <Card className="p-4 mb-4 w-80 absolute">
        <CardContent>
          <input
            type="text"
            placeholder="Request Name"
            className="w-full mb-2 border border-gray-300 rounded p-2"
            value={data.name}
            onChange={(e) => onChange(id, { ...data, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="URL"
            className="w-full mb-2 border border-gray-300 rounded p-2"
            value={data.url}
            onChange={(e) => onChange(id, { ...data, url: e.target.value })}
          />
          <select
            className="w-full mb-2 border border-gray-300 rounded p-2"
            value={data.method}
            onChange={(e) => onChange(id, { ...data, method: e.target.value })}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
          <textarea
            className="w-full mb-2 border border-gray-300 rounded p-2"
            placeholder="Headers (JSON Format)"
            value={data.headers}
            onChange={(e) => onChange(id, { ...data, headers: e.target.value })}
          />
          <textarea
            className="w-full mb-2 border border-gray-300 rounded p-2"
            placeholder="Body (JSON Format)"
            value={data.body}
            onChange={(e) => onChange(id, { ...data, body: e.target.value })}
          />
          {response && (
            <div className="mt-2 p-2 border border-gray-300 rounded">
              <strong>Response:</strong>
              <pre>{JSON.stringify(response, null, 2)}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </Draggable>
  );
};

const WebPulseFlowGenerator = () => {
  const [nodes, setNodes] = useState({});
  const [connections, setConnections] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  const addNode = () => {
    const id = `node-${Date.now()}`;
    setNodes({
      ...nodes,
      [id]: { name: '', url: '', method: 'GET', headers: '', body: '', response: null }
    });
  };

  const updateNode = (id, newData) => {
    setNodes({
      ...nodes,
      [id]: newData
    });
  };

  const connectNodes = () => {
    if (selectedNode) {
      setConnections([...connections, { from: selectedNode, to: Object.keys(nodes).at(-1) }]);
      setSelectedNode(null);
    }
  };

  const executeFlow = async () => {
    let currentNodeId = Object.keys(nodes).find(key => !connections.some(conn => conn.to === key));

    while (currentNodeId) {
      const node = nodes[currentNodeId];
      if (!node.url) return;

      try {
        const headers = JSON.parse(node.headers || '{}');
        const body = node.body ? JSON.parse(node.body) : null;
        const response = await fetch(node.url, {
          method: node.method,
          headers: headers,
          body: node.method === 'GET' ? null : JSON.stringify(body)
        });
        const responseData = await response.json();

        updateNode(currentNodeId, { ...node, response: responseData });
      } catch (error) {
        updateNode(currentNodeId, { ...node, response: { error: error.message } });
      }

      const nextConnection = connections.find(conn => conn.from === currentNodeId);
      currentNodeId = nextConnection ? nextConnection.to : null;
    }
  };

  return (
    <div className="p-8 relative">
      <Button onClick={addNode} className="mb-4">Add Request Node</Button>
      <Button onClick={executeFlow} className="mb-4 ml-4">Execute Flow</Button>
      <div>
        {Object.entries(nodes).map(([id, data]) => (
          <div key={id} onClick={() => setSelectedNode(id)}>
            <RequestNode id={id} data={data} response={data.response} onChange={updateNode} />
          </div>
        ))}
      </div>
      {selectedNode && (
        <Button onClick={connectNodes} className="mt-4">Connect To Last Node</Button>
      )}
    </div>
  );
};

export default WebPulseFlowGenerator;
