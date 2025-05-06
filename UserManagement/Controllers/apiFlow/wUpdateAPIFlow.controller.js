// to connect with server collection
const APIFlow = require("../../Models/APIFlow.model");
const createResponse = require("../../Response");

const wgetAPIFlow = async (req, res) => {
  try {
    // take params from url
    const { client_id, flow_id } = req.params;

    // not checking for client here 
    // but we can check if need araises in future 

    // retrive data from database
    const flow = await APIFlow.findById(flow_id);

    // if flow not exists
    if (!flow) {
      return res
        .status(200)
        .json(createResponse("", true, "Server Not Exists", 400, ""));
    }

    // now start updating this flow

    // setting status to down
    flow.status = 'D';
    console.dir(req.body.executedNodes);
    console.log(req.body.executedNodes);

    // update nodes
    flow.nodes.forEach((value, index, arr) => {
      console.log(value.id);
      
      // first add status 
      if (Object.keys(req.body.errors).includes(value.id)) {
        value.status = 'D';
        value.response = req.body.errors[value.id];
      }
      else if (req.body.nodeResults[value.id]) {
        value.status = 'R';
        value.response = req.body.nodeResults[value.id];
      } else {
        value.status = 'N';
      }

      console.log(value.status);
    });
    

    flow.save();

    // return response
    return res.status(200).json(createResponse(flow, false, "", 200, ""));
  } catch (error) {
    console.log("updateAPIFlow error : ", error);
    return res.status(200).json(createResponse(
      "",
      true,
      error,
      500,
      ""
    ));
  }
};

module.exports = wgetAPIFlow;
