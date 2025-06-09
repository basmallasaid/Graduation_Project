import React, { useState } from 'react';
import styles from "../../../Styles/style.module.css";
import Swal from "sweetalert2";
import api from '../../../API/axiosInstance';
const AgrcEdit = ({ transaction, onClose }) => {
    const [editedFarm, setEditedFarm] = useState({
        farmName: transaction?.farmName || "",
        location: transaction?.location || "",
        size: transaction?.size || "",
        farmId: transaction?.farmId || ""
    });

    if (!transaction) return null;

    const handleChange = (e) => {
        setEditedFarm({
            ...editedFarm,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = () => {
        const farmData = {
            farmId: editedFarm.farmId,
            farmName: editedFarm.farmName,
            location: editedFarm.location,
            size: editedFarm.size
        };

        api.put("/Farm/EditFarm", farmData)
            .then((response) => {
                console.log("Updated farm:", response.data);
                Swal.fire("تم التعديل!", "تم تحديث بيانات المزرعة بنجاح.", "success");
                onClose();
            })
            .catch((err) => {
                console.error("Error updating farm:", err);
                Swal.fire("خطأ!", "حدثت مشكلة أثناء التعديل.", "error");
            });
    };

    return (
        <div className={styles.modal_overlay} onClick={onClose}>
            <div className={styles.modal_content} onClick={(e) => e.stopPropagation()}>
                <button className={styles.modal_close} onClick={onClose}>×</button>
                <div className={styles.modal_gridEdiit}>
                    <div className={styles.modal_itemL}>
                        <span className={styles.modal_labelL}>اسم المزرعة</span>
                        <input
                            type="text"
                            name="farmName"
                            value={editedFarm.farmName}
                            onChange={handleChange}
                            className={styles.modal_inputEdit}
                            style={{ width: "300px" }}
                        />
                    </div>
                    <div className={styles.modal_itemL} style={{ marginRight: "135px" }}>
                        <span className={styles.modal_labelL}>الموقع</span>
                        <input
                            type="text"
                            name="location"
                            value={editedFarm.location}
                            onChange={handleChange}
                            className={styles.modal_inputEdit}
                        />
                    </div>
                    <div className={styles.modal_itemL} style={{ marginRight: "135px" }}>
                        <h3 className={styles.modal_labelL}>المساحة</h3>
                        <input
                            type="number"
                            name="size"
                            value={editedFarm.size}
                            onChange={handleChange}
                            className={styles.modal_inputEdit}
                        />
                    </div>
                    <div className={styles.btnEdit}>
                        <button className="btn btn-dark mb-3" style={{ borderRadius: "10px" }} onClick={handleSave}>
                            حفظ التعديلات
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgrcEdit;
