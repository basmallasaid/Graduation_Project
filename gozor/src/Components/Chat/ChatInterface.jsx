import React, { useState, useRef, useEffect } from 'react';
import styles from '../../Styles/style.module.css'; // Assuming this path is correct
import api from '../../API/axiosInstance'; // Your Axios instance

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


function ChatInterface() {
  // --- State ---
  const [contacts, setContacts] = useState([]);
  const [allConversations, setAllConversations] = useState({});
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Fetch Contacts (Conversations List) ---
  useEffect(() => {
    const fetchContactsAndConversations = async () => {
      setIsLoading(true);
      setError(null);
      let token = null;

      try {
        const storedUserData = localStorage.getItem("user_data");
        if (storedUserData) {
          const parsedUserData = JSON.parse(storedUserData);
          // --- IMPORTANT: VERIFY TOKEN KEY ---
          // Adjust 'token' if your user_data object stores the token under a different key
          // (e.g., accessToken, bearerToken, jwt, etc.)
          token = parsedUserData?.token;
        }

        if (!token) {
          setError("أنت غير مسجل الدخول أو أن جلسة العمل الخاصة بك قد انتهت. يرجى تسجيل الدخول مرة أخرى.");
          setIsLoading(false);
          return; // Stop if no token is found
        }

        const response = await api.get("Comminucation", {
          headers: {
            // 'Accept': '*/*', // Axios usually sets Accept header appropriately, can be omitted if not specifically needed
            'Authorization': `Bearer ${token}`,
          },
        });

        // With Axios, response.data already contains the parsed JSON object
        const data = response.data;

        // Axios typically throws for non-2xx, but an extra check or specific status handling can be useful
        if (!(response.status >= 200 && response.status < 300)) {
            // This case might be rare if Axios default error handling is active
            throw new Error(`API request failed with status ${response.status}`);
        }

        if (!Array.isArray(data)) {
          console.error("API did not return an array:", data);
          throw new Error("Invalid data format from API. Expected an array.");
        }

        const formattedContacts = data.map(item => ({
          id: item.id,
          name: item.userName || `مستخدم ${item.id}`, // Fallback name
          preview: item.descripition || "...", // Fallback preview
          time: formatDate(item.date),
          avatar: 'assets/person2.png', // Default avatar, API doesn't provide
          status: 'متصل', // Default status, API doesn't provide
        }));

        setContacts(formattedContacts);

        const initialConvos = {};
        formattedContacts.forEach(contact => {
          initialConvos[contact.id] = [
            {
              id: `msg-${contact.id}-initial-${Date.now()}`,
              sender: 'other',
              text: contact.preview, // Using description as the first message
              avatar: contact.avatar,
            },
          ];
        });
        setAllConversations(initialConvos);

        if (formattedContacts.length > 0) {
          setSelectedContactId(formattedContacts[0].id);
        }

      } catch (e) {
        console.error("Failed to fetch communications:", e);
        if (e.response) { // Axios error object often has a response property
          if (e.response.status === 401) {
            setError("غير مصرح به. قد تحتاج إلى تسجيل الدخول مرة أخرى.");
            // Optionally, you could trigger a logout or redirect to login here
          } else {
            setError(`خطأ من الخادم: ${e.response.status} ${e.response.statusText || ''}. حاول مرة أخرى.`);
          }
        } else if (e.request) { // The request was made but no response was received
          setError("لا يمكن الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.");
        } else { // Something happened in setting up the request that triggered an Error
          setError(e.message || "فشل في تحميل البيانات. حاول مرة أخرى.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchContactsAndConversations();
  }, []); // Empty dependency array: runs once on mount

  // --- Derived State ---
  const activeContact = contacts.find(c => c.id === selectedContactId);
  const currentMessages = activeContact ? allConversations[activeContact.id] || [] : [];

  // --- Effects ---
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, selectedContactId]);

  // --- Handlers ---
  const handleContactClick = (contactId) => {
    setSelectedContactId(contactId);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeContact) return;

    const messageToSend = {
      id: `msg-me-${Date.now()}`,
      sender: 'me',
      text: newMessage,
    };

    setAllConversations(prevConversations => {
      const currentConversation = prevConversations[activeContact.id] || [];
      const updatedConversation = [...currentConversation, messageToSend];
      return {
        ...prevConversations,
        [activeContact.id]: updatedConversation,
      };
    });

    setContacts(prevContacts => prevContacts.map(contact =>
      contact.id === activeContact.id
        ? { ...contact, preview: newMessage, time: 'الآن' }
        : contact
    ));

    setNewMessage('');
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  // --- Render Logic ---
  if (isLoading) {
    return <div className="container-fluid d-flex justify-content-center align-items-center vh-100">جاري التحميل...</div>;
  }

  if (error) {
    return <div className="container-fluid d-flex justify-content-center align-items-center vh-100 text-danger p-3 text-center">{error}</div>;
  }

  if (contacts.length === 0 && !isLoading) {
    return <div className="container-fluid d-flex justify-content-center align-items-center vh-100">لا توجد محادثات لعرضها.</div>;
  }

  return (
    <div className={`container-fluid ${styles.chatContainer}`} dir="rtl">
      <div className="row h-100">
        {/* Contact List Column */}
        <div className={`col-md-4 p-0 order-2 order-md-1 ${styles.contactListContainer}`}>
          <div className={`d-flex justify-content-between align-items-center ${styles.contactListHeader}`}>
            <h5 className="mb-0 fw-bold" style={{ fontSize: "2rem" }}>الرسائل</h5>
            <div>
              <span className={`badge bg-success rounded-pill me-2 ${styles.messageCountBadge}`}>
                {contacts.length}
              </span>
            </div>
          </div>

          <div className={styles.contactsScrollable}>
            {contacts.map(contact => (
              <div
                key={contact.id}
                onClick={() => handleContactClick(contact.id)}
                className={`d-flex align-items-center ${styles.contactItem} ${contact.id === selectedContactId ? styles.activeContact : ''
                  }`}
              >
                <img
                  src={contact.avatar || 'assets/default-avatar.png'}
                  alt="Avatar"
                  className={`rounded-circle me-3 ${styles.contactAvatar}`}
                  onError={(e) => { e.target.src = 'assets/default-avatar.png'; }}
                />
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between">
                    <span className={styles.contactName}>{contact.name}</span>
                    <small className={styles.contactTime}>{contact.time}</small>
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
              {/* Chat Header */}
              <div className={`d-flex align-items-center ${styles.chatHeader}`}>
                <img
                  src={activeContact.avatar || 'assets/default-avatar.png'}
                  alt="Avatar"
                  className={`rounded-circle me-3 ${styles.chatHeaderAvatar}`}
                  onError={(e) => { e.target.src = 'assets/default-avatar.png'; }}
                />
                <div>
                  <h6 className="mb-0">{activeContact.name}</h6>
                  <small className="text-muted d-flex align-items-center">
                    {activeContact.status === 'متصل' ? 'متصل' : 'غير متصل'}
                    {activeContact.status === 'متصل' && <span className={styles.statusDot}></span>}
                  </small>
                </div>
              </div>

              {/* Chat Messages */}
              <div className={styles.chatMessages}>
                {currentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`d-flex mb-3 ${styles.messageContainer} ${msg.sender === 'me' ? styles.sent : styles.received
                      }`}
                  >
                    {msg.sender === 'other' && (
                      <img
                        src={msg.avatar || 'assets/default-avatar.png'}
                        alt="Avatar"
                        className={`rounded-circle ${styles.chatAvatar}`}
                        onError={(e) => { e.target.src = 'assets/users.png'; }}
                      />
                    )}
                    <div
                      className={`p-2 px-3 ${styles.messageBubble} ${msg.sender === 'me' ? styles.sentBubble : styles.receivedBubble
                        }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className={`d-flex align-items-center ${styles.chatInputArea}`}>
                <input
                  type="text"
                  className={`form-control mx-2 ${styles.chatInput}`}
                  placeholder="اكتب رسالة ...."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button className={styles.sendButton} onClick={handleSendMessage}>
                  ➤
                </button>
              </div>
            </>
          ) : (
            <div className={`d-flex justify-content-center align-items-center h-100 ${styles.noChatSelected}`}>
              <p className="text-muted">{contacts.length > 0 ? "حدد محادثة لبدء الدردشة" : "لا توجد محادثات أو أنك غير مسجل الدخول"}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;