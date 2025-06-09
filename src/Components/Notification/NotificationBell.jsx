import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSignalR } from "../../contexts/SignalRContext";
import api from "../../API/axiosInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
    audio.play().catch((e) => console.error("Error playing sound:", e));
  }, []);

  const showToast = useCallback((type, content, toastId) => {
    toast.info(`🔔 ${type}: ${content}`, {
      toastId,
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  }, []);

  const handleNewNotification = useCallback((notification) => {
    setNotifications((prev) => [{ ...notification, isRead: false }, ...prev]);
    setAnimatedId(notification.notificationId);
    playNotificationSound();
    showToast(notification.type, notification.content, notification.notificationId);
    setTimeout(() => setAnimatedId(null), 3000);
  }, [playNotificationSound, showToast]);

  useEffect(() => {
    api
      .get("Notification")
      .then((res) => setNotifications(res.data.reverse()))
      .catch((err) => console.error("Error fetching notifications:", err));
  }, []);

  useEffect(() => {
    if (token && !isConnected) {
      startConnection(token);
    }
  }, [token, isConnected, startConnection]);

  useEffect(() => {
    if (!connection) return;

    connection.on("ReceiveNotification", handleNewNotification);
    return () => {
      connection.off("ReceiveNotification", handleNewNotification);
    };
  }, [connection, handleNewNotification]);

  useEffect(() => {
    if (!connection) return;

    const userData = JSON.parse(localStorage.getItem("user_data"));
    const userId = userData?.userId;

    const handleReceiveMessage = (message) => {
      if (message.senderId !== userId) {
        const uniqueId = `msg-${message.chatId}-${Date.now()}`;
        // setNotifications((prev) => [
        //   {
        //     notificationId: uniqueId,
        //     type: "محادثات",
        //     content: message.messageContent,
        //     isRead: false,
        //   },
        //   ...prev,
        // ]);
        playNotificationSound();
        showToast("محادثة جديدة", message.messageContent, uniqueId);
        setAnimatedId(uniqueId);
        setTimeout(() => setAnimatedId(null), 3000);
      }
    };

    connection.on("receivemessage", handleReceiveMessage);
    return () => {
      connection.off("receivemessage", handleReceiveMessage);
    };
  }, [connection, playNotificationSound, showToast]);

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
    setNotifications((prev) =>
      prev.map((n) => (n.notificationId === id ? { ...n, isRead: true } : n))
    );
    try {
      await api.patch(`/Notification/${id}/mark-as-read`);
    } catch (err) {
      console.error("Failed to mark notification as read", err);
      setNotifications((prev) =>
        prev.map((n) => (n.notificationId === id ? { ...n, isRead: false } : n))
      );
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.notificationId);
    if (unreadIds.length === 0) return;

    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

    try {
      await Promise.all(
        unreadIds.map((id) => api.patch(`/Notification/${id}/mark-as-read`))
      );
    } catch (err) {
      console.error("Failed to mark all as read", err);
      setNotifications((prev) =>
        prev.map((n) =>
          unreadIds.includes(n.notificationId) ? { ...n, isRead: false } : n
        )
      );
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
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
                    {n.type === "المحادثات" ? <img src="/assets/chats.png" alt="chats" />
                      : n.type === "الدوره الزراعيه" || n.type === "تحديث الدورة الزراعية" ? <img src="/assets/plant.png" alt="plant" />
                      : n.type === "المهام" || n.type === "التقييم" ? <img src="/assets/task.png" alt="task" />
                      : n.type === "طلب شراء" || n.type === "طلب استثمار" ? <img src="/assets/manifest.png" alt="manifest" />
                      : n.type === "حصاد" ? <img src="/assets/sickle.jpg" alt="sickle" />
                      : n.type === "مزارع مفضل" ? <img src="/assets/favourite.png" alt="favourite" />
                      : "🔔"}
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
                      <img src="/assets/check-mark.png" alt="mark" />
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
