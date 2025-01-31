import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Addcycletasks({ selectedCardId, onaddtasksSuccess }) {
    const [formData, setFormData] = useState({
        taskName: "",
        startDate: "",
        endDate: "",
        status: "لم تبدأ",
        description: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (Object.values(formData).some((value) => !value)) {
            toast.error("جميع الحقول مطلوبة");
            return;
        }

        const dataToSubmit = {
            ...formData,
            cycleId: selectedCardId
        };

        console.log("Data to Submit:", dataToSubmit);

        try {
            const response = await axios.post("http://localhost:8000/cyclestatues", dataToSubmit);
            console.log("Response:", response);

            if (response.status === 200 || response.status === 201) {
                toast.success("تم الحفظ بنجاح");
                setTimeout(() => onaddtasksSuccess(), 2000);
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error(`حدث خطأ أثناء الحفظ: ${error.message}`);
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
                            style={{borderRadius:"10px",borderColor:"#1F4E3D"}}  />
                        </div>
                        <div className="col-md-4 mb-2">
                            <label className="form-label" style={{ fontSize: "18px", fontWeight: "600" }}>تاريخ النهاية</label>
                            <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="form-control"
                            style={{borderRadius:"10px",borderColor:"#1F4E3D"}}  />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label" style={{ fontSize: "18px", fontWeight: "600" ,marginRight: "10px" }}>
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