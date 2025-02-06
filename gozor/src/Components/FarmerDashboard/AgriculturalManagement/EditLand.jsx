import React, { useState, useEffect } from 'react';
import styles from "../../../Styles/style.module.css";
import axios from "axios";
import Swal from "sweetalert2";

const EditLand = ({ onClose, landId }) => {
    const [landData, setLandData] = useState({
        landName: '',
        image: null,
        imageUrl: '',
        farmId: null,
        parcelId: landId
    });
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const fetchLandData = async () => {
            try {
                setLoading(true); // Set loading to true before fetching
                const response = await axios.get("http://localhost:3100/Farm");
                const farms = response.data;
                
                let foundLand = null;
                let foundFarmId = null;
                
                for(const farm of farms) {
                  const land = farm.landParcels.find(parcel => parcel.parcelId === landId);
                  if (land) {
                    foundLand = land;
                    foundFarmId = farm.farmId;
                    break;
                  }
                }
                
                if (foundLand) {
                  setLandData(prevState => ({
                      ...prevState,
                      landName: foundLand.landName,
                      imageUrl: foundLand.imageUrl,
                      farmId: foundFarmId,
                      parcelId: foundLand.parcelId
                  }));
              } else {
                  Swal.fire("خطأ!", "لم يتم العثور على الأرض", "error");
              }

            } catch (err) {
                console.error("Error fetching data:", err);
                Swal.fire("خطأ!", "حدث خطأ في جلب البيانات", "error");
            } finally {
              setLoading(false); // Set loading to false after fetch is complete, whether success or fail
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
        if (!landData.farmId || !landId) {
            Swal.fire("خطأ!", "معلومات غير مكتملة!", "error");
            return;
        }

        const updatedLand = {
            landName: landData.landName,
            imageUrl: landData.imageUrl || "/assets/Land.png",
            farmId: landData.farmId,
            parcelId: landId
        };
        
        try {
            await axios.put(`http://localhost:3100/Farm/${landData.farmId}/landParcels/${landId}`, updatedLand);
            Swal.fire("تم التعديل!", "تم تحديث بيانات الأرض بنجاح.", "success");
            onClose();
            window.location.reload();
        } catch (err) {
            console.error("Error updating land:", err);
            Swal.fire("خطأ!", "حدثت مشكلة أثناء التعديل: " + (err.response?.data?.message || "خطأ غير معروف"), "error");
        }
    };
        
    if (loading) {
        return <div>Loading...</div>; // Or a loader component
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