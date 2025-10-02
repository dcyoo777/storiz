"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import DateTimePicker from "@/components/custom/datetimepicker";
import { createNewStoryAction } from "@/actions/story/createNewStory";
import { get5MinuteFormat } from "@/lib/timeUtil";
import { toast } from "sonner";

export const customStoryFormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  where: z.string().max(100),
  with: z.string().max(100),
  startAt: z.string().min(2).max(100),
  endAt: z.string().min(2).max(100),
});

export function StoryForm() {
  const form = useForm<z.infer<typeof customStoryFormSchema>>({
    resolver: zodResolver(customStoryFormSchema),
    defaultValues: {
      title: "",
      where: "",
      with: "",
      startAt: get5MinuteFormat(),
      endAt: get5MinuteFormat(),
    },
  });

  const createNewStory = async (
    values: z.infer<typeof customStoryFormSchema>,
  ) => {
    try {
      const result = await createNewStoryAction({
        title: values.title,
        description: `${values.where ? `${values.where}에서 ` : ""}${values.with ? `${values.with}와 ` : ""}${values.title}을 했다!`,
        startAt: values.startAt,
        endAt: values.endAt,
      });

      if (result && result.length > 0) {
        toast.success("스토리가 성공적으로 등록되었습니다!");
        form.reset(); // 폼 초기화
      } else {
        toast.error("등록에 실패했습니다.");
      }
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : "오류가 발생했습니다.";
      if (errorMessage.includes("Unauthorized")) {
        toast.error("로그인이 필요합니다. 먼저 로그인해주세요.");
      } else {
        toast.error(errorMessage);
      }
    }
  };

  return (
    <div className="relative p-4">
      {/* <div className="rounded-lg border p-4 shadow"> */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(createNewStory)}
          className="space-y-4"
        >
          <div className="flex items-center gap-2">
            <FormField
              control={form.control}
              name="startAt"
              render={({ field }) => (
                <FormControl>
                  <DateTimePicker {...field} />
                </FormControl>
              )}
            />
            <div className="w-fit whitespace-nowrap">부터</div>
          </div>
          <FormField
            control={form.control}
            name="endAt"
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <FormControl>
                  <DateTimePicker {...field} />
                </FormControl>
                <div>까지</div>
              </div>
            )}
          />
          <div className="flex items-center gap-2">
            <FormField
              control={form.control}
              name="where"
              render={({ field }) => (
                <FormControl>
                  <Input placeholder="어디" {...field} />
                </FormControl>
              )}
            />
            <div className="w-fit text-right whitespace-nowrap">에서</div>
            <FormField
              control={form.control}
              name="with"
              render={({ field }) => (
                <FormControl>
                  <Input placeholder="누구" {...field} />
                </FormControl>
              )}
            />
            <div className="w-fit text-right whitespace-nowrap">와</div>
          </div>
          <div className="flex items-center gap-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormControl>
                  <Input placeholder="무엇" {...field} />
                </FormControl>
              )}
            />
            <div className="w-fit text-right whitespace-nowrap">을 했다!</div>
          </div>
          <Button className="w-full" size="lg" type="submit">
            등록하기
          </Button>
        </form>
      </Form>
      {/* </div> */}
    </div>
  );
}
export default StoryForm;
