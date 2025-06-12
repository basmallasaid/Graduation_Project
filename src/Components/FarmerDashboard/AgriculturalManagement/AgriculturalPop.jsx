import React, { useState } from 'react';
import Swal from 'sweetalert2';
import styles from "../../../Styles/style.module.css";
import AddLand from './AddLand';
import EditLand from './EditLand';
import api from '../../../API/axiosInstance';

// 1. استقبل الدالة الجديدة onDataChange
const AgriculturalPop = ({ transaction, onClose, onDataChange }) => {
    const [showAddLandPopup, setShowAddLandPopup] = useState(false);
    const [showEditLandPopup, setShowEditLandPopup] = useState(false);
    const [selectedLandId, setSelectedLandId] = useState(null);

    if (!transaction) return null;

    // 2. أنشئ دوال للتعامل مع نجاح الإضافة والتعديل
    const handleAddSuccess = () => {
        onDataChange(); // أعد تحميل البيانات في المكون الجد
        handleCloseAddLandPopup(); // أغلق النافذة
    };

    const handleEditSuccess = () => {
        onDataChange(); // أعد تحميل البيانات في المكون الجد
        handleCloseEditLandPopup(); // أغلق النافذة
    };
    
    // دوال الفتح والإغلاق تبقى كما هي
    const handleOpenAddLandPopup = () => setShowAddLandPopup(true);
    const handleCloseAddLandPopup = () => setShowAddLandPopup(false);
    
    const handleEdit = (parcelId) => {
        setSelectedLandId(parcelId);
        setShowEditLandPopup(true);
    };

    const handleCloseEditLandPopup = () => {
        setShowEditLandPopup(false);
        setSelectedLandId(null);
    };

    // 3. قم بتعديل دالة الحذف
    const handleDelete = (parcelId) => {
        if (!parcelId) {
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
                api.delete(`LandParcel/${parcelId}`)
                    .then(() => {
                        Swal.fire('تم الحذف!', 'تم حذف الأرض بنجاح.', 'success');
                        // *** استدع دالة التحديث بعد الحذف الناجح ***
                        onDataChange();
                    })
                    .catch(err => {
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

                <div className={styles.section_dividerA}>
                    <h3 className={styles.section_titleA}>الأراضي المرتبطة بالمزرعة</h3>
                    <button className={`btn btn-dark mb-3 ${styles.add_buttonA}`} onClick={handleOpenAddLandPopup}>
                        إضافة أرض
                    </button>
                </div>

                <div className={styles.scrollable_sectionA}>
                    {transaction.landParcels.map((parcel) => (
                        <div key={parcel.parcelId} className={styles.land_parcelA}>
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
                                        <span className={`${styles.modal_valueA} ${styles.modal_closeA2}`}>{parcel.parcelName}</span>
                                    </div>
                                    <div className={styles.land_parcel_itemA}>
                                        <span className={styles.modal_labelA}>اسم الدورة</span>
                                        <span className={`${styles.modal_valueA} ${styles.modal_closeA2}`}>{parcel.cycleName}</span>
                                    </div>
                                </div>
                            </div>
                            <span className={styles.icons_containerA}>
                                <span className={`text-primary ${styles.iconA}`} style={{ cursor: "pointer" }} onClick={() => handleEdit(parcel.parcelId)}>✎</span>
                                <span className="text-danger" style={{ cursor: "pointer" }} onClick={() => handleDelete(parcel.parcelId)}>🗑</span>
                            </span>
                            <div className={styles.land_parcel_imageA}>
                                <img src={`https://cityroots.runasp.net/${parcel.imageUrl}`} alt="Parcel" className={styles.parcel_imageA} />
                            </div>
                        </div>
                    ))}
                </div>
 {showAddLandPopup && (
                    <AddLand 
                        onClose={handleCloseAddLandPopup} 
                        farmId={transaction.farmId}
                        onAddSuccess={handleAddSuccess} // مرر الدالة الجديدة
                    />
                )}
                {showEditLandPopup && (
                    <EditLand 
                        onClose={handleCloseEditLandPopup} 
                        landId={selectedLandId}
                        onEditSuccess={handleEditSuccess} // مرر الدالة الجديدة
                    />
                )}
            </div>
        </div>
    );
};

export default AgriculturalPop;
