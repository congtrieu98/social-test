'use client'

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { UseFormReturn } from "react-hook-form";

const InputForm = ({ form, title }: { form: UseFormReturn, title: string }) => {
    const { data: session } = useSession()
    return (
        <>
            <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{title}</FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                disabled={
                                    session?.user?.role !== ROLE.ADMIN
                                }
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    );
}

export default InputForm;