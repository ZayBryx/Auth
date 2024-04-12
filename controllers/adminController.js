const admin = async (req, res) => {
  res.send("Admin Home");
};

const logout = async (req, res) => {
  res.send("Admin Logout");
};

module.exports = { admin, logout };
