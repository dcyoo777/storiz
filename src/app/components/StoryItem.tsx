import { Story } from "@/types/story";
import dayjs from "dayjs";

const StoryItem = ({ story }: { story: Story }) => {
  return (
    <li key={story.id} className="bg-card mb-4 rounded-lg border p-4 shadow-sm">
      <p className="text-secondary text-sm">
        {dayjs(story.start_at).format("MMM D, YYYY")} -{" "}
        {dayjs(story.end_at).format("MMM D, YYYY")}
      </p>
      <h3 className="mt-2 text-lg font-bold">{story.title}</h3>
      <p className="">{story.description}</p>
    </li>
  );
};
export default StoryItem;
