import {
  CameraOutlined,
  EditOutlined,
  LockOutlined,
  CloseOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Flex,
  Form,
  Space,
  Typography,
  Input,
  Row,
  Col,
  Divider,
  message,
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import {
  Form as RemixForm,
  useActionData,
  useLoaderData,
  useSubmit,
} from "react-router";
import { ActionData } from "~/types";
import type { GetProp, UploadProps } from "antd";
export { profileLoader as loader } from "~/loaders/profileLoader";
export { profileAction as action } from "~/actions/profileAction";
export const meta = () => {
  return [{ title: "User Profile" }];
};

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

export default function ProfilePage() {
  const submit = useSubmit();
  const [messageApi, contextHolder] = message.useMessage();
  const actionData = useActionData<ActionData>();
  const { user } = useLoaderData<{ user: any }>();
  const [isEditingProfile, setIsEditingProfile] = useState(true);
  const [editForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      messageApi.open({
        type: "error",
        content: "You can only upload JPG/PNG files!",
      });
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      messageApi.open({
        type: "error",
        content: "Image must be smaller than 2MB!",
      });
    }
    return isJpgOrPng && isLt2M;
  };

  useEffect(() => {
    if (actionData?.success) {
      messageApi.open({
        type: "success",
        content: actionData.message,
      });
    }
    if (actionData?.error) {
      messageApi.open({
        type: "error",
        content: actionData.error,
      });
    }

    setIsEditingProfile(true);
    passwordForm.resetFields();
  }, [actionData, messageApi, passwordForm]);

  useEffect(() => {
    if (user) {
      editForm.setFieldsValue({
        fullName: user.fullName,
        email: user.email,
        address: user.address,
        phone: user.phone,
      });
    }
  }, [user, editForm]);

  return (
    <>
      {contextHolder}
      <Card
        title="User Profile"
        variant="borderless"
        style={{ width: "80%", padding: 20, margin: "0 auto" }}
      >
        {/* Header with Avatar */}
        <Flex gap="middle" align="center">
          <div
            style={{
              position: "relative",
            }}
          >
            <Upload
              name="avatar"
              listType="picture-circle"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={beforeUpload}
              customRequest={({ file, onSuccess, onError }) => {
                try {
                  const formData = new FormData();
                  formData.append("avatar", file as File);
                  formData.append("action", "avatar");
                  formData.append("oldAvatar", user.avatarUrl);
                  submit(formData, {
                    method: "POST",
                    encType: "multipart/form-data", // Important!
                  });

                  if (actionData?.success) {
                    onSuccess?.("ok");
                  }
                } catch (error) {
                  onError?.(error as Error);
                }
              }}
              style={{ width: 150, height: 150 }}
            >
              <img
                draggable={false}
                src={
                  user.avatarUrl ||
                  "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/avatar_vo_tri_a49436c5de.jpg"
                }
                alt="avatar"
                width={"100%"}
                height={"100%"}
                style={{
                  borderRadius: "100%",
                }}
              />
              <Button
                type="dashed"
                shape="circle"
                icon={<CameraOutlined />}
                size="middle"
                style={{ position: "absolute", bottom: 5, right: 5 }}
              />
            </Upload>
          </div>
          <div>
            <Typography.Title level={3} style={{ margin: 0 }}>
              Bao Do Trong
            </Typography.Title>
            <Typography.Text type="secondary">
              example@gmail.com
            </Typography.Text>
          </div>
        </Flex>

        <Divider />

        {/* Personal Information Form */}
        <Card
          title="Personal Information"
          extra={
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => setIsEditingProfile(false)}
            >
              Edit Profile
            </Button>
          }
          style={{ marginBottom: 24 }}
        >
          <RemixForm method="post">
            <Form
              layout="vertical"
              component={false}
              disabled={isEditingProfile}
              form={editForm}
            >
              <input type="hidden" name="action" value="profile" />
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Full Name" name="fullName">
                    <Input size="large" name="fullName" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Address" name="address">
                    <Input size="large" name="address" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Email" name="email">
                    <Input size="large" name="email" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Phone Number" name="phone">
                    <Input size="large" name="phone" />
                  </Form.Item>
                </Col>
              </Row>

              {/* Button shown when editing */}
              <Form.Item
                style={{ display: isEditingProfile ? "none" : "block" }}
              >
                <Space>
                  <Button
                    size="large"
                    icon={<CloseOutlined />}
                    onClick={() => setIsEditingProfile(true)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    icon={<SaveOutlined />}
                  >
                    Save Changes
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </RemixForm>
        </Card>

        {/* Password Change Form */}
        <Card title="Change Password">
          <RemixForm method="post">
            <input type="hidden" name="action" value="password" />
            <Form layout="vertical" component={false} form={passwordForm}>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    label="Current Password"
                    name="currentPassword"
                    rules={[
                      {
                        required: true,
                        message: "Please enter current password",
                      },
                    ]}
                  >
                    <Input.Password
                      size="large"
                      name="currentPassword"
                      placeholder="Enter current password"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="New Password"
                    name="newPassword"
                    rules={[
                      {
                        required: true,
                        message: "Please enter new password",
                      },
                      {
                        min: 6,
                        message: "Password must be at least 6 characters",
                      },
                    ]}
                  >
                    <Input.Password
                      size="large"
                      name="newPassword"
                      placeholder="Enter new password (minimum 6 characters)"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Confirm Password"
                    name="confirmPassword"
                    dependencies={["newPassword"]} // Important!
                    rules={[
                      {
                        required: true,
                        message: "Please confirm password",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (
                            !value ||
                            getFieldValue("newPassword") === value
                          ) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("Passwords do not match!"),
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      size="large"
                      name="confirmPassword"
                      placeholder="Re-enter new password"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  icon={<LockOutlined />}
                >
                  Change Password
                </Button>
              </Form.Item>
            </Form>
          </RemixForm>
        </Card>
      </Card>
    </>
  );
}
