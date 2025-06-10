import { Link } from "react-router-dom";
import Modal from 'react-modal';
import React, { useState } from 'react';
import Code from "./Code";


export default function Email({email,onFlowComplete}) { // Get the email prop
    const [visiblecode, setVisiblecode] = useState(false);
    const codeStyles = {
      content: {
        maxWidth: '500px', 
        margin: ' auto', 
        padding: '10px', 
        borderRadius: '10px',
        height:'400px'
      },
      overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
    };
    return (
        <div className="d-flex justify-content-center align-items-center ">
            <div className="text-center p-4 border rounded shadow">
                <h1 style={{color:'black',fontSize:'3rem'}}>برجاء التحقق من بريدك الالكتروني</h1>
                <img src="/assets/Gmail.png" alt="Gmail Icon" className="img-fluid my-3" style={{ maxWidth: "180px" }} />
                <p>برجاء ادخال كود التحقق</p>
                <p>
                    لقد أرسلنا لك بريدًا إلكترونيًا يحتوي على كود لإعادة تعيين كلمة المرور الخاصة بك, 
                    <Link to="#" className="text-decoration-none" onClick={()=>setVisiblecode(true)}> حسنا تم الاستلام</Link>
                    <Modal isOpen={visiblecode} onRequestClose={()=>setVisiblecode(false)} style={codeStyles}>
                <button onClick={()=>setVisiblecode(false)}><i className="fa-solid fa-xmark"
                style={{
                  backgroundColor: 'transparent', 
                  border: 'none', 
                  fontSize: '24px', 
                  color: '#333', 
                  cursor: 'pointer', 
                  position: 'absolute',
                  top: '10px', 
                  right: '10px', 
                }} ></i></button>
             <Code email={email} onFlowComplete={onFlowComplete}/> {/* Pass the email prop here */}
            </Modal>
                </p>
                <hr />
                <p>
                    لم تستلم البريد الإلكتروني؟ تحقق من مجلد البريد العشوائي أو 
                    <Link to="#" className="text-decoration-none"> حاول الارسال مره اخري</Link>
                </p>
            </div>
        </div>
    );
}