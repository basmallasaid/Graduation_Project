import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../../Styles/style.module.css';
import api from '../../API/axiosInstance';
import { useSignalR } from '../../contexts/SignalRContext'; // تأكد من صحة هذا المسار

// --- استيراد مكونات المزارع ---
// import FooterF from '../FarmerDashboard/Main/FooterF';
// import NavSideF from '../FarmerDashboard/Main/NavSideF';
// import NavbarF from '../FarmerDashboard/Main/NavbarF';

// --- استيراد مكونات التاجر والمستثمر (عدّل المسارات حسب مشروعك) ---
// import NavbarMer from '../MerchantDashboard/Main/NavbarMer'; 
// import NavSideMer from '../MerchantDashboard/Main/NavSideMer'; 
// import FooterMer from '../MerchantDashboard/Main/FooterMer'; 

import NavbarInv from '../InvestorDashboard/Main/NavbarInv'; 
import NavSideInv from '../InvestorDashboard/Main/NavSideInv'; 
import FooterInv from '../InvestorDashboard/Main/FooterInv';
import NavbarMer from '../merchantDashboard/Main/NavbarMer';
import NavSideMer from '../merchantDashboard/Main/NavSideMer';
import NavSideF from '../FarmerDashboard/Main/NavSideF';
import FooterMer from '../merchantDashboard/Main/FooterMer';
import FooterF from '../FarmerDashboard/Main/FooterF';
import NavbarF from '../FarmerDashboard/Main/NavbarF';

// --- دوال مساعد لعرض المكونات حسب دور المستخدم ---

const RenderNavbarByRole = ({ role }) => {
  switch (role) {
    case 'Merchant':
      return <NavbarMer />;
    case 'Investor':
      return <NavbarInv />;
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


// --- Helper Function for Date Formatting ---
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffSeconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const diffMinutes = Math.round(diffSeconds / 60);
  const diffHours = Math.round(diffMinutes / 60);
  const diffDays = Math.round(diffHours / 24);

  if (diffSeconds < 60) return 'الآن';
  if (diffMinutes < 60) return `${diffMinutes} دقيقة`;
  if (diffHours < 24) return `${diffHours} ساعة`;
  if (diffDays === 1) return 'أمس';
  if (diffDays < 7) return `${diffDays} أيام`;
  return date.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' });
};

// --- Basic JWT Payload Decoder ---
const decodeJwtPayload = (token) => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode JWT or parse payload:", error);
    return null;
  }
};

const IMAGE_BASE_URL = 'https://cityroots.runasp.net/';
const DEFAULT_AVATAR = '/assets/users.png';

function ChatInterface() {
  const [contacts, setContacts] = useState([]);
  const [allConversations, setAllConversations] = useState({});
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const [contactsError, setContactsError] = useState(null);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [sendingError, setSendingError] = useState(null);

  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);

  const [authToken, setAuthToken] = useState(null);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [loggedInUserAvatar, setLoggedInUserAvatar] = useState(DEFAULT_AVATAR);
  const [userRole, setUserRole] = useState(null); // حالة جديدة لتخزين دور المستخدم

  const { connection, isConnected } = useSignalR();
  const storedUserData = localStorage.getItem("user_data");

  const location = useLocation();
  const navigate = useNavigate();
  const initialFarmerToChatWithRef = useRef(location.state?.farmerToChatWith);


  useEffect(() => {
    if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);
        const token = parsedUserData?.token;
        const role = parsedUserData?.role; // استخراج الدور

        if (role) {
          setUserRole(role);
        } else {
          console.warn("User role not found in user_data, defaulting to 'Farmer'.");
          setUserRole('Farmer'); // تعيين دور افتراضي
        }

        if (token) {
          setAuthToken(token);
          const decodedPayload = decodeJwtPayload(token);
          const userIdClaim = decodedPayload?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
          if (userIdClaim) {
            setLoggedInUserId(userIdClaim);
            setLoggedInUserAvatar(parsedUserData.avatarUrl || DEFAULT_AVATAR);
          } else {
            console.error("User ID claim not found in token payload.");
            setContactsError("فشل في تحديد المستخدم الحالي من التوكن.");
          }
        } else {
          setContactsError("التوكن غير موجود. يرجى تسجيل الدخول.");
        }
      } catch (e) {
        console.error("Failed to parse user data or decode token:", e);
        setContactsError("خطأ في معالجة بيانات المستخدم. حاول تسجيل الخروج ثم الدخول مرة أخرى.");
      }
    } else {
      setContactsError("أنت غير مسجل الدخول. يرجى تسجيل الدخول مرة أخرى.");
    }
  }, [storedUserData]);


  useEffect(() => {
    if (!authToken || !loggedInUserId) {
      setIsLoadingContacts(false);
      return;
    }
    const fetchContactsList = async () => {
      setIsLoadingContacts(true);
      setContactsError(null);
      try {
        const response = await api.get('Chat/users', {
          headers: { 'Authorization': `Bearer ${authToken}` },
        });
        if (!Array.isArray(response.data)) {
          throw new Error("تنسيق بيانات قائمة المحادثات غير صالح.");
        }
        const fetchedContacts = response.data
          .map(contact => ({
            id: contact.userId,
            name: contact.userName || 'مستخدم',
            avatar: contact.userImageUrl ? `${IMAGE_BASE_URL}${contact.userImageUrl}` : DEFAULT_AVATAR,
            preview: contact.lastMessage || '',
            time: contact.dateTimeOfLastMessage ? formatDate(contact.dateTimeOfLastMessage) : '',
            unreadMessages: contact.unreadMessages || 0,
            status: contact.isOnline ? 'متصل' : 'غير متصل',
            isOnline: contact.isOnline,
            _originalTimestamp: contact.dateTimeOfLastMessage,
          }))
          .sort((a, b) => {
            if (!a._originalTimestamp && !b._originalTimestamp) return 0;
            if (!a._originalTimestamp) return 1;
            if (!b._originalTimestamp) return -1;
            return new Date(b._originalTimestamp) - new Date(a._originalTimestamp);
          });
        setContacts(fetchedContacts);
      } catch (e) {
        console.error("Failed to fetch contacts list:", e);
        let msg = "فشل في تحميل قائمة المحادثات.";
        if (e.response?.status === 401) msg = "غير مصرح به لجلب المحادثات.";
        else if (e.message?.includes("تنسيق بيانات")) msg = e.message;
        setContactsError(msg);
        setContacts([]);
      } finally {
        setIsLoadingContacts(false);
      }
    };
    fetchContactsList();
  }, [authToken, loggedInUserId]);


  const handleContactClick = useCallback(async (contactId) => {
    if (selectedContactId === contactId && !(contacts.find(c => c.id === contactId)?.unreadMessages > 0)) {
      return;
    }

    setSelectedContactId(contactId);
    setMessagesError(null);
    setSendingError(null);

    const clickedContact = contacts.find(c => c.id === contactId);
    if (clickedContact && clickedContact.unreadMessages > 0) {
      setContacts(prevContacts =>
        prevContacts.map(contact =>
          contact.id === contactId ? { ...contact, unreadMessages: 0 } : contact
        )
      );
      try {
        if (!authToken) {
          console.error("Cannot mark messages as read: auth token not available.");
          return;
        }
        await api.post(`Chat/mark-as-read/${contactId}`, {}, {
          headers: { 'Authorization': `Bearer ${authToken}` },
        });
      } catch (error) {
        console.error(`Failed to mark messages as read for ${contactId}:`, error);
      }
    }
  }, [selectedContactId, contacts, authToken]);

  useEffect(() => {
    const farmerDataFromState = initialFarmerToChatWithRef.current;

    if (!farmerDataFromState || !authToken || !loggedInUserId || isLoadingContacts) {
      return;
    }

    const { userId: farmerId, name: farmerName, imageUrl: farmerPhoto } = farmerDataFromState;
    const contactExistsInList = contacts.find(c => c.id === farmerId);

    if (!contactExistsInList) {
      const newContactData = {
        id: farmerId,
        name: farmerName || "مستخدم جديد",
        avatar: farmerPhoto ? `${IMAGE_BASE_URL}${farmerPhoto}` : DEFAULT_AVATAR,
        preview: "ابدأ محادثة جديدة...",
        time: formatDate(new Date().toISOString()),
        unreadMessages: 0,
        status: "متصل",
        isOnline: true,
        _originalTimestamp: new Date().toISOString(),
      };

      setContacts(prevContacts => {
        if (prevContacts.some(c => c.id === farmerId)) {
          return prevContacts;
        }
        const updatedContacts = [newContactData, ...prevContacts];
        return updatedContacts.sort((a, b) => new Date(b._originalTimestamp) - new Date(a._originalTimestamp));
      });
    }
  }, [authToken, loggedInUserId, isLoadingContacts, contacts]);


  useEffect(() => {
    const farmerDataFromState = initialFarmerToChatWithRef.current;

    if (!farmerDataFromState || !authToken || !loggedInUserId || isLoadingContacts) {
      return;
    }

    const { userId: farmerIdToSelect } = farmerDataFromState;
    const contactIsNowInList = contacts.find(c => c.id === farmerIdToSelect);

    if (contactIsNowInList) {
      if (selectedContactId !== farmerIdToSelect) {
        handleContactClick(farmerIdToSelect);
      }
      if (initialFarmerToChatWithRef.current) {
        initialFarmerToChatWithRef.current = null;
        navigate(location.pathname, { replace: true, state: { ...location.state, farmerToChatWith: null } });
      }
    }
  }, [contacts, selectedContactId, authToken, loggedInUserId, isLoadingContacts, handleContactClick, navigate, location]);

  useEffect(() => {
    if (!connection || !isConnected || !loggedInUserId) {
      return;
    }

    const receiveMessageHandler = (messagePayload) => {
      if (!messagePayload || typeof messagePayload !== 'object') {
        return;
      }
      const { chatId, senderId, receiverId, messageContent, timestamp } = messagePayload;
      if (!senderId || !messageContent || !timestamp || !receiverId) {
        return;
      }

      const contactIdForUpdate = senderId === loggedInUserId ? receiverId : senderId;
      const uiSenderType = senderId === loggedInUserId ? "me" : "other";

      let resolvedSenderAvatar;
      if (uiSenderType === "me") {
        resolvedSenderAvatar = loggedInUserAvatar;
      } else {
        const contactInfo = contacts.find(c => c.id === senderId);
        resolvedSenderAvatar = contactInfo?.avatar || DEFAULT_AVATAR;
      }

      const formattedMessage = {
        id: chatId || `signalr-${Date.now()}`,
        sender: uiSenderType,
        text: messageContent,
        timestamp,
        avatar: resolvedSenderAvatar,
      };

      setAllConversations(prev => ({
        ...prev,
        [contactIdForUpdate]: [...(prev[contactIdForUpdate] || []), formattedMessage],
      }));

      setContacts(prevContacts => {
        let updatedContact = null;
        let contactExists = false;
        const otherContacts = prevContacts.filter(c => {
          if (c.id === contactIdForUpdate) {
            contactExists = true;
            updatedContact = {
              ...c,
              preview: messageContent,
              time: formatDate(timestamp),
              unreadMessages: (selectedContactId === contactIdForUpdate || uiSenderType === "me") ? 0 : (c.unreadMessages || 0) + 1,
              _originalTimestamp: timestamp,
            };
            return false;
          }
          return true;
        });

        if (!contactExists && uiSenderType === "other") {
          updatedContact = {
            id: senderId,
            name: `المستخدم ${senderId.substring(0, 8)}...`,
            avatar: DEFAULT_AVATAR,
            preview: messageContent,
            time: formatDate(timestamp),
            unreadMessages: (selectedContactId === senderId) ? 0 : 1,
            status: 'متصل',
            isOnline: true,
            _originalTimestamp: timestamp,
          };
        }

        const newContactsList = updatedContact ? [updatedContact, ...otherContacts] : [...prevContacts];
        return newContactsList.sort((a, b) => {
          const tsA = a._originalTimestamp ? new Date(a._originalTimestamp).getTime() : 0;
          const tsB = b._originalTimestamp ? new Date(b._originalTimestamp).getTime() : 0;
          return tsB - tsA;
        });
      });
    };

    const userStatusChangedHandler = (userId, isOnline) => {
      if (userId && typeof isOnline === 'boolean') {
        setContacts(prevContacts =>
          prevContacts.map(contact =>
            contact.id === userId ? { ...contact, status: isOnline ? 'متصل' : 'غير متصل', isOnline } : contact
          )
        );
      }
    };

    connection.on("ReceiveMessage", receiveMessageHandler);
    connection.on("userstatuschanged", userStatusChangedHandler);

    return () => {
      if (connection) {
        connection.off("ReceiveMessage", receiveMessageHandler);
        connection.off("userstatuschanged", userStatusChangedHandler);
      }
    };
  }, [connection, isConnected, loggedInUserId, loggedInUserAvatar, selectedContactId, contacts]);


  useEffect(() => {
    if (!selectedContactId || !authToken || !loggedInUserId) {
      return;
    }

    const fetchMessages = async () => {
      setIsMessagesLoading(true);
      setMessagesError(null);
      let msg = null;
      try {
        const response = await api.get(`Chat/messages/${selectedContactId}`, {
          headers: { 'Authorization': `Bearer ${authToken}` },
        });
        const messagesData = response.data;
        if (!Array.isArray(messagesData)) throw new Error("Invalid data format for messages.");

        const contactForAvatar = contacts.find(c => c.id === selectedContactId);

        const formattedMessages = messagesData.map(m => ({
          id: m.chatId,
          sender: m.senderId === loggedInUserId ? 'me' : 'other',
          text: m.messageContent,
          avatar: m.senderId === loggedInUserId
            ? loggedInUserAvatar
            : contactForAvatar?.avatar || DEFAULT_AVATAR,
          timestamp: m.timestamp,
        })).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        setAllConversations(prevConvos => ({
          ...prevConvos,
          [selectedContactId]: formattedMessages,
        }));

      } catch (e) {
        msg = "فشل في تحميل الرسائل لهذه المحادثة.";
        if (e.response?.status === 401) msg = "غير مصرح به لجلب الرسائل.";
        else if (e.response?.status === 404) {
          msg = null;
          setAllConversations(prevConvos => ({
            ...prevConvos,
            [selectedContactId]: [],
          }));
        }
        setMessagesError(msg);
      } finally {
        setIsMessagesLoading(false);
      }
    };
    fetchMessages();
  }, [selectedContactId, authToken, loggedInUserId, contacts, loggedInUserAvatar]);


  useLayoutEffect(() => {
    if (selectedContactId && messagesEndRef.current) {
      const messagesForSelectedContact = allConversations[selectedContactId];
      if (messagesForSelectedContact?.length) {
        messagesEndRef.current.scrollIntoView({
          behavior: "auto",
          block: "end"
        });
      }
    }
  }, [allConversations, selectedContactId]);


  const handleSendMessage = async () => {
    const currentActiveContact = contacts.find(c => c.id === selectedContactId);
    if (!newMessage.trim() || !currentActiveContact || !authToken || isSendingMessage || !loggedInUserId) {
      return;
    }

    setIsSendingMessage(true);
    setSendingError(null);
    const messageText = newMessage.trim();
    const tempMessageId = `msg-me-${Date.now()}`;

    const messageToSendForUI = {
      id: tempMessageId,
      sender: 'me',
      text: messageText,
      avatar: loggedInUserAvatar,
      timestamp: new Date().toISOString(),
    };

    setAllConversations(prev => ({
      ...prev,
      [currentActiveContact.id]: [...(prev[currentActiveContact.id] || []), messageToSendForUI],
    }));

    const previousContactPreview = currentActiveContact.preview;
    const previousContactTime = currentActiveContact.time;
    const previousContactTimestamp = currentActiveContact._originalTimestamp;

    setContacts(prevContacts => {
      let updatedContact = null;
      const otherContacts = prevContacts.filter(c => {
        if (c.id === currentActiveContact.id) {
          updatedContact = {
            ...c,
            preview: messageText,
            time: 'الآن',
            _originalTimestamp: new Date().toISOString(),
          };
          return false;
        }
        return true;
      });
      const newContactsList = updatedContact ? [updatedContact, ...otherContacts] : prevContacts;
      return newContactsList.sort((a, b) => {
        const tsA = a._originalTimestamp ? new Date(a._originalTimestamp).getTime() : 0;
        const tsB = b._originalTimestamp ? new Date(b._originalTimestamp).getTime() : 0;
        return tsB - tsA;
      });
    });
    setNewMessage('');

    try {
      const response = await api.post("Chat/send", {
        receiverId: currentActiveContact.id,
        message: messageText,
      }, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data && (response.data.chatId || response.data.id || response.data.messageId)) {
        const savedMessage = response.data;
        setAllConversations(prev => ({
          ...prev,
          [currentActiveContact.id]: (prev[currentActiveContact.id] || []).map(msg =>
            msg.id === tempMessageId
              ? {
                ...msg,
                id: savedMessage.chatId || savedMessage.id || savedMessage.messageId,
                timestamp: savedMessage.timestamp || new Date().toISOString(),
              }
              : msg
          ),
        }));
      }
    } catch (e) {
      let userErrorMessage = "فشل إرسال الرسالة. حاول مرة أخرى.";
      if (e.response) {
        userErrorMessage = e.response.status === 401
          ? "فشل إرسال الرسالة: غير مصرح به."
          : `فشل إرسال الرسالة: خطأ (${e.response.status} ${e.response.data?.message || e.response.data?.title || ''}).`;
      }
      setSendingError(userErrorMessage);

      setAllConversations(prev => ({
        ...prev,
        [currentActiveContact.id]: (prev[currentActiveContact.id] || []).filter(msg => msg.id !== tempMessageId)
      }));
      setContacts(prevContacts => {
        let revertedContact = null;
        const otherContacts = prevContacts.filter(c => {
          if (c.id === currentActiveContact.id) {
            revertedContact = {
              ...c,
              preview: previousContactPreview,
              time: previousContactTime,
              _originalTimestamp: previousContactTimestamp,
            };
            return false;
          }
          return true;
        });
        const revertedContactsList = revertedContact ? [revertedContact, ...otherContacts] : prevContacts;
        return revertedContactsList.sort((a, b) => {
          const tsA = a._originalTimestamp ? new Date(a._originalTimestamp).getTime() : 0;
          const tsB = b._originalTimestamp ? new Date(b._originalTimestamp).getTime() : 0;
          return tsB - tsA;
        });
      });
      setNewMessage(messageText);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const activeContact = contacts.find(c => c.id === selectedContactId);
  const currentMessages = activeContact ? allConversations[activeContact.id] || [] : [];

  if (!authToken && !contactsError && !storedUserData) {
    return <div className="container-fluid d-flex justify-content-center align-items-center vh-100">جاري تهيئة بيانات المستخدم...</div>;
  }
  if (contactsError && !loggedInUserId) {
    return (
      <div className="container-fluid d-flex justify-content-center align-items-center vh-100 text-danger p-3 text-center">
        {contactsError} يرجى محاولة <a href="/login">تسجيل الدخول</a> مرة أخرى.
      </div>
    );
  }
  if (!loggedInUserId && !isLoadingContacts && !contactsError) {
    return (
      <div className="container-fluid d-flex justify-content-center align-items-center vh-100 text-warning p-3 text-center">
        بيانات المستخدم غير متوفرة. قد تحتاج إلى <a href="/login">تسجيل الدخول</a>.
      </div>
    );
  }
  if (isLoadingContacts && loggedInUserId && contacts.length === 0 && !initialFarmerToChatWithRef.current) {
    return <div className="container-fluid d-flex justify-content-center align-items-center vh-100">جاري تحميل قائمة المحادثات...</div>;
  }
  if (contactsError && loggedInUserId) {
    return <div className="container-fluid d-flex justify-content-center align-items-center vh-100 text-danger p-3 text-center">{contactsError}</div>;
  }
  if (contacts.length === 0 && !isLoadingContacts && loggedInUserId && !initialFarmerToChatWithRef.current && !activeContact) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <RenderNavbarByRole role={userRole} />
        <div className="d-flex flex-grow-1">
          <RenderNavSideByRole role={userRole} />
          <main className="flex-grow-1 d-flex justify-content-center align-items-center">
             <div className="text-center text-muted">لا توجد محادثات لعرضها.</div>
          </main>
        </div>
        <RenderFooterByRole role={userRole} />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <RenderNavbarByRole role={userRole} />
      <div className="d-flex flex-grow-1">
        <RenderNavSideByRole role={userRole} />
        <main className="flex-grow-1">
          <div className={`container-fluid ${styles.chatContainer}`} dir="rtl">
            <div className="row h-100">
              <div className={`col-md-4 p-0 order-2 order-md-1 ${styles.contactListContainer}`}>
                <div className={`d-flex justify-content-between align-items-center ${styles.contactListHeader}`}>
                  <h5 className="mb-0 fw-bold" style={{ fontSize: "2rem" }}>الرسائل</h5>
                  <div><span className={`badge bg-success rounded-pill me-2 ${styles.messageCountBadge}`}>{contacts.length}</span></div>
                </div>
                <div className={styles.contactsScrollable}>
                  {isLoadingContacts && contacts.length === 0 && (
                    <div className="p-3 text-center text-muted">جاري تحميل المحادثات...</div>
                  )}
                  {contacts.map(contact => (
                    <div
                      key={contact.id}
                      onClick={() => handleContactClick(contact.id)}
                      className={`d-flex align-items-center ${styles.contactItem} ${contact.id === selectedContactId ? styles.activeContact : ''}`}
                    >
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        className={`rounded-circle me-3 ${styles.contactAvatar}`}
                        onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_AVATAR; }}
                      />
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between">
                          <span className={styles.contactName}>{contact.name}</span>
                          <div className="d-flex align-items-center">
                            {contact.unreadMessages > 0 && <span className={`badge bg-primary rounded-pill me-2 ${styles.unreadBadge}`}>{contact.unreadMessages}</span>}
                            <small className={styles.contactTime}>{contact.time}</small>
                          </div>
                        </div>
                        <p className={`mb-0 text-muted ${styles.contactPreview}`}>{contact.preview}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`col-md-8 p-0 order-1 order-md-2 ${styles.chatWindow}`}>
                {activeContact ? (
                  <>
                    <div className={`d-flex align-items-center ${styles.chatHeader}`}>
                      <img
                        src={activeContact.avatar}
                        alt={activeContact.name}
                        className={`rounded-circle me-3 ${styles.chatHeaderAvatar}`}
                        onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_AVATAR; }}
                      />
                      <div>
                        <h6 className="mb-0">{activeContact.name}</h6>
                        <small className="text-muted d-flex align-items-center">
                          {activeContact.status}
                          {activeContact.isOnline && <span className={styles.statusDot}></span>}
                        </small>
                      </div>
                    </div>
                    <div className={styles.chatMessages}>
                      {isMessagesLoading && (
                        <div className="d-flex justify-content-center align-items-center h-100 text-muted">جاري تحميل الرسائل...</div>
                      )}
                      {messagesError && !isMessagesLoading && (
                        <div className="d-flex justify-content-center align-items-center h-100 text-danger p-3 text-center">{messagesError}</div>
                      )}
                      {!isMessagesLoading && !messagesError && currentMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`d-flex mb-3 ${styles.messageContainer} ${msg.sender === 'me' ? styles.sent : styles.received}`}
                        >
                          {msg.sender === 'other' && (
                            <img
                              src={msg.avatar}
                              alt="Avatar"
                              className={`rounded-circle ${styles.chatAvatar}`}
                              onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_AVATAR; }}
                            />
                          )}
                          <div className={`p-2 px-3 ${styles.messageBubble} ${msg.sender === 'me' ? styles.sentBubble : styles.receivedBubble}`}>
                            {msg.text}
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                    {sendingError && <div className="p-2 text-center text-danger small">{sendingError}</div>}
                    <div className={`d-flex align-items-center ${styles.chatInputArea}`}>
                      <input
                        type="text"
                        className={`form-control mx-2 ${styles.chatInput}`}
                        placeholder="اكتب رسالة ...."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isSendingMessage || isMessagesLoading || !activeContact || !isConnected}
                      />
                      <button
                        className={styles.sendButton}
                        onClick={handleSendMessage}
                        disabled={isSendingMessage || isMessagesLoading || !activeContact || !newMessage.trim() || !isConnected}
                      >
                        {isSendingMessage ? '...' : <span style={{ transform: 'rotate(180deg)', display: 'inline-block' }}>➤</span>}
                      </button>
                    </div>
                  </>
                ) : (
                  loggedInUserId && (contacts.length > 0 || initialFarmerToChatWithRef.current) && !isLoadingContacts && (
                    <div className={`d-flex justify-content-center align-items-center h-100 ${styles.noChatSelected}`}>
                      <p className="text-muted">
                        {initialFarmerToChatWithRef.current && (isLoadingContacts || isMessagesLoading) ? "جاري تجهيز المحادثة..." : "حدد محادثة لبدء الدردشة"}
                      </p>
                    </div>
                  )
                )}
                {!activeContact && !isLoadingContacts && (!loggedInUserId || (contacts.length === 0 && !initialFarmerToChatWithRef.current)) && !contactsError && (
                  <div className={`d-flex justify-content-center align-items-center h-100 ${styles.noChatSelected}`}>
                    {/* This space can be intentionally blank */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      <RenderFooterByRole role={userRole} />
    </div>
  );
}

export default ChatInterface;