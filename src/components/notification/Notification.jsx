import React, { useState, useEffect, useMemo } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { TbCheck } from 'react-icons/tb';
import { FaEnvelope } from 'react-icons/fa';

const formatNotificationDate = (isoDate) => {
    const date = new Date(isoDate);
    const now = new Date();
    const diff = (now - date) / (1000 * 60 * 60 * 24); // difference in days
  
    if (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    ) {
      // Same day → show time
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    } else if (diff < 7) {
      // Within a week → show day name
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      // Older → show short date
      return date.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: '2-digit' });
    }
};

export default function Notification({ isOpen, onClose }) {
    const [notifications, setNotifications] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    // --- LOGIC 1: Đọc User từ SessionStorage (để tách biệt User giữa các Tab) ---
    useEffect(() => {
        const storedUser = sessionStorage.getItem('currentUser'); // <-- Sửa thành sessionStorage
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
    }, []);

    // --- LOGIC 2: Đọc Notification từ LocalStorage (để thông báo đi xuyên các Tab) ---
    const fetchNotifications = () => {
        // Đọc lại user mới nhất (đề phòng chưa load kịp)
        const user = JSON.parse(sessionStorage.getItem('currentUser'));
        if (!user) return;

        const allNotifications = JSON.parse(localStorage.getItem('system_notifications')) || [];
        
        // Lọc thông báo dành cho Role hiện tại (VD: Admin gửi cho Student -> Student mới thấy)
        const userNotifications = allNotifications.filter(n => n.toRole === user.role);
        
        // Sắp xếp: Mới nhất lên đầu
        const sorted = userNotifications.sort((a, b) => new Date(b.time) - new Date(a.time));
        setNotifications(sorted);
    };

    // --- LOGIC 3: Auto Refresh (Polling) ---
    useEffect(() => {
        // Gọi ngay khi mở
        fetchNotifications();

        // Cập nhật mỗi 2 giây để thấy thông báo mới ngay lập tức
        const intervalId = setInterval(fetchNotifications, 2000);

        // Lắng nghe sự kiện storage (khi tab khác update localStorage)
        const handleStorageChange = (event) => {
            if (event.key === 'system_notifications') {
                fetchNotifications();
            }
        };
        window.addEventListener('storage', handleStorageChange);

        return () => {
            clearInterval(intervalId); // Dọn dẹp interval
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [isOpen]); // Chạy lại khi mở component

    // --- LOGIC 4: Đánh dấu đã đọc ---
    const handleMarkOneAsRead = (notificationId) => {
        const allNotifications = JSON.parse(localStorage.getItem('system_notifications')) || [];
        const updatedNotifications = allNotifications.map(n =>
            n.id === notificationId ? { ...n, isRead: true } : n
        );
        localStorage.setItem('system_notifications', JSON.stringify(updatedNotifications));
        fetchNotifications(); // Refresh lại list hiển thị
    };
    
    const handleMarkAllAsRead = () => {
        const user = JSON.parse(sessionStorage.getItem('currentUser'));
        if (!user) return;

        const allNotifications = JSON.parse(localStorage.getItem('system_notifications')) || [];
        const updatedNotifications = allNotifications.map(n =>
            n.toRole === user.role ? { ...n, isRead: true } : n
        );
        localStorage.setItem('system_notifications', JSON.stringify(updatedNotifications));
        fetchNotifications(); // Refresh lại list hiển thị
    };

    // Sắp xếp hiển thị: Chưa đọc lên đầu
    const sortedDisplayNotifications = useMemo(
        () =>
            [...notifications].sort((a, b) => {
                if (a.isRead === b.isRead) {
                    return new Date(b.time) - new Date(a.time);
                }
                return a.isRead ? 1 : -1;
            }),
        [notifications]
    );

    if (!isOpen) return null;

    return (
        <div className="fixed top-16 right-4 w-96 bg-white shadow-2xl border border-gray-200 rounded-lg z-50 flex flex-col max-h-[80vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b bg-gray-50 rounded-t-lg">
                <h2 className="text-lg font-bold text-gray-800">Notifications</h2>
                <div className="flex gap-3 justify-end">
                    <button
                        className="p-1.5 hover:bg-gray-200 rounded-full transition text-gray-600"
                        onClick={handleMarkAllAsRead}
                        title="Mark all as read"
                    >
                        <TbCheck size={20} />
                    </button>
                    <button
                        className="p-1.5 hover:bg-gray-200 rounded-full transition text-gray-600"
                        onClick={onClose}
                    >
                        <RxCross2 size={20} />
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
                {sortedDisplayNotifications.map((n) => (
                    <div
                        key={n.id}
                        className={`flex justify-between items-start border border-gray-100 rounded-lg p-3 mb-3 transition shadow-sm ${n.isRead ? 'bg-white' : 'bg-blue-50 border-blue-200'}`}
                        onClick={() => !n.isRead && handleMarkOneAsRead(n.id)}
                        style={{ cursor: n.isRead ? 'default' : 'pointer' }}
                    >
                        <div className="flex-1 pr-2">
                            <p className={`text-sm ${n.isRead ? 'text-gray-500' : 'text-gray-800 font-semibold'}`}>
                                {n.message}
                            </p>
                        </div>
                        <p className={`text-[10px] ${n.isRead ? 'text-gray-400' : 'text-blue-500 font-medium'} whitespace-nowrap mt-0.5`}>
                            {formatNotificationDate(n.time)}
                        </p>
                    </div>
                ))}

                {sortedDisplayNotifications.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                        <FaEnvelope className="text-4xl mb-2 opacity-20" /> {/* Nhớ import FaEnvelope nếu dùng */}
                        <p className="text-sm">No notifications yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}