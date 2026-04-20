# Google Apps Script — Complete Setup Guide (From Scratch)

Follow every step exactly. This will set up:
- ✅ Spreadsheet logging (Name, Phone, Email, Timestamp)
- ✅ Automatic confirmation email with Golden Pass styling

---

## Step 1: Create a New Google Spreadsheet

1. Go to [sheets.google.com](https://sheets.google.com)
2. **Make sure you're logged into the Google account you want emails sent FROM** (e.g., `malabhshortfilm@gmail.com`)
3. Click **"+ Blank"** to create a new spreadsheet
4. Name it: `Malabh Registrations`
5. In **Row 1**, type these headers in cells A1 through D1:

| A1 | B1 | C1 | D1 |
|:--|:--|:--|:--|
| Name | Phone | Email | Registered At |

6. Leave the rest empty. Save it (it auto-saves).

---

## Step 2: Open Apps Script Editor

1. In the spreadsheet, click **Extensions → Apps Script**
2. A new tab opens with the script editor
3. **Delete everything** in the code editor (the default `myFunction` code)

---

## Step 3: Paste This Code

Copy and paste this **entire block** into the editor:

```javascript
// ═══════════════════════════════════════════════════════════
// MALABH — Registration Handler + Email Confirmation
// ═══════════════════════════════════════════════════════════

function doPost(e) {
  try {
    // 1. Get the spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // 2. Read form data
    var name  = e.parameter.name  || "";
    var phone = e.parameter.phone || "";
    var email = e.parameter.email || "";
    var timestamp = new Date();
    
    // 3. Save to spreadsheet
    sheet.appendRow([name, phone, email, timestamp]);
    
    // 4. Send confirmation email (only if email is provided)
    if (email && email.length > 0) {
      sendConfirmationEmail(email, name);
    }
    
    // 5. Return success
    return ContentService
      .createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Log error but still return success (so the website doesn't break)
    Logger.log("Error: " + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Malabh Registration API is running.");
}

// ═══════════════════════════════════════════════════════════
// EMAIL CONFIRMATION
// ═══════════════════════════════════════════════════════════

function sendConfirmationEmail(userEmail, userName) {
  var subject = "🎬 Your Golden Pass for Malabh Premiere";
  
  var htmlBody = '<!DOCTYPE html>' +
    '<html><head><meta charset="UTF-8"></head><body style="margin:0;padding:0;background:#050505;font-family:Arial,sans-serif;">' +
    '<div style="max-width:600px;margin:0 auto;background:#0a0a0a;border:1px solid #c9a84c;">' +
    
    // Header
    '<div style="text-align:center;padding:40px 30px 20px;border-bottom:1px solid #1a1a1a;">' +
    '<h1 style="color:#c9a84c;font-size:28px;margin:0;letter-spacing:3px;">MALABH</h1>' +
    '<p style="color:#888;font-size:12px;letter-spacing:2px;margin-top:8px;">A SHORT FILM</p>' +
    '</div>' +
    
    // Body
    '<div style="padding:30px;">' +
    '<p style="color:#ffffff;font-size:16px;line-height:1.6;">Hello <strong>' + userName + '</strong>,</p>' +
    '<p style="color:#cccccc;font-size:14px;line-height:1.8;">Thank you for registering for the premiere screening of <strong style="color:#c9a84c;">Malabh</strong>. Your Golden Pass has been confirmed.</p>' +
    
    // Event Details Box
    '<div style="background:#111;border-left:3px solid #c9a84c;padding:20px;margin:25px 0;">' +
    '<p style="margin:0 0 8px;color:#c9a84c;font-size:13px;letter-spacing:1px;">EVENT DETAILS</p>' +
    '<p style="margin:4px 0;color:#fff;font-size:14px;">📅 <strong>10 May 2026, Sunday</strong></p>' +
    '<p style="margin:4px 0;color:#fff;font-size:14px;">⏰ <strong>9:00 AM onwards</strong></p>' +
    '<p style="margin:4px 0;color:#fff;font-size:14px;">📍 <strong>Padma Talkies, Kolhapur</strong></p>' +
    '</div>' +
    
    '<p style="color:#cccccc;font-size:14px;line-height:1.8;">Please keep your <strong style="color:#c9a84c;">Golden Pass</strong> ready on your phone for entry at the venue.</p>' +
    '<p style="color:#cccccc;font-size:14px;line-height:1.8;">We look forward to seeing you there!</p>' +
    
    '<p style="color:#888;font-size:13px;margin-top:30px;">Warm regards,<br><strong style="color:#c9a84c;">Team Malabh</strong><br>Evolvin\' Media</p>' +
    '</div>' +
    
    // Footer
    '<div style="text-align:center;padding:20px;border-top:1px solid #1a1a1a;background:#050505;">' +
    '<p style="color:#555;font-size:11px;margin:0;">&copy; 2026 Evolvin\' Media. All rights reserved.</p>' +
    '</div>' +
    
    '</div></body></html>';

  GmailApp.sendEmail(userEmail, subject, 
    "Your Golden Pass for Malabh Premiere has been confirmed. Date: 10 May 2026, 9:00 AM at Padma Talkies, Kolhapur.", 
    {
      htmlBody: htmlBody,
      name: "Malabh Official"
    }
  );
}

// ═══════════════════════════════════════════════════════════
// TEST FUNCTION (run this manually to verify email works)
// ═══════════════════════════════════════════════════════════

function testEmail() {
  sendConfirmationEmail("YOUR_EMAIL_HERE@gmail.com", "Test User");
  Logger.log("Test email sent!");
}
```

---

## Step 4: Test the Email (Optional but Recommended)

1. In the code, find the `testEmail()` function at the bottom
2. Replace `YOUR_EMAIL_HERE@gmail.com` with **your own email**
3. At the top of the editor, select **`testEmail`** from the function dropdown
4. Click the **▶ Run** button
5. Google will ask you to **authorize** the script:
   - Click "Review Permissions"
   - Choose your Google account
   - Click "Advanced" → "Go to Malabh Registrations (unsafe)"
   - Click "Allow"
6. Check your email inbox — you should receive the styled confirmation!

---

## Step 5: Deploy as Web App

1. Click **Deploy → New deployment**
2. Click the ⚙️ gear icon next to "Select type" → choose **Web app**
3. Fill in:
   - **Description**: `Malabh Registration v1`
   - **Execute as**: `Me (your email)`
   - **Who has access**: `Anyone`
4. Click **Deploy**
5. **COPY the Web app URL** — it looks like:
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```

---

## Step 6: Update the Website Code

Give me the new URL and I will update `script.js` with it. Or if the URL is the same as before, no change needed.

---

## Step 7: Test Everything

1. Deploy website to Vercel
2. On your phone, fill the form and hit "Confirm My Booking"
3. Verify:
   - [ ] Golden Pass modal appears with image
   - [ ] Download button works
   - [ ] New row appears in Google Sheet
   - [ ] Confirmation email arrives in the user's inbox

---

## 📧 About the Email Address

> [!IMPORTANT]
> **Emails are ALWAYS sent from the Google account that owns the script.**
> 
> - If you create this script while logged into `malabhshortfilm@gmail.com`, emails come from that address.
> - If you create it from `yourpersonal@gmail.com`, emails come from that address.
> - **You cannot choose a different "from" address** — this is a Google security restriction.
> 
> **Recommendation**: Create the script from `malabhshortfilm@gmail.com` so emails look official.

## ⚠️ Google Email Limits

- Free Gmail account: **100 emails per day**
- Google Workspace account: **1,500 emails per day**
- This should be more than enough for a premiere event registration.
