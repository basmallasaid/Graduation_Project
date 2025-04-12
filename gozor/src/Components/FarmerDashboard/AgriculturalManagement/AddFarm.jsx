import React, { useState } from 'react';
import styles from "../../../Styles/style.module.css";
import axios from "axios";
import Swal from "sweetalert2";
import api from "../../../API/axiosInstance";
const AddFarm = ({ onClose }) => {
    // حالة لإضافة مزرعة جديدة
    const [newFarm, setNewFarm] = useState({
        farmName: "",
        location: "",
        size: ""
    });

    // تحديث القيم عند التغيير
    const handleChange = (e) => {
        setNewFarm({ ...newFarm, [e.target.name]: e.target.value });
    };

    // إضافة مزرعة جديدة
    const handleAdd = () => {
        axios.post("http://localhost:3100/Farm", newFarm)
            .then((response) => {
                console.log("Farm added:", response.data);
                Swal.fire("تمت الإضافة!", "تمت إضافة المزرعة بنجاح.", "success");
                onClose(); // إغلاق النافذة بعد الحفظ
            })
            .catch((err) => {
                console.error("Error adding farm:", err);
                Swal.fire("خطأ!", "حدثت مشكلة أثناء الإضافة.", "error");
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
                            value={newFarm.farmName}
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
                            value={newFarm.location}
                            onChange={handleChange}
                            className={styles.modal_inputEdit}
                        />
                    </div>
                    <div className={styles.modal_itemL} style={{ marginRight: "135px" }}>
                        <h3 className={styles.modal_labelL}>المساحة</h3>
                        <input
                            type="number"
                            name="size"
                            value={newFarm.size}
                            onChange={handleChange}
                            className={styles.modal_inputEdit}
                        />
                    </div>
                    <div className={styles.btnEdit}>
                        <button className="btn btn-dark mb-3" style={{ borderRadius: "10px" }} onClick={handleAdd }>
                           حفظ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddFarm;
