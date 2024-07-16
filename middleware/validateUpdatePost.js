import { updatePostSchema } from "../validation/postValidation.js";

const validateUpdatePost = (req, res, next) => {
  const { error } = updatePostSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      message: error.details.map((detail) => detail.message).join("; "),
    });
  }
  next();
};

export default validateUpdatePost;
