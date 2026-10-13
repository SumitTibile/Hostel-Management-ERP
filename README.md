# Hostel Management System (ERP) - BSiET

Web-based hostel ERP module: student registration, room allocation, fee tracking,
complaints, dashboard, and a student fee-payment page with UPI QR code.

## Run
Open `index.html` in a browser (internet needed once for React and QR libraries from cdnjs).
Or serve it: `python -m http.server 8000` then visit http://localhost:8000

## Files
- index.html - page shell and library scripts (React 18.3.1, qrcode-generator 1.4.4)
- styles.css - BSiET colour theme (blue / orange / yellow), light and dark mode
- app.js     - all modules: Dashboard, Students, Rooms, Fees, Complaints, Pay fees

## Notes
- Data is saved in the browser (localStorage). Use "Reset demo" to restore sample data.
- Roles: Warden/Admin and Student (switch from the top bar). No real login yet.
- Payment gateway is a demo: no real money moves. Replace UPI ID `bsiet.hostel@upi` in app.js.

## Planned stack (from project technology table)
React + TypeScript + Vite, Tailwind CSS, Recharts, jsPDF/SheetJS exports,
Firebase Auth + Firestore, Node.js + Express (TypeScript) with PostgreSQL.
