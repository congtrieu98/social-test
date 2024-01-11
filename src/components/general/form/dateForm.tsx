'use client'

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { UseFormReturn } from "react-hook-form";

const DateForm = ({ form, title, name }:
    {
        form: UseFormReturn, title: string,
        name: string, placeholder: string
    }) => {
    const { data: session } = useSession()
    return (
        <>
            <FormField
                control={form.control}
                name={name}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{title}</FormLabel>
                        <br />
                        <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-[240px] pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                        disabled={
                                            session?.user?.role !== "ADMIN"
                                        }
                                    >
                                        {field.value ? (
                                            format(new Date(field.value), "PPP")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={new Date(field.value)}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                        name === 'deadlines' ? date < new Date() : date > new Date() || date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>

                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    );
}

export default DateForm;