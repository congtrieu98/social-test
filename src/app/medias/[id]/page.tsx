/* eslint-disable @next/next/no-img-element */
"use client";

import Modal from "@/components/general/modal";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { trpc } from "@/lib/trpc/client";
import {
  ROLE,
  STATUS_IMAGE,
  formatDateFull,
  formatDatetime,
} from "@/utils/constant";
import { Table } from "antd";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Medias = ({ params }: { params: { id: string } }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { data: t } = trpc.tasks.getTaskById.useQuery({ id: params.id });

  const { mutate: updateImage, isLoading: updatingImage } =
    trpc.medias.updateMedia.useMutation();
  const { mutate: deleteMedia, isLoading: deletingImage } =
    trpc.medias.deleteMedia.useMutation();

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const getMediaDisable = t?.tasks?.medias.filter(
    (media) => media?.status === STATUS_IMAGE.DISABLE
  );

  const handleChangeAction = (val: string) => {
    if (val === "reset") {
      selectedRowKeys.map((item) => {
        return updateImage({
          id: item as string,
          userId: session?.user?.name as string,
          updateAt: new Date(),
          status: STATUS_IMAGE.ACTIVE,
        });
      });
      router.refresh();
      toast({
        title: "Success",
        description: "Khôi phục thành công!",
        defaultValue: "variant",
      });
    } else {
      selectedRowKeys.map((item) => {
        return deleteMedia({
          id: item as string,
        });
      });
      router.refresh();
      toast({
        title: "Success",
        description: "Xóa thành công!",
        defaultValue: "variant",
      });
    }
  };

  const columns = [
    {
      title: "User deleted",
      dataIndex: "userId",
    },
    {
      title: "Time deleted",
      dataIndex: "updateAt",
      render: (value: any) =>
        moment(value, formatDateFull).format(formatDatetime),
    },
    {
      title: "Image deleted",
      render: (record: any) => <Modal media={record} />,
    },
  ];

  return (
    <>
      <div className="text-xl font-semibold mb-5">Danh sách ảnh đã xóa</div>
      {selectedRowKeys.length > 0 && (
        <div className="mb-4">
          <Select onValueChange={(val) => handleChangeAction(val)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Lựa chọn thao tác" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="reset">Khôi phục</SelectItem>
                <SelectItem value="delete">Xóa vĩnh viễn</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}
      <Table
        rowKey="id"
        loading={updatingImage || deletingImage}
        // @ts-ignore
        rowSelection={session?.user.role === ROLE.ADMIN && rowSelection}
        columns={columns}
        // @ts-ignore
        // expandable={session?.user.role === ROLE.ADMIN && { expandedRowRender }}
        dataSource={getMediaDisable}
        scroll={{ x: 600 }}
      />
    </>
  );
};

export default Medias;
