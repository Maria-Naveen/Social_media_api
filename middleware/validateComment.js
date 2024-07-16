import { createCommentSchema } from "../validation/postValidation.js";

const validateComment = (req, res, next) => {
  const { error } = createCommentSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({
      message: error.details.map((detail) => detail.message).join("; "),
    });
  }
  next();
};

export default validateComment;
