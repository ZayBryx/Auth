const { StatusCode } = require("http-status-codes");

const account = async (req, res) => {
  console.log(req.user);
  res.status(StatusCode.OK).send();
};

const logout = async (req, res) => {
  res.send("logout route");
};

module.exports = {
  account,
  logout,
};
