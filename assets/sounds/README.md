# Sound Assets

This directory contains audio files for the app.

## Required Files

### emergency-alert.mp3
- **Purpose**: Emergency notification sound
- **Format**: MP3
- **Duration**: 2-5 seconds recommended
- **Volume**: High volume for emergency alerts

## Adding Sound Files

1. Add your emergency alert sound file as `emergency-alert.mp3`
2. Ensure the file is in MP3 format for cross-platform compatibility
3. Keep file size under 1MB for optimal performance

## Alternative Sound Sources

If you don't have a custom sound file, you can:
1. Use system default sounds (already configured as fallback)
2. Download free emergency alert sounds from:
   - Freesound.org
   - Zapsplat.com
   - Adobe Stock Audio

## Usage

The sound file is loaded in `src/services/notifications.js`:

```javascript
const { sound } = await Audio.Sound.createAsync(
  require('../../assets/sounds/emergency-alert.mp3'),
  { shouldPlay: false, isLooping: false, volume: 1.0 }
);
```
