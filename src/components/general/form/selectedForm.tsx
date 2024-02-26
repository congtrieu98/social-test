"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROLE } from "@/utils/constant";
import { $Enums } from "@prisma/client";
import { useSession } from "next-auth/react";
import { UseFormReturn } from "react-hook-form";

interface dataSelected {
  key: string;
  value: string;
}

interface dataUser {
  users: {
    id: string;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;
    role: $Enums.UserRole;
  }[];
}
const SelectedForm = ({
  form,
  title,
  dataOption,
  name,
  placeholder,
  editing,
  dataUser,
}: {
  form: UseFormReturn;
  title: string;
  dataOption: dataSelected[];
  name: string;
  placeholder: string;
  editing: boolean;
  dataUser: dataUser;
}) => {
  const { data: session } = useSession();

  return (
    <>
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{title}</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              // disabled={!editing}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {dataUser ? (
                  session?.user.role === ROLE.USER ? (
                    <SelectItem
                      key={session?.user.id}
                      value={session?.user.id}
                      spellCheck
                    >
                      {session?.user.name}
                    </SelectItem>
                  ) : (
                    dataUser?.users.map((item) => {
                      return (
                        <SelectItem key={item.id} value={item.id} spellCheck>
                          {item.name}
                        </SelectItem>
                      );
                    })
                  )
                ) : editing ? (
                  dataOption?.map((item, index) => {
                    return (
                      <SelectItem key={index} value={item.key} spellCheck>
                        {item.value}
                      </SelectItem>
                    );
                  })
                ) : (
                  dataOption
                    ?.filter((option) => option.key !== "readed")
                    ?.map((item, index) => {
                      return (
                        <SelectItem key={index} value={item.key} spellCheck>
                          {item.value}
                        </SelectItem>
                      );
                    })
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default SelectedForm;
