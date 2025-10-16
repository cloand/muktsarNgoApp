# 📁 Assets Setup Guide

## Required Asset Files

The app.json references several asset files that need to be created:

### 🖼️ **Image Assets Needed:**
1. `./assets/icon.png` - App icon (1024x1024px)
2. `./assets/splash.png` - Splash screen image
3. `./assets/adaptive-icon.png` - Android adaptive icon
4. `./assets/favicon.png` - Web favicon
5. `./assets/notification-icon.png` - Notification icon

### 🔊 **Sound Assets Needed:**
1. `./assets/sounds/emergency-alert.mp3` - Emergency alert sound

## 🚀 **Quick Fix for Development**

For now, we can temporarily remove the notification plugin from app.json to get the app running, then add it back later with proper assets.

## 📝 **Asset Requirements:**

### **App Icon (icon.png)**
- Size: 1024x1024 pixels
- Format: PNG
- Content: NGO logo with heart symbol
- Background: Red (#C62828) or transparent

### **Splash Screen (splash.png)**
- Size: 1284x2778 pixels (iPhone 14 Pro Max)
- Format: PNG
- Content: NGO logo and name
- Background: White or light theme

### **Notification Icon (notification-icon.png)**
- Size: 96x96 pixels
- Format: PNG
- Content: Simple heart icon
- Background: Transparent
- Color: White (for dark notification backgrounds)

### **Emergency Alert Sound (emergency-alert.mp3)**
- Duration: 2-5 seconds
- Format: MP3
- Content: Urgent alert tone
- Volume: Moderate (not too loud)

## 🔧 **Temporary Solution**

To get the app running immediately, we can:
1. Comment out the notification plugin in app.json
2. Use default Expo assets temporarily
3. Add proper assets later

This will allow development and testing to continue while assets are being prepared.
