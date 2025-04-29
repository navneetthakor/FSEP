// to connect with server collection
const Server = require("../../Models/Server.model");
const User = require("../../Models/User.model");
const createResponse = require("../../Response");

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

    // return response
    return res.status(200).json(createResponse(newServer, false, "", 200, ""));
  } catch (error) {
    console.log("addServer error : ", e);
    return res.status(200).json(createResponse(
        "",
        true,
        e,
        500,
        ""
    ));
  }
};

module.exports = addServer;
