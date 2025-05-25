import React, { useState,useEffect} from 'react';
import Swal from 'sweetalert2';
import Navbar from '../Navbar';
import NavSide from './NavSide';
import Footer from '../Footer';
import Modal from 'react-modal';
import ForgetPassword from './ForgetPassword'
import api from '../../API/axiosInstance';
// Define the path to your default image (relative to the public folder)
const DEFAULT_PROFILE_PIC = 'assets/users.png'; // Make sure this file exists in public/assets

// Helper function to create a simple file input trigger button
const FileInputButton = ({ onChange, isEditing }) => {
  if (!isEditing) return null;

  return (
    <label className="btn btn-sm btn-secondary mt-2">
      تغيير الصورة
      <input type="file" hidden accept="image/*" onChange={onChange} />
    </label>
  );
};


const ProfileManegment = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState(DEFAULT_PROFILE_PIC);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [title, setTitle] = useState('');
  const [rating, setRating] = useState('');
  const [visibleForget, setVisibleForget] = useState(false);

  useEffect(() => {
    api.get('Authentication/profile')
      .then((response) => {
        const { userName, email, phone, bio, rate, imageProfileUrl } = response.data;
        setName(userName || '');
        setEmail(email || '');
        setPhone(phone || '');
        setBio(bio || '');
        setTitle(rate ? `${rate} / 5` : 'لا توجد تقييمات');
        setProfilePic(imageProfileUrl || DEFAULT_PROFILE_PIC);
      })
      .catch(() => {
        Swal.fire('خطأ', 'فشل في تحميل بيانات الملف الشخصي', 'error');
      });
  }, []);

  const handleToggleEdit = () => {
    if (isEditing) {
      Swal.fire({
        title: 'هل تريد حفظ التعديلات؟',
        text: "سيتم تحديث بيانات ملفك الشخصي.",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'نعم، قم بالحفظ!',
        cancelButtonText: 'إلغاء'
      }).then((result) => {
        if (result.isConfirmed) {
          // --- Simulate Saving Data ---
          // Send data to API. Email is included implicitly.
          // profilePic will be null if removed, data URL if changed, original path if untouched.
          console.log("Saving data:", { name, email, phone, bio, profilePic, title });
          // --- End Simulation ---

          setIsEditing(false);
          Swal.fire(
            'تم الحفظ!',
            'تم تحديث بياناتك بنجاح.',
            'success'
          );
        }
      });
    } else {
      setIsEditing(true);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    // Setting state to null will cause the img src to fallback to DEFAULT_PROFILE_PIC
    setProfilePic(null);
  };

  const editableFieldStyle = {
      backgroundColor: "rgb(210, 205, 205)",
      borderRadius: "12px",
      color: "#2e2d2d",
      textAlign: 'end',
      padding: '0.5rem',
      fontSize: '0.9rem',
      border: '1px solid #ced4da'
  };
   const editableTextAreaStyle = {
      ...editableFieldStyle,
      minHeight: "100px",
      padding: '0.75rem'
  };
  
  const forgetStyles = {
    content: {
        maxWidth: '500px',
        margin: '0 auto',
        padding: '10px',
        borderRadius: '10px',
        height: '490px'
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  };
  return (
    <>
      <Navbar />
      {/* Main Flex Container */}
      <div className="d-flex" style={{  overflow: 'hidden' }}>
     {/* NavSide (Pass the shouldBeCollapsed prop) */}
     <NavSide
        />

        {/* Chat Panel Wrapper (Animated Width) */}
        <div >
        </div>        <main className="flex-grow-1">
          <div className="container mt-5 mb-5">
            <div className="row g-4">

              {/* User Details Section */}
              <div className="col-lg-8 order-lg-1">
                <div className="row p-4 shadow h-100" style={{ backgroundColor: "#e6e3e3", borderRadius: "20px" }}>

                  {/* Right Column */}
                  <div className="col-md-6 text-end mb-4 mb-md-0">
                    <h2 className="mb-4" style={{ fontWeight: "600" }}>بيانات المستخدم</h2>
                    {/* Name */}
                    <div className="mb-4">
                      <label htmlFor="userName" className="form-label fw-bold" style={{ color: "#878680", fontSize: "1.3rem" }}>الاسم</label>
                      {isEditing ? (
                        <input type="text" id="userName" className="form-control" style={editableFieldStyle} value={name} onChange={(e) => setName(e.target.value)} />
                      ) : (
                        <div className="form-control text-center" style={{ color: "#2e2d2d", backgroundColor: "rgb(184, 179, 179)", borderRadius: "12px", fontSize: '0.9rem', padding: '0.5rem' }}>{name}</div>
                      )}
                    </div>

                    {/* Email - Always Displayed, Not Editable */}
                    <div className="mb-4">
                      <label className="form-label fw-bold" style={{ color: "#878680", fontSize: "1.3rem" }}>البريد الإلكتروني</label>
                      {/* Removed conditional rendering - always show the div */}
                      <div className="form-control text-center" style={{ color: "#2e2d2d", backgroundColor: "rgb(184, 179, 179)", borderRadius: "12px", fontSize: '0.9rem', padding: '0.5rem' }}>
                        {email} {/* Display email from state */}
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="mb-4">
                      <label htmlFor="userPhone" className="form-label fw-bold" style={{ color: "#878680", fontSize: "1.3rem" }}>رقم الهاتف</label>
                      {isEditing ? (
                         <input type="tel" id="userPhone" className="form-control" style={editableFieldStyle} value={phone} onChange={(e) => setPhone(e.target.value)} />
                      ) : (
                        <div className="form-control text-center" style={{ color: "#2e2d2d", backgroundColor: "rgb(184, 179, 179)", borderRadius: "12px", fontSize: '0.9rem', padding: '0.5rem' }}>{phone}</div>
                      )}
                    </div>
                  </div>

                  {/* Left Column */}
                  <div className="col-md-6 text-end">
                     {/* Buttons */}
                    <div className="d-grid gap-2 d-md-flex justify-content-md-end mb-4">
                       <button className="btn btn-sm" style={{ backgroundColor: "black", color: "#fff", borderRadius: "13px" }} onClick={handleToggleEdit} >
                        {isEditing ? 'قم بالتعديل' : 'اضغط للتعديل'}
                       </button>
                       <button className="btn btn-sm" style={{ backgroundColor: "#878680", color: "#fff", borderRadius: "13px" }}  onClick={() => setVisibleForget(true)}>اضغط لتغيير كلمة المرور</button>
                                <Modal isOpen={visibleForget} onRequestClose={() => setVisibleForget(false)} style={forgetStyles}>
                                                   <button onClick={() => setVisibleForget(false)}>
                                                       <i className="fa-solid fa-xmark" style={{ backgroundColor: 'transparent', border: 'none', fontSize: '17px', color: '#333', cursor: 'pointer', position: 'absolute', top: '10px', right: '10px' }}></i>
                                                   </button>
                                                   <ForgetPassword />
                                               </Modal>
                    </div>
                    {/* Bio */}
                    <div className="mb-4">
                      <label htmlFor="userBio" className="fw-bold" style={{ color: "#878680", fontSize: "1.3rem" }}>النبذه التعريفيه</label>
                       {isEditing ? (
                         <textarea id="userBio" className="form-control" style={editableTextAreaStyle} rows="4" value={bio} onChange={(e) => setBio(e.target.value)} />
                      ) : (
                        <div className="form-control text-center" style={{ color: "black", backgroundColor: "rgb(184, 179, 179)", minHeight: "100px", borderRadius: "12px", fontSize: '0.9rem', padding: '2.5rem 0.75rem' }}>{bio}</div>
                       )}
                    </div>
                     {/* Rating */}
                    <div className="mb-2" style={{ marginTop: isEditing ? "10px": "40px" }}>
                      <h4 className="fw-bold" style={{ color: "#878680", fontSize: "1.3rem" }}>متوسط التقييم</h4>
                      <div className="form-control text-center" style={{ color: "black", backgroundColor: "rgb(184, 179, 179)", borderRadius: "12px", fontSize: '0.9rem', padding: '0.5rem' }}>{rating}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Picture Section */}
              <div className="col-lg-4 order-lg-2 mb-4 mb-lg-0">
                <div className="text-center p-4 shadow h-100 d-flex flex-column justify-content-center align-items-center" style={{ backgroundColor: "#e6e3e3", borderRadius: "20px" }}>
                  <img
                    // Use profilePic if it exists (truthy), otherwise use the default
                    src={`https://cityroots.runasp.net/${profilePic || DEFAULT_PROFILE_PIC}`}
                    alt="User"
                    className="img-fluid rounded-circle d-block mb-3"
                    style={{
                        maxWidth: '250px', maxHeight: '250px', width: '250px', height: '250px',
                        objectFit: 'cover', aspectRatio: '1 / 1',
                        border: isEditing ? '3px dashed #888' : 'none'
                     }}
                  />

                  {/* Action Buttons for Image (only in edit mode) */}
                  {isEditing && (
                    <div className='d-flex gap-2'>
                       {/* Change Photo Button */}
                       <FileInputButton onChange={handleImageChange} isEditing={isEditing} />

                       {/* Remove Photo Button - Only show if there IS a custom photo (profilePic is not null) */}
                       {profilePic && (
                         <button className="btn btn-sm btn-danger mt-2" onClick={handleRemoveImage}>
                           إزالة الصورة
                         </button>
                       )}
                    </div>
                  )}

                  {/* Name under photo */}
                  {isEditing ? (
                     <input type="text" className="form-control mt-3 mb-1 text-center fw-bold" style={{...editableFieldStyle, maxWidth: '80%', margin: '1rem auto 0' }} value={name} onChange={(e) => setName(e.target.value)} />
                  ) : (
                     <h5 className="mt-3 mb-1" style={{ fontWeight: "600" }}>{name}</h5>
                  )}

                  {/* Title under photo */}
                  {isEditing ? (
                    <input type="text" className="form-control text-center" style={{...editableFieldStyle, maxWidth: '80%', margin: '0 auto', color: "#4BAF47", fontWeight: "600"}} value={title} onChange={(e) => setTitle(e.target.value)} />
                  ) : (
                     <p className="text" style={{ fontWeight: "600", color: "#4BAF47" }}>{title}</p>
                  )}

                </div>
              </div>

            </div> {/* End .row */}
          </div> {/* End .container */}
        </main>
      </div>
      <Footer />
    </>
  )
};

export default ProfileManegment;