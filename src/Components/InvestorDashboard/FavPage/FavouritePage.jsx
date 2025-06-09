import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2'; // استيراد SweetAlert2
import NavbarInv from '../Main/NavbarInv';
import NavSideInv from '../Main/NavSideInv';
import FooterInv from '../Main/FooterInv';
import stylesInv from "../StylesInv/stylesInv.module.css";
import api from '../../../API/axiosInstance';

const FavouritePage = () => {
    const [farmers, setFarmers] = useState([]);
    const [sortOrder, setSortOrder] = useState('asc');
    const [filterRating, setFilterRating] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('FavouriteFarmer/Favourites');
                setFarmers(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleDelete = async (id) => {
        // عرض SweetAlert2 للتأكيد قبل الحذف
        const result = await Swal.fire({
            title: 'هل أنت متأكد؟',
            text: "لا يمكنك التراجع عن هذا الإجراء!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'نعم، احذف!',
            cancelButtonText:'الغاء'
        });

        if (result.isConfirmed) {
            try {
                await api.delete('FavouriteFarmer', {
                    data: { farmerId: id }
                });
                setFarmers(farmers.filter(farmer => farmer.farmerId !== id));
                Swal.fire('تم الحذف!', 'تم حذف المزارع بنجاح.', 'success'); // عرض رسالة نجاح
            } catch (error) {
                console.error('Error deleting farmer:', error);
                Swal.fire('خطأ!', 'حدث خطأ أثناء الحذف.', 'error'); // عرض رسالة خطأ
            }
        }
    };

    const sortedFarmers = [...farmers]
        .filter(farmer =>
            farmer.rate >= filterRating &&
            farmer.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));

    return (
        <div className="d-flex flex-column min-vh-100">
            <NavbarInv />
            <div className="d-flex flex-grow-1">
                <NavSideInv />
                <main className="flex-grow-1 p-3">
                    <div className="position-relative w-25 m-5">
                        <input
                            type="search"
                            className={`form-control ps-5 ${stylesInv.ser}`}
                            placeholder="ابحث حسب اسم المزارع..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="d-flex justify-content-center align-items-center mb-3">
                        <select className={`form-select w-auto ms-5 ${stylesInv.filter}`} onChange={(e) => setSortOrder(e.target.value)}>
                            <option value="asc">فرز أبجدي تصاعدي</option>
                            <option value="desc">فرز أبجدي تنازلي</option>
                        </select>
                        <select className={`form-select w-auto ${stylesInv.filter}`} onChange={(e) => setFilterRating(Number(e.target.value))}>
                            <option value="0">تصفية حسب التقييم</option>
                            <option value="1">نجمة واحدة فأكثر</option>
                            <option value="2">نجمتان فأكثر</option>
                            <option value="3">ثلاث نجوم فأكثر</option>
                            <option value="4">أربع نجوم فأكثر</option>
                            <option value="5">خمس نجوم</option>
                        </select>
                    </div>

                    <div className={`${stylesInv.gridContainer}`}>
                        {sortedFarmers.map((farmer, index) => (
                            <div key={index} className={stylesInv.cardFav}>
                                <div className={`card p-3 ${stylesInv.cardbg}`}>
                                    <div className="d-flex">
                                        <div className="flex-grow-1">
                                            <div className={`d-flex  ${stylesInv.datacard}`}>
                                                <h5 className="mb-0"><b>اسم المزارع</b></h5>
                                                <h5 className={`mb-1 ${stylesInv.datatitle}`}>{farmer.name}</h5>
                                            </div>
                                            <div className={`d-flex  ${stylesInv.datacard}`}>
                                                <h5 className="mb-0"><b>رقم المحمول</b></h5>
                                                <p className={`mb-1 ${stylesInv.datatitle}`}>{farmer.phoneNumber}</p>
                                            </div>
                                            <div className={`d-flex  ${stylesInv.datacard}`}>
                                                <h5 className={stylesInv.titemail}><b>البريد الالكتروني</b></h5>
                                                <p className={` ${stylesInv.email}`}>{farmer.email}</p>
                                            </div>
                                        </div>

                                        {farmer.imageProfileUrl && (
                                            <img src={`https://cityroots.runasp.net/${farmer.imageProfileUrl}`} alt={farmer.name} className={stylesInv.imgfav} />
                                        )}
                                    </div>
                                    <h5><b>البايو</b></h5>
                                    <p className={` ${stylesInv.info}`}>{farmer.bio}</p>
                                    <div className='d-flex justify-content-center align-items-center'>
                                        <h5 className='ms-3'><b>تقيمه العام</b></h5>
                                        <div>
                                            {[...Array(5)].map((_, starIndex) => (
                                                <span key={starIndex} className={`fs-3 ${starIndex < farmer.rate ? 'text-warning' : 'text-secondary'}`}>
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                        <span
                                            className={`text-danger ${stylesInv.delete}`}
                                            style={{ cursor: "pointer" }}
                                            onClick={() => handleDelete(farmer.farmerId)}
                                        >
                                            🗑
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
            <FooterInv />
        </div>
    );
};

export default FavouritePage;
