const User = require("../../models/User"); // Adjust the path as needed

const updateUserIP = async (userId, ipAddress) => {
    // Testing
    if(userId == "67dbd398bef99a3e8c3ab1e9"){
        ipAddress = "217.135.123.104";
    }else if(userId == "67dbd43420634f0c38b12587"){
        ipAddress = '106.184.72.180';
    }else if(userId == "67dbd470763aa7493c14ff7a"){
        ipAddress = '131.50.123.173';
    }
  try {
    await User.findByIdAndUpdate(userId, { $set: { ipAddress: ipAddress } });
    console.log(`Updated IP ${ipAddress} for user ${userId}`);
  } catch (err) {
    console.error("Failed to update user IP:", err);
  }
};

module.exports = updateUserIP;
