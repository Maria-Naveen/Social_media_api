import userService from "../services/userService.js";
import catchAsync from "../utils/catchAsync.js";

const userDetails = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const result = await userService.getUserDetails(userId);
  res.status(200).json(result);
});
export default userDetails;
