import type { RouterInputs, RouterOutputs } from "@/lib/utils/api";
import { api } from "@/lib/utils/api";
import { formatPostDate } from "@/lib/utils/format-post-date";
import { updateTimelineCache } from "@/lib/utils/update-timeline-cache";
import type { QueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import { AiFillHeart } from "react-icons/ai";

interface PostProps {
  post: RouterOutputs["post"]["timeline"]["posts"][number];
  client: QueryClient;
  input: RouterInputs["post"]["timeline"];
}

export const Post: FC<PostProps> = ({ post, client, input }) => {
  const { mutateAsync: likeMutation } = api.post.like.useMutation({
    onSuccess: (data, variables) => {
      updateTimelineCache({
        client,
        input,
        data,
        variables,
        action: "like",
      });
    },
  });
  const { mutateAsync: unlikeMutation } = api.post.unlike.useMutation({
    onSuccess: (data, variables) => {
      updateTimelineCache({
        client,
        input,
        data,
        variables,
        action: "unlike",
      });
    },
  });
  const hasLiked = post.likes.length > 0;

  const handleLike = () => {
    if (hasLiked) {
      unlikeMutation({ postId: post.id });
      return;
    }
    likeMutation({ postId: post.id });
  };

  return (
    <div className="mb-4 border-b-2 border-gray-400">
      <div className="flex p-2">
        {post.author.image && (
          <Image
            src={post.author.image}
            alt={`${post.author.name} profile picture`}
            width={48}
            height={48}
            className="h-max rounded-full"
          />
        )}

        <div className="ml-2">
          <div className="align-center flex">
            <p className="font-bold">
              <Link href={`/${post.author.name}`}>{post.author.name}</Link>
            </p>
            <p className="text-sm text-gray-400"> - {formatPostDate(post.createdAt)}</p>
          </div>
          <div>{post.text}</div>
        </div>
      </div>
      <div className="mt-4 flex items-center p-2">
        <AiFillHeart
          color={hasLiked ? "red" : "gray"}
          size="1.5rem"
          onClick={handleLike}
          role="button"
        />
        <span className="text-sm text-gray-400">{post._count.likes}</span>
      </div>
    </div>
  );
};
