import { TIMELINE_PAGINATION_LIMIT } from "@/lib/constants";
import { useScrollPosition } from "@/lib/hooks/use-scroll-position";
import type { RouterInputs } from "@/lib/utils/api";
import { api } from "@/lib/utils/api";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, type FC } from "react";
import { CreatePost } from "./CreatePost";
import { Post } from "./Post";

interface TimelineProps {
  where?: RouterInputs["post"]["timeline"]["where"];
  limit?: number;
}

export const Timeline: FC<TimelineProps> = ({ limit = TIMELINE_PAGINATION_LIMIT, where = {} }) => {
  const scrollPosition = useScrollPosition();
  const {
    data: timeline,
    hasNextPage,
    fetchNextPage,
    isFetching,
  } = api.post.timeline.useInfiniteQuery(
    { where, limit },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const client = useQueryClient();
  const posts = timeline?.pages.flatMap((page) => page.posts) ?? [];

  useEffect(() => {
    if (scrollPosition > 90 && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [scrollPosition, hasNextPage, isFetching, fetchNextPage]);

  return (
    <div>
      <CreatePost />
      <div className="border-l-2 border-r-2 border-t-2 border-gray-400">
        {posts.map((post) => (
          <Post key={post.id} post={post} client={client} input={{ limit, where }} />
        ))}

        {!hasNextPage && <p>No more items to load</p>}
      </div>
    </div>
  );
};
