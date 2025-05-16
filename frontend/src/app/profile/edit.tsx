"use client";
import { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ProfileEditPage() {
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem("user");
    if (data) {
      setUser(JSON.parse(data));
    }
  }, []);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      // Profile edit backend request
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:3000/auth/profile", 
        values, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      message.success("Мэдээлэл амжилттай шинэчлэгдлээ");
      localStorage.setItem("user", JSON.stringify({ username: values.username, role: user?.role }));
      router.push("/profile");
    } catch (err) {
      message.error("Алдаа гарлаа, дахин оролдоно уу");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Нэвтэрсэн хэрэглэгч алга байна.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Хувийн мэдээлэл засах</h1>
      <Form layout="vertical" onFinish={onFinish} initialValues={user}>
        <Form.Item
          name="username"
          label="Нэвтрэх нэр"
          rules={[{ required: true, message: "Нэвтрэх нэр оруулна уу" }]}
        >
          <Input placeholder="Жишээ: admin" />
        </Form.Item>
        <Form.Item name="role" label="Эрх">
          <Input disabled value={user.role} />
        </Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading}>
          Шинэчлэх
        </Button>
      </Form>
    </div>
  );
}
