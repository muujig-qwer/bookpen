"use client";
import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:3000/auth/change-password", 
        values, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      message.success("Нууц үг амжилттай солигдлоо");
      router.push("/profile");
    } catch (err) {
      message.error("Алдаа гарлаа, дахин оролдоно уу");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Нууц үг солих</h1>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="oldPassword"
          label="Хуучин нууц үг"
          rules={[{ required: true, message: "Хуучин нууц үгээ оруулна уу" }]}
        >
          <Input.Password placeholder="••••••••" />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="Шинэ нууц үг"
          rules={[{ required: true, message: "Шинэ нууц үг оруулна уу" }]}
        >
          <Input.Password placeholder="••••••••" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="Нууц үг баталгаажуулах"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: "Нууц үгээ баталгаажуулна уу" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Нууц үг тохирохгүй байна'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="••••••••" />
        </Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading}>
          Солих
        </Button>
      </Form>
    </div>
  );
}
