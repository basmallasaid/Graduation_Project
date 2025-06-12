import React, { useState, useEffect } from 'react';
import styles from "../../../Styles/style.module.css";
import Swal from "sweetalert2";
import api from '../../../API/axiosInstance';

const AddLand = ({ onClose, farmId ,onAddSuccess}) => {
    const [newLand, setNewLand] = useState({
        farmId: farmId || '',
        parcelName: '',
        imageUrl: null
    });

    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        if (farmId) {
            setNewLand(prev => ({
                ...prev,
                farmId: farmId
            }));
        }
    }, [farmId]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'imageUrl') {
            const file = files[0];
            setNewLand(prev => ({
                ...prev,
                imageUrl: file
            }));
            setImageLoaded(true);
        } else {
            setNewLand(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleAdd = () => {
        if (!newLand.farmId) {
            Swal.fire("خطأ!", "لم يتم تحديد مزرعة صحيحة.", "error");
            return;
        }

        if (!newLand.parcelName || !newLand.imageUrl) {
            Swal.fire("خطأ!", "يرجى تعبئة جميع الحقول المطلوبة.", "error");
            return;
        }

        const formData = new FormData();
        formData.append("FarmId", newLand.farmId);
        formData.append("ParcelName", newLand.parcelName);
        formData.append("Image", newLand.imageUrl);

        api.post("/LandParcel", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        })
            .then(response => {
                Swal.fire("تمت الإضافة!", "تمت إضافة الأرض بنجاح.", "success")
                    .then(() => {
                        // 2. استدع الدالة التي تم تمريرها بدلاً من onClose
                        onAddSuccess(); 
                    });
            })
            .catch(err => {
                console.error("Error adding land:", err.response?.data || err.message);
                Swal.fire("خطأ!", "حدثت مشكلة أثناء الإضافة.", "error");
            });
    };

    return (
        <div className={styles.modal_overlayL} onClick={onClose}>
            <div className={styles.modal_contentL} onClick={(e) => e.stopPropagation()}>
                <button className={styles.modal_closeL} onClick={onClose}>×</button>
                <div className={styles.modal_gridL}>
                    <div className={styles.image_and_data_container}>
                        <div className={styles.data_container}>
                            <div className={styles.modal_itemL}>
                                <span className={styles.modal_labelL}>اسم القطعة</span>
                                <input
                                    type="text"
                                    name="parcelName"
                                    value={newLand.parcelName}
                                    onChange={handleChange}
                                    className={styles.modal_inputEdit}
                                />
                            </div>
                        </div>

                        <div className={`${styles.image_container} ${imageLoaded ? "has-image" : ""}`}>
                            {newLand.imageUrl && (
                                <img src={URL.createObjectURL(newLand.imageUrl)} alt="Uploaded" />
                            )}
                            <input
                                type="file"
                                name="imageUrl"
                                id="imageUpload"
                                onChange={handleChange}
                                className={styles.file_inputL}
                                accept="image/*"
                            />
                        </div>
                    </div>

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
