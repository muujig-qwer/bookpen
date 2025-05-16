"use client";
import { useEffect, useState } from "react";
import {
  Button,
  message,
  Modal,
  ConfigProvider,
  Form,
  Upload,
  Image,
  Input,
} from "antd";
import BookForm from "./BookForm";
import { BookType, PagModel } from "../../../types/book";
import {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
} from "../../../services/bookService";
import BookTable from "./BookTable";
import { UploadOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";

const { TextArea } = Input;

export default function BookManager() {
  const [books, setBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PagModel>({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingBook, setEditingBook] = useState<BookType | null>(null);
  const [viewingBook, setViewingBook] = useState<BookType | null>(null);
  const [description, setDescription] = useState<string>("");
  const [file, setFile] = useState<RcFile | null>(null);

  const fetchBooks = async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      const res = await getBooks(page, pageSize);
      setBooks(res.data.data);
      setPagination({ ...pagination, total: res.data.count, current: page });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(pagination.current, pagination.pageSize);
  }, []);

  const handleViewClose = () => {
    setViewingBook(null);
    setDescription("");
    setFile(null);
  };

  const handleTableChange = (pageInfo: any) => {
    fetchBooks(pageInfo.current, pageInfo.pageSize);
  };

  const handleDelete = async (id: string) => {
    await deleteBook(id);
    fetchBooks(pagination.current, pagination.pageSize);
  };

  const handleAdd = () => {
    setEditingBook(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (val: BookType) => {
    setEditingBook(val);
    form.setFieldsValue(val);
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    if (editingBook) {
      await updateBook(editingBook._id!, values);
      message.success("Амжилттай хадгалагдлаа");
    } else {
      await createBook(values);
    }
    setIsModalOpen(false);
    fetchBooks(pagination.current, pagination.pageSize);
  };

  const handleView = (book: BookType) => {
    setViewingBook(book);
    setDescription(book.description || "");
    setFile(null);
  };

  const handleSaveDescriptionAndImage = async () => {
    if (!viewingBook) return;
    const formData = new FormData();
    formData.append("description", description);
    if (file) formData.append("image", file);

    try {
      const res = await fetch(`http://localhost:3000/books/upload/${viewingBook._id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Хадгалах үед алдаа гарлаа");
      message.success("Тайлбар болон зураг амжилттай хадгалагдлаа");
      fetchBooks(pagination.current, pagination.pageSize);
      handleViewClose();
    } catch (err) {
      message.error("Хадгалах үед алдаа гарлаа");
    }
  };

  return (
    <div className="p-5">
      <div className="flex gap-2 mb-4">
        <Button
          type="primary"
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700"
        >
          ➕ Бүртгэх
        </Button>
        <Button onClick={() => fetchBooks(1, 5)}>Дахин ачааллах</Button>
      </div>

      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#3b82f6",
            borderRadius: 12,
          },
        }}
      >
        <BookTable
          books={books}
          loading={loading}
          pagination={pagination}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onChange={handleTableChange}
          onView={handleView}
        />
      </ConfigProvider>

      <Modal
        title={editingBook ? "📘 Засварлах" : "📗 Шинэ ном нэмэх"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleOk}
        okText={editingBook ? "Хадгалах" : "Нэмэх"}
        cancelText="Цуцлах"
      >
        <BookForm form={form} />
      </Modal>

      <Modal
        title="📖 Дэлгэрэнгүй мэдээлэл"
        open={!!viewingBook}
        onCancel={handleViewClose}
        footer={null}
      >
        {viewingBook && (
          <div className="space-y-4">
            <p><strong>Гарчиг:</strong> {viewingBook.title}</p>
            <p><strong>Зохиогч:</strong> {viewingBook.author}</p>
            <p><strong>Он:</strong> {viewingBook.publishYear}</p>

            <Image
              width={200}
              src={`http://localhost:3000/uploads/${viewingBook.image || "no-image.jpg"}`}
              alt="Book cover"
            />

            <Upload
              beforeUpload={(file) => {
                setFile(file);
                return false;
              }}
              fileList={file ? [file as any] : []}
              showUploadList={true}
            >
              <Button icon={<UploadOutlined />}>Зураг сонгох</Button>
            </Upload>

            <div>
              <p className="font-semibold">Тайлбар:</p>
              <TextArea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Button
                className="mt-2"
                type="primary"
                onClick={handleSaveDescriptionAndImage}
              >
                💾 Хадгалах
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
