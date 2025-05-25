import React from 'react';
import styles from "../../../Styles/style.module.css";

const TransactionModalInv = ({ transaction, onClose }) => {
    if (!transaction) return null;

    return (
        <div className={styles.modal_overlay} onClick={onClose}>
            <div className={styles.modal_content} onClick={(e) => e.stopPropagation()}>
                <button className={styles.modal_close} onClick={onClose}>×</button>
                <div className={styles.modal_grid}>
                    <div className={styles.modal_item}>
                        <span className={styles.modal_label}>تاريخ المعاملة</span>
                        <span className={styles.modal_value}>
                            {new Date(transaction.paymentDate).toLocaleDateString('ar-EG')}
                        </span>
                    </div>
                    <div className={styles.modal_item}>
                        <span className={styles.modal_label}>نوع المعاملة</span>
                        <span className={styles.modal_value}>{transaction.type}</span>
                    </div>
                    <div className={styles.modal_item}>
                        <span className={styles.modal_label}>الطرف المستقبل</span>
                        <span className={styles.modal_value}>{transaction.payeeName}</span>
                    </div>

                    <div className={styles.modal_item}>
                        <span className={styles.modal_label}>البريد الإلكتروني (المستقبل)</span>
                        <span className={styles.modal_value}>{transaction.payeeEmail}</span>
                    </div>

                    <div className={styles.modal_item}>
                        <span className={styles.modal_label}>اسم الدورة</span>
                        <span className={styles.modal_value}>{transaction.associatedCycle.cycleName}</span>
                    </div>
                    <div className={styles.modal_item}>
                        <span className={styles.modal_label}>طريقة الدفع</span>
                        <span className={styles.modal_value}>{transaction.paymentMethod}</span>
                    </div>
                    <div className={styles.modal_item}>
                        <span className={styles.modal_label}>المبلغ</span>
                        <span className={styles.modal_value}>{transaction.amount} ج.م</span>
                    </div>

                    <div className={styles.modal_item}>
                        <span className={styles.modal_label}>الحالة</span>
                        <span className={styles.modal_value}>{transaction.status}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionModalInv;
