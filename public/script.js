// Country code data
const countryData = {
    "1": { name: "USA/Canada", flag: "🇺🇸", min: 10, max: 11 },
    "44": { name: "UK", flag: "🇬🇧", min: 10, max: 11 },
    "91": { name: "India", flag: "🇮🇳", min: 10, max: 10 },
    "234": { name: "Nigeria", flag: "🇳🇬", min: 10, max: 10 },
    "233": { name: "Ghana", flag: "🇬🇭", min: 9, max: 9 },
    "254": { name: "Kenya", flag: "🇰🇪", min: 9, max: 9 },
    "255": { name: "Tanzania", flag: "🇹🇿", min: 9, max: 9 },
    "256": { name: "Uganda", flag: "🇺🇬", min: 9, max: 9 },
    "27": { name: "South Africa", flag: "🇿🇦", min: 9, max: 9 },
    "20": { name: "Egypt", flag: "🇪🇬", min: 10, max: 10 },
    "62": { name: "Indonesia", flag: "🇮🇩", min: 9, max: 12 },
    "55": { name: "Brazil", flag: "🇧🇷", min: 10, max: 11 },
    "52": { name: "Mexico", flag: "🇲🇽", min: 10, max: 10 },
    "34": { name: "Spain", flag: "🇪🇸", min: 9, max: 9 },
    "33": { name: "France", flag: "🇫🇷", min: 9, max: 9 },
    "49": { name: "Germany", flag: "🇩🇪", min: 10, max: 11 },
    "39": { name: "Italy", flag: "🇮🇹", min: 9, max: 10 },
    "7": { name: "Russia", flag: "🇷🇺", min: 10, max: 10 },
    "81": { name: "Japan", flag: "🇯🇵", min: 10, max: 11 },
    "82": { name: "South Korea", flag: "🇰🇷", min: 9, max: 10 },
    "86": { name: "China", flag: "🇨🇳", min: 11, max: 11 },
    "65": { name: "Singapore", flag: "🇸🇬", min: 8, max: 8 },
    "60": { name: "Malaysia", flag: "🇲🇾", min: 9, max: 10 },
    "63": { name: "Philippines", flag: "🇵🇭", min: 10, max: 10 },
    "61": { name: "Australia", flag: "🇦🇺", min: 9, max: 9 },
    "64": { name: "New Zealand", flag: "🇳🇿", min: 8, max: 9 },
    "971": { name: "UAE", flag: "🇦🇪", min: 9, max: 9 },
    "966": { name: "Saudi Arabia", flag: "🇸🇦", min: 9, max: 9 },
    "90": { name: "Turkey", flag: "🇹🇷", min: 10, max: 10 },
    "92": { name: "Pakistan", flag: "🇵🇰", min: 10, max: 10 },
    "880": { name: "Bangladesh", flag: "🇧🇩", min: 10, max: 10 },
    "93": { name: "Afghanistan", flag: "🇦🇫", min: 9, max: 9 },
    "98": { name: "Iran", flag: "🇮🇷", min: 10, max: 10 },
    "212": { name: "Morocco", flag: "🇲🇦", min: 9, max: 9 },
    "213": { name: "Algeria", flag: "🇩🇿", min: 9, max: 9 },
    "216": { name: "Tunisia", flag: "🇹🇳", min: 8, max: 8 }
};

// DOM Elements
const countryCodeSelect = document.getElementById('countryCode');
const customCodeContainer = document.getElementById('customCodeContainer');
const customCountryCode = document.getElementById('customCountryCode');
const dynamicPrefix = document.getElementById('dynamicPrefix');
const phoneInput = document.getElementById('phoneInput');
const codeText = document.getElementById('codeText');
const commandCode = document.getElementById('commandCode');
const expiryText = document.getElementById('expiryText');
const fullNumberDisplay = document.getElementById('fullNumberDisplay');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const statusMessage = document.getElementById('statusMessage');
const progressBar = document.getElementById('progressBar');
const validTime = document.getElementById('validTime');
const countryName = document.getElementById('countryName');
const pairedCount = document.getElementById('pairedCount');

// State
let currentCode = null;
let expiryTimer = null;
let currentCountryCode = "234";
let currentCountryName = "Nigeria";

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌍 ALASTOR-MD Global Pairing System initialized');
    setupEventListeners();
    initUI();
    updatePairedCount();
});

// Setup event listeners
function setupEventListeners() {
    if (countryCodeSelect) {
        countryCodeSelect.addEventListener('change', handleCountryCodeChange);
    }
    
    if (customCountryCode) {
        customCountryCode.addEventListener('input', handleCustomCodeInput);
    }
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/\D/g, '');
        });
        
        setTimeout(() => phoneInput.focus(), 1000);
    }
    
    // Mobile menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.innerHTML = navMenu.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
    }
}

// Initialize UI
function initUI() {
    updateStatus('ready', 'Enter your WhatsApp number to begin');
    countryName.textContent = currentCountryName;
    addNotificationStyles();
}

// Handle country code selection
function handleCountryCodeChange() {
    const selectedValue = countryCodeSelect.value;
    
    if (selectedValue === 'other') {
        customCodeContainer.style.display = 'block';
        currentCountryCode = "";
        dynamicPrefix.textContent = "+";
        countryName.textContent = "Custom";
        currentCountryName = "Custom";
    } else {
        customCodeContainer.style.display = 'none';
        currentCountryCode = selectedValue;
        dynamicPrefix.textContent = `+${selectedValue}`;
        
        if (countryData[selectedValue]) {
            currentCountryName = countryData[selectedValue].name;
            countryName.textContent = currentCountryName;
        }
    }
}

// Handle custom country code input
function handleCustomCodeInput() {
    const code = customCountryCode.value.replace(/\D/g, '');
    customCountryCode.value = code;
    
    if (code.length > 0) {
        currentCountryCode = code;
        dynamicPrefix.textContent = `+${code}`;
        currentCountryName = "Custom";
        countryName.textContent = "Custom";
    }
}

// Generate 8-digit pairing code
async function generateCode() {
    const phone = phoneInput.value.trim();
    const countryCode = currentCountryCode;
    
    // Validate
    if (!phone || !/^\d+$/.test(phone)) {
        showNotification('Please enter valid phone number', 'error');
        return;
    }
    
    if (!countryCode) {
        showNotification('Please select country code', 'error');
        return;
    }
    
    const fullNumber = countryCode + phone;
    
    // Show loading
    updateStatus('pending', 'Generating 8-digit pairing code...');
    progressBar.style.width = '30%';
    
    try {
        // Call API to generate code
        const response = await fetch('/api/generate-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phone: fullNumber
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Display code
            displayCode(data.code, fullNumber, data.expiresAt);
            progressBar.style.width = '100%';
            showNotification('8-digit pairing code generated!', 'success');
        } else {
            throw new Error(data.error || 'Failed to generate code');
        }
        
    } catch (error) {
        console.error('Error:', error);
        showNotification(error.message, 'error');
        updateStatus('error', 'Failed to generate code');
        progressBar.style.width = '0%';
    }
}

// Display generated 8-digit code
function displayCode(code, fullNumber, expiresAt) {
    currentCode = code;
    
    // Update display with 8-digit code
    codeText.textContent = code;
    commandCode.textContent = code;
    codeText.style.color = '#25D366';
    
    // Format code for better readability: XXXX-XXXX
    const formattedCode = code.replace(/(\d{4})(\d{4})/, '$1-$2');
    codeText.textContent = formattedCode;
    
    // Show full number (masked)
    const maskedNumber = `+${fullNumber.substring(0, 3)}XXXX${fullNumber.substring(fullNumber.length - 3)}`;
    fullNumberDisplay.textContent = `For: ${maskedNumber}`;
    fullNumberDisplay.style.display = 'block';
    
    // Start expiry timer
    startExpiryTimer(new Date(expiresAt));
    
    // Update status
    updateStatus('pending', `Send "!pair ${code}" to DEMO-NXMD`);
    
    // Auto copy
    setTimeout(copyCode, 800);
}

// Generate 8-digit random code
function generate8DigitCode() {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
}

// Start expiry timer
function startExpiryTimer(expiryTime) {
    if (expiryTimer) clearInterval(expiryTimer);
    
    expiryTimer = setInterval(() => {
        const now = new Date();
        const timeLeft = expiryTime - now;
        
        if (timeLeft <= 0) {
            clearInterval(expiryTimer);
            expiryText.textContent = 'Expired';
            expiryText.style.color = '#ff4757';
            validTime.textContent = '00:00';
            codeText.style.color = '#ff4757';
            updateStatus('error', 'Pairing code expired');
            currentCode = null;
            fullNumberDisplay.textContent = 'Code expired - generate new one';
            return;
        }
        
        const minutes = Math.floor(timeLeft / 60000);
        const seconds = Math.floor((timeLeft % 60000) / 1000);
        
        expiryText.textContent = `Expires in: ${minutes}:${seconds.toString().padStart(2, '0')}`;
        validTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (minutes < 2) {
            expiryText.style.color = '#ffa502';
            validTime.style.color = '#ffa502';
        } else {
            expiryText.style.color = '#2ed573';
            validTime.style.color = '#2ed573';
        }
    }, 1000);
}

// Copy code to clipboard
function copyCode() {
    if (!currentCode) {
        showNotification('Generate a code first', 'error');
        return;
    }
    
    // Copy the full 8-digit code without formatting
    navigator.clipboard.writeText(currentCode).then(() => {
        showNotification('8-digit code copied to clipboard!', 'success');
        
        const btn = document.querySelector('.btn-copy');
        if (btn) {
            const original = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            btn.style.background = '#2ed573';
            btn.style.borderColor = '#2ed573';
            
            setTimeout(() => {
                btn.innerHTML = original;
                btn.style.background = '';
                btn.style.borderColor = '';
            }, 2000);
        }
    }).catch(err => {
        console.error('Copy failed:', err);
        showNotification('Failed to copy code', 'error');
    });
}

// Copy command to clipboard
function copyCommand() {
    const command = `!pair ${currentCode || 'XXXXXXXX'}`;
    navigator.clipboard.writeText(command).then(() => {
        const copyBtn = document.querySelector('.btn-copy-small');
        if (copyBtn) {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            copyBtn.style.background = '#2ed573';
            copyBtn.style.borderColor = '#2ed573';
            
            showNotification('Command copied!', 'success');
            
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.style.background = '';
                copyBtn.style.borderColor = '';
            }, 2000);
        }
    });
}

// Update status display
function updateStatus(state, message) {
    if (!statusDot || !statusText || !statusMessage) return;
    
    statusDot.className = 'dot';
    switch(state) {
        case 'ready':
            statusText.textContent = 'Ready';
            statusDot.style.background = '#25D366';
            break;
        case 'pending':
            statusText.textContent = 'Pending';
            statusDot.style.background = '#ffa502';
            break;
        case 'connected':
            statusText.textContent = 'Connected';
            statusDot.style.background = '#2ed573';
            break;
        case 'error':
            statusText.textContent = 'Error';
            statusDot.style.background = '#ff4757';
            break;
    }
    
    statusMessage.textContent = message;
}

// Show notification
function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    
    notification.innerHTML = `
        <i class="fas fa-${icons[type] || 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add notification styles
function addNotificationStyles() {
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 10px;
                display: flex;
                align-items: center;
                gap: 12px;
                z-index: 9999;
                animation: slideIn 0.3s ease;
                backdrop-filter: blur(10px);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                border: 1px solid rgba(255, 255, 255, 0.1);
                max-width: 350px;
            }
            .notification-success {
                background: rgba(46, 213, 115, 0.2);
                border-color: rgba(46, 213, 115, 0.3);
                color: #2ed573;
            }
            .notification-error {
                background: rgba(255, 71, 87, 0.2);
                border-color: rgba(255, 71, 87, 0.3);
                color: #ff4757;
            }
            .notification-close {
                background: transparent;
                border: none;
                color: inherit;
                cursor: pointer;
                margin-left: auto;
                opacity: 0.7;
                transition: opacity 0.3s;
            }
            .notification-close:hover {
                opacity: 1;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Update paired users count
function updatePairedCount() {
    if (pairedCount) {
        let count = Math.floor(1250 + Math.random() * 100);
        pairedCount.textContent = count.toLocaleString();
    }
}

// Utility functions
function scrollToPair() {
    const pairSection = document.getElementById('pair');
    if (pairSection) {
        pairSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Reset code
function resetCode() {
    currentCode = null;
    codeText.textContent = 'XXXXXXXX';
    commandCode.textContent = 'XXXXXXXX';
    expiryText.textContent = 'Expires in: --:--';
    validTime.textContent = '--:--';
    codeText.style.color = '';
    expiryText.style.color = '';
    fullNumberDisplay.style.display = 'none';
    
    if (expiryTimer) {
        clearInterval(expiryTimer);
        expiryTimer = null;
    }
    
    if (progressBar) progressBar.style.width = '0%';
    updateStatus('ready', 'Enter your number to begin');
}

// Export functions for global use
if (typeof window !== 'undefined') {
    window.generateCode = generateCode;
    window.copyCode = copyCode;
    window.copyCommand = copyCommand;
    window.scrollToPair = scrollToPair;
    window.resetCode = resetCode;
}