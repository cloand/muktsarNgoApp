import { Audio } from 'expo-av';
import { Alert } from 'react-native';

class SoundService {
  constructor() {
    this.sound = null;
    this.isInitialized = false;
    this.init();
  }

  async init() {
    try {
      // Set audio mode for notifications and alerts
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        playThroughEarpieceAndroid: false,
      });
      this.isInitialized = true;
      console.log('SoundService initialized successfully');
    } catch (error) {
      console.error('Error initializing SoundService:', error);
    }
  }

  async playAlarmSound() {
    try {
      if (!this.isInitialized) {
        await this.init();
      }

      // Unload previous sound if exists
      if (this.sound) {
        await this.sound.unloadAsync();
        this.sound = null;
      }

      // Create and load the alarm sound
      // For now, we'll use a simple system beep
      // In production, you can add actual sound files
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT' },
        {
          shouldPlay: true,
          isLooping: false,
          volume: 1.0,
        }
      );

      this.sound = sound;

      // Play the sound
      await sound.playAsync();

      // Set up completion handler
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          this.unloadSound();
        }
      });

      console.log('Emergency alarm sound played');
      return true;
    } catch (error) {
      console.error('Error playing alarm sound:', error);
      
      // Fallback: Use system alert sound
      try {
        await this.playSystemAlert();
        return true;
      } catch (fallbackError) {
        console.error('Error playing system alert:', fallbackError);
        return false;
      }
    }
  }

  async playSystemAlert() {
    try {
      // Use a simple beep sound as fallback
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' },
        {
          shouldPlay: true,
          isLooping: false,
          volume: 0.8,
        }
      );

      this.sound = sound;
      await sound.playAsync();

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          this.unloadSound();
        }
      });

      console.log('System alert sound played');
      return true;
    } catch (error) {
      console.error('Error playing system alert:', error);
      return false;
    }
  }

  async playNotificationSound() {
    try {
      if (!this.isInitialized) {
        await this.init();
      }

      // Unload previous sound if exists
      if (this.sound) {
        await this.sound.unloadAsync();
        this.sound = null;
      }

      // Create and load a softer notification sound
      // Using a simple notification tone
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT' },
        {
          shouldPlay: true,
          isLooping: false,
          volume: 0.6,
        }
      );

      this.sound = sound;
      await sound.playAsync();

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          this.unloadSound();
        }
      });

      console.log('Notification sound played');
      return true;
    } catch (error) {
      console.error('Error playing notification sound:', error);
      return false;
    }
  }

  async playSuccessSound() {
    try {
      if (!this.isInitialized) {
        await this.init();
      }

      // Unload previous sound if exists
      if (this.sound) {
        await this.sound.unloadAsync();
        this.sound = null;
      }

      // Create and load a success sound
      // Using a simple success tone
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT' },
        {
          shouldPlay: true,
          isLooping: false,
          volume: 0.5,
        }
      );

      this.sound = sound;
      await sound.playAsync();

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          this.unloadSound();
        }
      });

      console.log('Success sound played');
      return true;
    } catch (error) {
      console.error('Error playing success sound:', error);
      return false;
    }
  }

  async stopSound() {
    try {
      if (this.sound) {
        await this.sound.stopAsync();
        await this.unloadSound();
      }
    } catch (error) {
      console.error('Error stopping sound:', error);
    }
  }

  async unloadSound() {
    try {
      if (this.sound) {
        await this.sound.unloadAsync();
        this.sound = null;
      }
    } catch (error) {
      console.error('Error unloading sound:', error);
    }
  }

  // Vibration patterns for different alert types
  async vibrateEmergency() {
    try {
      const { Vibration } = require('react-native');
      // Emergency pattern: long-short-long-short
      Vibration.vibrate([0, 1000, 200, 500, 200, 1000]);
    } catch (error) {
      console.error('Error vibrating:', error);
    }
  }

  async vibrateNotification() {
    try {
      const { Vibration } = require('react-native');
      // Notification pattern: short vibration
      Vibration.vibrate(300);
    } catch (error) {
      console.error('Error vibrating:', error);
    }
  }

  async vibrateSuccess() {
    try {
      const { Vibration } = require('react-native');
      // Success pattern: two short vibrations
      Vibration.vibrate([0, 200, 100, 200]);
    } catch (error) {
      console.error('Error vibrating:', error);
    }
  }

  // Combined alert with sound and vibration
  async playEmergencyAlert() {
    try {
      // Play sound and vibrate simultaneously
      const soundPromise = this.playAlarmSound();
      const vibrationPromise = this.vibrateEmergency();
      
      await Promise.all([soundPromise, vibrationPromise]);
      return true;
    } catch (error) {
      console.error('Error playing emergency alert:', error);
      return false;
    }
  }

  async playNotificationAlert() {
    try {
      // Play notification sound and vibrate
      const soundPromise = this.playNotificationSound();
      const vibrationPromise = this.vibrateNotification();
      
      await Promise.all([soundPromise, vibrationPromise]);
      return true;
    } catch (error) {
      console.error('Error playing notification alert:', error);
      return false;
    }
  }

  async playSuccessAlert() {
    try {
      // Play success sound and vibrate
      const soundPromise = this.playSuccessSound();
      const vibrationPromise = this.vibrateSuccess();
      
      await Promise.all([soundPromise, vibrationPromise]);
      return true;
    } catch (error) {
      console.error('Error playing success alert:', error);
      return false;
    }
  }

  // Cleanup method
  async cleanup() {
    try {
      await this.stopSound();
      await this.unloadSound();
    } catch (error) {
      console.error('Error cleaning up SoundService:', error);
    }
  }
}

export default new SoundService();
