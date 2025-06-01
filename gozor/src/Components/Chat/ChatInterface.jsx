import React, { useState, useRef, useEffect } from 'react';
// import { jwtDecode } from 'jwt-decode'; // Recommended for production
import styles from '../../Styles/style.module.css';
import api from '../../API/axiosInstance';
import * as signalR from "@microsoft/signalr";


// --- Helper Function for Date Formatting (same as before) ---
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

// --- Basic JWT Payload Decoder (for demonstration, use jwt-decode in production) ---
const decodeJwtPayload = (token) => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode JWT or parse payload:", error);
    return null;
  }
};


const IMAGE_BASE_URL = 'https://cityroots.runasp.net/';
const DEFAULT_AVATAR = 'assets/default-avatar.png'; // Make sure this path is correct relative to your public folder

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
const signalRConnectionRef = useRef(null);

  const storedUserData = localStorage.getItem("user_data");

  // Effect to initialize token and loggedInUserId from localStorage
  useEffect(() => {
    if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);
        const token = parsedUserData?.token;
        if (token) {
          setAuthToken(token);
          const decodedPayload = decodeJwtPayload(token);
          const userIdClaim = decodedPayload?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
          if (userIdClaim) {
            setLoggedInUserId(userIdClaim);
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

  // --- Fetch Contacts (Conversations List) ---
 useEffect(() => {
  if (!authToken || !loggedInUserId) return;

  const connectToSignalR = async () => {
    try {
      const connection = new signalR.HubConnectionBuilder()
        .withUrl("https://cityroots.runasp.net/chathub", {
          accessTokenFactory: () => authToken
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();

      connection.on("ReceiveMessage", (message) => {
        const {
          chatId,
          senderId,
          messageContent,
          timestamp
        } = message;

        const sender = senderId === loggedInUserId ? "me" : "other";

        const formattedMessage = {
          id: chatId || `signalr-${Date.now()}`,
          sender,
          text: messageContent,
          timestamp,
          avatar: sender === "me" ? DEFAULT_AVATAR : (contacts.find(c => c.id === senderId)?.avatar || DEFAULT_AVATAR),
        };

        const contactId = sender === "me" ? message.receiverId : senderId;

        setAllConversations(prev => ({
          ...prev,
          [contactId]: [...(prev[contactId] || []), formattedMessage],
        }));

        // Update contact preview and time if not the current active chat
        setContacts(prev =>
          prev.map(c =>
            c.id === contactId
              ? {
                  ...c,
                  preview: messageContent,
                  time: "الآن",
                  unreadMessages: selectedContactId === contactId ? 0 : (c.unreadMessages || 0) + 1,
                }
              : c
          )
        );
      });

      await connection.start();
      console.log("SignalR connected.");

      signalRConnectionRef.current = connection;
    } catch (err) {
      console.error("SignalR connection failed:", err);
    }
  };

  connectToSignalR();

  return () => {
    signalRConnectionRef.current?.stop();
  };
}, [authToken, loggedInUserId]);


  // --- Fetch Messages for Selected Contact ---
  useEffect(() => {
    if (!selectedContactId || !authToken || !loggedInUserId) {
      return;
    }

    const fetchMessages = async () => {
      setIsMessagesLoading(true);
      setMessagesError(null);
      try {
        const response = await api.get(`Chat/messages/${selectedContactId}`, {
          headers: { 'Authorization': `Bearer ${authToken}` },
        });
        const messagesData = response.data;
        if (!Array.isArray(messagesData)) throw new Error("Invalid data format for messages.");

        const contactForAvatar = contacts.find(c => c.id === selectedContactId);

        const formattedMessages = messagesData.map(msg => ({
          // --- CORRECTED HERE ---
          id: msg.chatId || `msg-api-${Math.random()}`, // Use chatId from API
          sender: msg.senderId === loggedInUserId ? 'me' : 'other',
          text: msg.messageContent, // Use messageContent from API
          // --- END CORRECTION ---
          avatar: msg.senderId === loggedInUserId
            ? DEFAULT_AVATAR // Consider using loggedInUser's avatar if available
            : contactForAvatar?.avatar || DEFAULT_AVATAR,
          timestamp: msg.timestamp, // Store the original timestamp
        })).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)); // Sort by timestamp

        setAllConversations(prevConvos => ({
          ...prevConvos,
          [selectedContactId]: formattedMessages,
        }));

      } catch (e) {
        console.error(`Failed to fetch messages for ${selectedContactId}:`, e);
        if (e.response?.status === 401) setMessagesError("غير مصرح به لجلب الرسائل.");
        else setMessagesError(e.message || "فشل في تحميل الرسائل لهذه المحادثة.");
      } finally {
        setIsMessagesLoading(false);
      }
    };

    fetchMessages();
  }, [selectedContactId, authToken, loggedInUserId, contacts]);

  const activeContact = contacts.find(c => c.id === selectedContactId);
  const currentMessages = activeContact ? allConversations[activeContact.id] || [] : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  const handleContactClick = (contactId) => {
    if (selectedContactId === contactId) return;
    setSelectedContactId(contactId);
    setMessagesError(null);
    setSendingError(null);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeContact || !authToken || isSendingMessage) return;

    setIsSendingMessage(true);
    setSendingError(null);

    const messageText = newMessage.trim();
    const tempMessageId = `msg-me-${Date.now()}`;

    // Optimistic UI update
    const messageToSendForUI = {
      id: tempMessageId,
      sender: 'me',
      text: messageText,
      avatar: DEFAULT_AVATAR, // Consider using loggedInUser's avatar
      timestamp: new Date().toISOString(), // Add a temporary timestamp
    };

    const previousContactPreview = activeContact.preview;
    const previousContactTime = activeContact.time;

    setAllConversations(prev => ({
      ...prev,
      [activeContact.id]: [...(prev[activeContact.id] || []), messageToSendForUI],
    }));
    setContacts(prev => prev.map(c =>
      c.id === activeContact.id ? { ...c, preview: messageText, time: 'الآن' } : c
    ));
    setNewMessage('');

    try {
      // API call to send message
      const response = await api.post("Chat/send", {
        receiverId: activeContact.id,
        message: messageText, // API expects 'message' for sending
      }, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      // Optional: If API returns the saved message, update the temp message with real ID and timestamp
      if (response.data && response.data.chatId) {
          const savedMessage = response.data;
          setAllConversations(prev => ({
              ...prev,
              [activeContact.id]: (prev[activeContact.id] || []).map(msg =>
                  msg.id === tempMessageId
                      ? {
                          ...msg,
                          id: savedMessage.chatId, // Update with real ID from API
                          timestamp: savedMessage.timestamp, // Update with real timestamp
                          // Potentially update other fields if API returns them
                        }
                      : msg
              ),
          }));
      }

    } catch (e) {
      console.error("Failed to send message:", e);
      let userErrorMessage = "فشل إرسال الرسالة. حاول مرة أخرى.";
      if (e.response) {
        userErrorMessage = e.response.status === 401
          ? "فشل إرسال الرسالة: غير مصرح به."
          : `فشل إرسال الرسالة: خطأ (${e.response.status}).`;
      }
      setSendingError(userErrorMessage);
      // Revert optimistic UI update on error
      setAllConversations(prev => ({
        ...prev,
        [activeContact.id]: (prev[activeContact.id] || []).filter(msg => msg.id !== tempMessageId)
      }));
      setContacts(prevC => prevC.map(c => c.id === activeContact.id ? {...c, preview: previousContactPreview, time: previousContactTime} : c));
      setNewMessage(messageText); // Put the unsent message back in the input
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

  // --- Render Logic ---
  if (!authToken && !contactsError && !storedUserData) {
    return <div className="container-fluid d-flex justify-content-center align-items-center vh-100">جاري تهيئة بيانات المستخدم...</div>;
  }

  if (contactsError && !loggedInUserId) { // Critical error like token invalid or user ID not found
    return <div className="container-fluid d-flex justify-content-center align-items-center vh-100 text-danger p-3 text-center">{contactsError} يرجى محاولة تسجيل الدخول مرة أخرى.</div>;
  }


  if (isLoadingContacts && contacts.length === 0) {
    return <div className="container-fluid d-flex justify-content-center align-items-center vh-100">جاري تحميل قائمة المحادثات...</div>;
  }

  // Error fetching contacts but we might have had a token error before (loggedInUserId is null)
  if (contactsError && contacts.length === 0 && loggedInUserId) {
    return <div className="container-fluid d-flex justify-content-center align-items-center vh-100 text-danger p-3 text-center">{contactsError}</div>;
  }

  if (contacts.length === 0 && !isLoadingContacts && loggedInUserId) { // Logged in, but no contacts
    return <div className="container-fluid d-flex justify-content-center align-items-center vh-100">لا توجد محادثات لعرضها.</div>;
  }
  if (!loggedInUserId && !isLoadingContacts && !contactsError) { // User data not found, not loading, no specific error yet
    return <div className="container-fluid d-flex justify-content-center align-items-center vh-100 text-warning p-3 text-center">بيانات المستخدم غير متوفرة. قد تحتاج إلى تسجيل الدخول.</div>;
  }


  return (
    <div className={`container-fluid ${styles.chatContainer}`} dir="rtl">
      <div className="row h-100">
        {/* Contact List Column */}
        <div className={`col-md-4 p-0 order-2 order-md-1 ${styles.contactListContainer}`}>
          <div className={`d-flex justify-content-between align-items-center ${styles.contactListHeader}`}>
            <h5 className="mb-0 fw-bold" style={{ fontSize: "2rem" }}>الرسائل</h5>
            <div><span className={`badge bg-success rounded-pill me-2 ${styles.messageCountBadge}`}>{contacts.length}</span></div>
          </div>
          {contactsError && loggedInUserId && <div className="p-2 text-danger small text-center">{contactsError}</div>} {/* Show contacts error only if user was identified */}
          <div className={styles.contactsScrollable}>
            {contacts.map(contact => (
              <div
                key={contact.id}
                onClick={() => handleContactClick(contact.id)}
                className={`d-flex align-items-center ${styles.contactItem} ${contact.id === selectedContactId ? styles.activeContact : ''}`}
              >
                <img src={contact.avatar} alt="Avatar" className={`rounded-circle me-3 ${styles.contactAvatar}`} onError={(e) => { e.target.src = DEFAULT_AVATAR; }} />
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

        {/* Chat Window Column */}
        <div className={`col-md-8 p-0 order-1 order-md-2 ${styles.chatWindow}`}>
          {activeContact ? (
            <>
              <div className={`d-flex align-items-center ${styles.chatHeader}`}>
                <img src={activeContact.avatar} alt="Avatar" className={`rounded-circle me-3 ${styles.chatHeaderAvatar}`} onError={(e) => { e.target.src = DEFAULT_AVATAR; }}/>
                <div>
                  <h6 className="mb-0">{activeContact.name}</h6>
                  <small className="text-muted d-flex align-items-center">
                    {activeContact.status}
                    {activeContact.status === 'متصل' && <span className={styles.statusDot}></span>}
                  </small>
                </div>
              </div>

              <div className={styles.chatMessages}>
                {isMessagesLoading && (
                  <div className="d-flex justify-content-center align-items-center h-100 text-muted">
                    جاري تحميل الرسائل...
                  </div>
                )}
                {messagesError && !isMessagesLoading && (
                  <div className="d-flex justify-content-center align-items-center h-100 text-danger p-3 text-center">
                    {messagesError}
                  </div>
                )}
                {!isMessagesLoading && !messagesError && currentMessages.map((msg) => (
                  <div
                    key={msg.id} // This uses the corrected 'id: msg.chatId' or tempId
                    className={`d-flex mb-3 ${styles.messageContainer} ${msg.sender === 'me' ? styles.sent : styles.received}`}
                  >
                    {msg.sender === 'other' && (
                      <img src={msg.avatar} alt="Avatar" className={`rounded-circle ${styles.chatAvatar}`} onError={(e) => { e.target.src = DEFAULT_AVATAR; }} />
                    )}
                    <div className={`p-2 px-3 ${styles.messageBubble} ${msg.sender === 'me' ? styles.sentBubble : styles.receivedBubble}`}>
                      {msg.text} {/* This uses the corrected 'text: msg.messageContent' */}
                    </div>
                    {/* Optional: Display individual message timestamp */}
                    {/* <small className={styles.messageTimestamp}>{formatDate(msg.timestamp)}</small> */}
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
                  disabled={isSendingMessage || isMessagesLoading || !activeContact}
                />
                <button className={styles.sendButton} onClick={handleSendMessage} disabled={isSendingMessage || isMessagesLoading || !activeContact || !newMessage.trim()}>
                  {isSendingMessage ? '...' : '➤'}
                </button>
              </div>
            </>
          ) : (
             !isLoadingContacts && contacts.length > 0 && loggedInUserId && (
              <div className={`d-flex justify-content-center align-items-center h-100 ${styles.noChatSelected}`}>
                <p className="text-muted">حدد محادثة لبدء الدردشة</p>
              </div>
            )
          )}
          {/* Fallback for when no contacts and not loading contacts, or initial state before selection or if user is not identified */}
           {!activeContact && !isLoadingContacts && (contacts.length === 0 || !loggedInUserId) && !contactsError && (
             <div className={`d-flex justify-content-center align-items-center h-100 ${styles.noChatSelected}`}>
                <p className="text-muted">لا توجد محادثات متاحة أو أنك بحاجة لتسجيل الدخول.</p>
            </div>
           )}
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;