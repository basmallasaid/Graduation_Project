import React, { useState, useEffect } from 'react';
import styles from "../../../Styles/style.module.css";
import Swal from "sweetalert2";
import api from "../../../API/axiosInstance";

const EditLand = ({ onClose, landId }) => {
    const [landData, setLandData] = useState({
        landName: '',
        image: null,
        imageUrl: '',
        farmId: null,
        parcelId: landId
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLandData = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/LandParcel/${landId}`);
                const land = response.data;

                setLandData(prevState => ({
                    ...prevState,
                    landName: land.parcelName,
                    imageUrl: `https://cityroots.runasp.net/${land.imageUrl}`,
                    farmId: land.farmId,
                    parcelId: land.parcelId
                }));
            } catch (err) {
                console.error("Error fetching data:", err);
                Swal.fire("خطأ!", "حدث خطأ في جلب بيانات الأرض", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchLandData();
    }, [landId]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image" && files && files[0]) {
            const newImageUrl = URL.createObjectURL(files[0]);
            setLandData(prevState => ({
                ...prevState,
                image: files[0],
                imageUrl: newImageUrl
            }));
        } else {
            setLandData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleSave = async () => {
        if (!landData.farmId || !landId || !landData.landName.trim()) {
            Swal.fire("خطأ!", "يرجى ملء جميع البيانات المطلوبة", "error");
            return;
        }

        const formData = new FormData();
        formData.append("ParcelId", Number(landId));
        formData.append("FarmId", Number(landData.farmId));
        formData.append("ParcelName", landData.landName);

        if (landData.image) {
            formData.append("Image", landData.image);
        }

        try {
            await api.put(`LandParcel/EditLand`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            Swal.fire("تم التعديل!", "تم تحديث بيانات الأرض بنجاح.", "success");
            onClose();
            window.location.reload();
        } catch (err) {
            console.error("Error updating land:", err);
            Swal.fire("خطأ!", "فشل تعديل الأرض: " + (err.response?.data?.message || "خطأ غير معروف"), "error");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.modal_overlayL} onClick={onClose}>
            <div className={styles.modal_contentL} onClick={(e) => e.stopPropagation()}>
                <button className={styles.modal_closeL} onClick={onClose}>×</button>
                <div className={styles.modal_gridL}>
                    <div className={styles.image_and_data_container}>
                        <div className={styles.data_container}>
                            <div className={styles.modal_itemL}>
                                <span className={styles.modal_labelL}>اسم الأرض</span>
                                <input
                                    type="text"
                                    name="landName"
                                    value={landData.landName}
                                    onChange={handleChange}
                                    className={styles.modal_inputEdit}
                                />
                            </div>
                        </div>

                        <div className={styles.image_containerL}>
                            {landData.imageUrl && (
                                <img
                                    src={landData.imageUrl}
                                    alt="صورة الأرض"
                                    className={styles.preview_image}
                                />
                            )}
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

                    <button
                        className={`btn btn-dark mb-3 ${styles.AddLand_btn}`}
                        onClick={handleSave}
                    >
                        حفظ التعديلات
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditLand;
