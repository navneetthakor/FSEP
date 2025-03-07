// to connect with server collection
const Server = require("../../Models/Server.model");
const User = require("../../Models/User.model");
const createResponse = require("../../Response");

const updateServer = async (req, res) => {
  try {
    // check user exists or not
    const user = await User.findById(req.user.id);

    // if user is not present
    if (!user) {
      return res
        .status(200)
        .json(createResponse("", true, "User Not Exists", 400, ""));
    }

    // updating data
    const oldData = await Server.findById(req.params.server_id);

    const data = req.body;
    const updatedData = {
        server_name: data.server_name ?? oldData.server_name,
        method: data.method ?? oldData.method,
        server_url: data.server_url ?? oldData.server_url,
        Headers: data.Headers ?? oldData.Headers,
        body: data.body ?? oldData.body,
        status: data.status ?? oldData.status,
        type_of_check: data.type_of_check ?? oldData.type_of_check,
        desired_response_time: data.desired_response_time ?? oldData.desired_response_time,
        check_frequency: data.check_frequency ?? oldData.check_frequency,
        keyword: data.keyword ?? oldData.keyword,
        status_codes: data.status_codes ?? oldData.status_codes,
    }

    const updatedServer = await Server.findByIdAndUpdate(
        req.params.server_id,
        {$set : updatedData},
        {new :  true}
    );

    if(!updatedServer){
        return res
        .status(200)
        .json(createResponse("", true, "Server Not Exists", 400, ""));
    }

    // return response
    return res.status(200).json(createResponse(updatedServer, false, "Server pushed", 200, ""));
  } catch (error) {
    console.log("getServer error : ", error);
    return res.status(200).json(createResponse(
        "",
        true,
        error,
        500,
        ""
    ));
  }
};

module.exports = updateServer;
