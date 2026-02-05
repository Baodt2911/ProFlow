import { Form as RemixForm } from "react-router";
import { Form, Input, Button, Select } from "antd";
import { useEffect, useState } from "react";
export default function UserForm({
  mode,
  data,
}: {
  mode: "create" | "update";
  data?: any;
}) {
  const [role, setRole] = useState("USER");
  const [editForm] = Form.useForm();
  useEffect(() => {
    if (data) {
      editForm.setFieldsValue({
        ...data,
      });
    }
  }, [data, editForm]);
  return (
    <RemixForm method="POST" style={{ width: "100%" }}>
      <Form layout="vertical" component={false} form={editForm}>
        <input type="hidden" name="action" value={mode} />
        <input type="hidden" name="userId" value={data?.id} />
        <Form.Item
          label="Họ và tên"
          name="fullName"
          rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
        >
          <Input size="large" name="fullName" placeholder="Nhập họ và tên" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input size="large" name="email" placeholder="example@email.com" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu" },
            { min: 6, message: "Mật khẩu tối thiểu 6 ký tự" },
          ]}
        >
          <Input.Password
            size="large"
            name="password"
            placeholder="Nhập mật khẩu"
          />
        </Form.Item>

        <Form.Item label="Vai trò">
          <Select
            size="large"
            defaultValue={role}
            onChange={(value) => setRole(value)}
            options={[
              { value: "ADMIN", label: "Quản trị viên" },
              { value: "USER", label: "Người dùng" },
            ]}
          />
          <input type="hidden" name="role" value={role} />
        </Form.Item>

        <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
          <Button type="primary" htmlType="submit" size="large" block>
            {mode === "create" ? "Tạo tài khoản" : "Cập nhật"}
          </Button>
        </Form.Item>
      </Form>
    </RemixForm>
  );
}
