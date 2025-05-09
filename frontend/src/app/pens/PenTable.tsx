import { Table, Button, Space, Popconfirm } from "antd";
import { PenType, PagModel } from "../../../types/pen";
import { useRouter } from "next/navigation";

interface Props {
  pens: PenType[];
  loading: boolean;
  pagination: PagModel;
  onEdit: (pen: PenType) => void;
  onDelete: (id: string) => void;
  onChange: (pageInfo: any) => void;
}

export default function PenTable({
  pens,
  loading,
  pagination,
  onEdit,
  onDelete,
  onChange,
}: Props) {
  const router = useRouter();

  const handleBookRedirect = () => {
    router.push("/book");
  };

  return (
    <div>
      <Table
        bordered
        className="rounded-lg shadow-md"
        dataSource={pens}
        columns={[
          {
            title: "📚 Гарчиг",
            dataIndex: "title",
            render: (text: string) => <strong>{text || "xoxo"}</strong>,
          },
          { title: "✍️ Загвар", dataIndex: "brand" },
          { title: "📅 Он", dataIndex: "publishYear" },
          {
            title: "⚙️ Үйлдэл",
            render: (record: PenType) => (
              <Space>
                <Button type="link" onClick={() => onEdit(record)}>
                  Засварлах
                </Button>
                <Popconfirm
                  title="Та энэ үйлдлийг хийхдээ итгэлтэй байна уу?"
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
        onClick={handleBookRedirect}
        style={{ marginTop: 16 }}
      >
        Book руу шилжих
      </Button>
    </div>
  );
}
