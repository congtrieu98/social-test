'use client'
import SignIn from '@/components/auth/SignIn';
import { trpc } from '@/lib/trpc/client';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { formatDateFull, formatDatetime } from '@/utils/constant';
import moment from 'moment';
import { Report } from '@/lib/db/schema/reports';

const { Header, Sider, Content } = Layout;

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  const { data: r } = trpc.reports.getReports.useQuery()

  const columns: ColumnsType<Report> = [
    {
      title: 'Ngày',
      dataIndex: 'reportDate',
      key: 'reportDate',
      fixed: 'left',
      render: (val) => moment(val, formatDateFull).format(formatDatetime)
    },
    {
      title: 'Người thực hiện',
      dataIndex: 'assignedTo',
      key: 'assignedTo'
    },
    {
      title: 'Công việc(SL)',
      children: [
        {
          title: 'Hoàn thành',
          dataIndex: 'jobCompleted',
          key: 'jobCompleted',
        },
        {
          title: 'Chưa hoàn thành',
          dataIndex: 'jobUnfinished',
          key: 'jobUnfinished',
        },
      ],
    },
    {
      title: 'Tỉ lệ(%)',
      children: [
        {
          title: 'Hoàn thành',
          dataIndex: 'jobCompletedPrecent',
          key: 'jobCompletedPrecent',
          width: 200,
        },
        {
          title: 'Chưa hoàn thành',
          dataIndex: 'jobUnfinishedPercent',
          key: 'jobUnfinishedPercent',
        },
      ],
    },
    {
      title: 'KPI',
      dataIndex: 'kpi',
      key: 'kpi',
      fixed: 'right',
    },
    {
      title: 'Action',
      fixed: 'right',
    },
  ];

  return (
    <Layout className="layout">
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['/']}
          onClick={(e) => router.push(e.key)}
          items={[
            {
              key: '/',
              icon: <UserOutlined />,
              label: 'dashboard',
            },
            session && {
              key: 'tasks',
              icon: <VideoCameraOutlined />,
              label: 'Danh sách công việc',
            },
          ]}
        />
        <SignIn />
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
          }}
        >
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: () => setCollapsed(!collapsed),
          })}
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
          }}
        >
          <div className='text-2xl font-semibold mb-5'>Report</div>
          <Table
            columns={columns}
            dataSource={r?.reports}
            bordered
            size="middle"
            scroll={{ x: 'calc(700px + 50%)', y: 240 }}
          />
        </Content>
      </Layout>
    </Layout>
  )
}
