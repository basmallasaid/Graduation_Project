import React, { useState } from 'react';
import styles from "../../../Styles/style.module.css";
import axios from "axios";
import Swal from "sweetalert2";

const AddLand = ({ onClose }) => {
    const [newLand, setNewLand] = useState({
        landName: "",
        image: null // لحفظ الصورة
    });

    // تحديث القيم عند التغيير
    const handleChange = (e) => {
        if (e.target.name === "image") {
            setNewLand({ ...newLand, image: e.target.files[0] }); // حفظ الملف
        } else {
            setNewLand({ ...newLand, [e.target.name]: e.target.value });
        }
    };

    // إضافة أرض جديدة
    const handleAdd = () => {
        const formData = new FormData();
        formData.append("landName", newLand.landName);
        if (newLand.image) {
            formData.append("image", newLand.image); // إضافة الصورة إلى FormData
        }

        axios.post("http://localhost:3100/Farm", formData, {
            headers: {
                "Content-Type": "multipart/form-data", // إرسال البيانات كـ FormData
            },
        })
            .then((response) => {
                console.log("Land added:", response.data);
                Swal.fire("تمت الإضافة!", "تمت إضافة الأرض بنجاح.", "success");
                onClose(); // إغلاق النافذة بعد الحفظ
            })
            .catch((err) => {
                console.error("Error adding land:", err);
                Swal.fire("خطأ!", "حدثت مشكلة أثناء الإضافة.", "error");
            });
    };

    return (
        <div className={styles.modal_overlayL} onClick={onClose}>
            <div className={styles.modal_contentL} onClick={(e) => e.stopPropagation()}>
                <button className={styles.modal_closeL} onClick={onClose}>×</button>
                <div className={styles.modal_gridL}>
                    {/* الصورة على اليمين والبيانات على اليسار */}
                    <div className={styles.image_and_data_container}>
                        {/* البيانات على اليسار */}
                        <div className={styles.data_container}>
                            <div className={styles.modal_itemL}>
                                <span className={styles.modal_labelL} >اسم الأرض</span>
                                <input
                                    type="text"
                                    name="landName"
                                    value={newLand.landName}
                                    onChange={handleChange}
                                    className={styles.modal_inputEdit}
                                />
                            </div>
                        </div>

                        {/* الصورة على اليمين */}
                        <div className={styles.image_container}>
                            <input
                                type="file"
                                name="image"
                                id="imageUpload"
                                onChange={handleChange}
                                className={styles.file_inputL}
                                accept="image/*"
                            />
                        </div>
                    </div>

                    {/* زر الإضافة في الأسفل */}
                    <button
                        className={`btn btn-dark mb-3 ${styles.AddLand_btn}`}

                        onClick={handleAdd}
                    >
                       حفظ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddLand;