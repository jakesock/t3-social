import type { InfiniteData } from "@tanstack/react-query";
import { type QueryClient } from "@tanstack/react-query";
import type { RouterInputs, RouterOutputs } from "./api";

interface UpdateTimelineCacheOpts {
  client: QueryClient;
  variables: {
    postId: string;
  };
  data: {
    userId: string;
  };
  action: "like" | "unlike";
  input: RouterInputs["post"]["timeline"];
}

export function updateTimelineCache({
  client,
  variables,
  data,
  action,
  input,
}: UpdateTimelineCacheOpts) {
  client.setQueryData(
    [
      ["post", "timeline"],
      {
        input,
        type: "infinite",
      },
    ],
    (oldData) => {
      const newData = oldData as InfiniteData<RouterOutputs["post"]["timeline"]>;
      const countValue = action === "like" ? 1 : -1;

      const newPosts = newData.pages.map((page) => {
        return {
          ...page,
          posts: page.posts.map((post) => {
            if (post.id === variables.postId) {
              return {
                ...post,
                likes: action === "like" ? [data.userId] : [],
                _count: {
                  likes: post._count.likes + countValue,
                },
              };
            }

            return post;
          }),
        };
      });

      return {
        ...newData,
        pages: newPosts,
      };
    }
  );
}
