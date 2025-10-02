"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import dayjs from "dayjs";
import { get5MinuteFormat } from "@/lib/timeUtil";

export default function DatetimePicker({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = React.useState(false);

  const date = React.useMemo(() => {
    if (!value) return undefined;
    return dayjs(value).toDate();
  }, [value]);

  const time = React.useMemo(() => {
    if (!value) return "00:00:00";
    return dayjs(value).format("HH:mm:ss");
  }, [value]);

  return (
    <div className="flex gap-2">
      <div className="flex flex-col gap-3">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="text-md justify-between font-normal"
            >
              {date ? dayjs(date).format("YYYY. MM. DD") : "날짜 선택"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(date) => {
                if (!date) {
                  onChange(get5MinuteFormat());
                  setOpen(false);
                  return;
                }

                const formattedDate = dayjs(value)
                  .set("year", date.getFullYear())
                  .set("month", date.getMonth())
                  .set("date", date.getDate())
                  .format("YYYY-MM-DDTHH:mm:ss");

                onChange(formattedDate);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-3">
        <Input
          type="time"
          id="time-picker"
          step="300"
          value={time}
          onChange={(e) => {
            const newTime = e.target.value;

            if (!date) {
              onChange(
                dayjs()
                  .set("hour", parseInt(newTime.split(":")[0], 10))
                  .set("minute", parseInt(newTime.split(":")[1], 10))
                  .format("YYYY-MM-DDTHH:mm:ss"),
              );
              return;
            }

            const formattedDate = dayjs(value)
              .set("hour", parseInt(newTime.split(":")[0], 10))
              .set("minute", parseInt(newTime.split(":")[1], 10))
              .format("YYYY-MM-DDTHH:mm:ss");

            onChange(formattedDate);
          }}
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  );
}
