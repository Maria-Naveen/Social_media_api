import { updateCommentSchema } from "../validation/postValidation.js";

const validateUpdateComment = (req, res, next) => {
  const { error } = updateCommentSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({
      message: error.details.map((detail) => detail.message).join("; "),
    });
  }
  next();
};

export default validateUpdateComment;
