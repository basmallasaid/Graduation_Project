import React, { useState } from 'react';
import styles from '../Styles/style.module.css';

const CreateAccountForm = () => {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    category: 'مزارع', // Default to "مزارع"
    username: '',
    bio: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (category) => {
    setFormData({ ...formData, category });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // Add logic to send formData to backend
  };

  return (
    <>
    
    <div className={styles.regcontainer}>
      <h1 className={styles.firsttitle}>حساب جديد</h1>
      <p className={styles.subtitlee}>أهلا بك في جذور</p>
      <form onSubmit={handleSubmit} className={styles.regform}>
        <div className={styles.reginput}>
        <label for="name" className={styles.reglabel}>          <i class="fa-solid fa-user" style={{paddingLeft:"15px"}}></i>
        الاسم </label>

          <input
          
            type="text"
            name="name"
            placeholder=" الاسم بالكامل" 
            value={formData.name}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        <div className={styles.reginput}>
        <label for="email" className={styles.reglabel}><i className="fa-solid fa-envelope" style={{paddingLeft:"15px"}}></i>البريد الالكتروني </label>

          <input
            type="email"
            name="email"
            placeholder="البريد الالكتروني"
            value={formData.email}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        <div className={styles.reginput}>
        <label for="phone" className={styles.reglabel}><i class="fa-solid fa-phone" style={{paddingLeft:"15px"}}></i>رقم الهاتف</label>

          <input
            type="text"
            name="phone"
            placeholder="رقم الهاتف"
            value={formData.phone}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        <div className={styles.reginput}>
        <label for="name" className={styles.reglabel}><i class="fa-solid fa-lock"style={{paddingLeft:"15px"}}></i>كلمه المرور</label>

          <input
            type="password"
            name="password"
            placeholder="كلمة المرور"
            value={formData.password}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        <div className={styles.reginput}>
        <label for="password" className={styles.reglabel}><i class="fa-solid fa-lock"style={{paddingLeft:"15px"}}></i>اعاده كلمه المرور  </label>

          <input
            type="password"
            name="password"
            placeholder="اعاده كلمة المرور "
            value={formData.password}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        <label for="category" className={styles.reglabel}>اختار الفئه</label>

        <div className={styles.regcategory}>

        <button
  type="button"
  className={`${styles.regcategoryButton} ${
    formData.category === 'مزارع' ? styles.active : ''
  }`}
  onClick={() => handleCategoryChange('مزارع')}
>
  مزارع
</button>
          <button
  type="button"
  className={`${styles.regcategoryButton} ${
    formData.category === 'تاجر' ? styles.active : ''
  }`}
  onClick={() => handleCategoryChange('تاجر')}
>
  تاجر
</button>
          <button
  type="button"
  className={`${styles.regcategoryButton} ${
    formData.category === 'مستثمر' ? styles.active : ''
  }`}
  onClick={() => handleCategoryChange('مستثمر')}
>
  مستثمر
</button>
        </div>
        <div className={styles.reginput}>
        <label for="username" className={styles.reglabel}><i class="fa-solid fa-user"style={{paddingLeft:"15px"}}></i>اسم المستخدم</label>

          <input
            type="text"
            name="username"
            placeholder="اسم المستخدم"
            value={formData.username}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        <div className={styles.reginput}>
        <label for="bio" className={styles.reglabel}><i class="fa-solid fa-message"style={{paddingLeft:"15px"}}></i>السيره الذاتيه</label>

          <textarea
            name="bio"
            placeholder="السيرة الذاتية"
            value={formData.bio}
            onChange={handleChange}
            className={styles.regtextarea}
          ></textarea>
        </div>
        <button type="submit" className={styles.regButton}>
          إنشاء
        </button>
      </form>
    </div>

    </>
  );
};



export default CreateAccountForm;
