"use client";
import { App, Button, Form, Input } from "antd";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const { message } = App.useApp();

  const onFinish = async (values: any) => {
    try {
      const res = await axios.post("http://localhost:3000/auth/login", values);
      const { username, role } = res.data.user;
      localStorage.setItem("user", JSON.stringify({ username, role }));

      message.success("Амжилттай нэвтэрлээ");
      if (role === "book") {
        router.push("/book");
      } else {
        router.push("/pens");
      }
    } catch {
      message.error("Нэвтрэх нэр эсвэл нууц үг буруу байна");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-xl font-semibold text-center mb-4">Нэвтрэх</h1>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="username"
            label="Нэвтрэх нэр"
            rules={[{ required: true, message: "Нэвтрэх нэр оруулна уу" }]}
          >
            <Input placeholder="Жишээ: admin" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Нууц үг"
            rules={[{ required: true, message: "Нууц үг оруулна уу" }]}
          >
            <Input.Password placeholder="••••••••" />
          </Form.Item>
          <Button type="link" onClick={() => router.push("/register")}>
            Шинэ хэрэглэгч үүсгэх
          </Button>

          <Button type="primary" htmlType="submit" block>
            Нэвтрэх
          </Button>
        </Form>
      </div>
    </div>
  );
}
