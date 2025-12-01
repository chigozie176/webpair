🚀 Overview
ALASTOR-MD is a professional WhatsApp bot pairing system that allows users to securely connect their WhatsApp numbers to the ALASTOR-MD bot through a unique code-based pairing mechanism.

✨ Features
🔐 Secure Pairing: Generate unique 6-digit pairing codes

⚡ Real-time Updates: Live connection status via Socket.io

🤖 Bot Integration: REST API for bot verification

📱 Responsive Design: Works on all devices

🔔 Notifications: Real-time alerts and status updates

📊 Analytics: Live user statistics and pairing metrics

🎨 Professional UI: Modern dark theme with WhatsApp colors

🛠️ How It Works
User visits the pairing website

Enters WhatsApp number (234XXXXXXXX format)

Generates unique code (6-digit)

Sends code to ALASTOR-MD bot via WhatsApp: !pair YOUR_CODE

Bot verifies code with our API

Connection established - User can now use bot features

📁 Project Structure
text
alastor-md-pairing/
├── index.html          # Main website interface
├── styles.css          # Professional styling
├── script.js           # Frontend logic & Socket.io
├── server.js           # Backend API & WebSocket server
├── package.json        # Dependencies
├── vercel.json         # Vercel deployment config
├── .env.example        # Environment variables template
└── README.md           # This documentation
🌐 API Endpoints
For Users (Website)
GET / - Main pairing interface

GET /api/status - Server status & statistics

GET /api/check-paired/:phone - Check pairing status

For Bot Integration
POST /api/verify-pairing - Verify pairing codes

json
{
  "code": "123456",
  "botNumber": "DEMO-NXMD",
  "userNumber": "2347030626048"
}
🚀 Quick Deployment
Method 1: Vercel CLI
bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
Method 2: GitHub + Vercel Dashboard
Push to GitHub:

bash
git init
git add .
git commit -m "🚀 Deploy ALASTOR-MD Pairing System"
git branch -M main
git remote add origin https://github.com/chigozie176/webpair.git
git push -u origin main
Deploy on Vercel:

Go to vercel.com

Click "Add New" → "Project"

Import your GitHub repository

Click "Deploy"

Your site will be live instantly!

⚙️ Environment Variables
Create a .env file:

env
PORT=3000
NODE_ENV=production
SITE_URL=https://alastor-xd.vercel.app
ADMIN_PHONE=2347030626048
📱 Usage Instructions
For Users:
Visit the pairing website

Enter your WhatsApp number (Nigeria: 234XXXXXXXXXX)

Click "Generate Pairing Code"

Copy the 6-digit code

Open WhatsApp and send !pair YOUR_CODE to DEMO-NXMD

Wait for confirmation message

For Bot Developers:
The bot should listen for !pair command

Extract the code from user message

Call POST /api/verify-pairing with user details

Handle response and notify user

🛡️ Security Features
Codes expire after 10 minutes

One code per number at a time

Rate limiting protection

Secure WebSocket connections

Input validation and sanitization

📊 Statistics
Real-time user count

Active pairing sessions

Success rate tracking

Uptime monitoring

🤝 Community & Support
📞 Contact Developer
WhatsApp Support: +2347030626048

Email: mbanemew9@gmail.com

Telegram Support: @alastormd_support

🌐 Follow & Join Our Communities
📱 WhatsApp
WhatsApp Channel: ALASTOR-MD Updates

WhatsApp Group: ALASTOR-MD Community

📢 Telegram
Telegram Channel: @codexemp

Telegram Group 1: codexempchatroom

🎬 Social Media
YouTube: ALASTOR-MD Tutorials

TikTok: @alastormd

GitHub: github.com/C0D3-BR34K3R001

👨‍💻 Development
Local Development
bash
# Clone repository
git clone https://github.com/chigozie176/webpair.git
cd alastor-md-pairing

# Install dependencies
npm install

# Start development server
npm run dev

# Visit http://localhost:3000
Dependencies
express - Web server framework

socket.io - Real-time communication

cors - Cross-origin resource sharing

Production Deployment
bash
# Build for production
npm install --production

# Start server
npm start
📈 Monitoring
Real-time user connections

API request logging

Error tracking

Performance metrics

🔧 Troubleshooting
Common Issues:
Code not generating?

Check internet connection

Refresh the page

Clear browser cache

Pairing failed?

Ensure code is entered correctly

Check if code expired (10 minutes)

Verify WhatsApp number format

Website not loading?

Check Vercel deployment status

Verify domain configuration

Check browser compatibility

Support Channels:
GitHub Issues: Report Bugs

WhatsApp Support: +2347030626048

Email: mbanemew9@gmaail.com

📄 License
This project is proprietary software developed by Dark Codex Empire. All rights reserved.

🏆 Credits & Acknowledgments
Developed By:
Dark Codex Empire
by CODEBREAKER

Special Thanks:
WhatsApp Web.js community

Socket.io team

Vercel for hosting

All beta testers and contributors

Disclaimer:
This project is not affiliated with, endorsed by, or in any way associated with WhatsApp Inc. WhatsApp is a registered trademark of WhatsApp Inc.

🚨 Important Notes
Keep your pairing codes confidential

Codes are valid for 10 minutes only

One active pairing per number

Report suspicious activity immediately

Use official links only to avoid phishing

🔄 Updates & Changelog
Latest updates will be posted on:

WhatsApp Channel

Telegram Channel

GitHub Releases

⭐ Support the Project
If you find this project helpful, please:

Star the GitHub repository

Share with friends

Join our communities

Report bugs and suggest features

Made with ❤️ by Dark Codex Empire