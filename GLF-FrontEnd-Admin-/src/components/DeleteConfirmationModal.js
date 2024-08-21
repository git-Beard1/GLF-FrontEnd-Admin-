import React from "react";
import '../styles/modal.css'

const DeleteConfirmationModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="delete-confirmation-modal">
      <p>Are you sure you want to delete?</p>
      <button
        onClick={onConfirm}
        style={{ color: "white", backgroundColor: "#9e202e", width: "100px", boxShadow: "none" }}
      >
        Yes
      </button>
      <button
        onClick={onCancel}
        style={{ color: "white", backgroundColor: "#b8b6b6", width: "100px", boxShadow: "none" }}
      >
        No
      </button>
    </div>
  );
};

export default DeleteConfirmationModal;