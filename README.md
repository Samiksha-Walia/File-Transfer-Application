
# 🔁 Real-Time File Transfer App – React + Vite + Socket.IO

A **real-time file transfer** application built using **React (Vite)** and **Socket.IO**, allowing users to securely send and receive small files between authenticated users. The system supports **user registration/login**, encrypted file transfers, and **progress indicators**, all wrapped in a responsive and user-friendly interface.

> ⚠️ *This full-stack application is built for educational, demo, and portfolio purposes. It demonstrates real-time communication and secure file sharing using modern web technologies.*


## 🚀 Key Features

- ✅ Real-time file transfer using **Socket.IO**  
- ✅ **User authentication** (register/login) with JWT  
- ✅ Upload files from local device  
- ✅ Transfer to another online user  
- ✅ Real-time **progress indicators** and **status updates**  
- ✅ File previews (PDF, image, audio) before download  
- ✅ Transfer history with timestamps and file logs  
- ✅ **Encrypted socket communication** for data safety  
- ✅ Built with modern **React + Vite** stack  
- ✅ Responsive, clean, and intuitive UI  



## 🛠 Tech Stack

| Layer         | Technology Used                      |
|---------------|--------------------------------------|
| **Frontend**  | React.js + Vite + Tailwind CSS       |
| **Backend**   | Node.js, Express.js, MongoDB         |
| **Sockets**   | Socket.IO (Client + Server)          |
| **Auth**      | JWT, bcrypt.js                       |
| **UI**        | React Icons, Axios                   |



## ⚙️ Getting Started

### Prerequisites

* Node.js (v16+)
* MongoDB (Atlas or local)
* npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Samiksha-Walia/File-Transfer-Application.git
cd File-Transfer-Application

# --- Setup backend ---
cd server
npm install
# Create a .env file with MongoDB URI, JWT_SECRET, PORT, etc.
npm run dev

# --- Setup frontend ---
cd ../client
npm install
npm run dev
```

Your app will run at `http://localhost:5173` with backend on `http://localhost:5000` (default).


## 🔒 Security Measures

* **JWT** authentication for secure login and user verification
* **Encrypted socket communication** (over HTTPS/WebSocket Secure)
* File size limits and type validation (optional extension)
* Backend authentication middleware to verify tokens
* Secure headers and validation on both client and server



## 📡 How File Transfer Works

1. 👥 User logs in or registers
2. 🔍 Sees online users in real-time via socket events
3. 📤 Selects a file and a recipient
4. 📡 File is transmitted via Socket.IO as binary buffer
5. 📈 Live progress bar shows sending/receiving status
6. 📁 File is received and available for download



## 🧪 Testing Workflow

1. Open the app in two browser windows and login as different users
2. Upload a file in one window and select the other user
3. Watch real-time status logs and file appear on receiver’s end
4. Try with large/small files to test socket reliability
5. Observe error messages if socket disconnects or auth fails


## 📚 Resources Used

* [Socket.IO Real-Time Data Transfer Article](https://medium.com/@jangid.rohit70/real-time-data-transfer-between-client-and-server-using-socket-io-3588f828b063)
* [Vite + React Docs](https://vitejs.dev/guide/)
* [MDN: WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)

---

## 🔮 Future Enhancements

* 🔐 End-to-end encryption using AES-256
* 📧 Email invitations or share links
* 📲 Mobile PWA version with push notifications
* 🧪 Unit and integration testing using Jest/Cypress



## 👩‍💻 Author

**Samiksha Walia**
[GitHub](https://github.com/Samiksha-Walia) • [LinkedIn](https://linkedin.com/in/samiksha-walia)



## ⭐️ Show Your Support

If this project helped you or inspired your learning, please give it a ⭐️ on GitHub!

> 📝 *Real-time communication meets file transfer – built with modern web stack and a focus on user experience.*


