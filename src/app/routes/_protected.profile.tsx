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
  return [{ title: "Hồ sơ cá nhân" }];
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
        content: "Bạn chỉ có thể tải lên file JPG/PNG!",
      });
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      messageApi.open({
        type: "error",
        content: "Ảnh phải nhỏ hơn 2MB!",
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
        title="Hồ sơ cá nhân"
        variant="borderless"
        style={{ width: "80%", padding: 20, margin: "0 auto" }}
      >
        {/* Header với Avatar */}
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
                    encType: "multipart/form-data", // Quan trọng!
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
              Đỗ Trọng Bảo
            </Typography.Title>
            <Typography.Text type="secondary">
              example@gmail.com
            </Typography.Text>
          </div>
        </Flex>

        <Divider />

        {/* Form thông tin cá nhân */}
        <Card
          title="Thông tin cá nhân"
          extra={
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => setIsEditingProfile(false)}
            >
              Sửa hồ sơ
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
                  <Form.Item label="Họ và tên" name="fullName">
                    <Input size="large" name="fullName" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Địa chỉ" name="address">
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
                  <Form.Item label="Số điện thoại" name="phone">
                    <Input size="large" name="phone" />
                  </Form.Item>
                </Col>
              </Row>

              {/* Nút hiện khi đang chỉnh sửa */}
              <Form.Item
                style={{ display: isEditingProfile ? "none" : "block" }}
              >
                <Space>
                  <Button
                    size="large"
                    icon={<CloseOutlined />}
                    onClick={() => setIsEditingProfile(true)}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    icon={<SaveOutlined />}
                  >
                    Lưu thay đổi
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </RemixForm>
        </Card>

        {/* Form đổi mật khẩu */}
        <Card title="Đổi mật khẩu">
          <RemixForm method="post">
            <input type="hidden" name="action" value="password" />
            <Form layout="vertical" component={false} form={passwordForm}>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    label="Mật khẩu hiện tại"
                    name="currentPassword"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập mật khẩu hiện tại",
                      },
                    ]}
                  >
                    <Input.Password
                      size="large"
                      name="currentPassword"
                      placeholder="Nhập mật khẩu hiện tại"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Mật khẩu mới"
                    name="newPassword"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập mật khẩu mới",
                      },
                      {
                        min: 6,
                        message: "Mật khẩu phải có ít nhất 6 ký tự",
                      },
                    ]}
                  >
                    <Input.Password
                      size="large"
                      name="newPassword"
                      placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Xác nhận mật khẩu"
                    name="confirmPassword"
                    dependencies={["newPassword"]} // Quan trọng!
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng xác nhận mật khẩu",
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
                            new Error("Mật khẩu xác nhận không khớp!"),
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      size="large"
                      name="confirmPassword"
                      placeholder="Nhập lại mật khẩu mới"
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
                  Đổi mật khẩu
                </Button>
              </Form.Item>
            </Form>
          </RemixForm>
        </Card>
      </Card>
    </>
  );
}
