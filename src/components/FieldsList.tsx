import React from "react";

interface FieldsListProps {
  fields: Array<{ key: string }>;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

const FieldsList: React.FC<FieldsListProps> = ({
  fields,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="fields-list">
      <h3>表单字段</h3>
      {fields.map((field, index) => (
        <div key={index} className="field-item">
          <span>{field.key || `字段 ${index + 1}`}</span>
          <button onClick={() => onEdit(index)}>编辑</button>
          <button onClick={() => onDelete(index)}>删除</button>
        </div>
      ))}
    </div>
  );
};

export default FieldsList;
