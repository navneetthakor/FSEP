// to connect with server collection
const APIFlow = require("../../Models/APIFlow.model");
const User = require("../../Models/User.model");
const createResponse = require("../../Response");
const { Error } = require("mongoose");
const axios = require('axios');


// used for deletion of APIFlow document from relation in case of any failure
let apiFlowId = -1;

const addAPIFlow = async (req, res) => {
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
    const newAPIFlow = new APIFlow({
      user_id: user._id,
      api_flow_name: data.api_flow_name,
      status: data.status,
      nodes: data.nodes,
      edges: data.edges,
      check_frequency: data.check_frequency
    });

    // save this entry
    await newAPIFlow.save();

    //set global id for server
    apiFlowId = newAPIFlow._id;

    let wsResponse;
    try {
      const backendUrl = `${process.env.WORKER_POD_URL}/api/MasterPod/registerAPIFlow/${user._id}/${newAPIFlow._id}`
      wsResponse = await axios.post(backendUrl)
      // Handle successful response
    } catch (error) {
      console.error('Worker pod request failed:', error.message)
    }

    if (wsResponse.data.isError) {

      // delete this record 
      await APIFlow.findByIdAndDelete(apiFlowId);

      // return response
      return res.status(500).json(createResponse(wsResponse.data.errorMessage, true, "", 500, ""));
    }
    return res.status(200).json(createResponse(newAPIFlow, false, "", 200, ""));


  } catch (error) {
    console.log("AddAPIFlow error : ", Error);
    // delete this record 
    await APIFlow.findByIdAndDelete(apiFlowId);
    return res.status(200).json(createResponse(
      "",
      true,
      error,
      500,
      ""
    ));
  }
};

module.exports = addAPIFlow;
