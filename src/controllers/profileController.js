const profile = require('../services/profileService');

exports.getProfileInfoController = async (req, res) => {
    try {
        const userId = req.params.id;
        console.log(userId.userId)

        const profileInfo = await profile.getProfileInfo(userId.userId)
        res.status(200).json({
            profileInfo
        });
    }
    catch(error) {
        console.error("Error fetching user data: ", error.message);
        res.status(500).json({error: "Failed to fetch user data"});
    }
}

exports.getUserDetails = async (req, res) => {
    try {
        const userId = req.body;    
        const profileInfo = await profile.getUserInfoByUserId(userId.userId);

        res.status(200).json({
            profileInfo
        });
    }
    catch(error) {
        console.error("Error fetching user data: ", error.message);
        res.status(500).json({error: "Failed to fetch user data"});
    }
}

