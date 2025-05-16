"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Avatar, Dropdown, MenuProps, Space, message } from "antd";
import { BookOutlined, EditOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = localStorage.getItem("user");
    if (data) {
      try {
        setUser(JSON.parse(data));
      } catch (error) {
        console.error("Failed to parse user data", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    message.success("Амжилттай гарлаа");
    router.push("/login");
  };

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'logout') {
      logout();
    } else {
      router.push(`/${e.key}`);
    }
  };

  const items: MenuProps['items'] = [
    {
      label: 'Профайл',
      key: 'profile',
      icon: <UserOutlined />,
    },
    {
      type: 'divider',
    },
    {
      label: 'Гарах',
      key: 'logout',
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  if (loading) return null;
  if (!user) return null;

  return (
    <div className="flex justify-between items-center bg-blue-600 text-white px-6 py-3 shadow-md">
      <div className="flex space-x-4">
        {user.role === "book" && (
          <Button 
            type="text" 
            onClick={() => router.push("/book")} 
            className="text-white flex items-center"
            icon={<BookOutlined />}
          >
            Ном
          </Button>
        )}
        {user.role === "pen" && (
          <Button 
            type="text" 
            onClick={() => router.push("/pens")} 
            className="text-white flex items-center"
            icon={<EditOutlined />}
          >
            Бал
          </Button>
        )}
      </div>
      
      <Dropdown menu={{ items, onClick: handleMenuClick }} placement="bottomRight">
        <Space className="cursor-pointer hover:bg-blue-700 px-3 py-1 rounded">
          <Avatar 
            size="small" 
            icon={<UserOutlined />} 
            className="bg-blue-400"
          />
          <span className="font-medium">{user.username}</span>
        </Space>
      </Dropdown>
    </div>
  );
}