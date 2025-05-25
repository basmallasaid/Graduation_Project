import React, { useState, useRef } from 'react';
import styles from "../../Styles/style.module.css";
import NavbarF from '../FarmerDashboard/Main/NavbarF';
import FooterF from './Main/FooterF';
import api from '../../API/axiosInstance';

const AImodel = () => {
    const [files, setFiles] = useState([]);
    const fileInputRef = useRef(null);
    const [plantName, setPlantName] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [plantDiseaseData, setPlantDiseaseData] = useState(null);

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        const fileItems = selectedFiles.map(file => ({
            file,
            name: file.name,
            progress: 0,
            status: 'uploading',
            preview: URL.createObjectURL(file)
        }));
        setFiles(fileItems);

        selectedFiles.forEach((file, index) => {
            simulateUpload(file, index);
        });
    };

    const simulateUpload = (file, index) => {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            setFiles(prevFiles => {
                const updated = [...prevFiles];
                updated[index].progress = progress;
                return updated;
            });

            if (progress >= 100) {
                clearInterval(interval);

                const formData = new FormData();
                formData.append('file', file);

                api.post('Ai/predict', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                .then(response => {
                    const data = response.data;
                    setFiles(prevFiles => {
                        const updated = [...prevFiles];
                        updated[index].status = 'success';
                        return updated;
                    });

                    setImageUrl(data.imageUrl || URL.createObjectURL(file));

                    if (data.isIll) {
                        setPlantDiseaseData(data);
                        setPlantName(null);
                    } else {
                        setPlantDiseaseData(null);
                        setPlantName(data.name); // اسم النبات
                    }
                })
                .catch(error => {
                    console.error('Error uploading image:', error);
                    setFiles(prevFiles => {
                        const updated = [...prevFiles];
                        updated[index].status = 'error';
                        return updated;
                    });
                });
            }
        }, 200);
    };

    return (
        <>
            <NavbarF />
            <div className={styles.containerf}>
                <div className={`row ${styles.Ai}`}>
                    <div className='col-3'>
                        <img src={`/assets/Aiplane.png`} alt="plane" />
                    </div>
                    <div className='col-3'>
                        <img src={`/assets/Aiplanee.png`} alt="plane" />
                    </div>
                    <div className='col-5'>
                        <p><b>نظامنا المدعوم بالذكاء الاصطناعي يساعدك على اكتشاف وتشخيص أمراض النباتات بدقة، مع تقديم حلول عملية للحفاظ على صحة مزروعاتك.</b></p>
                    </div>
                </div>

                <div className={styles.imginfo}>
                    <p className={styles.titleimg}>التقط صورة، دعنا نحلل، ونحمي مزرعتك من أي تهديد!</p>
                    <div className='row'>
                        <div className={`col ${styles.uploadBox}`}>
                            <img src={`/assets/upload.png`} alt="upload" />
                            <p>اسحب الصور هنا لتحميلها</p>
                            <div className={styles.imagePreview}>
                                {files.length > 0 && files[0].preview && (
                                    <img src={files[0].preview} alt="Image Preview" />
                                )}
                            </div>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileChange}
                                className={styles.fileInput}
                                ref={fileInputRef}
                            />
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className={styles.imgButton}
                            >
                                Browse Files
                            </button>
                            <p className={styles.desimg}>5MB :الحجم الأقصى للصورة</p>
                            <p className={styles.desimg}>PNG ,JPG :أنواع الملفات المدعومة</p>
                        </div>

                        <div className={`col ${styles.fileList}`}>
                            {files.map((file, index) => (
                                <div key={index} className={styles.fileItem}>
                                    <div className={styles.imagePreview}>
                                        <img src={file.preview} alt={file.name} />
                                    </div>
                                    <div className={styles.progress}>
                                        <div
                                            className={`${styles.progressBar} ${file.status}`}
                                            style={{
                                                width: `${file.progress}%`,
                                                backgroundColor:
                                                    file.status === 'success' ? 'green' :
                                                    file.status === 'error' ? 'red' : 'blue'
                                            }}
                                        />
                                    </div>
                                    <span className={styles.status}>
                                        {file.status === 'success' ? 'تم الرفع بنجاح' :
                                         file.status === 'error' ? 'فشل في الرفع' : ''}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* يظهر هذا الجزء فقط بعد رفع الصورة */}
                {imageUrl && (
                    <div className={styles.showplane}>
                        {plantDiseaseData ? (
                            <>
                                <h3><b>اسم المرض: {plantDiseaseData.name}</b></h3>
                                <br />
                                <p>التشخيص:</p>
                                <p>{plantDiseaseData.diagnosis}</p>
                                <br />
                                <h3><b>الحلول المختارة:</b></h3>
                                <ol>
                                    {plantDiseaseData.recommendation.split('\n').map((rec, i) => (
                                        <li key={i}>{rec}</li>
                                    ))}
                                </ol>
                            </>
                        ) : (
                            <>
                                {plantName && <p>اسم النبات: {plantName}</p>}
                                <div >
                                    <p>تم رفع الصورة بنجاح!</p>
                                    <img src={imageUrl} alt="Uploaded" className={styles.imgPreview} style={{width:"30%"}} />
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
            <FooterF />
        </>
    );
};

export default AImodel;
