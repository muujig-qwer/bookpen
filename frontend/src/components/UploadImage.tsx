"use client";
import { message, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

interface Props {
  bookId: string;
  onUploaded: () => void;
}

export default function UploadImage({ bookId, onUploaded }: Props) {
  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      await axios.post(
        `http://localhost:3001/books/upload/${bookId}`, // ← порт шалгах
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      message.success("Зураг амжилттай илгээгдлээ");
      onUploaded();
    } catch (error) {
      message.error("Зураг илгээхэд алдаа гарлаа");
    }
  };

  return (
    <Upload
      customRequest={({ file }) => handleUpload(file as File)}
      showUploadList={false}
    >
      <Button icon={<UploadOutlined />}>Зураг оруулах</Button>
    </Upload>
  );
}
