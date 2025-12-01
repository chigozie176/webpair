// DOM Elements
const countrySelect = document.getElementById('countryCode');
const prefixDisplay = document.getElementById('prefixDisplay');
const phoneInput = document.getElementById('phoneNumber');
const codeValue = document.getElementById('codeValue');
const pairingCode = document.getElementById('pairingCode');
const codeExpiry = document.getElementById('codeExpiry');
const codeFor = document.getElementById('codeFor');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const statusMessage = document.getElementById('statusMessage');
const progressFill = document.getElementById('progressFill');
const validTime = document.getElementById('validTime');
const userCount = document.getElementById('userCount');

// State
let currentCode = null;
let expiryTimer = null;
let currentCountryCode = '234';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('DEMO-NXMD Pairing System initialized');
    updateUserCount();
    
    // Country code change
    countrySelect.addEventListener('change', function() {
        currentCountryCode = this.value;
        prefixDisplay.textContent = `+${this.value}`;
    });
    
    // Phone number validation
    phoneInput.addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '');
    });
});

// Generate 8-digit pairing code
function generatePairingCode() {
    const phone = phoneInput.value.trim();
    const countryCode = currentCountryCode;
    
    // Validate phone number
    if (!phone || !/^\d{7,15}$/.test(phone)) {
        showNotification('Please enter valid phone number', 'error');
        return;
    }
    
    const fullNumber = countryCode + phone;
    
    // Update status
    updateStatus('pending', 'Generating 8-digit code...');
    progressFill.style.width = '30%';
    
    // Simulate API call
    setTimeout(() => {
        // Generate 8-digit code
        const code = generate8DigitCode();
        currentCode = code;
        
        // Display code
        displayCode(code, fullNumber);
        
        // Update progress
        progressFill.style.width = '100%';
        
        // Show success
        showNotification('8-digit code generated! Send to DEMO-NXMD', 'success');
        
        // Update user count
        updateUserCount();
        
    }, 1000);
}

// Generate 8-digit code
function generate8DigitCode() {
    const code = Math.floor(10000000 + Math.random() * 90000000).toString();
    // Format: XXXX-XXXX
    return code.substring(0, 4) + '-' + code.substring(4);
}

// Display code
function displayCode(code, fullNumber) {
    // Update display
    codeValue.textContent = code;
    pairingCode.textContent = code;
    codeValue.style.color = '#25D366';
    
    // Show for which number
    const maskedNumber = `+${fullNumber.substring(0, 3)}XXX${fullNumber.substring(fullNumber.length - 4)}`;
    codeFor.textContent = `For: ${maskedNumber}`;
    codeFor.style.display = 'block';
    
    // Start expiry timer (10 minutes)
    startExpiryTimer();
    
    // Update status
    updateStatus('active', `Send "!pair ${code}" to DEMO-NXMD`);
    
    // Auto copy after 1 second
    setTimeout(copyCode, 1000);
}

// Start expiry timer
function startExpiryTimer() {
    if (expiryTimer) clearInterval(expiryTimer);
    
    let timeLeft = 600; // 10 minutes in seconds
    
    expiryTimer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(expiryTimer);
            codeExpiry.textContent = 'Expired';
            codeExpiry.style.color = '#ff4757';
            validTime.textContent = '00:00';
            codeValue.style.color = '#ff4757';
            updateStatus('expired', 'Code expired - generate new one');
            currentCode = null;
            return;
        }
        
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        codeExpiry.textContent = `Expires in: ${minutes}:${seconds.toString().padStart(2, '0')}`;
        validTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (minutes < 2) {
            codeExpiry.style.color = '#ffa502';
            validTime.style.color = '#ffa502';
        } else {
            codeExpiry.style.color = '#2ed573';
            validTime.style.color = '#2ed573';
        }
        
        timeLeft--;
    }, 1000);
}

// Copy code to clipboard
function copyCode() {
    if (!currentCode) {
        showNotification('Generate a code first', 'error');
        return;
    }
    
    // Remove dash for copying
    const codeToCopy = currentCode.replace('-', '');
    
    navigator.clipboard.writeText(codeToCopy).then(() => {
        showNotification('8-digit code copied!', 'success');
        
        // Update button
        const btn = document.querySelector('.btn-copy');
        const original = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        btn.style.background = '#2ed573';
        btn.style.borderColor = '#2ed573';
        
        setTimeout(() => {
            btn.innerHTML = original;
            btn.style.background = '';
            btn.style.borderColor = '';
        }, 2000);
    });
}

// Copy command to clipboard
function copyCommand() {
    if (!currentCode) {
        showNotification('Generate a code first', 'error');
        return;
    }
    
    const codeToCopy = currentCode.replace('-', '');
    const command = `!pair ${codeToCopy}`;
    
    navigator.clipboard.writeText(command).then(() => {
        const btn = document.querySelector('.btn-copy-small');
        const original = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i>';
        btn.style.background = '#2ed573';
        btn.style.borderColor = '#2ed573';
        
        showNotification('Command copied!', 'success');
        
        setTimeout(() => {
            btn.innerHTML = original;
            btn.style.background = '';
            btn.style.borderColor = '';
        }, 2000);
    });
}

// Update status
function updateStatus(state, message) {
    statusDot.className = 'status-dot';
    switch(state) {
        case 'ready':
            statusText.textContent = 'Ready';
            statusDot.classList.add('active');
            break;
        case 'pending':
            statusText.textContent = 'Generating';
            statusDot.classList.add('pending');
            break;
        case 'active':
            statusText.textContent = 'Active';
            statusDot.classList.add('active');
            break;
        case 'expired':
            statusText.textContent = 'Expired';
            statusDot.classList.add('error');
            break;
    }
    
    statusMessage.textContent = message;
}

// Update user count
function updateUserCount() {
    const baseCount = 1247;
    const randomIncrement = Math.floor(Math.random() * 5);
    userCount.textContent = (baseCount + randomIncrement).toLocaleString();
}

// Show notification
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    if (!document.getElementById('notification-style')) {
        const style = document.createElement('style');
        style.id = 'notification-style';
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 10px;
                display: flex;
                align-items: center;
                gap: 10px;
                z-index: 9999;
                animation: slideIn 0.3s ease;
                backdrop-filter: blur(10px);
            }
            .notification.success {
                background: rgba(46, 213, 115, 0.2);
                border: 1px solid #2ed573;
                color: #2ed573;
            }
            .notification.error {
                background: rgba(255, 71, 87, 0.2);
                border: 1px solid #ff4757;
                color: #ff4757;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Utility functions
function scrollToPair() {
    document.getElementById('pair').scrollIntoView({ behavior: 'smooth' });
}