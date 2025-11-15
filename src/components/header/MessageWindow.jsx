import React, { useState, useEffect, useRef } from 'react';
import {
    FaSearch,
    FaChevronLeft,
    FaPaperPlane,
    FaTimes,
    FaPlus,
} from 'react-icons/fa';

// --- Initial Chat Data (History reversed to oldest-first) ---
const initialChats = [
    {
        id: 'chat-1',
        contactName: 'JOHN DO',
        lastMessage: 'Please submit the assignment before...',
        lastMessageDate: '20/10/25',
        fullHistory: [
            { sender: 'JOHN DO', message: 'Please submit the assignment before the deadline. This is a final reminder. Regards, John.', timestamp: '20/10/25 09:15'}
        ],
        unread: true,
        avatarColor: 'bg-green-200',
        avatarTextColor: 'text-green-700',
        avatarText: 'JD'
    },
    {
        id: 'chat-2',
        contactName: 'JOHN DOES',
        lastMessage: 'There will be no classes this week bec...',
        lastMessageDate: '16/10/25',
        fullHistory: [
            { sender: 'JOHN DOES', message: 'There will be no classes this week because I have to attend a conference. Please use this time to revise what you have learned in class. Regards, John.', timestamp: '16/10/25 11:00' },
            { sender: 'Me', message: 'Dear teacher will there be classes this week?', timestamp: '16/10/25 11:15' },
            { sender: 'JOHN DOES', message: 'Please take your time to review lesson 4. I will prepare a make up class in the near future', timestamp: '16/10/25 11:20' }
        ],
        unread: false,
        avatarColor: 'bg-purple-200',
        avatarTextColor: 'text-purple-700',
        avatarText: 'JD'
    },
    {
        id: 'chat-3',
        contactName: 'JOHN DID',
        lastMessage: 'Excellent! Also remember to prepare a pre...',
        lastMessageDate: '20/9/25',
        fullHistory: [
            { sender: 'JOHN DID', message: 'Dear students, please remember to bring your textbooks for the next session.', timestamp: '20/9/25 14:30'},
            { sender: 'Me', message: 'Understood. Will bring them.', timestamp: '20/9/25 14:45'},
            { sender: 'JOHN DID', message: 'Excellent! Also remember to prepare a presentation on the next topic', timestamp: '20/9/25 15:00'}
        ],
        unread: false,
        avatarColor: 'bg-red-200',
        avatarTextColor: 'text-red-700',
        avatarText: 'JD'
    },
    {
        id: 'chat-4',
        contactName: 'JOHN DONE',
        lastMessage: '[Reminder] Next week we will have no ...',
        lastMessageDate: '13/8/25',
        fullHistory: [
            { sender: 'Me', message: 'Teacher, do we have the break next week?', timestamp: '13/8/25 10:10'},
            { sender: 'JOHN DONE', message: '[Reminder] Next week we will have no class on Monday due to the national holiday.', timestamp: '13/8/25 10:15' }
        ],
        unread: false,
        avatarColor: 'bg-cyan-200',
        avatarTextColor: 'text-cyan-700',
        avatarText: 'JD'
    },
];

// --- Component Definition ---
export default function MessageWindow({ isOpen, onClose }) {
    const [chats, setChats] = useState(initialChats);
    const [activeChatId, setActiveChatId] = useState('chat-2');
    const [messageInputs, setMessageInputs] = useState({});
    const [toast, setToast] = useState('');

    // Group modal state
    const [groupModalOpen, setGroupModalOpen] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');

    // Ref for auto-scrolling
    const chatHistoryRef = useRef(null);

    // Effect for toast
    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(""), 3000);
        return () => clearTimeout(t);
    }, [toast]);

    // Effect for auto-scrolling
    useEffect(() => {
        if (chatHistoryRef.current) {
            chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
        }
    }, [activeChatId, chats]); // Run when chat changes or chats state updates

    const toggleMember = (id) => {
        setSelectedMembers(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
    };

    const createGroup = () => {
        if (!newGroupName.trim()) {
            setErrorMsg('Please enter a group name.');
            return;
        }
        if (selectedMembers.length === 0) {
            setErrorMsg('Select at least one member.');
            return;
        }

        const groupName = newGroupName.trim();
        const initials = groupName.split(' ').map(s => s[0]).slice(0,2).join('').toUpperCase() || 'G';
        
        const now = new Date();
        const dateLabel = `${String(now.getDate()).padStart(2,'0')}/${String(now.getMonth()+1).padStart(2,'0')}/${String(now.getFullYear()).slice(-2)}`;
        const timeLabel = `${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`;
        const timestamp = `${dateLabel} ${timeLabel}`;
        
        const memberNames = selectedMembers.map(id => chats.find(c => c.id === id).contactName);
        
        const createMessage = { 
            sender: 'System', 
            message: `Group "${groupName}" created.`, 
            timestamp 
        };
        const memberMessages = memberNames.map(name => ({ 
            sender: 'System', 
            message: `${name} was added to the group.`, 
            timestamp 
        }));
        
        const newHistory = [createMessage, ...memberMessages]; 

        const newChat = {
            id: `group-${Date.now()}`,
            contactName: groupName,
            lastMessage: newHistory[newHistory.length - 1].message,
            lastMessageDate: dateLabel,
            fullHistory: newHistory,
            unread: false,
            avatarColor: 'bg-indigo-200',
            avatarTextColor: 'text-indigo-700',
            avatarText: initials,
            members: selectedMembers.slice(),
            isGroup: true,
        };

        setChats(prev => [newChat, ...prev]);
        setActiveChatId(newChat.id);
        setToast(`Group "${groupName}" created.`);

        // reset group modal
        setGroupModalOpen(false);
        setNewGroupName('');
        setSelectedMembers([]);
        setErrorMsg('');
    };

    const handleSend = () => {
        const messageText = messageInputs[activeChatId]?.trim();
        if (!messageText) return;

        const now = new Date();
        const dateLabel = `${String(now.getDate()).padStart(2,'0')}/${String(now.getMonth()+1).padStart(2,'0')}/${String(now.getFullYear()).slice(-2)}`;
        const timeLabel = `${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`;
        const timestamp = `${dateLabel} ${timeLabel}`;

        const newMessageObj = {
            sender: 'Me',
            message: messageText,
            timestamp: timestamp
        };

        setChats(prevChats => prevChats.map(chat => {
            if (chat.id === activeChatId) {
                return {
                    ...chat,
                    fullHistory: [...chat.fullHistory, newMessageObj],
                    lastMessage: messageText,
                    lastMessageDate: dateLabel
                };
            }
            return chat;
        }));

        setMessageInputs(prevInputs => ({
            ...prevInputs,
            [activeChatId]: ''
        }));
    };

    const activeChat = chats.find(c => c.id === activeChatId);

    return (
        <>
            {/* 1. The Overlay (mobile) */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
                    onClick={onClose} 
                ></div>
            )}

            {/* Toast Notification */}
            {toast && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-black/75 text-white rounded-lg shadow-xl py-2 px-4 text-sm font-medium animate-pulse">
                    {toast}
                </div>
            )}
            
            {/* 2. The Window */}
            <div
                className={`
                    fixed top-0 right-0 h-full w-full 
                    md:w-[700px] lg:w-[800px] md:h-[calc(100%-4rem)] md:top-auto md:bottom-0 md:rounded-tl-xl
                    bg-white text-gray-800 shadow-2xl z-40
                    transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                    flex overflow-hidden
                `}
            >
                {/* --- Column 1: Chat List --- */}
                <div className={`
                    w-full md:w-[300px] lg:w-[340px] flex-shrink-0
                    border-r border-gray-200 flex flex-col
                    ${activeChatId ? 'hidden md:flex' : 'flex'}
                `}>
                    {/* List Header */}
                    <div className="flex justify-between items-center p-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold">Messages</h2>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => { setGroupModalOpen(true); setErrorMsg(''); }}
                                className="text-sm bg-primary text-white px-3 py-1.5 rounded-lg font-medium hover:opacity-90 transition flex items-center gap-1.5"
                            >
                                <FaPlus size={12} /> New Group
                            </button>
                            <button
                                onClick={onClose} 
                                className="text-gray-400 hover:text-gray-600 p-1"
                            >
                                <FaTimes />
                            </button>
                        </div>
                    </div>

                    {/* Search Input */}
                    <div className="p-3 border-b border-gray-200">
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <FaSearch className="text-gray-400" />
                            </span>
                            <input
                                type="text"
                                placeholder="Search contact"
                                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
                            />
                        </div>
                    </div>

                    {/* Message List */}
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {chats.map((chat) => (
                            <div 
                                key={chat.id} 
                                className={`flex items-center p-3 hover:bg-gray-100 cursor-pointer transition-colors rounded-lg
                                    ${activeChatId === chat.id ? 'bg-blue-50' : ''}
                                `}
                                onClick={() => {
                                    setActiveChatId(chat.id);
                                    if(chat.unread) {
                                        setChats(chats.map(c => c.id === chat.id ? {...c, unread: false} : c));
                                    }
                                }}
                            >
                                {/* Avatar */}
                                <div className={`relative w-10 h-10 ${chat.avatarColor} rounded-full flex items-center justify-center mr-3 font-semibold ${chat.avatarTextColor} shrink-0`}>
                                    {chat.avatarText}
                                    {chat.unread && (
                                        <span className="absolute -bottom-0.5 -right-0.5 block h-3 w-3 bg-red-500 rounded-full border-2 border-white" />
                                    )}
                                </div>
                                
                                {/* Message Info */}
                                <div className="flex-1 min-w-0"> 
                                    <div className="flex justify-between items-center">
                                        <span className={`font-semibold text-sm truncate ${activeChatId === chat.id ? 'text-blue-700' : ''}`}>
                                            {chat.contactName}
                                        </span>
                                        <span className="text-xs text-gray-500 shrink-0 ml-2">{chat.lastMessageDate}</span>
                                    </div>
                                    <p className={`text-sm text-gray-600 truncate ${chat.unread ? 'font-bold text-gray-800' : ''}`}>
                                        {chat.lastMessage}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- Column 2: Active Chat --- */}
                <div className={`
                    flex-1 flex flex-col bg-white
                    ${activeChatId ? 'flex' : 'hidden md:flex'}
                `}>
                    {!activeChat ? (
                        <div className="flex-1 flex items-center justify-center text-gray-500">
                            Select a chat to start messaging
                        </div>
                    ) : (
                        <>
                            {/* Active Chat Header */}
                            <div className="flex items-center p-4 border-b border-gray-200">
                                {/* Mobile-only Back Button */}
                                <button 
                                    className="text-gray-500 hover:text-gray-700 mr-3 md:hidden"
                                    onClick={() => setActiveChatId(null)}
                                >
                                    <FaChevronLeft />
                                </button>
                                <div className={`w-10 h-10 ${activeChat.avatarColor} rounded-full flex items-center justify-center mr-3 font-semibold ${activeChat.avatarTextColor} shrink-0`}>
                                    {activeChat.avatarText}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-base font-semibold">{activeChat.contactName}</h3>
                                </div>
                                <button 
                                    className="text-gray-400 hover:text-gray-600 p-1 md:hidden"
                                    onClick={onClose}
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            {/* Chat History */}
                            <div ref={chatHistoryRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                                {activeChat.fullHistory.map((msg, index) => (
                                    // --- (MODIFICATION 2) ---
                                    // Changed flex alignment for System messages
                                    <div key={index} className={`flex ${
                                        msg.sender === 'Me' ? 'justify-end' 
                                        : msg.sender === 'System' ? 'justify-center' 
                                        : 'justify-start'
                                    }`}>
                                        <div className={`py-2 px-4 rounded-lg ${ // max-w-[75%] removed from here
                                            msg.sender === 'Me' 
                                                ? 'bg-primary text-white rounded-t-xl rounded-bl-xl max-w-[75%]' // re-added max-w
                                                : msg.sender === 'System'
                                                    ? 'bg-transparent text-gray-500 text-sm text-center' // kept it simple
                                                    : 'bg-gray-100 text-gray-800 rounded-t-xl rounded-br-xl max-w-[75%]' // re-added max-w
                                        }`}>
                                            <p className={`text-sm whitespace-pre-wrap ${msg.sender === 'System' ? 'italic' : ''}`}>{msg.message}</p>
                                            <span className={`text-xs ${
                                                msg.sender === 'Me' ? 'text-blue-200' 
                                                : msg.sender === 'System' ? 'hidden'
                                                : 'text-gray-500'
                                            } block text-right mt-1`}>
                                                {msg.timestamp}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Message Input and Send Button */}
                            <div className="p-4 border-t border-gray-200 bg-white">
                                <div className="flex items-center bg-gray-100 rounded-full p-1">
                                    <input
                                        type="text"
                                        className="flex-1 p-2 px-4 bg-transparent focus:outline-none placeholder-gray-500 text-gray-800"
                                        placeholder="Write a message..."
                                        value={messageInputs[activeChatId] || ''}
                                        onChange={e => {
                                            const newInputs = {...messageInputs};
                                            newInputs[activeChatId] = e.target.value;
                                            setMessageInputs(newInputs);
                                        }}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSend();
                                            }
                                        }}
                                    />
                                    <button 
                                        className="shrink-0 bg-primary hover:opacity-90 text-white p-3 rounded-full transition-colors ml-1"
                                        onClick={handleSend}
                                    >
                                        <FaPaperPlane className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* --- Group Creation Modal --- */}
            {groupModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                    <div className="bg-white w-11/12 md:w-[560px] rounded-xl shadow-lg border">
                        <div className="flex justify-between items-center p-4 border-b">
                            <div>
                                <h3 className="text-lg font-semibold">Create New Group</h3>
                                <p className="text-sm text-gray-500">Choose group name and members</p>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600" onClick={() => { setGroupModalOpen(false); setErrorMsg(''); }}>
                                <FaTimes size={18} />
                            </button>
                        </div>

                        <div className="p-5 space-y-4">
                            {errorMsg && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">{errorMsg}</div>}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Group name</label>
                                <input
                                    value={newGroupName}
                                    onChange={e => setNewGroupName(e.target.value)}
                                    // --- (MODIFICATION 1) ---
                                    // Added text-gray-900 to make typed text visible
                                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                                    placeholder="e.g. Project Study Group"
                                />
                            </div>

                            <div>
                                <div className="text-sm font-medium text-gray-700 mb-2">Select members</div>
                                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-auto pr-2 border rounded-lg p-2">
                                    {chats.filter(c => !c.isGroup).map(c => (
                                        <label key={c.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedMembers.includes(c.id)}
                                                onChange={() => toggleMember(c.id)}
                                                className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                                            />
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${c.avatarColor} ${c.avatarTextColor}`}>{c.avatarText}</div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-800">{c.contactName}</div>
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
                                    onClick={() => { setGroupModalOpen(false); setErrorMsg(''); }}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition"
                                    onClick={createGroup}
                                >
                                    Create Group
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}