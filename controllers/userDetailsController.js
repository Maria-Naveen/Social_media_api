import userService from "../services/userService.js";

const userDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await userService.getUserDetails(userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export default userDetails;
