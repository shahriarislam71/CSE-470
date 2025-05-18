import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { FiSend, FiUser, FiMessageSquare } from 'react-icons/fi';
import { BsFillPersonFill, BsPersonCheckFill } from 'react-icons/bs';
import { IoMdSchool } from 'react-icons/io';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

const SectionChatrooms = () => {
  const { courseId, sectionName } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [courseDetails, setCourseDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userType, setUserType] = useState(''); // 'teacher' or 'student'
  const messagesEndRef = useRef(null);

  // Fetch course details and user info
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch course details
        const courseRes = await fetch(`http://localhost:5000/courses/${courseId}`);
        const courseData = await courseRes.json();
        setCourseDetails(courseData);

        // Simulate getting user info (replace with actual auth logic)
        const userEmail = localStorage.getItem('userEmail') || 'teacher@example.com';
        setUserEmail(userEmail);
        
        // Determine if user is teacher or student (replace with actual logic)
        const isTeacher = userEmail === courseData.email;
        setUserType(isTeacher ? 'teacher' : 'student');

        // Load chat messages
        await loadMessages(courseData.courseCode);
      } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to load chatroom',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    };

    fetchData();
  }, [courseId, sectionName]);

  const loadMessages = async (courseCode) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:5000/chatrooms?courseCode=${courseCode}&section=${sectionName}`
      );
      const data = await response.json();
      
      if (data.messages) {
        setMessages(data.messages.reverse()); // Show latest at bottom
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await fetch('http://localhost:5000/chatrooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseCode: courseDetails.courseCode,
          section: sectionName,
          email: userEmail,
          message: newMessage,
          senderType: userType
        })
      });

      if (response.ok) {
        setNewMessage('');
        await loadMessages(courseDetails.courseCode);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to send message',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">{courseDetails?.courseName || 'Loading...'}</h1>
            <p className="text-sm opacity-80">
              Section: {sectionName} • {userType === 'teacher' ? 'Teacher' : 'Student'} Chat
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-white/20 rounded-full px-3 py-1">
            <IoMdSchool className="text-lg" />
            <span className="font-medium">{courseDetails?.courseCode || ''}</span>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-pulse text-gray-500">Loading messages...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <FiMessageSquare className="text-4xl mb-2" />
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <AnimatePresence key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.email === userEmail ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-lg rounded-2xl p-4 ${msg.email === userEmail
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                    : msg.senderType === 'teacher'
                      ? 'bg-white border border-purple-100 shadow-sm'
                      : 'bg-gray-100'
                    }`}
                >
                  <div className="flex items-start space-x-2">
                    <div className={`rounded-full p-2 ${msg.senderType === 'teacher' ? 'bg-purple-100 text-purple-600' : 'bg-indigo-100 text-indigo-600'}`}>
                      {msg.senderType === 'teacher' ? <BsFillPersonFill /> : <BsPersonCheckFill />}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`font-semibold ${msg.email === userEmail ? 'text-white' : msg.senderType === 'teacher' ? 'text-purple-600' : 'text-indigo-600'}`}>
                          {msg.senderType === 'teacher' ? 'Teacher' : 'Student'}
                        </span>
                        <span className="text-xs opacity-70">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="mt-1">{msg.message}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
              rows="1"
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className={`absolute right-2 bottom-2 p-2 rounded-full ${newMessage.trim()
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                } transition-colors`}
            >
              <FiSend />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionChatrooms;