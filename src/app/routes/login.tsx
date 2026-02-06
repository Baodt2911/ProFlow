import {
  Link,
  LoaderFunctionArgs,
  Form as RemixForm,
  useActionData,
} from "react-router";
import { Form, Input, Button, Card, Typography } from "antd";
import ROUTES from "~/constants/route";
import { redirectIfAuthenticated } from "~/utils/authServer";
export { loginAction as action } from "~/actions/login";
export const meta = () => {
  return [{ title: "Đăng nhập" }];
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
      }}
    >
      <Card style={{ width: 360 }}>
        <Typography.Title level={3} style={{ textAlign: "center" }}>
          Đăng nhập
        </Typography.Title>

        <RemixForm method="post">
          <Form layout="vertical" component={false}>
            <Form.Item label="Email" rules={[{ required: true }]}>
              <Input name="email" />
            </Form.Item>

            <Form.Item label="Mật khẩu" rules={[{ required: true }]}>
              <Input.Password name="password" />
            </Form.Item>

            {actionData?.error && (
              <Typography.Text type="danger">
                {actionData.error}
              </Typography.Text>
            )}

            <Form.Item style={{ marginTop: 16 }}>
              <Button type="primary" htmlType="submit" block>
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </RemixForm>
        <Typography.Text>
          Chưa có tài khoản?{" "}
          <Link
            to={ROUTES.REGISTER}
            className="ant-typography ant-typography-link"
          >
            Đăng ký
          </Link>
        </Typography.Text>
      </Card>
    </div>
  );
}
