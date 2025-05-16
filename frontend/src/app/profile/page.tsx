"use client";
import { useState, useEffect } from "react";
import { Button, Form, Input, message, Card } from "antd";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("user");
    if (data) {
      const parsedUser = JSON.parse(data);
      setUser(parsedUser);
      form.setFieldsValue({ username: parsedUser.username });
    }
  }, [form]);

  const onFinish = async (values: any) => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await axios.put(
        "http://localhost:3000/auth/update-profile",
        { username: values.username },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update local storage and state
      const updatedUser = { ...user, username: values.username };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      message.success("Профайл амжилттай шинэчлэгдлээ");
      setIsEdit(false);
    } catch (error: any) {
      message.error(error.response?.data?.message || "Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card title="Профайл мэдээлэл" bordered={false}>
        {!isEdit ? (
          <>
            <div className="mb-6">
              <p className="text-lg">
                <span className="font-medium">Нэвтрэх нэр:</span> {user.username}
              </p>
              <p className="text-lg">
                <span className="font-medium">Эрх:</span> {user.role}
              </p>
            </div>
            <Button  type="primary" onClick={() => setIsEdit(true)}>
              Засах
            </Button>
          </>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ username: user.username }}
          >
            <Form.Item
              name="username"
              label="Нэвтрэх нэр"
              rules={[{ required: true, message: "Нэвтрэх нэр оруулна уу" }]}
            >
              <Input />
            </Form.Item>
            <div className="flex gap-4">
              <Button type="primary" htmlType="submit" loading={loading}>
                Хадгалах
              </Button>
              <Button
                onClick={() => {
                  setIsEdit(false);
                  form.resetFields();
                }}
              >
                Цуцлах
              </Button>
            </div>
          </Form>
        )}
      </Card>
    </div>
  );
}
