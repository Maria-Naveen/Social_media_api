import Joi from "joi";

export const createPostSchema = Joi.object({
  description: Joi.string().required().messages({
    "any.required": "Description is required.",
    "string.empty": "Description cannot be empty.",
  }),
});

export const updatePostSchema = Joi.object({
  description: Joi.string().required().messages({
    "any.required": "Description is required.",
    "string.empty": "Description cannot be empty.",
  }),
});

export const createCommentSchema = Joi.object({
  text: Joi.string().required().messages({
    "any.required": "Comment text is required.",
    "string.empty": "Comment text cannot be empty",
  }),
});

export const updateCommentSchema = Joi.object({
  text: Joi.string().required().messages({
    "any.required": "Comment text is required.",
    "string.empty": "Comment text cannot be empty",
  }),
});
