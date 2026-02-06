import React, { useState } from "react";
import {
  Form,
  LoaderFunctionArgs,
  Outlet,
  useLoaderData,
  useLocation,
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
import { requireUser } from "~/utils/auth.server";
import { Button, Flex, Layout, Menu, theme, Typography } from "antd";
import { getSession } from "~/lib/session";
import { SystemRole } from "~/types";
export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const role = session.get("role");
  await requireUser(request);
  return { role };
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
  const location = useLocation();
  const {
    token: { colorBgContainer, colorTextBase },
  } = theme.useToken();
  const [selectedKey, setSelectedKey] = useState(
    location.pathname.split("/")[0],
  );
  const navigate = useNavigate();
  const { role } = useLoaderData<{ role: SystemRole }>();
  if (role === "ADMIN") {
    const existingItem = menuItems.find((m) => m.key === "management-user");
    if (!existingItem) {
      menuItems.push({
        key: "management-user",
        icon: <UserSwitchOutlined />,
        label: "Quản lý người dùng",
      });
    }
  }
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
