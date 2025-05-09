"use client";
import { useEffect, useState } from "react";
import { Button, message, Modal, ConfigProvider, Form } from "antd";
import BookForm from "./BookForm";
import { BookType, PagModel } from "../../../types/book";
import {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
} from "../../../services/bookService";
import BookTable from "./BookTable";

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
      message.success("Амжилттай шинэчлэгдлээ");
    } else {
      await createBook(values);
      message.success("Амжилттай бүртгэгдлээ");
    }
    setIsModalOpen(false);
    fetchBooks(pagination.current, pagination.pageSize);
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
        <Button onClick={() => fetchBooks(1, pagination.pageSize)}>
          Дахин ачааллах
        </Button>
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
        />
      </ConfigProvider>
      <Modal
        title={editingBook ? "📘 Засварлах" : "📗 Шинэ ном нэмэх"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleOk}
        okText={editingBook ? "Хадгалах" : "Нэмэх"}
        cancelText="Цуцлах"
        width={800}
      >
        <BookForm form={form} />
      </Modal>
    </div>
  );
}
