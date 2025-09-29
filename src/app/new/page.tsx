"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DateTimePicker from "@/components/custom/datetimepicker";
import { createNewStoryAction } from "../actions/createNewStory";
import { storyFormSchema } from "../schema/storySchema";
import { get5MinuteFormat } from "@/lib/timeUtil";
import { toast } from "sonner";

export function ProfileForm() {
  const form = useForm<z.infer<typeof storyFormSchema>>({
    resolver: zodResolver(storyFormSchema),
    defaultValues: {
      title: "",
      description: "",
      startAt: get5MinuteFormat(),
      endAt: get5MinuteFormat(),
    },
  });

  const createNewStory = async (values: z.infer<typeof storyFormSchema>) => {
    try {
      const result = await createNewStoryAction(values);

      if (result && result.length > 0) {
        toast.success("스토리가 성공적으로 등록되었습니다!");
        form.reset(); // 폼 초기화
      } else {
        toast.error("등록에 실패했습니다.");
      }
    } catch (error) {
      console.error(error);
      toast.error("오류가 발생했습니다.");
    }
  };

  return (
    <div className="container mx-auto my-10 max-w-md rounded-lg border p-4 shadow">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(createNewStory)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>제목</FormLabel>
                <FormControl>
                  <Input
                    placeholder="있었던 일에 제목을 붙여주세요!"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>설명</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="있었던 일에 설명을 붙여주세요!"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startAt"
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <FormControl>
                  <DateTimePicker {...field} />
                </FormControl>
                <div>부터</div>
              </div>
            )}
          />
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
          <Button className="w-full" type="submit">
            등록하기
          </Button>
        </form>
      </Form>
    </div>
  );
}
export default ProfileForm;
