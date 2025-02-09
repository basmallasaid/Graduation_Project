import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import styles from "../../../Styles/style.module.css";
import AddLand from './AddLand';
import EditLand from './EditLand';

const AgriculturalPop = ({ transaction, onClose }) => {
    const [showAddLandPopup, setShowAddLandPopup] = useState(false);
    const [showEditLandPopup, setShowEditLandPopup] = useState(false);
    const [selectedLandId, setSelectedLandId] = useState(null);

    if (!transaction) return null;

    // فتح وإغلاق النوافذ المنبثقة
    const handleOpenAddLandPopup = () => setShowAddLandPopup(true);
    const handleCloseAddLandPopup = () => setShowAddLandPopup(false);
    
    const handleEdit = (parcelId) => {
        console.log("تعديل الأرض ذات الرقم:", parcelId);
        setSelectedLandId(parcelId);
        setShowEditLandPopup(true);
    };
    
    const handleCloseEditLandPopup = () => {
        setShowEditLandPopup(false);
        setSelectedLandId(null);
    };

    // حذف الأرض
    const handleDelete = (parcelId) => {
        if (!parcelId) {
            console.error("Error: parcelId is undefined or null");
            Swal.fire('خطأ!', 'الأرض غير موجودة', 'error');
            return;
        }

        Swal.fire({
            title: 'تأكيد حذف',
            text: "هل أنت متأكد أنك تريد حذف هذه الأرض؟",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#49A760',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'نعم، حذف!',
            cancelButtonText: 'لا، إلغاء'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:3100/Farm/${parcelId}`)
                    .then((response) => {
                        console.log("Delete Response:", response);
                        Swal.fire('تم الحذف!', 'تم حذف الأرض بنجاح.', 'success');
                    })
                    .catch(err => {
                        console.error("Error deleting land:", err.response ? err.response.data : err);
                        Swal.fire('خطأ!', 'حدثت مشكلة عند الحذف', 'error');
                    });
            }
        });
    };

    return (
        <div className={styles.modal_overlayA} onClick={onClose}>
            <div className={styles.modal_contentA} onClick={(e) => e.stopPropagation()}>
                <button className={styles.modal_closeA} onClick={onClose}>×</button>
                <h2 className={styles.modal_titleA}>تفاصيل المزرعة</h2>

                {/* بيانات المزرعة */}
                <div className={styles.first_rowA}>
                    <div className={styles.first_row_itemA}>
                        <span className={styles.modal_labelA}>اسم المزرعة</span>
                        <span className={`${styles.modal_valueA} ${styles.modal_valueAA}`}>{transaction.farmName}</span>
                    </div>
                    <div className={styles.first_row_itemA}>
                        <span className={styles.modal_labelA}>رقم المزرعة</span>
                        <span className={`${styles.modal_valueA} ${styles.modal_valueAA}`}>{transaction.farmId}</span>
                    </div>
                    <div className={styles.first_row_itemA}>
                        <span className={styles.modal_labelA}>الموقع</span>
                        <span className={`${styles.modal_valueA} ${styles.modal_valueAA}`}>{transaction.location}</span>
                    </div>
                    <div className={styles.first_row_itemA}>
                        <span className={styles.modal_labelA}>المساحة</span>
                        <span className={`${styles.modal_valueA} ${styles.modal_valueAA}`}>{transaction.size} فدان</span>
                    </div>
                </div>

                {/* قسم الأراضي */}
                <div className={styles.section_dividerA}>
                    <h3 className={styles.section_titleA}>الأراضي المرتبطة بالمزرعة</h3>
                    <button
                        className={`btn btn-dark mb-3 ${styles.add_buttonA}`}
                        onClick={handleOpenAddLandPopup}
                    >
                        إضافة أرض
                    </button>
                </div>

                {/* قائمة الأراضي */}
                <div className={styles.scrollable_sectionA}>
                    {transaction.landParcels.map((parcel) => (
                        <div key={parcel.parcelId} className={styles.land_parcelA}>
                            {/* بيانات الأرض */}
                            <div className={styles.land_parcel_dataA}>
                                <div className={styles.land_parcel_rowA}>
                                    <div className={styles.land_parcel_itemA}>
                                        <span className={styles.modal_labelA}>رقم الأرض</span>
                                        <span className={`${styles.modal_valueA} ${styles.modal_closeA2}`}>{parcel.parcelId}</span>
                                    </div>
                                    <div className={styles.land_parcel_itemA}>
                                        <span className={styles.modal_labelA}>حالة الأرض</span>
                                        <span className={`${styles.modal_valueA} ${styles.modal_closeA2}`}>{parcel.status}</span>
                                    </div>
                                </div>
                                <div className={styles.land_parcel_rowA}>
                                    <div className={styles.land_parcel_itemA}>
                                        <span className={styles.modal_labelA}>اسم الأرض</span>
                                        <span className={`${styles.modal_valueA} ${styles.modal_closeA2}`}>{parcel.landName}</span>
                                    </div>
                                    <div className={styles.land_parcel_itemA}>
                                        <span className={styles.modal_labelA}>اسم الدورة</span>
                                        <span className={`${styles.modal_valueA} ${styles.modal_closeA2}`}>{parcel.cycleName}</span>
                                    </div>
                                </div>
                            </div>

                            {/* أيقونات التعديل والحذف */}
                            <span className={styles.icons_containerA}>
                                <span 
                                    className={`text-primary ${styles.iconA}`}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => handleEdit(parcel.parcelId)} 
                                >
                                    ✎
                                </span>
                                <span className="text-danger" style={{ cursor: "pointer" }} 
                                    onClick={() => handleDelete(parcel.parcelId)}>
                                    🗑
                                </span>
                            </span>

                            {/* صورة الأرض */}
                            <div className={styles.land_parcel_imageA}>
                                <img src={parcel.imageUrl} alt="Parcel" className={styles.parcel_imageA} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* عرض Popup إضافة أرض */}
                {showAddLandPopup && (
                    <AddLand onClose={handleCloseAddLandPopup} />
                )}

                {/* عرض Popup تعديل الأرض */}
                {showEditLandPopup && (
                    <EditLand onClose={handleCloseEditLandPopup} landId={selectedLandId} />
                )}
            </div>
        </div>
    );
};

export default AgriculturalPop;
