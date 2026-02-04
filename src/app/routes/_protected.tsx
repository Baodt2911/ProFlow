import React, { useState } from "react";
import {
  Form,
  LoaderFunctionArgs,
  Outlet,
  useLoaderData,
  useNavigate,
} from "react-router";
import {
  CalendarOutlined,
  CarryOutOutlined,
  FundProjectionScreenOutlined,
  HomeFilled,
  ProjectOutlined,
  SettingOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { requireUser } from "~/utils/authServer";
import { Button, Flex, Layout, Menu, theme, Typography } from "antd";
import { getSession } from "~/lib/session";
export async function loader({ request }: LoaderFunctionArgs) {
  await requireUser(request);
  return null;
}
const { Header, Content, Footer, Sider } = Layout;

const menuItems = [
  {
    key: "dashboard",
    icon: <HomeFilled />,
    label: `Tổng quan`,
  },
  {
    key: "project",
    icon: <ProjectOutlined />,
    label: `Dự án`,
  },
  {
    key: "task",
    icon: <CarryOutOutlined />,
    label: `Task`,
  },
  {
    key: "calendar",
    icon: <CalendarOutlined />,
    label: `Lịch`,
  },
  {
    key: "setting",
    icon: <SettingOutlined />,
    label: `Cài đặt`,
  },
];
export default function ProtectedLayout() {
  const {
    token: {
      colorBgLayout,
      colorBgBase,
      colorBgContainer,
      colorBgElevated,
      colorTextBase,
    },
  } = theme.useToken();
  const [selectedKey, setSelectedKey] = useState("dashboard");
  const navigate = useNavigate();
  return (
    <Layout style={{ width: "100%", minHeight: "100vh" }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <Flex
          style={{
            width: "100%",
            height: 50,
          }}
          align="center"
          justify="center"
          gap={10}
        >
          <FundProjectionScreenOutlined
            style={{ fontSize: 20, color: colorTextBase }}
          />
          <Typography.Title level={5}>ProFlow</Typography.Title>
        </Flex>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => {
            switch (key) {
              case "dashboard":
                setSelectedKey(key);
                navigate("/dashboard");
                break;
              case "project":
                setSelectedKey(key);
                navigate("/project");
                break;
              case "task":
                setSelectedKey(key);
                navigate("/task");
                break;
              case "management-user":
                setSelectedKey(key);
                navigate("management-user");
                break;
              case "calendar":
                setSelectedKey(key);
                navigate("calendar");
                break;
              case "setting":
                setSelectedKey(key);
                navigate("setting");
                break;
              default:
                break;
            }
          }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            display: "flex",
            justifyContent: "flex-end",
            background: colorBgContainer,
          }}
        >
          <Form method="post" action="/logout" style={{ marginRight: 20 }}>
            <Button htmlType="submit" color="danger" variant="outlined">
              Đăng xuất
            </Button>
          </Form>
        </Header>
        <Content style={{ margin: "24px 16px 0" }}>
          <Outlet />
        </Content>
        <Footer style={{ textAlign: "center" }}>
          ProFlow ©{new Date().getFullYear()} created by baodt2911
        </Footer>
      </Layout>
    </Layout>
  );
}
