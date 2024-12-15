import React, { useState, useRef, useEffect } from 'react';
import styles from "../../Styles/style.module.css";
import Navbar from '../Navbar';
import FooterF from './FooterF';
import axios from 'axios';

const AImodel = () => {
    const [files, setFiles] = useState([]);
    const [plantDiseaseData, setPlantDiseaseData] = useState(null);
    const fileInputRef = useRef(null);
    const [plantName, setPlantName] = useState(null);
    const [imageUrl, setImageUrl] = useState(null); // State to store the uploaded image URL

    // Fetch plant name on component mount
    useEffect(() => {
        axios.get('http://localhost:3100/plantName')
            .then(response => {
                setPlantName(response.data[0]?.name);
            })
            .catch(error => {
                console.error('Error fetching plant name:', error);
            });
    }, []);

    // Fetch plant disease data on component mount
    useEffect(() => {
        axios.get('http://localhost:3100/plantDiseaseData')
            .then((response) => {
                setPlantDiseaseData(response.data[0]); // Assuming data is an array
            })
            .catch((error) => {
                console.error("Error fetching plant disease data:", error);
            });
    }, []);

    // Handle file selection
    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        const fileItems = selectedFiles.map(file => ({
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

    // Simulate file upload with Axios
    const simulateUpload = (file, index) => {
        const formData = new FormData();
        formData.append('file', file);

        axios.post('http://localhost:3100/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setFiles((prevFiles) => {
                    const newFiles = [...prevFiles];
                    newFiles[index].progress = progress;
                    return newFiles;
                });
            },
        })
            .then((response) => {
                const uploadedImageUrl = response.data.imageUrl;  // Assuming response contains the image URL
                setImageUrl(uploadedImageUrl);  // Store the image URL

                // After successful image upload, send the URL to plantimg API
                axios.post('http://localhost:3100/plantimg', {
                    imageUrl: uploadedImageUrl,
                })
                    .then(() => {
                        console.log('Image URL saved to db');
                    })
                    .catch((error) => {
                        console.error('Error saving image URL:', error);
                    });

                setFiles((prevFiles) => {
                    const newFiles = [...prevFiles];
                    newFiles[index].status = 'success';
                    return newFiles;
                });
            })
            .catch(() => {
                setFiles((prevFiles) => {
                    const newFiles = [...prevFiles];
                    newFiles[index].status = 'error';
                    return newFiles;
                });
            });
    };

    return (
        <>
            <Navbar />
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
                    <p className={`${styles.titleimg}`}>التقط صورة، دعنا نحلل، ونحمي مزرعتك من أي تهديد!</p>
                    <div className='row'>
                        <div className={`col ${styles.uploadBox}`}>
                            <img src={`/assets/upload.png`} alt="plane" />
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
                                                backgroundColor: file.status === 'success' ? 'green' : (file.status === 'error' ? 'red' : 'blue')
                                            }}
                                        />
                                    </div>
                                    <span className={styles.status}>
                                        {file.status === 'success' ? 'Upload Successful' : file.status === 'error' ? 'Upload Failed' : ''}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.showplane}>
                    {plantDiseaseData && plantDiseaseData.isIll ? (
                        <>
                            <h3><b>اسم المرض : {plantDiseaseData.name}</b></h3>
                            <br />
                            <p>التشخيص :</p>
                            <p>{plantDiseaseData.diagnosis}</p>
                            <br />
                            <h3><b>الحلول المختارة:</b></h3>
                            <ol>
                                {plantDiseaseData.recommendation.split(',').map((recommendation, index) => (
                                    <li key={index}>{recommendation}</li>
                                ))}
                            </ol>
                        </>
                    ) : (
                        <div className={styles.showplane}>
                            <p>اسم النبات: {plantName ? plantName : 'جاري تحميل اسم النبات...'}</p>
                            {imageUrl && (
                                <div>
                                    <p>تم رفع الصورة بنجاح!</p>
                                    <img src={imageUrl} alt="Uploaded" className={styles.imgPreview} />
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </div>
            <FooterF />
        </>
    );
};

export default AImodel;
