// to connect with server collection
const APIFlow = require("../../Models/APIFlow.model");
const createResponse = require("../../Response");

const wgetAPIFlow = async (req, res) => {
  try {
    // take params from url
    const {client_id, flow_id} = req.params;

    // not checking for client here 
    // but we can check if need araises in future 

    // retrive data from database
    const flow = await APIFlow.findById(flow_id);

    if(flow.user_id != client_id){
        return res
        .status(200)
        .json(createResponse("", true, "User Not have defined api flow", 400, ""));
    }

    if(!flow){
        return res
        .status(200)
        .json(createResponse("", true, "Server Not Exists", 400, ""));
    }

    // return response
    return res.status(200).json(createResponse(flow, false, "", 200, ""));
  } catch (error) {
    console.log("getServer error : ", error);
    return res.status(200).json(createResponse(
        "",
        true,
        e,
        500,
        ""
    ));
  }
};

module.exports = wgetAPIFlow;
