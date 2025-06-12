import React, { useEffect, useState, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../../../Styles/style.module.css";
import AgriculturalPop from "./AgriculturalPop";
import NavbarF from "../Main/NavbarF";
import FooterF from "../Main/FooterF";
import NavSideF from "../Main/NavSideF";
import AgrcEdit from "./AgrcEdit";
import AddFarm from "./AddFarm";
import Swal from 'sweetalert2';
import api from "../../../API/axiosInstance";

const Agricultural = () => {
    const [farmData, setFarmData] = useState([]);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchFarms = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get("/Farm/GetAllFarmasOfFarmerId");
            const farmsWithServerId = response.data.map(farm => ({
                ...farm,
                serverId: farm.id
            }));
            setFarmData(farmsWithServerId);
        } catch (error) {
            console.error("Error fetching farms:", error);
            // لا تظهر رسالة خطأ هنا إلا إذا كان أول تحميل
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFarms();
    }, [fetchFarms]);

    // ===================================================================
    // ===========  هذا هو الكود الجديد والمهم للغاية  ===========
    // ===================================================================
    useEffect(() => {
        // هذا التأثير يعمل كلما تغيرت قائمة المزارع الرئيسية 'farmData'.
        // إذا كانت النافذة المنبثقة مفتوحة (selectedTransaction ليست فارغة)،
        // فإننا نحتاج إلى تحديث بياناتها بأحدث إصدار.
        if (selectedTransaction) {
            const updatedTransaction = farmData.find(
                (farm) => farm.farmId === selectedTransaction.farmId
            );

            // إذا كانت المزرعة لا تزال موجودة، قم بتحديث الـ state الخاص بالنافذة
            if (updatedTransaction) {
                setSelectedTransaction(updatedTransaction);
            } else {
                // إذا تم حذف المزرعة، أغلق النافذة المنبثقة
                setSelectedTransaction(null);
            }
        }
    }, [farmData, selectedTransaction?.farmId]); // يعتمد على farmData و farmId المحدد
    // ===================================================================

    const handleDelete = async (farmId) => {
        // ... (كود الحذف يبقى كما هو، لكن من الأفضل أن يعيد تحميل البيانات)
        Swal.fire({
            title: 'تأكيد حذف',
            text: "هل أنت متأكد ؟",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#49A760',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'نعم، حذف!',
            cancelButtonText: 'لا، إلغاء'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.delete(`/Farm/Delete/${farmId}`);
                    Swal.fire('تم الحذف!', 'تم حذف المزرعة بنجاح.', 'success');
                    // استدع fetchFarms لإعادة تحميل القائمة المحدثة
                    fetchFarms();
                } catch (error) {
                    console.error("Error deleting farm:", error);
                    Swal.fire('خطأ!', 'حدثت مشكلة عند الحذف', 'error');
                }
            }
        });
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <NavbarF />
            <div className={`d-flex flex-grow-1`}>
                <NavSideF />
                <main className={`flex-grow-1 ${styles.hid} `}>
                    <div className="container mt-4">
                        <div className={` ${styles.AddFarm}`}>
                            <button className="btn btn-dark mb-3" style={{ borderRadius: "10px" }}
                                onClick={() => setAddModalOpen(true)}>إضافة مزرعة جديدة</button>
                        </div>
                        {loading && farmData.length === 0 ? (
                            <div>Loading...</div>
                        ) : (
                            <div className={`${styles.table_container} ${styles.tableAgric}`}>
                                <table className={styles.transactions_table}>
                                    <thead>
                                        <tr>
                                            <th>رقم المزرعة</th>
                                            <th>اسم المزرعة</th>
                                            <th>الموقع</th>
                                            <th>المساحة</th>
                                            <th>عدد الأراضي المربوطة</th>
                                            <th>إجراءات</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {farmData.map((farm) => (
                                            <tr key={farm.farmId} onClick={() => setSelectedTransaction(farm)}>
                                                <td>{farm.farmId}</td>
                                                <td>{farm.farmName}</td>
                                                <td>{farm.location}</td>
                                                <td>{farm.size} فدان</td>
                                                <td>{farm.numbersOfLands}</td>
                                                <td>
                                                    <span className="text-primary mx-2" style={{ cursor: "pointer" }}
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // لمنع فتح النافذة الكبيرة
                                                            setSelectedTransaction(farm);
                                                            setEditModalOpen(true);
                                                        }}>✎</span>
                                                    <span className="text-danger" style={{ cursor: "pointer" }}
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // لمنع فتح النافذة الكبيرة
                                                            handleDelete(farm.farmId);
                                                        }}>🗑</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {selectedTransaction && (
                                    <AgriculturalPop
                                        transaction={selectedTransaction}
                                        onClose={() => setSelectedTransaction(null)}
                                        onDataChange={fetchFarms}
                                    />
                                )}
                                {isEditModalOpen && (
                                    <AgrcEdit
                                        transaction={selectedTransaction}
                                        onClose={() => setEditModalOpen(false)}
                                        // هذا السطر هو الذي يربط بين المكونين
                                        onEditSuccess={fetchFarms}
                                    />
                                )}
                                {isAddModalOpen && (
                                    <AddFarm
                                        onClose={() => setAddModalOpen(false)}
                                        onFarmAdded={fetchFarms}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>
            <FooterF />
        </div>
    );
};

export default Agricultural;