export default class WebPulseNodeFlowGenerator {
    constructor() {
      this.nodes = [];
      this.edges = [];
    }
  
    /**
     * Add a request node to the flow
     * @param {string} id - Unique identifier for the node
     * @param {string} name - Display name for the node
     * @param {Object} properties - Request properties (url, method, headers, body)
     * @returns {WebPulseFlowGenerator} - The current instance for chaining
     */
    addRequestNode(id, name, properties) {
      this.nodes.push({
        id,
        name,
        type: 'REQUEST',
        properties: {
          url: properties.url || '',
          method: properties.method || 'GET',
          headers: properties.headers || {},
          body: properties.body || null
        }
      });
      return this;
    }
  
    /**
     * Add a condition node to the flow
     * @param {string} id - Unique identifier for the node
     * @param {string} name - Display name for the node
     * @param {string} condition - JavaScript condition expression
     * @returns {WebPulseFlowGenerator} - The current instance for chaining
     */
    addConditionNode(id, name, condition) {
      this.nodes.push({
        id,
        name,
        type: 'CONDITION',
        properties: {
          condition
        }
      });
      return this;
    }
  
    /**
     * Add a transform node to the flow
     * @param {string} id - Unique identifier for the node
     * @param {string} name - Display name for the node
     * @param {string} transform - JavaScript transform function body
     * @returns {WebPulseFlowGenerator} - The current instance for chaining
     */
    addTransformNode(id, name, transform) {
      this.nodes.push({
        id,
        name,
        type: 'TRANSFORM',
        properties: {
          transform
        }
      });
      return this;
    }
  
    /**
     * Connect two nodes with an edge
     * @param {string} sourceId - Source node ID
     * @param {string} targetId - Target node ID
     * @param {string} sourcePort - Optional source port (for condition nodes: 'true'/'false')
     * @returns {WebPulseFlowGenerator} - The current instance for chaining
     */
    addEdge(sourceId, targetId, sourcePort = null) {
      const edge = {
        source: sourceId,
        target: targetId
      };
      
      if (sourcePort) {
        edge.sourcePort = sourcePort;
      }
      
      this.edges.push(edge);
      return this;
    }
  
    /**
     * Get the complete flow configuration
     * @returns {Object} - The flow configuration object
     */
    getFlowConfig() {
      return {
        nodes: this.nodes,
        edges: this.edges
      };
    }
  
    /**
     * Convert flow configuration to JSON string
     * @param {boolean} pretty - Whether to format the JSON with indentation
     * @returns {string} - JSON string representation of the flow
     */
    toJson(pretty = false) {
      return JSON.stringify(this.getFlowConfig(), null, pretty ? 2 : 0);
    }
  
    /**
     * Clear the flow configuration
     * @returns {WebPulseFlowGenerator} - The current instance for chaining
     */
    clear() {
      this.nodes = [];
      this.edges = [];
      return this;
    }
  
    /**
     * Load a flow configuration
     * @param {Object} config - The flow configuration object
     * @returns {WebPulseFlowGenerator} - The current instance for chaining
     */
    loadFlowConfig(config) {
      if (config && typeof config === 'object') {
        this.nodes = Array.isArray(config.nodes) ? config.nodes : [];
        this.edges = Array.isArray(config.edges) ? config.edges : [];
      }
      return this;
    }
  
    /**
     * Validate the flow configuration
     * @returns {Object} - Validation result {valid: boolean, errors: string[]}
     */
    validate() {
      const errors = [];
      const nodeIds = new Set(this.nodes.map(node => node.id));
      
      // Check for duplicate node IDs
      if (nodeIds.size !== this.nodes.length) {
        errors.push('Duplicate node IDs detected');
      }
      
      // Check for invalid edge references
      for (const edge of this.edges) {
        if (!nodeIds.has(edge.source)) {
          errors.push(`Edge references non-existent source node: ${edge.source}`);
        }
        if (!nodeIds.has(edge.target)) {
          errors.push(`Edge references non-existent target node: ${edge.target}`);
        }
      }
      
      // Check for isolated nodes (no incoming or outgoing edges)
      const connectedNodes = new Set();
      this.edges.forEach(edge => {
        connectedNodes.add(edge.source);
        connectedNodes.add(edge.target);
      });
      
      const isolatedNodes = this.nodes.filter(node => !connectedNodes.has(node.id));
      if (isolatedNodes.length > 1) { // Allow one isolated node (start node)
        errors.push(`Multiple isolated nodes detected: ${isolatedNodes.map(n => n.id).join(', ')}`);
      }
      
      return {
        valid: errors.length === 0,
        errors
      };
    }
  }
  
  // Example usage
  function createSampleFlow() {
    const flow = new WebPulseNodeFlowGenerator();
    
    // Add request node to get user data
    flow.addRequestNode(
      'getUserData',
      'Get User Data',
      {
        url: 'https://api.example.com/users/1',
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ${token}'
        }
      }
    );
    
    // Add condition node to check if user has admin role
    flow.addConditionNode(
      'checkAdminRole',
      'Check Admin Role',
      'getDataRef("getUserData.body.role") === "admin"'
    );
    
    // Add request node for admin-only data
    flow.addRequestNode(
      'getAdminData',
      'Get Admin Data',
      {
        url: 'https://api.example.com/admin/dashboard',
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ${token}'
        }
      }
    );
    
    // Add request node for regular user data
    flow.addRequestNode(
      'getUserMetrics',
      'Get User Metrics',
      {
        url: 'https://api.example.com/users/1/metrics',
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ${token}'
        }
      }
    );
    
    // Add transform node to combine data
    flow.addTransformNode(
      'combineData',
      'Combine Data',
      `// Combine user data with either admin or regular metrics
       const userData = getDataRef('getUserData.body');
       let metrics;
       
       if (getDataRef('getAdminData.body')) {
         metrics = getDataRef('getAdminData.body');
       } else if (getDataRef('getUserMetrics.body')) {
         metrics = getDataRef('getUserMetrics.body');
       } else {
         metrics = {};
       }
       
       return {
         user: userData,
         metrics: metrics,
         timestamp: new Date().toISOString()
       };`
    );
    
    // Connect nodes with edges
    flow.addEdge('getUserData', 'checkAdminRole');
    flow.addEdge('checkAdminRole', 'getAdminData', 'true');
    flow.addEdge('checkAdminRole', 'getUserMetrics', 'false');
    flow.addEdge('getAdminData', 'combineData');
    flow.addEdge('getUserMetrics', 'combineData');
    
    return flow;
  }
  
  // Function to send flow to backend
  // async function sendFlowToBackend(flow) {
  //   try {
  //     const response = await fetch('/api/requestflow/execute', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: flow.toJson()
  //     });
      
  //     if (!response.ok) {
  //       throw new Error(`Server responded with status: ${response.status}`);
  //     }
      
  //     return await response.json();
  //   } catch (error) {
  //     console.error('Error sending flow to backend:', error);
  //     throw error;
  //   }
  // }

  // console.log(createSampleFlow());
  console.dir(createSampleFlow(), { depth: null, colors: true });