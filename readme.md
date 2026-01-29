ContentGuard AI
===============

**ContentGuard AI** is a comprehensive full-stack application that enables users to upload videos, processes them for content sensitivity analysis, and provides seamless video streaming capabilities with real-time progress tracking. It features a Multi-Tenant architecture with Role-Based Access Control (RBAC) to ensure data isolation and security.

### Tech Stack

*   **Frontend:** React.js, Vite, Axios, Socket.io-client, CSS Modules.
    
*   **Backend:** Node.js, Express.js, Socket.io (Real-time), Multer (Uploads), JWT (Auth).
    
*   **Database:** MongoDB (Mongoose ODM).
    
*   **DevOps:** Local environment with environment-variable configuration.
    

🚀 Installation & Setup Guide
-----------------------------

### Prerequisites

*   **Node.js** (v16 or higher)
    
*   **MongoDB** (Local installation or Atlas Connection String)
    
*   **Git**
    

### Step 1: Clone the Repository

Bash

`   git clone   cd contentguard-ai   `

### Step 2: Backend Setup

1.  Bash

cd backend
    
2.  Bashnpm install
    
3.  Code snippetPORT=5000MONGO\_URI=mongodb+srv://JWT\_SECRET=your\_super\_secret\_key\_123
    
4.  Bashnpm run dev**Success:** You should see "Server running on port 5000" & "MongoDB Connected".
    

### Step 3: Frontend Setup

1.  Bashcd ../frontend
    
2.  Bashnpm install
    
3.  Bashnpm run dev
    
4.  Open your browser and visit: http://localhost:5173
    

📡 API Documentation
--------------------

**Base URL:** http://localhost:5000/api

### Authentication (/auth)

**MethodEndpointDescriptionAccessPOST**/registerRegister new user (requires Role & Org ID)Public**POST**/loginAuthenticate user & return JWT TokenPublic

### Videos (/videos)

**MethodEndpointDescriptionAccessGET**/List organization videos. Filter: ?sensitivity=safeAuth Users**POST**/uploadUpload video file (multipart/form-data)Editor, Admin**GET**/stream/:idStream video (Ranges supported). Query: ?token=Auth Users

### Admin (/admin)

**MethodEndpointDescriptionAccessGET**/usersList all users in the organizationAdmin Only**DELETE**/users/:idDelete a specific userAdmin Only

📖 User Manual
--------------

### 1\. Registration & Login

*   **Register:** Click "Need an account?" on the login page.
    
    *   **Viewer:** Read-only access.
        
    *   **Editor:** Can upload and manage content.
        
    *   **Admin:** Full system access and user management.
        
*   **Login:** Secure authentication using JWT.
    

### 2\. Dashboard

*   **Header:** Displays current User, Role, and Organization context.
    
*   **Logout:** Securely clears session data.
    

### 3\. Uploading Video (Editor/Admin)

2.  Enter a Title and select a file (.mp4, .mkv).
    
3.  **Progress Tracking:** Watch real-time upload progress and sensitivity analysis.
    

### 4\. Library & Streaming

*   **Status Indicators:**
    
    *   🟡 **Processing:** Content is being analyzed.
        
    *   🟢 **Safe:** Content cleared for viewing.
        
    
*   **Streaming:** Click any completed video to start playback using HTTP range requests.
    

### 5\. Admin Panel

*   Accessible only to users with the **Admin** role.
    
*   View all members within the organization.
    
*   Delete users to revoke access.
    

🔧 Troubleshooting
------------------

*   **Error 403 (Forbidden):** Session may be expired. Log out and log back in to refresh the JWT.
    
*   **Video not playing:** Verify the backend is running on port 5000 and MongoDB is connected.
    
*   **Upload Issues:** Ensure the file is a valid video format and does not exceed server size limits.