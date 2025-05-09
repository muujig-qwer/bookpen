import { Table, Button, Space, Popconfirm } from "antd";
import { BookType, PagModel } from "../../../types/book";
import { useRouter } from "next/navigation";

interface Props {
  books: BookType[];
  loading: boolean;
  pagination: PagModel;
  onEdit: (book: BookType) => void;
  onDelete: (id: string) => void;
  onChange: (pageInfo: any) => void;
}

export default function BookTable({
  books,
  loading,
  pagination,
  onEdit,
  onDelete,
  onChange,
}: Props) {
  const router = useRouter();

  const handlePenRedirect = () => {
    router.push("/pens");
  };

  return (
    <div>
      <Table
        bordered
        className="rounded-lg shadow-md"
        dataSource={books}
        columns={[
          {
            title: "📚 Гарчиг",
            dataIndex: "title",
            render: (text: string) => <strong>{text || "xoxo"}</strong>,
          },
          { title: "✍️ Зохиогч", dataIndex: "author" },
          { title: "📅 Он", dataIndex: "publishYear" },
          {
            title: "⚙️ Үйлдэл",
            render: (record: BookType) => (
              <Space>
                <Button type="link" onClick={() => onEdit(record)}>
                  Засварлах
                </Button>
                <Popconfirm
                  title="Та энэ номыг устгахдаа итгэлтэй байна уу?"
                  okText="Тийм"
                  cancelText="Үгүй"
                  onConfirm={() => onDelete(record._id!)}
                >
                  <Button danger type="link">
                    Устгах
                  </Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
        rowKey="_id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
        }}
        onChange={onChange}
      />
      <Button
        type="primary"
        onClick={handlePenRedirect}
        style={{ marginTop: 16 }}
      >
        Pen руу шилжих
      </Button>
    </div>
  );
}