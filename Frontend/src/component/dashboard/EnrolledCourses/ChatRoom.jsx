import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FiSend, FiUser, FiMessageSquare } from 'react-icons/fi';
import { FaChalkboardTeacher } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import { format } from 'date-fns';

const Chatroom = ({ courseCode, section, userEmail, userType }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef(null);
    const fetchIntervalRef = useRef(null);

    // API endpoints
    const CHATROOM_API = 'http://localhost:5000/chatrooms';

    // Memoized fetch function
    const fetchMessages = useCallback(async () => {
        try {
            const response = await fetch(`${CHATROOM_API}?courseCode=${courseCode}&section=${section}`);
            if (!response.ok) {
                throw new Error('Failed to fetch messages');
            }
            const data = await response.json();
            setMessages(data.messages || []);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    }, [courseCode, section]);

    // Send a new message
    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || isSending) return;

        try {
            setIsSending(true);
            const response = await fetch(CHATROOM_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    courseCode,
                    section,
                    email: userEmail,
                    message: newMessage,
                    senderType: userType
                }),
            });

            if (response.ok) {
                setNewMessage('');
                await fetchMessages(); // Wait for refresh before allowing new messages
            } else {
                throw new Error('Failed to send message');
            }
        } catch (err) {
            console.error('Error sending message:', err);
            setError('Failed to send message');
        } finally {
            setIsSending(false);
        }
    };

    // Setup auto-refresh and cleanup
    useEffect(() => {
        // Initial fetch
        fetchMessages();

        // Setup interval for auto-refresh
        fetchIntervalRef.current = setInterval(fetchMessages, 5000);

        // Cleanup function
        return () => {
            if (fetchIntervalRef.current) {
                clearInterval(fetchIntervalRef.current);
            }
        };
    }, [fetchMessages]);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Optimize message rendering
    const renderMessage = (msg, index) => (
        <div 
            key={`${msg.timestamp}-${index}`} 
            className={`flex ${msg.email === userEmail ? 'justify-end' : 'justify-start'}`}
        >
            <div 
                className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg p-3 ${msg.email === userEmail 
                    ? 'bg-indigo-100 text-gray-800' 
                    : msg.senderType === 'teacher' 
                        ? 'bg-purple-100 text-gray-800' 
                        : 'bg-white border border-gray-200'}`}
            >
                <div className="flex items-center mb-1">
                    {msg.senderType === 'teacher' ? (
                        <FaChalkboardTeacher className="mr-2 text-purple-600" />
                    ) : (
                        <FiUser className="mr-2 text-gray-500" />
                    )}
                    <span className="font-medium text-sm">
                        {msg.senderType === 'teacher' ? 'Teacher' : msg.email.split('@')[0]}
                    </span>
                </div>
                <p className="text-gray-800">{msg.message}</p>
                <div className="text-xs text-gray-500 mt-1">
                    {format(new Date(msg.timestamp), 'MMM d, h:mm a')}
                </div>
            </div>
        </div>
    );

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    );

    if (error) return (
        <div className="text-center p-4 text-red-500">
            Error: {error}
            <button 
                onClick={fetchMessages}
                className="ml-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded"
            >
                Retry
            </button>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
            {/* Chat header */}
            <div className="bg-indigo-600 text-white p-4">
                <h2 className="text-xl font-bold">{courseCode} - {section}</h2>
                <p className="text-indigo-100 text-sm">
                    {userType === 'teacher' ? 'Teacher Chat' : 'Student Chat'}
                </p>
            </div>

            {/* Messages container */}
            <div className="flex-1 p-4 overflow-y-auto">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                        <FiMessageSquare className="text-4xl mb-2" />
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map(renderMessage)}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Message input */}
            <form onSubmit={sendMessage} className="border-t border-gray-200 p-4 bg-white">
                <div className="flex items-center">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        disabled={isSending}
                    />
                    <button
                        type="submit"
                        className={`px-4 py-2 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            isSending
                                ? 'bg-indigo-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                        disabled={isSending}
                    >
                        {isSending ? (
                            <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                            <IoMdSend className="text-xl" />
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Chatroom;