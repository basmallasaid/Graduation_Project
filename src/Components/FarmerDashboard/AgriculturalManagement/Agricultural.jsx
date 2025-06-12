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

    // Fetch farms using useCallback to optimize performance
    const fetchFarms = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get("/Farm/GetAllFarmasOfFarmerId");
            const farmsWithServerId = response.data.map(farm => ({
                ...farm,
                serverId: farm.id // renaming 'id' to 'serverId'
            }));
            setFarmData(farmsWithServerId);
        } catch (error) {
            console.error("Error fetching farms:", error);
            Swal.fire("خطأ!", "حدث خطأ أثناء جلب البيانات.", "error");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFarms();
    }, [fetchFarms]);

    const handleDelete = async (farmId) => {
        if (!farmId) {
            console.error("Error: farmId is undefined or null");
            Swal.fire('خطأ!', 'المزرعة غير موجودة', 'error');
            return;
        }

        const farmToDelete = farmData.find(farm => farm.farmId === farmId);
        if (!farmToDelete || !farmToDelete.farmId) {
            Swal.fire('خطأ!', 'المزرعة غير موجودة', 'error');
            return;
        }

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
                    // إرسال طلب الحذف عبر الـ API مع الـ farmId في الرابط
                    await api.delete(`/Farm/Delete/${farmToDelete.farmId}`);
                    setFarmData(prevFarmData => prevFarmData.filter(farm => farm.farmId !== farmToDelete.farmId));
                    Swal.fire('تم الحذف!', 'تم حذف المزرعة بنجاح.', 'success');
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
            <div className="d-flex flex-grow-1">
                <NavSideF />
                <main className={`flex-grow-1 ${styles.hid}`}>
                    <div className="container mt-4">
                        <div className={` ${styles.AddFarm}`}>
                            <button className="btn btn-dark mb-3" style={{ borderRadius: "10px" }}
                                onClick={() => setAddModalOpen(true)}>إضافة مزرعة جديدة</button>
                        </div>
                        {loading ? (
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
                                            <tr key={farm.farmId}>
                                                <td onClick={() => setSelectedTransaction(farm)}>{farm.farmId}</td>
                                                <td onClick={() => setSelectedTransaction(farm)}>{farm.farmName}</td>
                                                <td onClick={() => setSelectedTransaction(farm)}>{farm.location}</td>
                                                <td onClick={() => setSelectedTransaction(farm)}>{farm.size} فدان</td>
                                                <td onClick={() => setSelectedTransaction(farm)}>{farm.numbersOfLands}</td>
                                                <td>
                                                    <span className="text-primary mx-2" style={{ cursor: "pointer" }}
                                                          onClick={(e) => {
                                                              e.stopPropagation();
                                                              setSelectedTransaction(farm);
                                                              setEditModalOpen(true);
                                                          }}>✎</span>
                                                    <span className="text-danger" style={{ cursor: "pointer" }}
                                                          onClick={(e) => {
                                                              e.stopPropagation();
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
                                    />
                                )}
                                {isEditModalOpen && (
                                    <AgrcEdit
                                        transaction={selectedTransaction}
                                        onClose={() => setEditModalOpen(false)}
                                    />
                                )}
                                {isAddModalOpen && (
                                    <AddFarm
                                        onClose={() => setAddModalOpen(false)}
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
