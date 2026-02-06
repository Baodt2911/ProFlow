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
  Form,
} from "antd";
import type { TableProps, FormInstance } from "antd";
import { useEffect, useState } from "react";
import {
  useActionData,
  useLoaderData,
  useSearchParams,
  useSubmit,
  Form as RemixForm,
} from "react-router";
import UserForm from "~/components/Form/UserForm";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "~/constants/core";
import { ActionData } from "~/types";
export { managementUserAction as action } from "~/actions/managementUserAction";
export { managementUserLoader as loader } from "~/loaders/managementUserLoader";

export const meta = () => {
  return [{ title: "User Management" }];
};

export default function ManagementUser() {
  const actionData = useActionData<ActionData>() ?? {};
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const onResetForm = (form: FormInstance<any>) => {
    form.resetFields();
  };

  useEffect(() => {
    if (actionData.success) {
      messageApi.open({
        type: "success",
        content: actionData.message || "Action successful",
      });
    }
    if (actionData.error) {
      messageApi.open({
        type: "error",
        content: actionData.error,
      });
    }
    onResetForm(form);
    setIsModalBlockOpen(false);
  }, [actionData, form, messageApi]);
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
      title: "Status",
      dataIndex: "isBlock",
      key: "isBlock",
      render: (_, record) => (
        <Tooltip title={record.blockReason}>
          <Badge
            status={record.isBlocked ? "error" : "success"}
            text={
              <Typography.Text type={record.isBlocked ? "danger" : "success"}>
                {record.isBlocked ? "Blocked" : "Active"}
              </Typography.Text>
            }
          />
        </Tooltip>
      ),
    },
    {
      title: "Full Name",
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
      title: "Address",
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
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit Account">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectUser(record);
                showModalForm();
              }}
            />
          </Tooltip>

          <Tooltip title={record.isBlocked ? "Unblock" : "Block account"}>
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
            title="Delete Account"
            description="Are you sure you want to delete this account?"
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
            <Tooltip title="Delete Account">
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
        title="Update User"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalFormOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <UserForm mode="update" data={selectUser} form={form} />
      </Modal>

      <Modal
        title="Block Account"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalBlockOpen}
        onCancel={() => setIsModalBlockOpen(false)}
        footer={null}
      >
        <RemixForm method="post">
          <input type="hidden" name="action" value={"block"} />
          <input type="hidden" name="userId" value={selectUser.id} />
          <Input size="large" name="reason" placeholder="Reason for blocking" />
          <Button
            htmlType="submit"
            danger
            style={{ marginTop: 20, width: "100%" }}
          >
            Block Account
          </Button>
        </RemixForm>
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
            Create Account
          </Typography.Title>

          <UserForm mode="create" form={form} />
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
