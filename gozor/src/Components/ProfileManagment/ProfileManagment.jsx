import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Navbar from '../Navbar';
import NavSide from './NavSide';
import Footer from '../Footer';
import Modal from 'react-modal';
import ForgetPassword from './ForgetPassword';
import api from '../../API/axiosInstance';
import NavbarMer from '../merchantDashboard/Main/NavbarMer';
import NavbarInv from '../InvestorDashboard/Main/NavbarInv';
import NavbarF from '../FarmerDashboard/Main/NavbarF';
import NavSideMer from '../merchantDashboard/Main/NavSideMer';
import NavSideInv from '../InvestorDashboard/Main/NavSideInv';
import NavSideF from '../FarmerDashboard/Main/NavSideF';
import FooterMer from '../merchantDashboard/Main/FooterMer';
import FooterInv from '../InvestorDashboard/Main/FooterInv';
import FooterF from '../FarmerDashboard/Main/FooterF';

// Define the path to your default image (relative to the public folder)
const DEFAULT_PROFILE_PIC = 'assets/users.png'; // Make sure this file exists in public/assets
 

const RenderNavbarByRole = ({ role }) => {
  switch (role) {
    case 'Merchant':
      return <NavbarMer />;
    case 'Investor':
      return <NavbarInv/>;
    case 'Farmer':
    default:
      return <NavbarF/>;
  }
};

const RenderNavSideByRole = ({ role }) => {
  switch (role) {
    case 'Merchant':
      return <NavSideMer/>;
    case 'Investor':
      return <NavSideInv/>;
    case 'Farmer':
    default:
      return <NavSideF/>;
  }
};

const RenderFooterByRole = ({ role }) => {
  switch (role) {
    case 'Merchant':
      return <FooterMer/>;
    case 'Investor':
      return <FooterInv />;
    case 'Farmer':
    default:
      return <FooterF />;
  }
};


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

// Helper function to convert data URL to File object
function dataURLtoFile(dataurl, baseFilename = 'profile_image') {
    if (!dataurl) return null;
    let arr = dataurl.split(','),
        mimeMatch = arr[0].match(/:(.*?);/);

    if (!mimeMatch || mimeMatch.length < 2) {
        console.error("Invalid data URL: mime type not found or invalid format.");
        return null;
    }
    const mime = mimeMatch[1];
    const extension = mime.split('/')[1] ? mime.split('/')[1].replace('jpeg', 'jpg') : 'bin'; // e.g., 'png', 'jpg'
    const filename = `${baseFilename}.${extension}`;

    let bstr;
    try {
        bstr = atob(arr[1]);
    } catch (e) {
        console.error("Failed to decode base64 string (atob):", e, dataurl.substring(0,100)); // Log part of dataurl for debugging
        return null;
    }

    let n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    try {
        return new File([u8arr], filename, { type: mime });
    } catch (e) {
        console.error("Error creating File object:", e);
        return null;
    }
}


const ProfileManegment = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState(DEFAULT_PROFILE_PIC);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [title, setTitle] = useState(''); // This is the rate string e.g. "4 / 5" or "لا توجد تقييمات"
  const [rating, setRating] = useState(''); // This is also the rate string for the details section
  const [visibleForget, setVisibleForget] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    api.get('Authentication/profile')
      .then((response) => {
        const { userName, email, phone, bio, rate, imageProfileUrl ,role} = response.data;
        setName(userName || '');
        setEmail(email || '');
        setPhone(phone || '');
        setBio(bio || '');
        const rateText = rate ? `${parseFloat(rate).toFixed(1)} / 5` : 'لا توجد تقييمات';
        setTitle(rateText); // For under the photo
        setRating(rateText); // For the "متوسط التقييم" field in details
        setProfilePic(imageProfileUrl || DEFAULT_PROFILE_PIC);
        setUserRole(role);
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
          const formData = new FormData();
          formData.append('UserName', name);
          formData.append('Phone', phone);
          formData.append('Bio', bio);
          // Email is not sent as it's not in the PUT API parameters for update
          // Rate/Title is not sent as it's not in the PUT API parameters for update

          // Handle image:
          // Send 'Image' field only if a new image file has been selected (profilePic is a data URL)
          if (profilePic && profilePic.startsWith('data:image/')) {
            const imageFile = dataURLtoFile(profilePic, 'profile_upload');
            if (imageFile) {
              formData.append('Image', imageFile);
            } else {
              console.warn("Could not convert data URL to file. Image will not be uploaded.");
              // Optionally, inform the user if conversion failed.
            }
          }
          // If profilePic is null (user clicked "Remove Image"), we don't append 'Image'.
          // The backend determines how to handle this: either keep the old image,
          // or remove it. Based on typical REST APIs, not sending the field means "no change".
          // If specific removal is needed, the API would usually have a flag like `RemoveImage: true`.

          api.put('Authentication/profile', formData, {
            headers: {
              // 'Content-Type': 'multipart/form-data' // Axios sets this automatically for FormData
            }
          })
          .then(response => {
            setIsEditing(false);
            Swal.fire('تم الحفظ!', 'تم تحديث بياناتك بنجاح.', 'success');

            // After successful save, update profilePic state if backend returns a new image URL
            if (response.data && response.data.imageProfileUrl) {
              setProfilePic(response.data.imageProfileUrl);
            }
            // If no imageProfileUrl in response, but we uploaded a new image (data URL was set to profilePic),
            // profilePic already holds the data URL, which will display the new image.
            // On next full fetch/refresh, the actual server URL will be loaded by useEffect.
          })
          .catch(error => {
            console.error("Error updating profile:", error.response?.data || error.message);
            let errorMessage = 'فشل في تحديث الملف الشخصي.';
            if (error.response && error.response.data) {
                if (error.response.data.errors) {
                    const errors = error.response.data.errors;
                    const errorMessages = Object.values(errors).flat();
                    errorMessage += '\n' + errorMessages.join('\n');
                } else if (typeof error.response.data === 'string') {
                    errorMessage = error.response.data;
                } else if (error.response.data.message) {
                    errorMessage = error.response.data.message;
                }
            }
            Swal.fire('خطأ', errorMessage, 'error');
          });
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
        setProfilePic(reader.result); // reader.result is a base64 data URL
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    // Setting state to null will cause the img src to fallback to DEFAULT_PROFILE_PIC
    // via the logic in the img tag's src attribute.
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

  // Determine image source for the img tag
  let imageSrcToDisplay;
  if (profilePic && profilePic.startsWith('data:image/')) {
    imageSrcToDisplay = profilePic; // Use data URL directly if it's a newly selected image
  } else {
    // Use server path or default path, prepended with base URL
    imageSrcToDisplay = `https://cityroots.runasp.net/${profilePic || DEFAULT_PROFILE_PIC}`;
  }


  return (
    <>
      <RenderNavbarByRole role={userRole} />
      <div className="d-flex" style={{  overflow: 'hidden' }}>
        <RenderNavSideByRole role={userRole} />
        <div> {/* This empty div was present in the original code */}
        </div>
        <main className="flex-grow-1">
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
                      <div className="form-control text-center" style={{ color: "#2e2d2d", backgroundColor: "rgb(184, 179, 179)", borderRadius: "12px", fontSize: '0.9rem', padding: '0.5rem' }}>
                        {email}
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
                        {isEditing ? 'قم بالحفظ' : 'اضغط للتعديل'}
                       </button>
                       <button className="btn btn-sm" style={{ backgroundColor: "#878680", color: "#fff", borderRadius: "13px" }}  onClick={() => setVisibleForget(true)}>اضغط لتغيير كلمة المرور</button>
                        <Modal isOpen={visibleForget} onRequestClose={() => setVisibleForget(false)} style={forgetStyles} appElement={document.getElementById('root') || undefined}>
                           <button onClick={() => setVisibleForget(false)} style={{ backgroundColor: 'transparent', border: 'none', fontSize: '17px', color: '#333', cursor: 'pointer', position: 'absolute', top: '10px', right: '10px', padding: '5px' }}>
                               <i className="fa-solid fa-xmark"></i>
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
                        <div className="form-control text-center" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: "black", backgroundColor: "rgb(184, 179, 179)", minHeight: "100px", borderRadius: "12px", fontSize: '0.9rem', padding: '1rem 0.75rem', textAlign: 'right' }}>{bio}</div>
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
                    src={imageSrcToDisplay}
                    alt="User"
                    onError={(e) => { 
                        // Fallback to default if server image fails to load or if imageSrcToDisplay is broken
                        if (e.target.src !== `https://cityroots.runasp.net/${DEFAULT_PROFILE_PIC}`) {
                           e.target.src = `https://cityroots.runasp.net/${DEFAULT_PROFILE_PIC}`;
                        }
                    }}
                    className="img-fluid rounded-circle d-block mb-3"
                    style={{
                        maxWidth: '250px', maxHeight: '250px', width: '250px', height: '250px',
                        objectFit: 'cover', aspectRatio: '1 / 1',
                        border: isEditing ? '3px dashed #888' : 'none'
                     }}
                  />

                  {isEditing && (
                    <div className='d-flex gap-2'>
                       <FileInputButton onChange={handleImageChange} isEditing={isEditing} />
                       {profilePic && profilePic !== DEFAULT_PROFILE_PIC && ( // Show remove only if not default and not null
                         <button className="btn btn-sm btn-danger mt-2" onClick={handleRemoveImage}>
                           إزالة الصورة
                         </button>
                       )}
                    </div>
                  )}

                  {isEditing ? (
                     <input type="text" className="form-control mt-3 mb-1 text-center fw-bold" style={{...editableFieldStyle, maxWidth: '80%', margin: '1rem auto 0' }} value={name} onChange={(e) => setName(e.target.value)} />
                  ) : (
                     <h5 className="mt-3 mb-1" style={{ fontWeight: "600" }}>{name}</h5>
                  )}
                  {/* Title under photo (derived from rate, not editable by user) */}
                  <p className="text" style={{ fontWeight: "600", color: "#4BAF47" }}>{title}</p>
                </div>
              </div>

            </div> {/* End .row */}
          </div> {/* End .container */}
        </main>
      </div>
       <RenderFooterByRole role={userRole} />
    </>
  )
};

export default ProfileManegment;