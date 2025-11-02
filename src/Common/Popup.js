import React from "react";
import "../assets/css/Popup.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import EditCategory from "../Popup/EditCategory";
import EditTransaction from "../Popup/EditTransaction";

const Popup = ({ onClose, popupType, title, query=null, onRefresh=null }) => {
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div
        className="popup-container"
        onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
      >
        <div className="popup-header">
          <h2>{title}</h2>
          <FontAwesomeIcon icon={faXmark} className="close-icon" onClick={onClose} />
        </div>

        <div className="popup-body">
            {popupType === "categoryPopup" && (
                <EditCategory id={query} onClose={onClose} onRefresh={onRefresh} />
            )}
            {popupType === "transactionPopup" && (
                <EditTransaction id={query} onClose={onClose} onRefresh={onRefresh} />
            )}
        </div>
      </div>
    </div>
  );
};

export default Popup;