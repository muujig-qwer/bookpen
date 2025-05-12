"use client";
import { Form, Input, InputNumber } from "antd";

interface Props {
  form: any;
}

export default function BookForm({ form }: Props) {
  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="title"
        label="Гарчиг"
        rules={[{ required: true, message: "Гарчиг оруулна уу!" }]}
      >
        <Input placeholder="Жишээ: Нарны хот" />
      </Form.Item>

      <Form.Item
        name="author"
        label="Зохиогч"
        rules={[{ required: true, message: "Зохиогчийн нэр оруулна уу!" }]}
      >
        <Input placeholder="Жишээ: Д.Нацагдорж" />
      </Form.Item>

      <Form.Item
        name="publishYear"
        label="Хэвлэгдсэн он"
        rules={[
          { required: true, message: "Он заавал шаардлагатай!" },
          {
            type: "number",
            min: 1000,
            max: new Date().getFullYear(),
            message: "Зөв оноор (жишээ: 2020) оруулна уу",
          },
        ]}
      >
        <InputNumber className="w-full" placeholder="Жишээ: 2020" />
      </Form.Item>
    </Form>
  );
}
