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
import { redirectIfAuthenticated } from "~/utils/authServer";
export { registerAction as action } from "~/actions/register";

export const meta = () => {
  return [{ title: "Đăng ký" }];
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
      }}
    >
      {actionData?.error && (
        <Alert
          style={{ position: "fixed", top: 20, right: 20 }}
          title={actionData?.error}
          type="warning"
          showIcon
          closable
        />
      )}
      <Card style={{ width: 360 }}>
        <Typography.Title level={3} style={{ textAlign: "center" }}>
          Đăng ký
        </Typography.Title>

        <RemixForm method="post">
          <Form layout="vertical" component={false}>
            <Form.Item label="Tên" rules={[{ required: true }]}>
              <Input name="fullName" />
            </Form.Item>

            <Form.Item label="Email" rules={[{ required: true }]}>
              <Input name="email" />
            </Form.Item>

            <Form.Item label="Mật khẩu" rules={[{ required: true }]}>
              <Input.Password name="password" />
            </Form.Item>

            <Form.Item style={{ marginTop: 16 }}>
              <Button type="primary" htmlType="submit" block>
                Đăng ký
              </Button>
            </Form.Item>
          </Form>
        </RemixForm>
        <Typography.Text>
          Đã có tài khoản?{" "}
          <Link
            to={ROUTES.LOGIN}
            className="ant-typography ant-typography-link"
          >
            Đăng nhập
          </Link>
        </Typography.Text>
      </Card>
    </div>
  );
}
