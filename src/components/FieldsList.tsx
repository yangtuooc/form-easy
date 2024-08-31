import React from "react";
import "./FieldsList.css";

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
      <h3 className="fields-list-title">Form Fields</h3>
      <div className="fields-list-container">
        {fields.length === 0 ? (
          <p className="no-fields-message">
            No fields added yet. Draw a box on the PDF to add a field.
          </p>
        ) : (
          <ul className="fields-list-items">
            {fields.map((field, index) => (
              <li key={index} className="field-item">
                <span
                  className="field-name"
                  title={field.key || `Field ${index + 1}`}
                >
                  {field.key || `Field ${index + 1}`}
                </span>
                <div className="field-actions">
                  <button
                    onClick={() => onEdit(index)}
                    className="field-action-btn edit-btn"
                    title="Edit field"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(index)}
                    className="field-action-btn delete-btn"
                    title="Delete field"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FieldsList;
