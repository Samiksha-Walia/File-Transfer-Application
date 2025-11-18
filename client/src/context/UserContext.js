import { createContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [account, setAccount] = useState({});
    const [person, setPerson] = useState({});
    const [activeUsers, setActiveUsers] = useState([]);
    const [newMessageFlag, setNewMessageFlag]  = useState(false);
    const [voiceMessage, setVoiceMessage] = useState(null);

    const [unreadCounts, setUnreadCounts] = useState({}); // { [senderId]: count }

    const [message, setMessage] = useState({});
    const socket = useRef();

    useEffect(() => {
        socket.current = io('ws://localhost:9000');
    }, []);

    // Load persisted unread counts for this account on login
    useEffect(() => {
        if (!account?._id) return;
        try {
            const stored = localStorage.getItem(`unreadCounts_${account._id}`);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed && typeof parsed === 'object') {
                    setUnreadCounts(parsed);
                }
            }
        } catch (e) {
            console.log('Failed to load unreadCounts from storage:', e);
        }
    }, [account?._id]);

    // Global listener for incoming messages to update unread counts and browser notifications
    useEffect(() => {
        if (!socket.current) return;

        const handleIncoming = (data) => {
            // Only consider messages sent TO the logged-in user
            if (!account?._id || data.receiverId !== account._id) return;

            // Always bump unread for the sender; we will mark as read when user opens that chat
            setUnreadCounts((prev) => ({
                ...prev,
                [data.senderId]: (prev[data.senderId] || 0) + 1,
            }));

            // Let other components (like Conversations list) know a new message arrived
            setNewMessageFlag(prev => !prev);

            // Play a short notification sound (best-effort)
            try {
                if (typeof window !== 'undefined') {
                    const audio = new Audio('/notification.wav');
                    audio.volume = 0.9;
                    audio.play().catch(() => {
                        // Ignore autoplay errors if the user hasn't interacted yet
                    });
                }
            } catch (e) {
                console.log('Notification sound error:', e);
            }

            // Browser notification (best-effort)
            try {
                if (typeof window !== 'undefined' && 'Notification' in window) {
                    const notify = () => {
                        const title = 'New message';
                        const body = data.text || 'You have a new message';
                        new Notification(title, { body });
                    };

                    if (Notification.permission === 'granted') {
                        notify();
                    } else if (Notification.permission === 'default') {
                        Notification.requestPermission().then((perm) => {
                            if (perm === 'granted') notify();
                        });
                    }
                }
            } catch (e) {
                // Fail silently if notifications are blocked or unsupported
                console.log('Notification error:', e);
            }
        };

        socket.current.on('getMessage', handleIncoming);

        return () => {
            socket.current.off('getMessage', handleIncoming);
        };
    }, [account?._id]);

    // Persist unreadCounts whenever they change for the logged-in account
    useEffect(() => {
        if (!account?._id) return;
        try {
            localStorage.setItem(`unreadCounts_${account._id}` , JSON.stringify(unreadCounts));
        } catch (e) {
            console.log('Failed to save unreadCounts to storage:', e);
        }
    }, [account?._id, unreadCounts]);

    return (
        <UserContext.Provider value={{
            account,
            setAccount,
            person,
            setPerson,
            socket,
            activeUsers,
            setActiveUsers,
            newMessageFlag,
            setNewMessageFlag,
            voiceMessage,
            setVoiceMessage,
            unreadCounts,
            setUnreadCounts
        }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
