// to connect with server collection
const Server = require("../../Models/Server.model");
const User = require("../../Models/User.model");
const createResponse = require("../../Response");

const serverId = -1;

const addServer = async (req, res) => {
  try {
    // check user exists or not
    const user = await User.findById(req.user.id);

    // if user is not present
    if (!user) {
      return res
        .status(200)
        .json(createResponse("", true, "User Not Exists", 400, ""));
    }

    // now add this entry to server modal
    const data = req.body;
    const newServer = new Server({
      user_id: req.user.id,
      server_name: data.server_name,
      method: data.method,
      server_url: data.server_url,
      Headers: data.Headers,
      body: data.body,
      status: data.status,
      type_of_check: data.type_of_check,
      desired_response_time: data.desired_response_time,
      check_frequency: data.check_frequency,
      keyword: data.keyword,
      status_codes: data.status_codes,
    });

    // save this entry
    newServer.save();

    // serverModal for workerPod
    const ServerModal = {
      // Client id (who owns this server)
      Client_id: user_id, // string
    
      // Server id (unique id for this server)
      Server_id: newServer._id, // string
    
      // Flow id (used in alerting service) - optional
      flow_id: null, // string | null
    
      // Worker id
      Method: newServer.method, // string
    
      // Server URL
      Server_url: newServer.server_url, // string
    
      // Headers (simulating Dictionary<string, string>)
      Headers: newServer.Headers, // Object (Dictionary in C#)
    
      // Body - optional
      Body: newServer.body, // string | null
    
      // Status of the server (simulating ServerStatus enum)
      Status: newServer.status, // string (R for Running, other statuses can be defined)
    
      // Type of check (simulating TypeOFCheck enum)
      typeOFCheck: newServer.type_of_check, // string (GET, POST, etc.)
    
      // Check Frequency (simulating CheckFrequency enum)
      CheckFrequency: newServer.check_frequency, // string (e.g., THRM for hourly)
    
      // Keyword to find or not find on the page
      Keyword: newServer.keyword, // string | null
    
      // List of status codes which response can contain
      StatusCodes: newServer.status_codes // Array of integers (e.g., [200, 404])
    };

    //set global id for server
    serverId = newServer._id;

    // making request to the worker server
    const backendUrl = `${process.env.WORKER_POD_URL}/api/MasterPod/register`
    const wsResponse = await axios.post(URL = backendUrl, Headers = {
      Accept: 'application/json'
    }, data = ServerModal);

    if(!wsResponse.data.IsError){
      // return response
      return res.status(200).json(createResponse(newServer, false, "", 200, ""));
    }else{
      return res.status(500).json(createResponse(newServer, true, "", 500, ""));
    }

  } catch (error) {

    // delete entry if exists
    if(serverId !== -1){
      await Server.findByIdAndDelete(serverId);
    }

    console.log("addServer error : ", error);
    return res.status(200).json(createResponse(
        "",
        true,
        error,
        500,
        ""
    ));
  }
};

module.exports = addServer;
