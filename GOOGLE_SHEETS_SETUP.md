# Google Sheets Integration Guide — Samanvay 2027 CL Meet

This step-by-step operational manual explains how to connect your website directly to **Google Sheets** and **Google Drive** using **Google Apps Script**.

No backend server, paid database, or specialized developer tools are required. Setup takes approximately **3 to 5 minutes**.

---

## Architecture Overview

```
┌─────────────────────────────────┐
│   React / Vite Web Application   │
│   (index.html / script.js)      │
└───────────────┬─────────────────┘
                │
                │ HTTP POST (CORS-friendly text/plain JSON payload)
                ▼
┌─────────────────────────────────┐
│   Google Apps Script Web App    │  ◄── `google-apps-script.js`
│   (LockService, Sanitization)   │
└───────────────┬─────────────────┘
                ├──► Appends row to [Google Sheets]
                └──► Saves optional ID card photos to [Google Drive]
```

---

## Step-by-Step Manual Setup

### 1. Open Your Google Spreadsheet
1. Open your configured Google Spreadsheet link:
   👉 **[Samanvay 2027 Registrations Sheet](https://docs.google.com/spreadsheets/d/1xbAatTita0te-q9HGd5upPTqTvVWh9qGc437IvJQ214/edit?usp=sharing)**
   *(Spreadsheet ID: `1xbAatTita0te-q9HGd5upPTqTvVWh9qGc437IvJQ214`)*
2. You do **not** need to manually format headers — the script will automatically create, bold, style, freeze, and adjust widths for all 10 column headers on the very first submission.

---

### 2. Open Google Apps Script
1. In your Google Sheet top menu bar, click on **Extensions** > **Apps Script**.
2. A new tab will open with the Apps Script code editor.
3. Rename the project at the top left from *"Untitled project"* to:
   ```
   Samanvay 2027 CL Meet Backend
   ```

---

### 3. Paste the Apps Script Code
1. In the editor, select and delete any default code inside `Code.gs`.
2. Open [`google-apps-script.js`](./google-apps-script.js) from this repository (it already contains your exact Spreadsheet ID `1xbAatTita0te-q9HGd5upPTqTvVWh9qGc437IvJQ214` pre-configured).
3. Copy the **entire contents** of `google-apps-script.js` and paste them into `Code.gs`.
4. Click the **Save** icon (💾) or press `Ctrl + S` (Windows) / `Cmd + S` (Mac).

---

### 4. Configure the Spreadsheet Binding
* The script is pre-configured with your Spreadsheet ID:
  `var SPREADSHEET_ID = "1xbAatTita0te-q9HGd5upPTqTvVWh9qGc437IvJQ214";`
* It will directly write all incoming Contingent Leader and Assistant Leader accreditations into this exact sheet.

---

### 5. Deploy the Script as a Web App
1. At the top right of the Apps Script window, click the blue **Deploy** button > **New deployment**.
2. In the modal that appears, click the **gear icon** (⚙️) next to "Select type" and choose **Web app**.
3. Fill in the deployment details exactly as follows:
   * **Description**: `Samanvay 2027 CL Meet v1`
   * **Execute as**: `Me (your_email@gmail.com)`
   * **Who has access**: `Anyone` *(Crucial: This allows college leaders to submit their delegation RSVP without requiring a Google login).*
4. Click **Deploy**.

---

### 6. Authorize Permissions
1. Google will display an **"Authorization required"** dialog. Click **Authorize access**.
2. Select your Google account.
3. You may see a screen saying *"Google hasn’t verified this app"*:
   * Click on **Advanced** (small text in bottom left).
   * Click **Go to Samanvay 2027 CL Meet Backend (unsafe)**.
   * Review the permissions (Google Sheets & Google Drive access) and click **Allow**.

---

### 7. Copy the Web App URL
1. Once deployed, the modal will display a **Web app URL** in this format:
   ```
   https://script.google.com/macros/s/AKfycbxXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/exec
   ```
2. Click **Copy** next to the Web app URL.

---

### 8. Place the URL in `.env.local`
1. In the root of this project, open `.env.local` (or create it if not present).
2. Set `VITE_GOOGLE_SCRIPT_URL` to your copied URL:
   ```ini
   VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/AKfycbxXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/exec
   ```
3. Save the file.
4. Restart your Vite development server if it was running:
   ```powershell
   npm run dev
   ```

---

### 9. Test a Submission
1. Open your browser to `http://localhost:5173/`.
2. Scroll to the **Accreditation Desk (RSVP Section)**.
3. Fill out the 4-step registration:
   * **Step 1**: Select or enter a College Name (e.g. `St. Xavier's College, Mumbai`).
   * **Step 2**: Enter Contingent Leader Name and a 10-digit mobile number (e.g. `9820112233`). Optionally attach an ID card photo.
   * **Step 3**: Enter Assistant Leader Name and a distinct 10-digit mobile number (e.g. `9820445566`). Optionally attach an ID card photo.
   * **Step 4**: Review your generated Met Gala VIP Place Card.
4. Click **"Confirm Attendance & Issue VIP Pass"**.
5. Observe the submit button display the loading state. Upon completion:
   * Confetti and paparazzi flashes trigger.
   * The card executes a 3D flip to reveal the **24K Shining Golden Ticket**.
   * A unique Credential Reference ID (e.g. `SMV-CL-2027-4819`) is assigned.

---

### 10. Verify Data in Google Sheets
1. Switch back to your Google Spreadsheet tab.
2. You will see that the sheet has automatically created 10 formatted columns:

| Submission ID | Submission Timestamp | College Name | CL Name | CL Contact | ACL Name | ACL Contact | CL ID Card Reference | ACL ID Card Reference | Submission Status |
|---|---|---|---|---|---|---|---|---|---|
| `SMV-CL-2027-4819` | `14/01/2027 10:30:15 IST` | St. Xavier's College, Mumbai | Aarav Sharma | `9820112233` | Rhea Sen | `9820445566` | Drive Link / N/A | Drive Link / N/A | **Accredited** |

* Notice that the mobile numbers retain their leading zeros because they are stored strictly with text formatting.
* Notice that the header row is frozen and bolded with an obsidian/gold palette.

---

### 11. Optional ID Card Photo System Configuration
* **Default Automatic Setup (Zero Config)**:
  * When a participant uploads an ID card photo, the script automatically creates a folder titled `"Samanvay 2027 CL Meet ID Cards"` in your Google Drive root.
  * Files are uniquely named (e.g. `CL_ID_SMV-CL-2027-4819_Aarav_Sharma.jpg`).
  * The direct Google Drive URL is stored in column 8 (`CL ID Card Reference`) or column 9 (`ACL ID Card Reference`).
* **Custom Google Drive Folder (Optional)**:
  1. If you prefer to store ID cards inside an existing folder, open that folder in Google Drive.
  2. Copy the folder ID from the URL:
     `https://drive.google.com/drive/folders/YOUR_FOLDER_ID_HERE`
  3. In Apps Script, click **Project Settings** (⚙️ on left sidebar).
  4. Scroll to **Script Properties** > **Add script property**:
     * Property: `DRIVE_FOLDER_ID`
     * Value: `YOUR_FOLDER_ID_HERE`
  5. Click **Save script properties**.

---

## Security Safeguards Implemented

1. **Formula Injection Guard**: All text inputs beginning with `=`, `+`, `-`, or `@` are sanitized with a single quote prefix so malicious formulas cannot execute in Google Sheets.
2. **LockService Concurrency Control**: Uses `LockService.getScriptLock()` with a 12-second timeout to prevent simultaneous submissions from corrupting rows or overwriting data.
3. **Duplicate Prevention**: Scans existing entries by mobile number to prevent duplicate registrations for the same contingent delegation.
4. **Honeypot Anti-Spam**: Invisible field (`institution_secret`) catches automated bots and discards their input without corrupting your sheet.
5. **No Public Read Exposure**: The Web App endpoint only accepts POST writes; it never exposes an endpoint that allows visitors to download or read other colleges' registration data.
