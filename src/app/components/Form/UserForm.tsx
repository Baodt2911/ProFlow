import { Form as RemixForm } from "react-router";
import { Form, Input, Button, Select, FormInstance } from "antd";
import { useEffect, useState } from "react";
export default function UserForm({
  mode,
  data,
  form,
}: {
  mode: "create" | "update";
  data?: any;
  form?: FormInstance<any>;
}) {
  const [role, setRole] = useState("USER");
  useEffect(() => {
    if (form) {
      if (data) {
        form.setFieldsValue({
          ...data,
        });
      }
    }
  }, [data, form]);
  return (
    <RemixForm method="POST" style={{ width: "100%" }}>
      <Form layout="vertical" component={false} form={form}>
        <input type="hidden" name="action" value={mode} />
        <input type="hidden" name="userId" value={data?.id} />
        <Form.Item
          label="Full Name"
          name="fullName"
          rules={[{ required: true, message: "Please enter full name" }]}
        >
          <Input size="large" name="fullName" placeholder="Enter full name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter email" },
            { type: "email", message: "Email is invalid" },
          ]}
        >
          <Input size="large" name="email" placeholder="example@email.com" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Please enter password" },
            { min: 6, message: "Password must be at least 6 characters" },
          ]}
        >
          <Input.Password
            size="large"
            name="password"
            placeholder="Enter password"
          />
        </Form.Item>

        <Form.Item label="Role">
          <Select
            size="large"
            defaultValue={role}
            onChange={(value) => setRole(value)}
            options={[
              { value: "ADMIN", label: "Administrator" },
              { value: "USER", label: "User" },
            ]}
          />
          <input type="hidden" name="role" value={role} />
        </Form.Item>

        <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
          <Button type="primary" htmlType="submit" size="large" block>
            {mode === "create" ? "Create Account" : "Update"}
          </Button>
        </Form.Item>
      </Form>
    </RemixForm>
  );
}
