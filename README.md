# File Storage & Secure Upload System – Local Execution Guide

## 📌 Project Overview

This project is a **secure file storage system** that allows users to:

* Register and log in
* Upload files securely (files less than 25MB)
* Scan uploaded files for malware (using ClamAV)
* Store files safely (local/MinIO)
* View and manage uploaded files

The main goal of this project is to **demonstrate secure file upload and storage practices**, including authentication, **multiple layers of file scanning and validation**, malware detection, and proper backend–frontend separation.

In real-world applications, file uploads are one of the most common attack vectors. This project focuses heavily on **preventing malicious files from ever being stored or executed**, even in a local environment.

---

## 🔐 File Security & Scanning Mechanisms

This project implements **multiple levels of security checks** before accepting any uploaded file. Each file must pass *all* checks below to be successfully stored.

### 1️⃣ File Type & MIME Validation

* The backend validates the **MIME type** of the uploaded file.
* This prevents attackers from uploading disguised files (e.g., `.exe` renamed as `.pdf`).
* Only expected and safe MIME types are allowed.

**Examples of rejected files:**

* Executable files (`.exe`, `.bat`, `.cmd`, `.sh`)
* Script files (`.js`, `.vbs`, `.ps1`)
* Files with mismatched extension and MIME type

---

### 2️⃣ Extension-Based Filtering

* File extensions are checked against a **deny list**.
* High‑risk extensions are blocked immediately without further processing.

**Common rejected extensions:**

* `.exe`, `.dll`
* `.bat`, `.cmd`
* `.js`, `.vbs`
* `.ps1`, `.sh`
* `.msi`

This prevents accidental execution of harmful binaries.

---

### 3️⃣ Malware & Virus Scanning (ClamAV)

* Every uploaded file is scanned using **ClamAV** before storage.
* The file is temporarily held and scanned using the `clamscan` engine.
* If **any malware signature** is detected, the upload is immediately rejected.

**What happens on detection:**

* File is deleted instantly
* Upload request fails with an error
* File is never saved to disk

This protects against:

* Trojan files
* Macro-based malware
* Known virus signatures
* Embedded malicious payloads

---

### 4️⃣ Macro & Embedded Threat Protection

* Office files (`.docx`, `.xlsx`, `.pptx`) are scanned for **macro‑based threats**.
* ClamAV detects malicious macros commonly used for phishing and ransomware attacks.

---

### 5️⃣ File Size Limit Enforcement

* A **strict maximum file size limit** is enforced at the backend level during upload.
* Files exceeding this limit are **rejected immediately** before scanning or storage.
* This prevents:

  * Denial‑of‑Service (DoS) attacks using large files
  * Excessive memory or disk usage
  * Abuse of the virus scanning engine

**Current file size limit:**

* **Maximum allowed size: 25 MB per file**

**What happens if the limit is exceeded:**

* Upload request is rejected
* File is not scanned
* File is not saved to disk
* Client receives a clear error message

This ensures predictable performance and protects system resources.

---

### 6️⃣ Size & Resource Safety Checks

* Even within the allowed size limit, files may take time to scan due to security checks.
* Upload delays are **expected and intentional**.
* This prevents bypassing scans using resource‑intensive payloads.

---

### ✅ Accepted Files (If Clean)

Files are accepted **only if**:

* MIME type is valid
* Extension is allowed
* No malware or macros are detected

**Examples of allowed files (if clean):**

* `.pdf`
* `.jpg`, `.png`
* `.txt`
* `.docx`, `.xlsx` (without malicious macros)

---

## 🧠 Architecture Overview

* **Frontend**: React (runs on `localhost:3001`)
* **Backend**: Node.js + Express (runs on `localhost:3000`)
* **Authentication**: JWT-based auth
* **File Upload**: Multer
* **Virus Scanning**: ClamAV
* **Storage**: Local filesystem / MinIO (local)

Frontend communicates with backend via REST APIs.

---

## 📁 Project Structure (High Level)

```
file-storage/
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── server.js
│   │
│   ├── .env
│   ├── package.json
│
├── frontend/
│   ├── app/
│   ├── .env.local
│   ├── package.json
│
└── README.md
```

---

## ⚙️ Prerequisites (Must Be Installed)

Make sure the following are installed **before running the project**:

1. **Node.js** (v20.20)
2. **npm** (comes with Node.js)
3. **ClamAV** (for virus scanning)

### 🔹 Installing ClamAV (Windows)

1. Download ClamAV from the official website
2. Install it
3. Ensure `clamscan` is available in system PATH
4. Update virus definitions:

```
cd "C:\Program Files\ClamAV"
freshclam
```

---

## 🚀 Step-by-Step Local Execution Guide

### 1️⃣ Clone or Extract the Project

If using ZIP:

* Extract the ZIP file to any folder

If cloning:

```
git clone https://github.com/Shetty-Aryan/file-storage.git
cd file-storage
```

---

### 2️⃣ Backend Setup

#### 📂 Navigate to Backend

```
cd backend
```

#### 📦 Install Dependencies

```
npm install
```

#### ▶️ Start Backend Server

```
node src/server.js
```

Expected output:

```
Server running on port 3000
```

Backend is now running at:

```
http://localhost:3000
```

---

### 3️⃣ Frontend Setup

#### 📂 Navigate to Frontend

Open a new terminal:

```
cd frontend
```

#### 📦 Install Dependencies

```
npm install
```

#### ▶️ Start Frontend Server

```
npm run dev
```

Frontend will run at:

```
http://localhost:3001
```

---

## 🔄 How the Application Works (Flow)

1. User registers / logs in
2. JWT token is stored on frontend
3. File upload request is sent to backend
4. Backend:

   * Validates user
   * Scans file using ClamAV
   * Rejects malicious files
   * Stores clean files
5. Uploaded files are listed for the user

---

## 🛑 Common Issues & Notes

### ❌ CORS Errors

* Ensure frontend is running on `localhost:3001`
* Backend CORS origin must match frontend URL

### ❌ File Upload Timeout

* Large files may take time due to ClamAV scanning(so allowed only 25MB or less sized files)
* This is expected behavior in local environment

### ❌ ClamAV Not Found

* Ensure ClamAV path in `.env` is correct
* Ensure virus definitions are updated

---

## 📌 Important Notes for Evaluation

* This project focuses on **security concepts**, not deployment
* ClamAV scanning is intentionally synchronous for safety
* All data is stored **locally**
* Environment variables are shared separately for security

---

## 📎 Repository

Source code repository:

* GitHub: [https://github.com/Shetty-Aryan/file-storage](https://github.com/Shetty-Aryan/file-storage)

---

## ✅ Conclusion

This project demonstrates:

* Secure authentication
* Malware-safe file uploads
* Backend–frontend communication
* Real-world security considerations

It is fully runnable on a **local machine** using the steps above.
