import React, { useState, useRef, useEffect } from 'react';
import styles from "../../Styles/style.module.css";
import Navbar from '../Navbar';
import axios from 'axios';
import FooterF from './Main/FooterF';

const AImodel = () => {
    const [files, setFiles] = useState([]);
    const [plantDiseaseData, setPlantDiseaseData] = useState(null);
    const fileInputRef = useRef(null);
    const [plantName, setPlantName] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3100/plantName')
            .then(response => {
                setPlantName(response.data[0]?.name);
            })
            .catch(error => {
                console.error('Error fetching plant name:', error);
            });
    }, []);

    useEffect(() => {
        axios.get('http://localhost:3100/plantDiseaseData')
            .then((response) => {
                setPlantDiseaseData(response.data[0]);
            })
            .catch((error) => {
                console.error("Error fetching plant disease data:", error);
            });
    }, []);

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        const fileItems = selectedFiles.map(file => ({
            name: file.name,
            progress: 0,
            status: 'uploading',
            preview: URL.createObjectURL(file)
        }));
        setFiles(fileItems);

        // Simulate successful upload immediately
        selectedFiles.forEach((file, index) => {
            simulateUpload(file, index);
        });
    };

    const simulateUpload = (file, index) => {
        // Create a fake progress animation
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            setFiles((prevFiles) => {
                const newFiles = [...prevFiles];
                newFiles[index].progress = progress;
                return newFiles;
            });

            if (progress >= 100) {
                clearInterval(interval);
                const fakeImageUrl = `/assets/uploads/${file.name}`;/*note */
                setImageUrl(fakeImageUrl);

                // Update the plantimg data in json-server
                axios.post('http://localhost:3100/plantimg', {
                    id: Date.now().toString(),
                    imageUrl: fakeImageUrl
                })
                .then(() => {
                    setFiles((prevFiles) => {
                        const newFiles = [...prevFiles];
                        newFiles[index].status = 'success';
                        return newFiles;
                    });
                })
                .catch((error) => {
                    console.error('Error saving image URL:', error);
                    setFiles((prevFiles) => {
                        const newFiles = [...prevFiles];
                        newFiles[index].status = 'error';
                        return newFiles;
                    });
                });
            }
        }, 200);
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
            <FooterF/>
        </>
    );
};

export default AImodel;
