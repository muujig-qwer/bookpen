"use client";
import { App, Button, Form, Input, Select } from "antd";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const { message } = App.useApp();

  const onFinish = async (values: any) => {
    try {
      await axios.post("http://localhost:3000/auth/register", values);
      message.success("Амжилттай бүртгэгдлээ");
      router.push("/login");
    } catch {
      message.error("Бүртгэл амжилтгүй");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-xl font-semibold text-center mb-4">Бүртгүүлэх</h1>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item name="username" label="Нэвтрэх нэр" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Нууц үг" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="role" label="Хандах эрх" rules={[{ required: true }]}>
            <Select
              options={[
                { value: "book", label: "Зөвхөн ном" },
                { value: "pen", label: "Зөвхөн үзэг" },
              ]}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Бүртгүүлэх
          </Button>
        </Form>
      </div>
    </div>
  );
}
