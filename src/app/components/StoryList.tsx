"use client";

import { getStoriesAction } from "@/actions/story/getStoriesAction";
import { Story } from "@/types/story";
import { useQuery } from "@tanstack/react-query";
import StoryItem from "./StoryItem";

const StoryList = () => {
  const query = useQuery({
    queryKey: ["stories"],
    queryFn: getStoriesAction,
  });

  return (
    <ul>
      {query.data?.map((story: Story) => (
        <StoryItem key={story.id} story={story} />
      ))}
    </ul>
  );
};

export default StoryList;
