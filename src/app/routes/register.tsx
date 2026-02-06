import {
  Link,
  LoaderFunctionArgs,
  Form as RemixForm,
  useActionData,
} from "react-router";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  notification,
  Alert,
} from "antd";
import ROUTES from "~/constants/route";
import { redirectIfAuthenticated } from "~/utils/auth.server";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
export { registerAction as action } from "~/actions/registerAction";

export const meta = () => {
  return [{ title: "Register" }];
};
export async function loader({ request }: LoaderFunctionArgs) {
  await redirectIfAuthenticated(request);
  return null;
}

export default function RegisterPage() {
  const actionData = useActionData<{
    success?: number;
    error?: string;
    message?: string;
  }>();
  console.log(actionData);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      {actionData?.error && (
        <Alert
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 1000,
            minWidth: 300,
          }}
          message={actionData.error}
          type="error"
          showIcon
          closable
        />
      )}

      <Card
        style={{
          width: 420,
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          borderRadius: 16,
        }}
      >
        <Typography.Title
          level={2}
          style={{
            textAlign: "center",
            marginBottom: 32,
            fontWeight: 600,
          }}
        >
          Register
        </Typography.Title>

        <RemixForm method="post">
          <Form layout="vertical" component={false}>
            <Form.Item
              label="Full Name"
              name="fullName"
              rules={[{ required: true, message: "Please enter full name" }]}
            >
              <Input
                name="fullName"
                size="large"
                placeholder="Enter full name"
              />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Email is invalid" },
              ]}
            >
              <Input
                name="email"
                size="large"
                placeholder="example@email.com"
              />
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
                name="password"
                size="large"
                placeholder="Enter password (at least 6 characters)"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 16 }}>
              <Button type="primary" htmlType="submit" size="large" block>
                Register
              </Button>
            </Form.Item>
          </Form>
        </RemixForm>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Typography.Text type="secondary">
            Already have an account?{" "}
            <Link to={ROUTES.LOGIN} style={{ fontWeight: 500 }}>
              Login now
            </Link>
          </Typography.Text>
        </div>
      </Card>
    </div>
  );
}
