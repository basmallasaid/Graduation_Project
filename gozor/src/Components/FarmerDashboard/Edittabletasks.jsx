import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from 'sweetalert2';

export default function EditTaskModal({ selectedTask, onTaskUpdate }) {
    const [formData, setFormData] = useState({
        taskName: "",
        startDate: "",
        endDate: "",
        status: "",
        description: "",
    });

    useEffect(() => {
        if (selectedTask) {
            setFormData(selectedTask);
        }
    }, [selectedTask]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await Swal.fire({
            title: "هل أنت متأكد من تعديل المهمة؟",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "تعديل",
            confirmButtonColor: "#28a745",
            denyButtonText: "الغاء التعديل",
            cancelButtonText: "الغاء"
        });

        if (result.isConfirmed) {
            try {
                const response = await axios.put(`http://localhost:8000/cyclestatues/${selectedTask.id}`, formData);

                if (response.status === 200) {
                    onTaskUpdate(response.data);
                    Swal.fire({
                        title: "تم التعديل!",
                        text: "تم التعديل بنجاح.",
                        icon: "success",
                        confirmButtonColor: "#28a745"
                    });
                } else {
                    Swal.fire({
                        title: "حدث خطأ",
                        text: "حدث خطأ أثناء التعديل",
                        icon: "error"
                    });
                }
            } catch (error) {
                console.error("Error updating task:", error);
                Swal.fire({
                    title: "حدث خطأ",
                    text: "حدث خطأ أثناء التعديل",
                    icon: "error"
                });
            }

        } else if (result.isDenied) {
            Swal.fire({
                title: "لم يتم حفظ التعديلات",
                icon: "info",
                confirmButtonColor: "#28a745"
            });
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} style={{padding:"20px"}}>
                <div className="container">
                     <div className="row mb-3">
                        <div className="col-md-4 mb-2">
                            <label className="form-label" style={{ fontSize: "18px", fontWeight: "600" }}>اسم المهمة</label>
                            <input type="text" name="taskName" value={formData.taskName} onChange={handleChange} className="form-control"
                            style={{borderRadius:"10px",borderColor:"#1F4E3D"}} />
                        </div>
                        <div className="col-md-4 mb-2">
                            <label className="form-label" style={{ fontSize: "18px", fontWeight: "600" }}>تاريخ البداية</label>
                            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="form-control" 
                            style={{borderRadius:"10px",borderColor:"#1F4E3D"}}/>
                        </div>
                        <div className="col-md-4 mb-2">
                            <label className="form-label" style={{ fontSize: "18px", fontWeight: "600" }}>تاريخ النهاية</label>
                            <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="form-control" 
                            style={{borderRadius:"10px",borderColor:"#1F4E3D"}}/>
                        </div>
                    </div>
                    <div className="mb-3">
                       <label htmlFor="description" className="form-label" style={{ fontSize: "18px", fontWeight: "600", marginRight: "10px" }}>
                            الوصف
                        </label>
                         <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={5}
                             className="form-control"
                             style={{borderColor:"#1F4E3D",padding:"8px",borderRadius:"10px"}}
                        ></textarea>
                    </div>
                </div>
                <div className="d-flex justify-content-end">
                  <button
                        type="submit"
                        className="btn"
                        style={{
                            width: "120px",
                            padding: "10px",
                            backgroundColor: "#1F4E3D",
                            color: "white",
                            borderRadius: "10px",
                            marginLeft: "10px"
                        }}
                    >
                        حفظ
                    </button>
                </div>
            </form>
            <ToastContainer />
        </>
    );
}