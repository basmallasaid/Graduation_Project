import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../../Styles/style.module.css';
import api from '../../API/axiosInstance';
import { useSignalR } from '../../contexts/SignalRContext'; // Adjust path

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

  const { connection, isConnected } = useSignalR();
  const storedUserData = localStorage.getItem("user_data");

  const location = useLocation();
  const navigate = useNavigate();
  const initialFarmerToChatWithRef = useRef(location.state?.farmerToChatWith);


  useEffect(() => {
    // console.log("ChatInterface: Auth Effect Running"); // Reduced logging for brevity
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
            setLoggedInUserAvatar(parsedUserData.avatarUrl || DEFAULT_AVATAR);
            // console.log("ChatInterface: LoggedInUserId set:", userIdClaim);
            // if (initialFarmerToChatWithRef.current) {
            //     console.log("ChatInterface: Auth ready, initial farmer to chat with from ref:", initialFarmerToChatWithRef.current);
            // }
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
    // console.log("ChatInterface: Fetching contacts list...");
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
        // console.log("ChatInterface: Contacts list fetched and set:", fetchedContacts.length);
      } catch (e) {
        console.error("Failed to fetch contacts list:", e);
        let msg = "فشل في تحميل قائمة المحادثات.";
        if (e.response?.status === 401) msg = "غير مصرح به لجلب المحادثات.";
        else if (e.message?.includes("تنسيق بيانات")) msg = e.message;
        setContactsError(msg);
        setContacts([]);
      } finally {
        setIsLoadingContacts(false);
        // console.log("ChatInterface: Finished fetching contacts, isLoadingContacts: false");
      }
    };
    fetchContactsList();
  }, [authToken, loggedInUserId]);


  const handleContactClick = useCallback(async (contactId) => {
    // console.log("handleContactClick: Called with ID:", contactId, "Current selected:", selectedContactId);
    if (selectedContactId === contactId && !(contacts.find(c => c.id === contactId)?.unreadMessages > 0)) {
        // console.log("handleContactClick: Contact already selected and no unread. Doing nothing.");
        return;
    }

    setSelectedContactId(contactId);
    // console.log("handleContactClick: setSelectedContactId to", contactId);
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
            // console.log(`Messages for ${contactId} marked as read on server.`);
        } catch (error) {
            console.error(`Failed to mark messages as read for ${contactId}:`, error);
        }
    }
  }, [selectedContactId, contacts, authToken]);

  useEffect(() => {
    const farmerDataFromState = initialFarmerToChatWithRef.current;

    if (!farmerDataFromState || !authToken || !loggedInUserId || isLoadingContacts) {
    //   if (farmerDataFromState) console.log("Add Farmer Effect: Waiting for auth/contacts load.", { hasFarmer: !!farmerDataFromState, authToken: !!authToken, loggedInUserId: !!loggedInUserId, isLoadingContacts });
      return;
    }

    // console.log("Add Farmer Effect: Processing farmer from navigation state:", farmerDataFromState);
    const { userId: farmerId, name: farmerName, imageUrl: farmerPhoto } = farmerDataFromState;
    const contactExistsInList = contacts.find(c => c.id === farmerId);

    if (!contactExistsInList) {
    //   console.log(`Add Farmer Effect: Farmer ${farmerName} (${farmerId}) not in existing contacts. Preparing to add.`);
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
        //   console.log("Add Farmer Effect (setContacts): Farmer already added, skipping duplicate.");
          return prevContacts;
        }
        // console.log("Add Farmer Effect (setContacts): Adding new contact to state:", newContactData);
        const updatedContacts = [newContactData, ...prevContacts];
        return updatedContacts.sort((a, b) => new Date(b._originalTimestamp) - new Date(a._originalTimestamp));
      });
    } else {
    //   console.log(`Add Farmer Effect: Farmer ${farmerName} (${farmerId}) already in contacts. Will be handled by Auto-Select if needed.`);
    }
  }, [authToken, loggedInUserId, isLoadingContacts, contacts]);


  useEffect(() => {
    const farmerDataFromState = initialFarmerToChatWithRef.current;

    if (!farmerDataFromState || !authToken || !loggedInUserId || isLoadingContacts) {
        // if (farmerDataFromState) console.log("Auto-Select Effect: Waiting for conditions.", { farmerDataFromState:!!farmerDataFromState, auth:!!authToken, user:!!loggedInUserId, loadingContacts:isLoadingContacts});
        return;
    }
    
    const { userId: farmerIdToSelect } = farmerDataFromState;
    const contactIsNowInList = contacts.find(c => c.id === farmerIdToSelect);

    if (contactIsNowInList) {
        if (selectedContactId !== farmerIdToSelect) {
            // console.log(`Auto-Select Effect: Farmer ${farmerIdToSelect} is in contacts. Selecting.`);
            handleContactClick(farmerIdToSelect);
        } else {
            // console.log(`Auto-Select Effect: Farmer ${farmerIdToSelect} is in contacts AND already selected.`);
        }
        
        if (initialFarmerToChatWithRef.current) {
            // console.log("Auto-Select Effect: Clearing farmer data from navigation state and ref.");
            initialFarmerToChatWithRef.current = null;
            navigate(location.pathname, { replace: true, state: { ...location.state, farmerToChatWith: null } });
        }
    } else {
        // console.log(`Auto-Select Effect: Farmer ${farmerIdToSelect} not yet in contacts list. Waiting. Contacts count: ${contacts.length}`);
    }
  }, [contacts, selectedContactId, authToken, loggedInUserId, isLoadingContacts, handleContactClick, navigate, location]);

  useEffect(() => {
    if (!connection || !isConnected || !loggedInUserId) {
        // if (connection && !isConnected) console.log("ChatInterface: SignalR connection available but not connected. Waiting...");
        // else if (!connection) console.log("ChatInterface: SignalR connection not yet available from context.");
        // else if (!loggedInUserId) console.log("ChatInterface: User not logged in, not registering SignalR handlers.");
        return;
    }
    // console.log("ChatInterface: (Re)Registering SignalR event handlers.");

    const receiveMessageHandler = (messagePayload) => {
        // console.log("ChatInterface: SignalR ReceiveMessage Payload:", messagePayload);
        if (!messagePayload || typeof messagePayload !== 'object') {
            console.warn("ChatInterface: Invalid message payload received.", messagePayload);
            return;
        }
        const { chatId, senderId, receiverId, messageContent, timestamp } = messagePayload;
        if (!senderId || !messageContent || !timestamp || !receiverId) {
            console.warn("ChatInterface: Incomplete message data in payload.", messagePayload);
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
                // console.log(`SignalR: Received message from new contact ${senderId}. Adding to contacts.`);
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
        // console.log("ChatInterface: SignalR UserStatusChanged - UserID:", userId, "IsOnline:", isOnline);
        if (userId && typeof isOnline === 'boolean') {
            setContacts(prevContacts =>
                prevContacts.map(contact =>
                    contact.id === userId ? { ...contact, status: isOnline ? 'متصل' : 'غير متصل', isOnline } : contact
                )
            );
        } else {
            console.warn("ChatInterface: UserStatusChanged received invalid data - UserID:", userId, "IsOnline:", isOnline);
        }
    };

    connection.on("ReceiveMessage", receiveMessageHandler);
    connection.on("userstatuschanged", userStatusChangedHandler);
    // console.log("ChatInterface: 'ReceiveMessage' and 'userstatuschanged' handlers registered.");

    return () => {
        // console.log("ChatInterface: Cleaning up SignalR event handlers.");
        if (connection) {
            connection.off("ReceiveMessage", receiveMessageHandler);
            connection.off("userstatuschanged", userStatusChangedHandler);
            // console.log("ChatInterface: 'ReceiveMessage' and 'userstatuschanged' handlers unregistered.");
        }
    };
  }, [connection, isConnected, loggedInUserId, loggedInUserAvatar, selectedContactId, contacts]);


  useEffect(() => {
    if (!selectedContactId || !authToken || !loggedInUserId) {
    //   if(selectedContactId) console.log("Fetch Messages: Skipping, missing auth/user", { selectedContactId, hasAuth: !!authToken, hasUser: !!loggedInUserId });
      return;
    }

    const fetchMessages = async () => {
      setIsMessagesLoading(true);
      setMessagesError(null);
    //   console.log(`Fetch Messages: Attempting for ${selectedContactId}`);
      let msg = null; // Define msg here to be accessible in finally
      try {
        const response = await api.get(`Chat/messages/${selectedContactId}`, {
          headers: { 'Authorization': `Bearer ${authToken}` },
        });
        // console.log(`Fetch Messages: API response for ${selectedContactId}`, {status: response.status, dataLength: response.data?.length });
        const messagesData = response.data;
        if (!Array.isArray(messagesData)) throw new Error("Invalid data format for messages.");

        const contactForAvatar = contacts.find(c => c.id === selectedContactId);

        const formattedMessages = messagesData.map(m => ({ // Renamed msg to m to avoid conflict
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
        // console.log(`Fetch Messages: Successfully set ${formattedMessages.length} messages for ${selectedContactId}.`);

      } catch (e) {
        console.error(`Fetch Messages: Failed for ${selectedContactId}:`, e.response?.status, e.response?.data || e.message);
        msg = "فشل في تحميل الرسائل لهذه المحادثة."; // Assign to outer scope msg
        if (e.response?.status === 401) msg = "غير مصرح به لجلب الرسائل.";
        else if (e.response?.status === 404) {
            // console.log(`Fetch Messages: 404 for ${selectedContactId} - new chat.`);
            msg = null; 
            setAllConversations(prevConvos => ({
                ...prevConvos,
                [selectedContactId]: [], 
            }));
        }
        setMessagesError(msg);
      } finally {
        setIsMessagesLoading(false);
        // console.log(`Fetch Messages: Finished for ${selectedContactId}, isLoading: false, intended messagesError: ${msg}`); // ESLINT FIX: Use outer scope msg
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
        if (!currentActiveContact) console.warn("Send message: No active contact selected or found.");
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
      } else {
          console.log("Message sent, but API response did not contain expected message ID/timestamp.");
      }
    } catch (e) {
      console.error("Failed to send message:", e);
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

  // console.log("RENDER CYCLE:", {
  //   loggedInUserId,
  //   authToken: !!authToken,
  //   isLoadingContacts,
  //   contactsCount: contacts.length,
  //   initialFarmerRef: initialFarmerToChatWithRef.current,
  //   selectedContactId,
  //   activeContactId: activeContact?.id,
  //   isMessagesLoading,
  //   messagesError,
  //   currentMessagesCount: currentMessages.length,
  //   allConversationsKeys: Object.keys(allConversations)
  // });

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
    return <div className="container-fluid d-flex justify-content-center align-items-center vh-100">لا توجد محادثات لعرضها.</div>;
  }

  return (
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
                {!isMessagesLoading && !messagesError && currentMessages.map((msg) => ( // Renamed inner `msg` variable
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
                  {isSendingMessage ? '...' : <span style={{transform: 'rotate(180deg)', display: 'inline-block'}}>➤</span>}
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
                {/* This space can be intentionally blank or show a generic message if conditions for "no chats" or "select chat" aren't met */}
            </div>
           )}
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;