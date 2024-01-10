"use client";
import SignIn from "@/components/auth/SignIn";
import { trpc } from "@/lib/trpc/client";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { formatDateFull, formatDatetime } from "@/utils/constant";
import moment from "moment";
import { Report } from "@/lib/db/schema/reports";

const { Header, Sider, Content } = Layout;

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();
  // const { data: r } = trpc.reports.getReports.useQuery();

  const columns: ColumnsType<Report> = [
    {
      title: "Ngày",
      dataIndex: "reportDate",
      key: "reportDate",
      // fixed: 'left',
      render: (val) => moment(val, formatDateFull).format(formatDatetime),
    },
    {
      title: "Người thực hiện",
      dataIndex: "assignedTo",
      key: "assignedTo",
    },
    {
      title: "Công việc(SL)",
      children: [
        {
          title: "Hoàn thành",
          dataIndex: "jobCompleted",
          key: "jobCompleted",
        },
        {
          title: "Chưa hoàn thành",
          dataIndex: "jobUnfinished",
          key: "jobUnfinished",
        },
      ],
    },
    {
      title: "Tỉ lệ(%)",
      children: [
        {
          title: "Hoàn thành",
          dataIndex: "jobCompletedPrecent",
          key: "jobCompletedPrecent",
          width: 200,
        },
        {
          title: "Chưa hoàn thành",
          dataIndex: "jobUnfinishedPercent",
          key: "jobUnfinishedPercent",
        },
      ],
    },
    {
      title: "KPI",
      dataIndex: "kpi",
      key: "kpi",
      // fixed: 'right',
    },
    {
      title: "Action",
      // fixed: 'right',
    },
  ];

  return (
    <>
      <div className="text-base">
        Welcome to <span className="font-semibold">{session?.user?.name}</span>{" "}
        come back!
      </div>
    </>
  );
}
