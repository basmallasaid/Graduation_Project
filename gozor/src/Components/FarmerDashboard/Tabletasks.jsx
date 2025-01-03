import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import Edittabletasks from "./Edittabletasks";
import ReactModal from "react-modal";

const Taskstable = ({ selectedCardId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visiblecrop, setVisiblecrop] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
          const response = await fetch(`http://localhost:8000/cyclestatues?cycleId=${selectedCardId}`); // Changed to use id
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const json = await response.json();
        setData(Array.isArray(json) ? json : json.cyclestatues || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (selectedCardId) {
      fetchData();
    }
  }, [selectedCardId]);

  const handleDelete = async (id) => {
    console.log("handleDelete called with id:", id); // Debug log
    const isConfirmed = await Swal.fire({
        title: "هل أنت متأكد؟",
        text: "لن تتمكن من التراجع عن هذا!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#d33",
        confirmButtonText: "نعم، احذفها!",
    });

    if (isConfirmed.isConfirmed) {
        try {
            console.log("Sending DELETE request to:", `http://localhost:8000/cyclestatues/${id}`); // Debug log
            await axios.delete(`http://localhost:8000/cyclestatues/${id}`);
            setData((prevData) => {
                const filteredData = prevData.filter((item) => item.id !== id);
                console.log("Data after deletion:", filteredData); // Debug log
                return filteredData;
            });

            Swal.fire({
                title: "تم الحذف!",
                text: "تم حذف المهمة بنجاح.",
                icon: "success",
                confirmButtonColor: "#28a745",
            });
        } catch (error) {
            console.error("Error deleting task:", error.response ? error.response.data : error);
            Swal.fire({
                title: "حدث خطأ",
                text: "حدث خطأ أثناء حذف المهمة.",
                icon: "error",
            });
        }
    }
};

const handleEdit = (item) => {
  console.log("handleEdit called with item:", item); // Debug log

    if (!item) {
       console.error("Error in handleEdit, item is undefined or null");
        return;
    }
    setSelectedTask(item);
    setVisiblecrop(true);
};

const handleTaskUpdate = (updatedTask) => {
    console.log("handleTaskUpdate called with updatedTask:", updatedTask); // Debug log

    if (!updatedTask) {
        console.error("Error in handleTaskUpdate, updatedTask is undefined or null");
        return; // Exit the function early
    }
    setData((prevData) => {
        const updatedData = prevData.map((item) =>
            item.id === updatedTask.id ? updatedTask : item
        );
        console.log("Data after update:", updatedData); // Debug log
        return updatedData;
    });
    setVisiblecrop(false);
};

  if (loading) {
    return <div>جاري التحميل...</div>;
  }

  if (error) {
    return <div>حدث خطأ: {error}</div>;
  }

  const getRowColor = (status) => {
    switch (status) {
      case "مكتمله":
        return "#A4D0A4";
      case "قيد التنفيذ":
        return "#878680";
      case "لم تبدأ":
        return "#C5CE38";
      default:
        return "transparent";
    }
  };

  const cropStyles = {
    content: {
      maxWidth: "60%",
      margin: "auto",
      padding: "10px",
      borderRadius: "30px",
      maxHeight: "55%",
      backgroundColor: "#fff",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
  };

  return (
    <div className="rtl" style={{ padding: "20px", direction: "rtl" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2", textAlign: "right" }}>
            <th style={{ padding: "10px", border: "1px solid #ddd", width: "10%" }}>المهمة</th>
            <th style={{ padding: "10px", border: "1px solid #ddd", width: "10%" }}>الحالة</th>
            <th style={{ padding: "10px", border: "1px solid #ddd", width: "10%" }}>تاريخ البداية</th>
            <th style={{ padding: "10px", border: "1px solid #ddd", width: "10%" }}>تاريخ النهاية</th>
            <th
              style={{
                padding: "10px",
                border: "1px solid #ddd",
                width: "60%",
              }}
            >
              الوصف
            </th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr
                key={item.id}
                style={{
                  textAlign: "right",
                  backgroundColor: getRowColor(item.status),
                }}
              >
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {item.taskName}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {item.status}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {item.startDate}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {item.endDate}
                </td>
                <td
                  style={{
                    padding: "10px",
                    border: "1px solid #ddd",
                    width: "60%",
                    wordWrap: "break-word",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>{item.description}</div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        style={{ border: "none", backgroundColor: "transparent" }}
                        onClick={() => handleEdit(item)}
                      >
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      <ReactModal
                        isOpen={visiblecrop}
                        onRequestClose={() => setVisiblecrop(false)}
                        ariaHideApp={false}
                        style={cropStyles}
                      >
                        <button
                          onClick={() => setVisiblecrop(false)}
                          style={{
                            backgroundColor: "transparent",
                            border: "none",
                            fontSize: "20px",
                            color: "#333",
                            cursor: "pointer",
                            position: "absolute",
                            top: "35px",
                            right: "30px",
                          }}
                        >
                          <i className="fa-solid fa-xmark"></i>
                        </button>

                        <Edittabletasks
                          selectedTask={selectedTask}
                          onTaskUpdate={handleTaskUpdate}
                        />
                      </ReactModal>
                      <button
                        style={{ border: "none", backgroundColor: "transparent" }}
                        onClick={() => handleDelete(item.id)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ padding: "10px", textAlign: "center" }}>
                لا توجد بيانات متاحة
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Taskstable;