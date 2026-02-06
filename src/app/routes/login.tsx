import {
  Link,
  LoaderFunctionArgs,
  Form as RemixForm,
  useActionData,
} from "react-router";
import { Form, Input, Button, Card, Typography, Alert } from "antd";
import ROUTES from "~/constants/route";
import { redirectIfAuthenticated } from "~/utils/auth.server";
export { loginAction as action } from "~/actions/loginAction";
export const meta = () => {
  return [{ title: "Login" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  await redirectIfAuthenticated(request);
  return null;
}
export default function LoginPage() {
  const actionData = useActionData<{ error?: string }>();

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
          Login
        </Typography.Title>

        <RemixForm method="post">
          <Form layout="vertical" component={false}>
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
              rules={[{ required: true, message: "Please enter password" }]}
            >
              <Input.Password
                name="password"
                size="large"
                placeholder="Enter password"
              />
            </Form.Item>

            {actionData?.error && (
              <Alert
                message={actionData.error}
                type="error"
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}

            <Form.Item style={{ marginBottom: 16 }}>
              <Button type="primary" htmlType="submit" size="large" block>
                Login
              </Button>
            </Form.Item>
          </Form>
        </RemixForm>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Typography.Text type="secondary">
            Don't have an account?{" "}
            <Link to={ROUTES.REGISTER} style={{ fontWeight: 500 }}>
              Register now
            </Link>
          </Typography.Text>
        </div>
      </Card>
    </div>
  );
}
