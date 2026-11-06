/**
 * ============================================================================
 * SAMANVAY 2027: MET GALA — CL MEET REGISTRATION BACKEND (Google Apps Script)
 * ============================================================================
 * 
 * Production-ready backend service connecting the Samanvay 2027 CL Meet website
 * directly to Google Sheets and Google Drive.
 * 
 * ARCHITECTURE:
 * React / Vite Website  ──>  Google Apps Script (Web App)  ──>  Google Sheets
 *                                                         └──>  Google Drive (Optional ID Photos)
 * 
 * SPREADSHEET STRUCTURE (10 Exact Columns):
 * [1] Submission ID            - e.g. METGALA-VIP-CL-042
 * [2] Submission Timestamp     - e.g. 14/01/2027 10:30:45 IST
 * [3] College Name             - e.g. St. Xavier's College, Mumbai
 * [4] CL Name                  - Contingent Leader Full Name
 * [5] CL Contact               - 10-Digit Mobile (stored as text with ' to preserve leading 0)
 * [6] ACL Name                 - Assistant Contingent Leader Full Name
 * [7] ACL Contact              - 10-Digit Mobile (stored as text with ' to preserve leading 0)
 * [8] CL ID Card Reference     - Google Drive URL or "N/A"
 * [9] ACL ID Card Reference    - Google Drive URL or "N/A"
 * [10] Submission Status       - e.g. "Accredited"
 * ============================================================================
 */

// Spreadsheet Column Header Definitions
var HEADERS = [
  "Submission ID",
  "Submission Timestamp",
  "College Name",
  "CL Name",
  "CL Contact",
  "ACL Name",
  "ACL Contact",
  "CL ID Card Reference",
  "ACL ID Card Reference",
  "Submission Status"
];

// Configuration
var CONFIG = {
  FEST_NAME: "SAMANVAY 2027",
  CONCLAVE: "Met Gala CL Meet",
  TIMEZONE: "Asia/Kolkata",
  DRIVE_FOLDER_NAME: "Samanvay 2027 CL Meet ID Cards",
  MAX_PHOTO_BYTES: 5 * 1024 * 1024 // 5 MB per photo
};

// Target Google Spreadsheet ID (Configured for Samanvay 2027)
var SPREADSHEET_ID = "1xbAatTita0te-q9HGd5upPTqTvVWh9qGc437IvJQ214";

/**
 * Returns the target Google Sheet.
 * Attempts to open by explicit SPREADSHEET_ID first, falling back to active sheet if container-bound.
 */
function getTargetSheet() {
  if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== "") {
    try {
      var ss = SpreadsheetApp.openById(SPREADSHEET_ID.trim());
      return ss.getSheetByName("Accreditations") || ss.getSheetByName("Sheet1") || ss.getSheets()[0];
    } catch (err) {
      Logger.log("openById failed, falling back to getActiveSpreadsheet: " + err.toString());
    }
  }
  var activeSs = SpreadsheetApp.getActiveSpreadsheet();
  return activeSs.getSheetByName("Accreditations") || activeSs.getSheetByName("Sheet1") || activeSs.getSheets()[0];
}

/**
 * Ensures the target sheet has headers, bold styling, frozen top row,
 * proper column widths, and text formatting.
 */
function initializeSheet(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    
    var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#181014");
    headerRange.setFontColor("#DFC38A");
    headerRange.setFontFamily("Arial");
    headerRange.setFontSize(10);
    headerRange.setVerticalAlignment("middle");
    sheet.setRowHeight(1, 38);
    sheet.setFrozenRows(1);
    
    // Optimized Column Widths (px)
    var widths = [180, 180, 260, 180, 140, 180, 140, 220, 220, 140];
    for (var i = 0; i < widths.length; i++) {
      sheet.setColumnWidth(i + 1, widths[i]);
    }
  }
}

/**
 * Formula Injection Guard & Sanitizer:
 * Trims whitespace and prevents formula injection attacks (=, +, -, @)
 */
function sanitizeInput(val, maxLength) {
  if (val === null || val === undefined) return "";
  var str = String(val).trim();
  if (maxLength && str.length > maxLength) {
    str = str.substring(0, maxLength);
  }
  // Formula Injection Guard: prefix with single quote if starts with formula trigger
  if (/^[=+\-@]/.test(str)) {
    return "'" + str;
  }
  return str;
}

/**
 * Retrieves or creates a dedicated Google Drive folder for ID cards.
 */
function getOrCreateDriveFolder() {
  try {
    // Check if custom folder ID is configured in Script Properties
    var customFolderId = PropertiesService.getScriptProperties().getProperty("DRIVE_FOLDER_ID");
    if (customFolderId) {
      return DriveApp.getFolderById(customFolderId);
    }
    
    // Fallback: Find or create the default folder in Drive root
    var folders = DriveApp.getFoldersByName(CONFIG.DRIVE_FOLDER_NAME);
    if (folders.hasNext()) {
      return folders.next();
    }
    return DriveApp.createFolder(CONFIG.DRIVE_FOLDER_NAME);
  } catch (err) {
    Logger.log("Drive folder retrieval error: " + err.toString());
    return null;
  }
}

/**
 * Saves a base64 encoded photo to Google Drive and returns the file URL.
 */
function savePhotoToDrive(photoData, role, refId, delegateName) {
  if (!photoData || !photoData.base64) return "N/A";
  
  try {
    var folder = getOrCreateDriveFolder();
    if (!folder) return "Drive Access Unavailable";
    
    // Clean base64 string
    var base64Str = photoData.base64.replace(/^data:image\/\w+;base64,/, "");
    var decodedBytes = Utilities.base64Decode(base64Str);
    
    if (decodedBytes.length > CONFIG.MAX_PHOTO_BYTES) {
      return "Upload Skipped: Exceeded 5MB Limit";
    }
    
    // Determine MIME type and file extension
    var mimeType = photoData.mimeType || "image/jpeg";
    var ext = "jpg";
    if (mimeType.indexOf("png") !== -1) ext = "png";
    else if (mimeType.indexOf("webp") !== -1) ext = "webp";
    
    var cleanName = (delegateName || role).replace(/[^a-zA-Z0-9_-]/g, "_");
    var fileName = role + "_ID_" + refId + "_" + cleanName + "." + ext;
    
    var blob = Utilities.newBlob(decodedBytes, mimeType, fileName);
    var file = folder.createFile(blob);
    
    return file.getUrl();
  } catch (err) {
    Logger.log("Error saving " + role + " photo: " + err.toString());
    return "Upload Error: " + err.message;
  }
}

/**
 * Main HTTP POST Handler:
 * Receives JSON registration payload, validates, de-duplicates, and appends to sheet.
 */
function doPost(e) {
  // Use ScriptLock to prevent concurrent write race conditions
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(12000); // Wait up to 12s for lock
  } catch (lockErr) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "Server is currently processing concurrent registrations. Please retry in a few seconds."
    })).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "No data payload received."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var sheet = getTargetSheet();
    initializeSheet(sheet);

    var data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "Invalid JSON payload."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Anti-Spam Honeypot Check
    if (data.institution_secret && String(data.institution_secret).trim() !== "") {
      // Bot detected - drop silently with success
      var botNum = ("00" + Math.floor(10 + Math.random() * 90)).slice(-3);
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        refId: "METGALA-VIP-CL-" + botNum,
        message: "Delegation accredited successfully."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Extract & Sanitize Inputs
    var collegeName = sanitizeInput(data.college || data.college_name, 150);
    var clName = sanitizeInput(data.clName || data.cl_name, 80);
    var clPhone = String(data.clPhone || data.cl_phone || "").replace(/\D/g, "").slice(-10);
    var aclName = sanitizeInput(data.aclName || data.acl_name, 80);
    var aclPhone = String(data.aclPhone || data.acl_phone || "").replace(/\D/g, "").slice(-10);
    var genNum = ("00" + Math.floor(10 + Math.random() * 90)).slice(-3);
    var refId = sanitizeInput(data.refId, 40) || ("METGALA-VIP-CL-" + genNum);

    // Server-Side Validation: Required Fields
    if (!collegeName || collegeName.length < 3) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "College name is required and must be at least 3 characters."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (!clName || clName.length < 2) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "Contingent Leader (CL) name is required."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (!clPhone || !/^[6-9]\d{9}$/.test(clPhone)) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "Valid 10-digit Indian mobile number required for Contingent Leader."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (!aclName || aclName.length < 2) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "Assistant Contingent Leader (ACL) name is required."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (!aclPhone || !/^[6-9]\d{9}$/.test(aclPhone)) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "Valid 10-digit Indian mobile number required for Assistant Leader."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (clPhone === aclPhone) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "Contingent Leader and Assistant Leader mobile numbers must be distinct."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Duplicate Check: Check existing rows for matching mobile numbers
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      // Get columns: [1: Submission ID, 3: College, 5: CL Contact, 7: ACL Contact]
      var existingData = sheet.getRange(2, 1, lastRow - 1, 7).getValues();
      for (var i = 0; i < existingData.length; i++) {
        var existingRef = existingData[i][0];
        var existingClPhone = String(existingData[i][4]).replace(/\D/g, "").slice(-10);
        var existingAclPhone = String(existingData[i][6]).replace(/\D/g, "").slice(-10);

        if (existingClPhone === clPhone || existingAclPhone === clPhone ||
            existingClPhone === aclPhone || existingAclPhone === aclPhone) {
          return ContentService.createTextOutput(JSON.stringify({
            status: "duplicate",
            refId: existingRef,
            message: "A contingent delegation with this contact number is already accredited under Ref ID: " + existingRef
          })).setMimeType(ContentService.MimeType.JSON);
        }
      }
    }

    // Process Optional ID Card Photos
    var clPhotoRef = "N/A";
    if (data.clPhoto) {
      clPhotoRef = savePhotoToDrive(data.clPhoto, "CL", refId, clName);
    }

    var aclPhotoRef = "N/A";
    if (data.aclPhoto) {
      aclPhotoRef = savePhotoToDrive(data.aclPhoto, "ACL", refId, aclName);
    }

    // Formatted IST Timestamp
    var timestampStr = Utilities.formatDate(new Date(), CONFIG.TIMEZONE, "dd/MM/yyyy HH:mm:ss 'IST'");

    // Append Row in Exact 10-Column Sequence:
    // [1] Submission ID, [2] Timestamp, [3] College, [4] CL Name, [5] CL Phone, [6] ACL Name, [7] ACL Phone, [8] CL Photo, [9] ACL Photo, [10] Status
    sheet.appendRow([
      refId,
      timestampStr,
      collegeName,
      clName,
      "'" + clPhone, // Forced text format with leading single quote
      aclName,
      "'" + aclPhone, // Forced text format with leading single quote
      clPhotoRef,
      aclPhotoRef,
      "Accredited"
    ]);

    var newRow = sheet.getLastRow();
    // Explicitly set phone columns (Cols 5 and 7) number format to text
    sheet.getRange(newRow, 5).setNumberFormat("@");
    sheet.getRange(newRow, 7).setNumberFormat("@");

    // Center align status & reference columns
    sheet.getRange(newRow, 1).setHorizontalAlignment("center");
    sheet.getRange(newRow, 2).setHorizontalAlignment("center");
    sheet.getRange(newRow, 5).setHorizontalAlignment("center");
    sheet.getRange(newRow, 7).setHorizontalAlignment("center");
    sheet.getRange(newRow, 10).setHorizontalAlignment("center");
    sheet.getRange(newRow, 10).setFontWeight("bold");
    sheet.getRange(newRow, 10).setFontColor("#25855A"); // Emerald green status text

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      refId: refId,
      timestamp: timestampStr,
      college: collegeName,
      clName: clName,
      clPhone: clPhone,
      aclName: aclName,
      aclPhone: aclPhone,
      message: "Delegation accredited successfully."
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (globalErr) {
    Logger.log("Critical doPost error: " + globalErr.toString());
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "Server error occurred: " + globalErr.message
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/**
 * HTTP GET Handler:
 * Health-check endpoint to verify script deployment, connectivity, and active status.
 */
function doGet(e) {
  var sheetTitle = "Unknown";
  var rowCount = 0;
  try {
    var sheet = getTargetSheet();
    sheetTitle = sheet.getParent().getName();
    rowCount = sheet.getLastRow();
  } catch (err) {
    sheetTitle = "Spreadsheet Access Check: " + err.message;
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: "active",
    service: "Samanvay 2027 CL Meet Accreditation API",
    fest: CONFIG.FEST_NAME,
    conclave: CONFIG.CONCLAVE,
    institution: "Thakur Specialized Degree College (TSPDC)",
    spreadsheet: sheetTitle,
    spreadsheetId: SPREADSHEET_ID,
    registeredCount: Math.max(0, rowCount - 1),
    timestamp: Utilities.formatDate(new Date(), CONFIG.TIMEZONE, "dd/MM/yyyy HH:mm:ss 'IST'")
  }, null, 2)).setMimeType(ContentService.MimeType.JSON);
}

/**
 * 1-Click Verification & Permission Grant Function:
 * Run this function directly inside the Google Apps Script editor to:
 * 1. Grant initial Google authorization to read/write to your Google Sheet.
 * 2. Automatically create the bold, frozen 10-column header row.
 * 3. Add a verified test accreditation row to prove it works.
 */
function testAccreditationSubmission() {
  var testPayload = {
    postData: {
      contents: JSON.stringify({
        refId: "METGALA-VIP-CL-TEST",
        college: "Thakur Specialized Degree College (TSPDC)",
        clName: "Test Contingent Leader",
        clPhone: "9876543210",
        aclName: "Test Assistant Leader",
        aclPhone: "9876543211",
        clPhoto: null,
        aclPhoto: null,
        institution_secret: ""
      })
    }
  };

  var response = doPost(testPayload);
  Logger.log("doPost Test Result: " + response.getContent());
}
