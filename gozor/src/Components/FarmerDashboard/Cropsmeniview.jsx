// import NavbarF from "./Main/NavbarF";
// import FooterF from "./Main/FooterF";
// import styles from "../../Styles/style.module.css";
// import { useState, useEffect } from "react";
// import Modal from "@mui/material/Modal";
// import Box from "@mui/material/Box";
// import UpdateNewCycle from "./Updateoncycle";
// import ReactModal from "react-modal";
// import modal from "react-modal";
// import Addcycletasks from "./Addcycletasks";
// import Addopencycle from "./Addopencycle";
// import AddCloseCycle from "./Addclosecycle";
// import Tabletasks from './Tabletasks';
// import Swal from "sweetalert2";
// import { useNavigate } from "react-router-dom";
// import Updateopencycle from './Updateopencycle';
// import Updateclosecycle from './Updateclosecycle';
// import Viewnew from "./Viewnew";
// import Cardrequests from './Cardrequets'
// import NavSideF from './Main/NavSideF'
// export default function Cropmenuview() {
//   const [showInput, setShowInput] = useState(false);
//   const [open, setOpen] = useState(false); // State to manage modal visibility
//   const [visiblecrop, setVisiblecrop] = useState(false);
//   const [visiblecrop2, setVisiblecrop2] = useState(false);
//   const [visiblecropopen, setVisiblecropopen] = useState(false);
//   const [visiblecropclose, setVisiblecropclose] = useState(false);
//   const [visibletabletasks, setvisibletabletasks] = useState(false);
//   const [visibleupdateopen, setvisibleupdateopen] = useState(false);
//   const [visibleupdateclose, setvisibleupdateclose] = useState(false);
//   const [visibleviewnew, setvisibleviewnew] = useState(false);
//   const [visiblecardrequests, setvisiblecardrequests] = useState(false);
//   const [data, setData] = useState([]);
//   const [searchQuery, setSearchQuery] = useState(""); // New state for search query
//   const [selectedCard, setSelectedCard] = useState(null); // State to track selected card
//   const [modalData, setModalData] = useState(null);
//   const [cycleStatus, setCycleStatus] = useState(null); // "open" or "close"

// //   const handleCardClick = (card) => {
// //     console.log("Card clicked:", card);
// //     if (selectedCard === card) {
// //       setSelectedCard(null);
// //     } else {
// //       setSelectedCard(card);
// //     }
// //   };

// //   const handleSaveSuccess = (updatedData) => {
// //     console.log("Updated Data:", updatedData);
// //     setvisibleupdateclose(false);
// //     setModalData(null);
// //     // Update the data in the list
// //     setData(prevData => prevData.map(item =>
// //       item.id === updatedData.id ? { ...updatedData, cycleId: updatedData.id } : item
// //     ));
// //   };


// //   const openUpdateModal = (card) => {
// //     if (card) {
// //       console.log("Opening modal with card data:", card);
// //       setModalData(card);
// //       if (!card.isOpenForInvestment) {
// //         setvisibleupdateclose(true);
// //       } else {
// //         setvisibleupdateopen(true);
// //       }
// //     }
// //   };


// //   useEffect(() => {
// //     // Fetch data from the backend
// //     fetch("http://localhost:8000/viewyield")
// //       .then((response) => response.json())
// //       .then((result) => {
// //         if (Array.isArray(result)) {
// //           setData(result);
// //         } else {
// //           setData([result]);
// //         }
// //       })
// //       .catch((error) => console.error("Error fetching data:", error));
// //   }, []);

// //   const handleOpen = () => setOpen(true);
// //   const handleClose = () => setOpen(false);

// //   const navigate = useNavigate();


// //   const handleButtonClick = () => {
// //     setShowInput((prevState) => !prevState); // Toggle the input field
// //   };



// //   const searchResults = data.filter((item) => {
// //     const searchLower = searchQuery.toLowerCase();

// //     return (
// //       // Basic cycle info
// //       item.cycleName?.toLowerCase().includes(searchLower) ||
// //       item.parcelName?.toLowerCase().includes(searchLower) ||
// //       (item.isOpenForInvestment ? "مفتوحة" : "مغلقة").includes(searchLower) ||

// //       // Dates
// //       item.startDate?.toLowerCase().includes(searchLower) ||
// //       item.endDate?.toLowerCase().includes(searchLower) ||

// //       // Financial data
// //       item.expectedFinancialGoal?.toString().includes(searchLower) ||
// //       item.expectedProduction?.toString().includes(searchLower) ||
// //       item.roiUnit?.toLowerCase().includes(searchLower) ||

// //       // Investment cycle details
// //       item.openInvestmentCycleDTO?.currentTotalInvestment?.toString().includes(searchLower) ||
// //       item.openInvestmentCycleDTO?.maxInvestorsAllowed?.toString().includes(searchLower) ||

// //       // Investors
// //       item.currentInvestors?.some(investor =>
// //         investor.fullName?.toLowerCase().includes(searchLower) ||
// //         investor.investmentAmount?.toString().includes(searchLower)
// //       ) ||

// //       // Warning/time
// //       item.timeToStart?.toLowerCase().includes(searchLower)
// //     );
// //   });


// //   const handleSearch = (e) => {
// //     setSearchQuery(e.target.value);
// //   };

// //   const handleDelete = async (id) => {
// //     try {
// //       const isConfirmed = await Swal.fire({
// //         title: "هل أنت متأكد؟",
// //         text: "لن تتمكن من التراجع عن هذا!",
// //         icon: "warning",
// //         showCancelButton: true,
// //         confirmButtonColor: "#28a745",
// //         cancelButtonColor: "#d33",
// //         confirmButtonText: "نعم، احذفها!",
// //         cancelButtonText: "إلغاء"
// //       });

// //       if (isConfirmed.isConfirmed) {
// //         const response = await fetch(`http://localhost:8000/viewyield/${id}`, {
// //           method: "DELETE",
// //         });

// //         if (response.ok) {
// //           setData((prevData) => prevData.filter((item) => item.id !== id));
// //           Swal.fire({
// //             title: "تم!",
// //             text: "تم حذف الدورة بنجاح.",
// //             icon: "success",
// //             confirmButtonColor: '#28a745'
// //           });
// //         } else {
// //           Swal.fire({
// //             title: "خطأ!",
// //             text: "حدث خطأ أثناء حذف الدورة.",
// //             icon: "error"
// //           });
// //         }
// //       }
// //     } catch (error) {
// //       Swal.fire({
// //         title: "خطأ!",
// //         text: "حدث خطأ أثناء حذف الدورة.",
// //         icon: "error"
// //       });
// //     }
// //   };

// //   const style = {
// //     position: "absolute",
// //     top: "50%",
// //     left: "50%",
// //     transform: "translate(-50%, -50%)",
// //     width: 400,
// //     bgcolor: "background.paper",
// //     boxShadow: 24,
// //     p: 4,
// //   };

//   const cropStyles = {
//     content: {
//       maxWidth: "100%",
//       margin: "auto",
//       padding: "10px",
//       borderRadius: "30px",
//       maxHeight: "75%",
//       backgroundColor: "#fff",
//     },
//     overlay: {
//       backgroundColor: "rgba(0, 0, 0, 0.5)",
//     },
//   };
//   const cropStyles2 = {
//     content: {
//       maxWidth: "100%",
//       margin: "auto",
//       padding: "10px",
//       borderRadius: "30px",
//       maxHeight: "60%",
//       backgroundColor: "#fff",
//     },
//     overlay: {
//       backgroundColor: "rgba(0, 0, 0, 0.5)",
//     },
//   };
//   const cropStylesopen = {
//     content: {
//       maxWidth: "100%",
//       margin: "auto",
//       padding: "20px",
//       borderRadius: "30px",
//       maxHeight: "90%",
//       backgroundColor: "#fff",
//     },
//     overlay: {
//       backgroundColor: "rgba(0, 0, 0, 0.5)",
//     },
//   };
//   const cropStylesclose = {
//     content: {
//       maxWidth: "85%",
//       margin: "auto",
//       padding: "20px",
//       borderRadius: "30px",
//       maxHeight: "65%",
//       backgroundColor: "#fff",
//     },
//     overlay: {
//       backgroundColor: "rgba(0, 0, 0, 0.5)",
//     },
//   };
//   const croptabletasks = {
//     content: {
//       maxWidth: "100%",
//       margin: "auto",
//       padding: "20px",
//       borderRadius: "30px",
//       maxHeight: "54%",
//       backgroundColor: "#fff",
//     },
//     overlay: {
//       backgroundColor: "transparent",
//     },
//   };
//   const cardreq = {
//     content: {
//       maxWidth: "46%",
//       margin: "auto",
//       padding: "20px 20px",
//       borderRadius: "30px",
//       maxHeight: "50%",
//       backgroundColor: "#fff",
//     },
//     overlay: {
//       backgroundColor: "transparent",
//     },
//   };
//   const viewnew = {
//     content: {
//       maxWidth: "100%",
//       margin: "auto",
//       padding: "20px",
//       borderRadius: "30px",
//       maxHeight: "80%",
//       backgroundColor: "#fff",
//     },
//     overlay: {
//       backgroundColor: "transparent",
//     },
//   };
//   const handleaddSuccess = () => {
//     setVisiblecropopen(false); // Close the modal
//     navigate("/cropmenuview"); // Navigate to the home page
//   };
//   const handleaddcloseSuccess = () => {
//     setVisiblecropclose(false); // Close the modal
//     navigate("/cropmenuview"); // Navigate to the home page
//   };
//   const handleupdateSuccess = () => {
//     setVisiblecrop(false); // Close the modal
//     navigate("/cropmenuview"); // Navigate to the home page
//   };
//   const handleaddtasksSuccess = () => {
//     setVisiblecrop2(false); // Close the modal
//     navigate("/cropmenuview"); // Navigate to the home page
//   };
//   return (
//     <>
//       <NavbarF />
//       <div className="d-flex flex-column min-vh-100" >
//           <div className="d-flex flex-grow-1">
//                     <NavSideF/>
//                     <main className="flex-grow-1">
//         <div style={{ display: "flex" }} >
//           <h1 className={styles.Menutitle}>قائمه الدورات الزراعيه</h1>
//         </div>

// //         <div
// //           style={{
// //             display: "flex",
// //             justifyContent: "center",
// //             textAlign: "center",
// //             gap: "35px",
// //             flexWrap: "wrap",

// //           }}
// //         >
// //           <div className={styles.searchContainer}>
// //             {showInput && (
// //               <input
// //                 type="text"
// //                 placeholder="ابحث ....."
// //                 className={styles.menusearchInput}
// //                 value={searchQuery}
// //                 onChange={handleSearch}
// //               />
// //             )}
// //             <button
// //               className={styles.serachviewbutt}
// //               onClick={(e) => {
// //                 e.stopPropagation(); // Prevent event bubbling
// //                 setShowInput(!showInput);
// //               }}
// //             >
// //               <i className="fa-solid fa-magnifying-glass"></i>
// //             </button>
// //           </div>

// //           <button className={styles.menuviewbutt} onClick={(e) => { e.stopPropagation(); handleOpen() }}>
// //             اضافه دوره جديده
// //           </button>

// //           <Modal
// //             open={open}
// //             onClose={handleClose}
// //             aria-labelledby="parent-modal-title"
// //             aria-describedby="parent-modal-description"
// //           >
// //             <Box sx={style}>
// //               <button
// //                 onClick={(e) => { e.stopPropagation(); handleClose() }}
// //                 style={{
// //                   backgroundColor: "transparent",
// //                   border: "none",
// //                   fontSize: "20px",
// //                   color: "#333",
// //                   cursor: "pointer",
// //                   position: "absolute",
// //                   top: "35px",
// //                   right: "30px",
// //                 }}
// //               >
// //                 <i className="fa-solid fa-xmark"></i>
// //               </button>
// //               <h2 id="parent-modal-title" style={{ textAlign: "center" }}>
// //                 اختار حاله الدوره اولا
// //               </h2>
// //               <div
// //                 style={{
// //                   display: "flex",
// //                   justifyContent: "center",
// //                   textAlign: "center",
// //                   gap: "20px",
// //                 }}
// //               >
// //                 {/* Open Cycle Button */}
// //                 <button
// //                   style={{
// //                     marginTop: "16px",
// //                     padding: "8px 30px",
// //                     backgroundColor: "#28a745",
// //                     color: "white",
// //                     border: "none",
// //                     borderRadius: "10px",
// //                     cursor: "pointer",
// //                   }}
// //                   onClick={(e) => {
// //                     e.stopPropagation();
// //                     setCycleStatus("open"); // Set status to "open"
// //                     setVisiblecropopen(true); // Open the "Open Cycle" modal
// //                     handleClose(); // Close the parent modal
// //                   }}
// //                 >

// //                   مفتوحه
// //                 </button>

// //                 <button
// //                   style={{
// //                     marginTop: "16px",
// //                     padding: "8px 35px",
// //                     backgroundColor: "#fff",
// //                     color: "black",
// //                     border: "none",
// //                     borderRadius: "10px",
// //                     cursor: "pointer",
// //                     boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
// //                   }}
// //                   onClick={(e) => {
// //                     e.stopPropagation();
// //                     setCycleStatus("close"); // Set status to "close"
// //                     setVisiblecropclose(true); // Open the "Close Cycle" modal
// //                     handleClose();
// //                   }}
// //                 >
// //                   مغلقه
// //                 </button>
// //               </div>
// //             </Box>
// //           </Modal>

// //           {/* Open Cycle Modal */}
// //           <ReactModal
// //             isOpen={visiblecropopen}
// //             onRequestClose={() => setVisiblecropopen(false)}
// //             ariaHideApp={false}
// //             style={cropStylesopen}
// //           >
// //             <div onClick={(e) => e.stopPropagation()}>
// //               <button
// //                 onClick={(e) => { e.stopPropagation(); setVisiblecropopen(false) }}
// //                 style={{
// //                   backgroundColor: "transparent",
// //                   border: "none",
// //                   fontSize: "20px",
// //                   color: "#333",
// //                   cursor: "pointer",
// //                   position: "absolute",
// //                   top: "35px",
// //                   right: "30px",
// //                 }}
// //               >
// //                 <i className="fa-solid fa-xmark"></i>
// //               </button>
// //               <Addopencycle
// //                 isOpenForInvestment={true}
// //                 onCropAdded={(newCrop) => setData((prevCrops) => [...prevCrops, newCrop])}
// //                 onaddSuccess={handleaddSuccess}
// //               />
// //             </div>
// //           </ReactModal>

// //           {/* Close Cycle Modal */}
// //           <ReactModal
// //             isOpen={visiblecropclose}
// //             onRequestClose={() => setVisiblecropclose(false)}
// //             ariaHideApp={false}
// //             style={cropStylesclose}
// //           >
// //             <div onClick={(e) => e.stopPropagation()}>
// //               <button
// //                 onClick={(e) => { e.stopPropagation(); setVisiblecropclose(false) }}
// //                 style={{
// //                   backgroundColor: "transparent",
// //                   border: "none",
// //                   fontSize: "20px",
// //                   color: "#333",
// //                   cursor: "pointer",
// //                   position: "absolute",
// //                   top: "35px",
// //                   right: "30px",
// //                 }}
// //               >
// //                 <i className="fa-solid fa-xmark"></i>
// //               </button>
// //               <AddCloseCycle isOpenForInvestment={false} onCropAdded={(newCrop) => setData((prevCrops) => [...prevCrops, newCrop])}
// //                 onaddcloseSuccess={handleaddcloseSuccess}

// //               />
// //             </div>
// //           </ReactModal>


// //           <button
// //             className={styles.menuviewbutt}
// //             style={{
// //               backgroundColor: selectedCard ? "#878680" : "#d3d3d3",
// //               cursor: selectedCard ? "pointer" : "not-allowed",
// //             }}
// //             disabled={!selectedCard}
// //             onClick={(e) => { e.stopPropagation(); setVisiblecrop(true) }}
// //           >
// //             اضافه تحديثات علي دوره
// //           </button>
// //           <ReactModal
// //             isOpen={visiblecrop}
// //             onRequestClose={() => setVisiblecrop(false)}
// //             ariaHideApp={false}
// //             style={cropStyles}
// //           >
// //             <div onClick={(e) => e.stopPropagation()}>
// //               <button
// //                 onClick={(e) => { e.stopPropagation(); setVisiblecrop(false) }}
// //                 style={{
// //                   backgroundColor: "transparent",
// //                   border: "none",
// //                   fontSize: "20px",
// //                   color: "#333",
// //                   cursor: "pointer",
// //                   position: "absolute",
// //                   top: "35px",
// //                   right: "30px",
// //                 }}
// //               >
// //                 <i className="fa-solid fa-xmark"></i>
// //               </button>
// //               {/* Pass the selected card ID to the UpdateNewCycle component */}
// //               <UpdateNewCycle
// //                 selectedCardId={selectedCard?.id}
// //                 onupdateSuccess={handleupdateSuccess}
// //               />
// //             </div>
// //           </ReactModal>

// //           <button
// //             className={styles.menuviewbutt}
// //             style={{
// //               backgroundColor: selectedCard ? "#878680" : "#d3d3d3",
// //               cursor: selectedCard ? "pointer" : "not-allowed",
// //             }}
// //             disabled={!selectedCard} // Disable if no card is selected
// //             onClick={(e) => { e.stopPropagation(); setVisiblecrop2(true) }} // Open modal
// //           >
// //             اضافه مهام لدوره
// //           </button>

// //           {/* Modal for Adding Tasks */}
// //           <ReactModal
// //             isOpen={visiblecrop2}
// //             onRequestClose={() => setVisiblecrop2(false)}
// //             ariaHideApp={false}
// //             style={{
// //               content: {
// //                 top: "50%",
// //                 left: "50%",
// //                 right: "auto",
// //                 bottom: "auto",
// //                 marginRight: "-50%",
// //                 transform: "translate(-50%, -50%)",
// //                 borderRadius:"20px",
// //                 width:"60%"
// //               },
// //             }}
// //           >
// //             <div onClick={(e) => e.stopPropagation()}>
// //               {/* Close Button */}
// //               <button
// //                 onClick={(e) => { e.stopPropagation(); setVisiblecrop2(false) }}
// //                 style={{
// //                   backgroundColor: "transparent",
// //                   border: "none",
// //                   fontSize: "20px",
// //                   color: "#333",
// //                   cursor: "pointer",
// //                   position: "absolute",
// //                   top: "15px",
// //                   right: "15px",
// //                 }}
// //               >
// //                 <i className="fa-solid fa-xmark"></i>
// //               </button>

// //               {/* Pass the selected card ID to Addcycletasks */}
// //               <Addcycletasks
// //                 selectedCardId={selectedCard?.id}
// //                 onaddtasksSuccess={() => {
// //                   setVisiblecrop2(false); // Close modal on success
// //                   handleaddtasksSuccess(); // Notify parent component
// //                 }}
// //               />

// //               {console.log("Selected Card ID:", selectedCard?.id)}
// //             </div>
// //           </ReactModal>

// //           <button
// //             className={styles.menuviewbutt}
// //             style={{
// //               backgroundColor: selectedCard ? "#878680" : "#d3d3d3",
// //               cursor: selectedCard ? "pointer" : "not-allowed",
// //             }}
// //             disabled={!selectedCard}
// //             onClick={(e) => { e.stopPropagation(); openUpdateModal(selectedCard) }}
// //           >
// //             تعديل دوره حالية
// //           </button>

// //           <ReactModal
// //             isOpen={visibleupdateclose}
// //             onRequestClose={() => {
// //               setvisibleupdateclose(false);
// //               setModalData(null);
// //             }}
// //             ariaHideApp={false}
// //             style={cropStylesclose}
// //           >
// //             <div onClick={(e) => e.stopPropagation()}>
// //               <button
// //                 onClick={(e) => {
// //                   e.stopPropagation(); setvisibleupdateclose(false);
// //                   setModalData(null);
// //                 }}
// //                 style={{
// //                   backgroundColor: "transparent",
// //                   border: "none",
// //                   fontSize: "20px",
// //                   color: "#333",
// //                   cursor: "pointer",
// //                   position: "absolute",
// //                   top: "35px",
// //                   right: "30px",
// //                 }}
// //               >
// //                 <i className="fa-solid fa-xmark"></i>
// //               </button>

// //               <Updateclosecycle
// //                 selectedCardData={modalData}
// //                 onUpdateSuccess={handleSaveSuccess}
// //               />
// //             </div>
// //           </ReactModal>

// //           {/* Modal for Open Cycles */}
// //           <ReactModal
// //             isOpen={visibleupdateopen}
// //             onRequestClose={() => {
// //               setvisibleupdateopen(false);
// //               setModalData(null);
// //             }}
// //             ariaHideApp={false}
// //             style={cropStylesopen}
// //           >
// //             <div onClick={(e) => e.stopPropagation()}>
// //               <button
// //                 onClick={(e) => {
// //                   e.stopPropagation();
// //                   setvisibleupdateopen(false);
// //                   setModalData(null);
// //                 }}
// //                 style={{
// //                   backgroundColor: "transparent",
// //                   border: "none",
// //                   fontSize: "20px",
// //                   color: "#333",
// //                   cursor: "pointer",
// //                   position: "absolute",
// //                   top: "35px",
// //                   right: "30px",
// //                 }}
// //               >
// //                 <i className="fa-solid fa-xmark"></i>
// //               </button>
// //               <Updateopencycle
// //                 selectedCardData={modalData}
// //                 onUpdateSuccess={handleSaveSuccess}
// //               />
// //             </div>
// //           </ReactModal>



// //           <button
// //             className={styles.menuviewbutt}
// //             style={{
// //               backgroundColor: selectedCard ? "#878680" : "#d3d3d3",
// //               cursor: selectedCard ? "pointer" : "not-allowed",
// //             }}
// //             disabled={!selectedCard}
// //             onClick={(e) => {
// //               e.stopPropagation();
// //               if (selectedCard) {
// //                 handleDelete(selectedCard.id); // Use the selected card ID
// //               }
// //             }}
// //           >
// //             حذف دوره حالية
// //           </button>
// //         </div>
// //         <div className="container">
// //             <div className="py-3">
// //                 <div className="row" style={{ marginTop: "20px" }}>
// //                     {searchResults.length > 0 ? (
// //                         searchResults.map((item, index) => (
// //                             <div
// //                                 key={item.id}
// //                                 className="col-lg-6 col-md-6 col-sm-12 mb-4"
// //                             >
// //                                 <div
// //                                     className="mx-auto card"
// //                                     style={{
// //                                         width: "90%",
// //                                         background:
// //                                             item === selectedCard
// //                                                 ? "#62b067"
// //                                                 : item.isOpenForInvestment
// //                                                     ? "#add0b6"
// //                                                     : "linear-gradient(0deg, rgba(250,255,252,1) 0%, rgba(190,197,192,1) 91%)",
// //                                     }}
// //                                     onClick={(e) => {
// //                                         e.stopPropagation();
// //                                         handleCardClick(item);
// //                                     }}
// //                                 >
// //                                     <div className="card-body py-3 px-2">
// //                                         <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
// //                                             <div className="d-flex align-items-center gap-3 flex-grow-1">
// //                                                 <h5 className="card-title mb-2" style={{ fontSize: "1.8rem" }}>
// //                                                     الدورة:
// //                                                 </h5>
// //                                                 <h5 style={{ fontSize: "1.8rem" }}>
// //                                                     {item.cycleName || "غير معروف"}
// //                                                 </h5>
// //                                             </div>
// //                                             <div className="d-flex gap-2 ms-auto">
// //                                                 <button
                                                
// //                                                     className="btn " 
// //                                                     onClick={(e) => {
// //                                                         e.stopPropagation();
// //                                                         if (selectedCard !== item) {
// //                                                             handleCardClick(item);
// //                                                         }
// //                                                         setvisibletabletasks(true)
// //                                                     }}
// //                                                     style={{ fontSize: ".9em",backgroundColor:"#1F4E3D" ,color:"white",boxShadow:"rgba(0, 0, 0, 0.24) 0px 3px 8px"}}
// //                                                 >
// //                                                     عرض المهام
// //                                                 </button>
// //                                                 <ReactModal
// //                                                     isOpen={visibletabletasks}
// //                                                     onRequestClose={() => setvisibletabletasks(false)}
// //                                                     ariaHideApp={false}
// //                                                     style={croptabletasks}
// //                                                 >
// //                                                     <div onClick={(e) => e.stopPropagation()}>
// //                                                         <button
// //                                                             onClick={(e) => { e.stopPropagation(); setvisibletabletasks(false) }}
// //                                                             className="btn btn-close position-absolute top-0 end-0 m-2"
// //                                                             aria-label="Close"
// //                                                             style={{ fontSize: "20px", color: "#333", cursor: "pointer" }}
// //                                                         />
// //                                                         <Tabletasks selectedCardId={selectedCard?.id} />
// //                                                     </div>
// //                                                 </ReactModal>

// //                                                 <button
// //                                                     className="btn btn-secondary"
// //                                                     onClick={(e) => {
// //                                                         e.stopPropagation();
// //                                                         if (selectedCard !== item) {
// //                                                             handleCardClick(item);
// //                                                         }
// //                                                         setvisibleviewnew(true);
// //                                                     }}
// //                                                     style={{ fontSize: ".9em",backgroundColor:"#1F4E3D" ,color:"white",boxShadow:"rgba(0, 0, 0, 0.24) 0px 3px 8px"}}
// //                                                 >
// //                                                     عرض التحديثات
// //                                                 </button>
// //                                                 <ReactModal
// //                                                     isOpen={visibleviewnew}
// //                                                     onRequestClose={() => setvisibleviewnew(false)}
// //                                                     ariaHideApp={false}
// //                                                     style={viewnew}
// //                                                 >
// //                                                     <div onClick={(e) => e.stopPropagation()}>
// //                                                         <button
// //                                                             onClick={(e) => { e.stopPropagation(); setvisibleviewnew(false) }}
// //                                                             className="btn btn-close position-absolute top-0 end-0 m-2"
// //                                                             aria-label="Close"
// //                                                             style={{ fontSize: "20px", color: "#333", cursor: "pointer" }}
// //                                                         />
// //                                                         <Viewnew selectedCardId={selectedCard?.id} />
// //                                                     </div>
// //                                                 </ReactModal>
// //                                             </div>
// //                                         </div>
// //                                         <div className="d-flex align-items-center gap-2 mb-3">
// //                                             <p className="card-text mb-0" style={{ fontSize: "1.5rem" }}>
// //                                                 الأرض:
// //                                             </p>
// //                                             <p className="card-text mb-0" style={{ fontSize: "1.5rem" }}>
// //                                                 {item.parcelName || "غير معروف"}
// //                                             </p>
// //                                         </div>
// //                                         <div className="d-flex align-items-center gap-2 flex-wrap mb-3">
// //                                           <div className="d-flex gap-2">
// //                                             <p className="card-text mb-0" style={{ fontSize: "1.5rem", fontWeight: "500" }}>
// //                                                 تاريخ الانتاج:
// //                                             </p>
// //                                             <p className="mb-0" style={{ fontSize: "1.5rem" }}>
// //                                                 {new Date(item.startDate).toLocaleDateString("ar-EG")}
// //                                             </p>
// //                                             </div>
// //                                             <div className="d-flex gap-2"> 

// //                                             <p className="card-text mb-0" style={{ fontSize: "1.5rem", fontWeight: "500" }}>
// //                                                 تاريخ الانتهاء:
// //                                             </p>
// //                                             <p className="mb-0" style={{ fontSize: "1.5rem" }}>
// //                                                 {new Date(item.endDate).toLocaleDateString("ar-EG")}
// //                                             </p>
// //                                             </div>
// //                                         </div>

//                                         <div className="d-flex justify-content-between align-items-center mb-3">
//                                             <div className="d-flex align-items-center gap-2">
//                                                 <p className="mb-0" style={{ fontSize: "1.5rem" }}>
//                                                     الحالة:
//                                                 </p>
//                                                 <p className="mb-0" style={{ fontSize: "1.5rem" }}>
//                                                     {item.isOpenForInvestment ? "مفتوحة للاستثمار" : "مغلقة"}
//                                                 </p>
//                                             </div>
//                                         </div>
//                                         {item.isOpenForInvestment && (
//                                             <div>
//                                                 <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
//                                                     <div className="d-flex align-items-center gap-2">
//                                                         <p className="mb-0" style={{ fontSize: "1.5rem" }}>
//                                                             الهدف الاستثماري:
//                                                         </p>
//                                                         <p className="mb-0" style={{ fontSize: "1.5rem" }}>
//                                                             {item.openInvestmentCycleDTO?.expectedFinancialGoal || "غير محدد"} جنيه
//                                                         </p>
//                                                     </div>
//                                                     <div className="d-flex align-items-center gap-3">
//                                                         <p className="mb-0" style={{ fontSize: "1.5rem", fontWeight: "600" }}>
//                                                             عدد الطلبات
//                                                         </p>
//                                                         <button className="btn" style={{ border: "none", borderRadius: "30%", padding: "5px 15px", fontSize: "1.1em",backgroundColor:"#fff" }} onClick={(e) => { e.stopPropagation(); setvisiblecardrequests(true) }}>
//                                                             {item.numbersOfRequestsInvestments || "0"}
//                                                         </button>
//                                                     </div>
//                                                 </div>
//                                                 <ReactModal
//                                                     isOpen={visiblecardrequests}
//                                                     onRequestClose={() => setvisiblecardrequests(false)}
//                                                     ariaHideApp={false}
//                                                     style={cardreq}
//                                                 >
//                                                     <div onClick={(e) => e.stopPropagation()}>
//                                                         <button
//                                                             onClick={(e) => { e.stopPropagation(); setvisiblecardrequests(false) }}
//                                                             className="btn btn-close position-absolute top-0 end-0 m-2"
//                                                             aria-label="Close"
//                                                             style={{ fontSize: "20px", color: "#333", cursor: "pointer" }}
//                                                         />
//                                                         <Cardrequests />
//                                                     </div>
//                                                 </ReactModal>
//                                                 <div className="d-flex align-items-center gap-2 mb-3">
//                                                     <p className="mb-0" style={{ fontSize: "1.5rem" }}>
//                                                         الهدف المالي المجمع:
//                                                     </p>
//                                                     <p className="mb-0" style={{ fontSize: "1.5rem" }}>
//                                                         {item.openInvestmentCycleDTO?.currentTotalInvestment || 0}
//                                                     </p>
//                                                 </div>
//                                                 <div className="d-flex align-items-center gap-2 mb-3">
//                                                     <p className="mb-0" style={{ fontSize: "1.5rem" }}>
//                                                         عدد المستثمرين المسموح:
//                                                     </p>
//                                                     <p className="mb-0" style={{ fontSize: "1.5rem" }}>
//                                                         {item.openInvestmentCycleDTO?.maxInvestorsAllowed || 0} مستثمرين
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                         )}
//                                         {!item.isOpenForInvestment && (
//                                             <div className="d-flex align-items-center gap-2 " style={{marginBottom:"180px"}}>
//                                                 <p className="mb-0" style={{ fontSize: "1.5rem" }}>
//                                                     متوقع انتاجيه المحصول :
//                                                 </p>
//                                                 <p className="mb-0" style={{ fontSize: "1.5rem" }}>
//                                                     {item.expectedProduction || "غير متوفر"}
//                                                 </p>
//                                                 <p className="mb-0 ms-1" style={{ fontSize: "1.2rem" }}>{item.roiUnit}</p>
//                                             </div>
//                                         )}
//                                         {item.isOpenForInvestment && (
//                                             <div className="d-flex align-items-start gap-3">
//                                                 <p className="mb-0" style={{  fontSize: "1.5rem" }}>
//                                                     المستثمرين الحاليين:
//                                                 </p>
//                                                 <div>
//                                                     {item.currentInvestors && item.currentInvestors.length > 0 ? (
//                                                         item.currentInvestors.map((investor, i) => (
//                                                             <p key={i} className="mb-0" style={{ fontSize: "1.5rem" }}>
//                                                                 {investor.fullName} ({investor.investmentAmount} جنيه)
//                                                             </p>
//                                                         ))
//                                                     ) : (
//                                                         <p className="mb-0" style={{ fontSize: "1.5rem" }}>لا يوجد مستثمرين</p>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         )}
//                                         <div className="d-flex align-items-center justify-content-center gap-2 mt-4">
//                                             <p className="mb-0 text-danger" style={{ fontSize: "1.3rem", fontWeight: "600" }}>
//                                                 <i className="fa-regular fa-sun"> تنبيه:</i>
//                                             </p>
//                                             <p className="mb-0" style={{ fontSize: "1.3rem" }}>{item.timeToStart}</p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))
//                     ) : (
//                         <div className="text-center mt-3" style={{ fontSize: "1.2rem" }}>
//                             لا توجد نتائج مطابقة.
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//         </main>
//         </div>
//         </div>
//       <FooterF />
//     </>
//   );
// }
