import {
  POST_MAX_CHARACTERS,
  POST_MIN_CHARACTERS,
  TIMELINE_PAGINATION_LIMIT,
} from "@/lib/constants";
import { z } from "zod";

export const createPostInputSchema = z.object({
  text: z
    .string({ required_error: "Post text is required" })
    .min(POST_MIN_CHARACTERS, "Post must be at least 5 characters in length")
    .max(POST_MAX_CHARACTERS, "Post must be 280 characters or less"),
});

export const timelineInputSchema = z.object({
  where: z
    .object({
      author: z.object({ name: z.string().optional() }).optional(),
    })
    .optional(),
  cursor: z.string().nullish(),
  limit: z.number().min(1).max(100).default(TIMELINE_PAGINATION_LIMIT),
});

export const likeUnlikePosttInputSchema = z.object({ postId: z.string() });
