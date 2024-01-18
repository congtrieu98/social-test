// import * as React from "react";
// import { DateTime } from "luxon";
// import { Calendar as CalendarIcon } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { cn } from "@/lib/utils";
// import { SelectSingleEventHandler } from "react-day-picker";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { ROLE } from "@/utils/constant";
// import { useSession } from "next-auth/react";
// import { format } from "date-fns";

// interface DateTimePickerProps {
//   date: Date;
//   setDate: (date: Date) => void;
//   name: string;
// }

// export function DateTimePicker({ date, setDate, name }: DateTimePickerProps) {
//   const { data: session } = useSession();

//   const luxonDateTime = DateTime.fromJSDate(date);
//   const formattedDateTime = luxonDateTime.toFormat('yyyy-MM-dd\'T\'HH:mm');
//   const [selectedDateTime, setSelectedDateTime] = React.useState<DateTime>(
//     DateTime.fromISO(formattedDateTime)
//   );
//   // console.log("dateProp:", date)

//   console.log("check format:", formattedDateTime)
//   console.log("selectedDatime to format:", selectedDateTime.toFormat("HH:mm"))
//   // console.log("check ddingj dạng:", DateTime.fromISO("2024-01-18"))
//   const handleSelect: SelectSingleEventHandler = (day, selected) => {
//     console.log("data selected:", selected)
//     const luxonDateTimeSelected = DateTime.fromJSDate(selected);
//     const selectedDay = luxonDateTimeSelected.toFormat('yyyy-MM-dd\'T\'HH:mm');
//     console.log("selectedDay:", selectedDay)
//     // const selectedDay = DateTime.fromJSDate(selected);
//     // const modifiedDay =
//     // const matchResult = selectedDay.match(/(\d{2}):(\d{2})/);
//     // if (matchResult) {
//     //   const [, hour, minute] = matchResult;
//     // setSelectedDateTime({
//     //   hour: hour,
//     //   minute: minute
//     // });
//     // console.log(`Giờ: ${hour}, Phút: ${minute}`);
//     // } else {
//     //   console.error('Không có sự khớp cho giờ và phút.');
//     // }

//     // const selectedDay = DateTime.fromJSDate(selected);
//     // const modifiedDay = selectedDay.set({
//     //   hour: selectedDateTime.hour,
//     //   minute: selectedDateTime.minute,
//     // });
//     // setSelectedDateTime(modifiedDay);
//     // setDate(modifiedDay.toJSDate());

//     setDate(new Date(selectedDay.toString()));
//   };

//   const handleTimeChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
//     const { value } = e.target;
//     const hours = Number.parseInt(value.split(":")[0] || "00", 10);
//     const minutes = Number.parseInt(value.split(":")[1] || "00", 10);
//     const modifiedDay = selectedDateTime.set({ hour: hours, minute: minutes });

//     setSelectedDateTime(modifiedDay);
//     setDate(modifiedDay.toJSDate());
//   };

//   const footer = (
//     <>
//       <div className="pt-0 pb-4">
//         <Label>Time</Label>
//         <Input
//           type="time"
//           onChange={handleTimeChange}
//           value={selectedDateTime.toFormat("HH:mm")}
//         />
//       </div>
//       {!selectedDateTime && <p>Please pick a day.</p>}
//     </>
//   );

//   return (
//     <>
//       <Popover>
//         <PopoverTrigger asChild className="z-10">
//           <Button
//             variant={"outline"}
//             className={cn(
//               "w-[280px] justify-start text-left font-normal",
//               !date && "text-muted-foreground"
//             )}
//             disabled={session?.user?.role !== ROLE.ADMIN}
//           >
//             <CalendarIcon className="mr-2 h-4 w-4" />
//             {date ? (
//               selectedDateTime.toFormat("DDD HH:mm")
//             ) : (
//               <span>Pick a date</span>
//             )}
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-auto p-0">
//           <Calendar
//             mode="single"
//             selected={selectedDateTime.toJSDate()}
//             onSelect={handleSelect}
//             disabled={
//               (date) => name === "deadlines" && date < new Date()
//               //   : date > new Date() || date < new Date("1900-01-01")
//             }
//             initialFocus
//           />

//         </PopoverContent>
//       </Popover>
//       {footer}
//     </>
//   );
// }





"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TimePickerDemo } from "./time-picker";

export function DateTimePicker() {
  const [date, setDate] = React.useState<Date>();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP HH:mm:ss") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
        <div className="p-3 border-t border-border">
          <TimePickerDemo setDate={setDate} date={date} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
