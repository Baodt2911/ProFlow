import {
  DeleteOutlined,
  EditOutlined,
  LockOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import {
  Flex,
  Space,
  Table,
  Tag,
  Button,
  Typography,
  theme,
  Tooltip,
  Popconfirm,
  Pagination,
  Modal,
  Input,
  Badge,
  message,
} from "antd";
import type { TableProps, PopconfirmProps } from "antd";
import { useEffect, useState } from "react";
import {
  Form,
  useActionData,
  useLoaderData,
  useSearchParams,
  useSubmit,
} from "react-router";
import UserForm from "~/components/Form/UserForm";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "~/constants/core";
import { ActionData } from "~/types";
export { managementUserAction as action } from "~/actions/managementUserAction";
export { managementUserLoader as loader } from "~/loaders/managementUserLoader";

export const meta = () => {
  return [{ title: "Quản lý người dùng" }];
};

export default function ManagementUser() {
  const actionData = useActionData<ActionData>() ?? {};
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (actionData.success) {
      messageApi.open({
        type: "success",
        content: "Thao tác thành công",
      });
    }
    if (actionData.error) {
      messageApi.open({
        type: "error",
        content: actionData.error,
      });
    }
  }, [actionData]);
  const { data, total } = useLoaderData();
  const {
    token: { colorBgBase },
  } = theme.useToken();

  const [isModalFormOpen, setIsModalFormOpen] = useState(false);
  const [isModalBlockOpen, setIsModalBlockOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectUser, setSelectUser] = useState<any>({});
  const submit = useSubmit();
  const page = parseInt(searchParams.get("page") ?? DEFAULT_PAGE.toString());
  const limit = parseInt(searchParams.get("limit") ?? DEFAULT_LIMIT.toString());

  const showModalForm = () => {
    setIsModalFormOpen(true);
  };

  const handleCancel = () => {
    setIsModalFormOpen(false);
  };

  const handlePageChange = (newPage: number, pageSize: number) => {
    const params: Record<string, string> = {
      page: String(newPage),
      limit: String(pageSize),
    };
    setSearchParams(params);
  };

  const columns: TableProps["columns"] = [
    {
      title: "Trạng thái",
      dataIndex: "isBlock",
      key: "isBlock",
      render: (_, record) => (
        <Tooltip title={record.blockReason}>
          <Badge
            status={record.isBlocked ? "error" : "success"}
            text={
              <Typography.Text type={record.isBlocked ? "danger" : "success"}>
                {record.isBlocked ? "Bị khóa" : "Hoạt động"}
              </Typography.Text>
            }
          />
        </Tooltip>
      ),
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      render: (text) => <Typography.Text strong>{text}</Typography.Text>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Role",
      key: "role",
      dataIndex: "role",
      render: (tag) => (
        <Tag color={tag === "ADMIN" ? "blue" : "gold"} key={tag}>
          {tag}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Sửa tài khoản">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectUser(record);
                showModalForm();
              }}
            />
          </Tooltip>

          <Tooltip title={record.isBlocked ? "Mở khóa" : "Khóa tài khoản"}>
            <Button
              color="danger"
              variant="filled"
              icon={record.isBlocked ? <UnlockOutlined /> : <LockOutlined />}
              onClick={() => {
                if (record.isBlocked) {
                  submit(
                    {
                      action: "unblock",
                      userId: record.id,
                    },
                    { method: "POST" },
                  );
                } else {
                  setSelectUser(record);
                  setIsModalBlockOpen(true);
                }
              }}
            />
          </Tooltip>

          <Popconfirm
            title="Xóa tài khoản"
            description="Bạn có chắc chắn muốn xóa tài khoản này không?"
            onConfirm={() =>
              submit(
                {
                  action: "delete",
                  userId: record.id,
                },
                { method: "POST" },
              )
            }
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Xóa tài khoản">
              <Button
                color="danger"
                variant="filled"
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <>
      {contextHolder}
      <Modal
        title="Cập nhật người dùng"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalFormOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <UserForm mode="update" data={selectUser} />
      </Modal>

      <Modal
        title="Khóa tài khoản"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalBlockOpen}
        onCancel={() => setIsModalBlockOpen(false)}
        footer={null}
      >
        <Form method="post">
          <input type="hidden" name="action" value={"block"} />
          <input type="hidden" name="userId" value={selectUser.id} />
          <Input size="large" name="reason" placeholder="Lý do khóa" />
          <Button
            htmlType="submit"
            danger
            style={{ marginTop: 20, width: "100%" }}
          >
            Khóa tài khoản
          </Button>
        </Form>
      </Modal>
      <Flex align="start" style={{ padding: 20, height: "100vh" }} gap="large">
        <Flex
          vertical
          align="center"
          style={{
            flex: 1,
            borderRadius: 15,
            background: colorBgBase,
            padding: "32px 24px",
            maxWidth: 450,
          }}
        >
          <Typography.Title level={3} style={{ marginBottom: 24 }}>
            Tạo tài khoản
          </Typography.Title>

          <UserForm mode="create" />
        </Flex>

        <Flex vertical style={{ flex: 2 }} gap={"large"}>
          <Table
            rowKey={"id"}
            columns={columns}
            dataSource={data}
            style={{ borderRadius: 15 }}
            pagination={false}
          />
          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <Pagination
              current={page}
              pageSize={limit}
              total={total}
              showSizeChanger
              onChange={handlePageChange}
              // showTotal={(total) => ()}
            />
          </div>
        </Flex>
      </Flex>
    </>
  );
}
