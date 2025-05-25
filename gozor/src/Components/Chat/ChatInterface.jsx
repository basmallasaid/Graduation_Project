import React, { useState, useRef, useEffect } from 'react'; // Import useRef and useEffect
import styles from '../../Styles/style.module.css';

// --- Dummy Data (Initial State) ---
const initialContacts = [
    { id: 1, name: 'أحمد محمد ابراهيم', preview: 'مرحبا بك كيف الحال ؟', time: '12 دقيقة', avatar: 'assets/person2.png', status: 'متصل' },
    { id: 2, name: 'فاطمة الزهراء علي', preview: 'تمام، شكراً لسؤالك!', time: '25 دقيقة', avatar: 'assets/person2.png', status: 'غير متصل' },
    { id: 3, name: 'يوسف عبدالله خالد', preview: 'متى يمكننا الاجتماع؟', time: '1 ساعة', avatar: 'assets/person2.png', status: 'متصل' },
    { id: 4, name: 'مريم حسن سعيد', preview: 'وصلتني الملفات، شكراً.', time: '3 ساعات', avatar: 'assets/person2.png', status: 'متصل' },
    { id: 5, name: 'خالد وليد عمر', preview: 'بالتأكيد، سأرسلها.', time: 'أمس', avatar: 'assets/person2.png', status: 'غير متصل' },
    { id: 6, name: 'نور عادل ياسين', preview: 'فكرة جيدة!', time: 'أمس', avatar: 'assets/person2.png', status: 'متصل' },
];

const initialConversations = {
    1: [ { id: 101, sender: 'other', text: 'أهلاً وسهلاً! نعم، لدي مزرعة متخصصة في زراعة الخضروات العضوية.', avatar: 'assets/person2.png' }, { id: 102, sender: 'me', text: 'هذا رائع! هل لديك نظام ري حديث؟' }, { id: 103, sender: 'other', text: 'نعم، نظام ري بالتنقيط.', avatar: 'assets/person2.png' },],
    2: [ { id: 201, sender: 'other', text: 'مرحباً! كيف يمكنني المساعدة اليوم؟', avatar: 'assets/person2.png' }, { id: 202, sender: 'me', text: 'أبحث عن معلومات حول آخر التحديثات.' },],
    3: [ { id: 301, sender: 'me', text: 'مرحباً يوسف، هل أنت متاح للاجتماع غداً؟' }, { id: 302, sender: 'other', text: 'أهلاً! نعم، يناسبني الساعة 10 صباحاً.', avatar: 'assets/person2.png' }, { id: 303, sender: 'me', text: 'ممتاز، سأرسل الدعوة.' },],
    4: [ { id: 401, sender: 'other', text: 'تم إرسال الملفات المطلوبة.', avatar: 'assets/person2.png' }, { id: 402, sender: 'me', text: 'وصلتني الملفات، شكراً جزيلاً مريم!' },],
    5: [ { id: 501, sender: 'me', text: 'هل يمكنك إرسال التقرير الأخير؟'}, { id: 502, sender: 'other', text: 'بالتأكيد، سأرسلها الآن.', avatar: 'assets/person2.png'},],
    6: [ { id: 601, sender: 'other', text: 'ما رأيك في الاقتراح الجديد؟', avatar: 'assets/person2.png' }, { id: 602, sender: 'me', text: 'فكرة جيدة! دعنا نناقش التفاصيل.'}, { id: 603, sender: 'other', text: 'متى يناسبك؟', avatar: 'assets/person2.png' },],
};
// --- End Dummy Data ---


function ChatInterface() {
  // --- State ---
  const [contacts, setContacts] = useState(initialContacts); // Keep contacts state if needed later, otherwise use initialContacts directly
  const [allConversations, setAllConversations] = useState(initialConversations); // Make conversations stateful
  const [selectedContactId, setSelectedContactId] = useState(
    initialContacts.length > 0 ? initialContacts[0].id : null
  );
  const [newMessage, setNewMessage] = useState(''); // State for the input field
  const messagesEndRef = useRef(null); // Ref for scrolling to bottom

  // --- Derived State ---
  const activeContact = contacts.find(c => c.id === selectedContactId);
  // Get messages, ensuring it defaults to an empty array if contact or conversation doesn't exist
  const currentMessages = activeContact ? allConversations[activeContact.id] || [] : [];

  // --- Effects ---
  // Scroll to the bottom whenever messages change (new message sent or contact switched)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]); // Dependency: run when currentMessages array changes

  // --- Handlers ---
  const handleContactClick = (contactId) => {
    setSelectedContactId(contactId);
    // Optionally clear message input when switching contacts
    // setNewMessage('');
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeContact) return; // Don't send empty messages or if no contact selected

    const messageToSend = {
      id: Date.now(), // Simple unique ID for this example
      sender: 'me',
      text: newMessage,
      // 'me' messages typically don't need an avatar directly associated in the display
    };

    // Update the conversations state IMMUTABLY
    setAllConversations(prevConversations => {
      // Get the current conversation for the active contact, or an empty array if none exists
      const currentConversation = prevConversations[activeContact.id] || [];
      // Create the updated conversation array
      const updatedConversation = [...currentConversation, messageToSend];

      // Return the new state object for all conversations
      return {
        ...prevConversations, // Copy all existing conversations
        [activeContact.id]: updatedConversation, // Overwrite the specific conversation with the updated one
      };
    });

    // Also update the preview in the contact list (optional but good UX)
    setContacts(prevContacts => prevContacts.map(contact =>
        contact.id === activeContact.id
        ? { ...contact, preview: newMessage, time: 'الآن' } // Update preview and time
        : contact
    ));


    // Clear the input field
    setNewMessage('');
  };

  // Handle sending message on Enter key press in the input
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) { // Check for Enter key (without Shift)
        event.preventDefault(); // Prevent default form submission/newline
        handleSendMessage();
    }
  };


  return (
    <div className={`container-fluid ${styles.chatContainer}`} dir="rtl">
      <div className="row h-100">

        {/* Contact List Column */}
        <div className={`col-md-4 p-0 order-2 order-md-1 ${styles.contactListContainer}`}>
            {/* Contact List Header */}
            <div className={`d-flex justify-content-between align-items-center ${styles.contactListHeader}`}>
                <h5 className="mb-0 fw-bold" style={{fontSize:"2rem"}}>الرسائل</h5>
                <div>
                <span className={`badge bg-success rounded-pill me-2 ${styles.messageCountBadge}`}>
                    {contacts.length}
                </span>
                </div>
            </div>

            {/* Scrollable Contact List */}
            <div className={styles.contactsScrollable}>
                {contacts.map(contact => (
                <div
                    key={contact.id}
                    onClick={() => handleContactClick(contact.id)}
                    className={`d-flex align-items-center ${styles.contactItem} ${
                    contact.id === selectedContactId ? styles.activeContact : ''
                    }`}
                >
                    <img
                        src={contact.avatar || 'assets/default-avatar.png'} // Add a fallback avatar
                        alt="Avatar"
                        className={`rounded-circle me-3 ${styles.contactAvatar}`}
                        onError={(e) => { e.target.src = 'assets/default-avatar.png'; }} // Handle image load errors
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
                        src={activeContact.avatar || 'assets/default-avatar.png'} // Fallback avatar
                        alt="Avatar"
                        className={`rounded-circle me-3 ${styles.chatHeaderAvatar}`}
                        onError={(e) => { e.target.src = 'assets/default-avatar.png'; }} // Handle image load errors
                    />
                    <div>
                        <h6 className="mb-0">{activeContact.name}</h6>
                        <small className="text-muted d-flex align-items-center"> {/* Flexbox for alignment */}
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
                        className={`d-flex mb-3 ${styles.messageContainer} ${
                        msg.sender === 'me' ? styles.sent : styles.received
                        }`}
                    >
                        {/* Conditionally render avatar for 'other' */}
                        {msg.sender === 'other' && (
                            <img
                                src={msg.avatar || 'assets/default-avatar.png'} // Fallback avatar
                                alt="Avatar"
                                className={`rounded-circle ${styles.chatAvatar}`}
                                onError={(e) => { e.target.src = 'assets/users.png'; }} // Handle image load errors
                            />
                        )}
                        {/* Message Bubble */}
                        <div
                            className={`p-2 px-3 ${styles.messageBubble} ${
                                msg.sender === 'me' ? styles.sent : styles.received
                            }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
                {/* Element to scroll to */}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
                <div className={`d-flex align-items-center ${styles.chatInputArea}`}>
                    <input
                        type="text"
                        className={`form-control mx-2 ${styles.chatInput}`}
                        placeholder="اكتب رسالة ...."
                        value={newMessage} // Bind input value to state
                        onChange={(e) => setNewMessage(e.target.value)} // Update state on change
                        onKeyPress={handleKeyPress} // Handle Enter key press
                    />
                    <button className={styles.sendButton} onClick={handleSendMessage}> {/* Add onClick handler */}
                        ➤
                    </button>
                </div>
            </>
          ) : (
            <div className={`d-flex justify-content-center align-items-center h-100 ${styles.noChatSelected}`}>
              <p className="text-muted">حدد محادثة لبدء الدردشة</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;