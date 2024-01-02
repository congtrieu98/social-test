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
import React, { useEffect, useState } from 'react';

const { Header, Sider, Content } = Layout;

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);

//   const { data: t } = trpc.tasks.getTasks.useQuery()
//   const { data: u } = trpc.users.getUsers.useQuery()
//   const { data: r } = trpc.reports.getReports.useQuery()
//   const { mutate: createReport, isLoading: isCreating } = trpc.reports.createReport.useMutation();
// console.log("userssss:", u)
// console.log("reportttttt:", r)
//   useEffect(() => {
//   console.log("hello")
//   if (t?.tasks !== undefined) {
//     u?.users.map(async (user) => {
//       if (['trieunguyen2806@gmail.com', 'khanh@suzu.vn'].indexOf(user.email as string) === -1) {
//         let taskComplete = []
//         let taskUnfinished = []
//         t?.tasks.map((item) => {
//           if (item?.assignedId === user?.id) {
//             if (item?.status === 'completed') {
//               taskComplete.push(item)
//             } else {
//               taskUnfinished.push(item)
//             }
//           }
//         })

//         const percenTaskCompleted = Math.round(((taskComplete?.length ? taskComplete?.length : 0) / t.tasks?.length) * 100)
//         const percenTaskUnfinished = Math.round(((taskUnfinished?.length ? taskUnfinished?.length : 0) / t.tasks?.length) * 100)
        
//         createReport({
//           assignedTo: user.name as string,
//           reportDate: new Date(),
//           jobCompleted: taskComplete?.length,
//           jobUnfinished: taskUnfinished?.length,
//           jobCompletedPrecent: percenTaskCompleted || 0,
//           jobUnfinishedPercent: percenTaskUnfinished || 0,
//           kpi: percenTaskCompleted >= 50 ? 'Đạt' : 'Không đạt',
//         });
//         taskComplete = []
//         taskUnfinished = []
//       }
//     })
//   }
// }, [t])


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
          Report
        </Content>
      </Layout>
    </Layout>
  )
}
