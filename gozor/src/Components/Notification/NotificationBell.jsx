import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSignalR } from "../../contexts/SignalRContext";
import api from "../../API/axiosInstance";
import "./NotificationBell.css";

const NotificationBell = ({ token }) => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [animatedId, setAnimatedId] = useState(null);
  const bellRef = useRef(null);

  const { connection, startConnection, isConnected } = useSignalR();

  const playNotificationSound = useCallback(() => {
    const audio = new Audio("/sounds/notification.mp3");
    audio.play().catch(e => console.error("Error playing sound:", e));
  }, []);

  const handleNewNotification = useCallback((notification) => {
    setNotifications(prev => [{ ...notification, isRead: false }, ...prev]);
    setAnimatedId(notification.notificationId);
    playNotificationSound();
    setTimeout(() => setAnimatedId(null), 3000);
  }, [playNotificationSound]);

  // تحميل الإشعارات الأولية
  useEffect(() => {
    api.get("Notification")
      .then(res => setNotifications(res.data.reverse()))
      .catch(err => console.error("Error fetching notifications:", err));
  }, []);

  // بدء الاتصال عند توفر التوكن وعدم وجود اتصال
  useEffect(() => {
    if (token && !isConnected) {
      startConnection(token);
    }
  }, [token, isConnected, startConnection]);

  // تسجيل مستمع الإشعارات (ReceiveNotification)
  useEffect(() => {
    if (!connection) return;

    connection.on("ReceiveNotification", handleNewNotification);
    return () => {
      connection.off("ReceiveNotification", handleNewNotification);
    };
  }, [connection, handleNewNotification]);

  // استقبال الرسائل الجديدة وتحديث التنبيهات مباشرة
  useEffect(() => {
    if (!connection) return;

    const handleReceiveMessage = (message) => {
      console.log("Received message:", message);

      setNotifications(prev => [
        {
          notificationId: `msg-${message.chatId}-${Date.now()}`, // معرف فريد مؤقت
          type: "Chat",
          content: message.messageContent,
          isRead: false,
        },
        ...prev
      ]);
      playNotificationSound();
      setAnimatedId(`msg-${message.chatId}-${Date.now()}`);
      setTimeout(() => setAnimatedId(null), 3000);
    };

    connection.on("receivemessage", handleReceiveMessage);

    return () => {
      connection.off("receivemessage", handleReceiveMessage);
    };
  }, [connection, playNotificationSound]);

  // إغلاق قائمة الإشعارات عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (id) => {
    setNotifications(prev => prev.map(n => n.notificationId === id ? { ...n, isRead: true } : n));
    try {
      await api.patch(`/Notification/${id}/mark-as-read`);
    } catch (err) {
      console.error("Failed to mark notification as read", err);
      setNotifications(prev => prev.map(n => n.notificationId === id ? { ...n, isRead: false } : n));
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.isRead).map(n => n.notificationId);
    if (unreadIds.length === 0) return;
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    try {
      await Promise.all(unreadIds.map(id => api.patch(`/Notification/${id}/mark-as-read`)));
    } catch (err) {
      console.error("Failed to mark all as read", err);
      setNotifications(prev => prev.map(n => unreadIds.includes(n.notificationId) ? { ...n, isRead: false } : n));
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const visibleNotifications = showAll ? notifications : notifications.slice(0, 5);

  return (
    <div className="notification-wrapper" ref={bellRef}>
      <img
        src="/assets/notifications.png"
        alt="Notifications"
        style={{ width: "30px", cursor: "pointer" }}
        onClick={() => setOpen(!open)}
      />
      {unreadCount > 0 && (
        <span className="notification-count">{unreadCount}</span>
      )}
      {open && (
        <div className="notification-box">
          <div className="notification-header">
            <span>🔔 التنبيهات</span>
            {unreadCount > 0 && (
              <a href="#!" onClick={markAllAsRead} className="mark-all-read-link">
                تمييز الكل كمقروء
              </a>
            )}
          </div>

          <div className="notification-list">
            {notifications.length > 0 ? (
              visibleNotifications.map((n) => (
                <div
                  key={n.notificationId}
                  className={`notification-item ${animatedId === n.notificationId ? "new-notification" : ""} ${n.isRead ? "read" : "unread"}`}
                >
                  <span className="notification-icon">
                    {n.type === "Chat" ? "💬" : n.type === "Cycle" ? "🔄" : "🔔"}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div className="notification-title">{n.type}</div>
                    <div className="notification-desc">{n.content}</div>
                  </div>
                  {!n.isRead && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(n.notificationId);
                      }}
                      className="mark-as-read-btn"
                      title="تمييز كمقروء"
                    >
                    <img src="/assets/check-mark.png" alt="mark"  />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="notification-item" style={{ justifyContent: "center" }}>
                لا توجد تنبيهات
              </div>
            )}
          </div>

          {notifications.length > 5 && (
            <div className="notification-footer" onClick={() => setShowAll(!showAll)}>
              {showAll ? "عرض أقل" : "عرض كل التنبيهات"}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
