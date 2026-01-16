# 🎨 EHR Frontend - UI Testing Guide

## 🚀 **How to View the UI**

### **Step 1: Start the Dev Server**

```bash
cd ehr-frontend
npm run dev
```

You should see:
```
VITE v5.x.x ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

## 📍 **All Available Routes**

### **1. Quick Access Hub** (Start Here!)
```
http://localhost:5173/dashboard
```
**What you'll see:**
- Quick links to all dashboards
- Test credentials display
- Description of each dashboard
- Links to auth pages

---

### **2. Landing/Home Page**
```
http://localhost:5173/
```
**Features:**
- Hero section with gradient background
- Feature cards (AES-128, Blockchain, Patient Control)
- Role selection cards
- Login/Register buttons

---

### **3. Authentication Pages**

#### Login Page
```
http://localhost:5173/auth/login
```
**Features:**
- Two-column layout (Branding + Form)
- Role selection dropdown
- Email/Password inputs
- Remember me checkbox
- MetaMask login button
- Link to register page

**Test Credentials** (UI only, not functional yet):
```
Patient:  john.doe@patient.com / patient123
Doctor:   sarah.johnson@doctor.com / doctor123
Staff:    emily.davis@staff.com / staff123
```

#### Register Page
```
http://localhost:5173/auth/register
```
**Features:**
- Centered card layout
- Role-based conditional fields:
  - **Patient**: Date of Birth, Blood Group
  - **Doctor**: Specialty, License Number
  - **Staff**: Department, Employee ID
- Password confirmation
- Terms & Conditions checkbox
- MetaMask registration option

---

### **4. Dashboards** (Direct Access - No Login Required!)

#### 👤 Patient Dashboard
```
http://localhost:5173/dashboard/patient
```

**7 Sections:**
1. **Dashboard** (Default)
   - 4 stat cards with accent borders
   - Recent activity timeline
   - Access requests preview

2. **My Profile**
   - Editable patient information
   - Blood group, DOB, gender, etc.
   - Edit/Save functionality with toast

3. **Medical Records**
   - Grid layout (3 columns)
   - 5 sample records with real data
   - Type badges (Lab, Prescription, Imaging)
   - View/Download/Delete buttons
   - Encryption status indicator

4. **Upload Record**
   - File upload form
   - Record type selector
   - Description textarea
   - AES-128 encryption callout
   - Upload & Encrypt button

5. **Access Requests**
   - 2 pending requests with full details
   - Requester profiles (avatar, name, specialty)
   - Reason, duration, timestamp
   - Approve/Deny buttons (with toast)

6. **Permissions**
   - Active permissions list
   - Access level (Read/Full)
   - Grant/Expiry dates
   - Revoke button (with toast)

7. **Audit Log**
   - Timeline-style layout
   - Type-specific icons and colors
   - Complete activity history
   - Filter dropdown (All/Access/Upload/Permission)

**Mock Data:**
- 5 medical records
- 2 pending access requests
- 2 active permissions
- 8 audit log entries

---

#### 👨‍⚕️ Doctor Dashboard
```
http://localhost:5173/dashboard/doctor
```

**5 Sections:**
1. **Dashboard**
   - Stats: Authorized Patients, Records Accessed
   - Recent activity
   - My patients preview

2. **My Profile**
   - Doctor-specific fields (Specialty, License Number)
   - Hospital/Clinic info

3. **My Patients**
   - List of 6 authorized patients
   - Last accessed date
   - View Records button

4. **Request Access**
   - Patient search field
   - Reason for access textarea
   - Access duration selector
   - Pending requests list

5. **Patient Records**
   - Patient selector dropdown
   - Records grid view
   - View record button

---

#### 🏥 Staff Dashboard
```
http://localhost:5173/dashboard/staff
```

**5 Sections:**
1. **Dashboard**
   - Stats: Authorized Patients, Records Accessed
   - Recent activity
   - My patients preview

2. **My Profile**
   - Staff-specific fields (Department, Employee ID)
   - Hospital/Facility info

3. **My Patients**
   - List of authorized patients
   - Last accessed date
   - View Records button

4. **Request Access**
   - Patient search
   - Reason textarea
   - Duration selector
   - Pending requests

5. **Patient Records**
   - Patient selector
   - Records grid
   - View functionality

---

## 🎨 **UI Features to Check**

### **Animations & Transitions**
✅ Hover effects on cards (shadow + scale)
✅ Smooth transitions (200-300ms)
✅ Button hover states
✅ Icon animations
✅ Toast notifications (bottom-right)
✅ Sidebar collapse animation

### **Color-Coded Elements**
✅ **Status Badges:**
  - Pending: Orange
  - Approved: Green
  - Denied: Red
  - Active: Green
  - Expired: Gray

✅ **Record Type Badges:**
  - Lab: Blue
  - Prescription: Green
  - Imaging: Purple
  - Diagnosis: Orange
  - Other: Gray

✅ **Stat Cards:**
  - Total Records: Blue accent
  - Authorized Users: Green accent
  - Pending Requests: Orange accent
  - Recent Activity: Purple accent

### **Interactive Elements**
✅ Click nav items to switch sections
✅ Click "Approve" button → Green toast
✅ Click "Deny" button → Red toast
✅ Click "Revoke" button → Info toast
✅ Edit Profile → Save Changes → Success toast
✅ Upload Record → Submit → Success toast
✅ Hover cards for shadow effect
✅ Responsive sidebar (mobile collapse)

### **Responsive Design**
✅ Test on mobile (360px)
✅ Test on tablet (768px)
✅ Test on desktop (1920px)
✅ Sidebar collapses on mobile
✅ Grid layouts stack properly
✅ Touch-friendly button sizes

---

## 🔔 **Toast Notifications**

Watch for these notifications when clicking buttons:

```
✅ Success (Green):
- "Approved access request from Dr. Sarah Johnson"
- "Profile updated successfully!"
- "Medical record uploaded and encrypted successfully!"

❌ Error (Red):
- "Denied access request from Dr. Michael Chen"

ℹ️ Info (Blue):
- "Revoked access permission for Emily Davis"
```

**Location:** Bottom-right corner

---

## 📊 **Mock Data Overview**

All dashboards use realistic static data from `src/lib/data/mockData.ts`:

### **Users:**
- John Doe (Patient)
- Jane Smith (Patient)
- Dr. Sarah Johnson (Cardiologist)
- Dr. Michael Chen (Neurologist)
- Emily Davis (Nursing Staff)

### **Medical Records:**
- Blood Test Results (Lab)
- Cardiology Consultation (Diagnosis)
- Chest X-Ray (Imaging)
- Prescription - Antibiotics (Prescription)
- MRI Scan - Brain (Imaging)

### **Access Requests:**
- Dr. Sarah Johnson → Pending
- Dr. Michael Chen → Pending
- Emily Davis → Approved

### **Permissions:**
- Dr. Sarah Johnson → Active (Full Access)
- Emily Davis → Active (Read Access)
- Dr. Michael Chen → Expired

---

## 🎯 **Testing Checklist**

### **Navigation**
- [ ] Home page loads correctly
- [ ] Login page displays properly
- [ ] Register page shows role-based fields
- [ ] Dashboard hub shows all links
- [ ] Patient dashboard accessible
- [ ] Doctor dashboard accessible
- [ ] Staff dashboard accessible

### **Patient Dashboard**
- [ ] Stats show correct numbers (5, 2, 2, 8)
- [ ] Recent activity shows 4 items
- [ ] Access requests show 2 pending
- [ ] Medical records grid shows 5 items
- [ ] Upload form displays
- [ ] Permissions list shows 2 items
- [ ] Audit log shows 8 entries
- [ ] All nav items work
- [ ] Profile edit/save works

### **Interactions**
- [ ] Approve button shows green toast
- [ ] Deny button shows red toast
- [ ] Revoke button shows info toast
- [ ] Save profile shows success toast
- [ ] Upload form shows success toast
- [ ] Hover effects work on cards
- [ ] Sidebar toggles on mobile
- [ ] All buttons have hover states

### **Design**
- [ ] Colors match design system
- [ ] Status badges show correct colors
- [ ] Record type badges colored properly
- [ ] Stat cards have accent borders
- [ ] Icons have contextual colors
- [ ] Typography hierarchy clear
- [ ] Spacing consistent
- [ ] Rounded corners applied

---

## 📝 **Notes**

**Current Status:**
- ✅ UI Shell: Complete
- ✅ Static Data: Complete
- ✅ Animations: Complete
- ✅ Color System: Complete
- ✅ Responsive Design: Complete
- ⏳ Authentication: Not connected (UI preview mode)
- ⏳ Backend API: Not connected
- ⏳ Real Functionality: Not implemented yet

**What Works:**
- All navigation
- Section switching
- Visual feedback (hover, transitions)
- Toast notifications
- Static data display
- Form layouts

**What Doesn't Work Yet:**
- Actual login/authentication
- Form submissions
- File uploads
- API calls
- Data persistence
- MetaMask integration

---

## 🆘 **Troubleshooting**

### **Issue: Dev server won't start**
```bash
cd ehr-frontend
npm install
npm run dev
```

### **Issue: Page not found**
- Make sure dev server is running
- Check the URL exactly matches the routes above
- Try clearing browser cache (Ctrl+Shift+R)

### **Issue: Toast not showing**
- Check bottom-right corner of screen
- Make sure you clicked an action button (Approve, Deny, Revoke, Save)

### **Issue: Styles look broken**
```bash
# Rebuild Tailwind
npm run build
npm run dev
```

---

## 🎉 **Enjoy Testing!**

**Recommended Flow:**
1. Start at http://localhost:5173/dashboard (Hub)
2. Click "Patient Dashboard"
3. Test all 7 sections
4. Try interactive buttons for toasts
5. Check responsive design (resize browser)
6. Visit Doctor and Staff dashboards
7. Check Auth pages for form UI
8. Return to Landing page for hero section

**Questions?** Check:
- `UI_CONVERSION_SUMMARY.md` - Initial conversion details
- `UI_UPGRADE_SUMMARY.md` - Latest upgrades and improvements
- `UI_TESTING_GUIDE.md` - This file!

---

**Status:** ✅ **UI Complete & Ready for Testing!**

