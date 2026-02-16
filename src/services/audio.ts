// Vocap - Audio Recording Service
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

export interface RecordingResult {
  uri: string;
  duration: number;
}

class AudioService {
  private recording: Audio.Recording | null = null;
  private isRecording: boolean = false;

  async requestPermissions(): Promise<boolean> {
    try {
      const permission = await Audio.requestPermissionsAsync();
      return permission.granted;
    } catch (error) {
      console.error('Failed to request audio permissions:', error);
      return false;
    }
  }

  async prepareRecording(): Promise<void> {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (error) {
      console.error('Failed to prepare recording:', error);
    }
  }

  async startRecording(): Promise<boolean> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.error('No audio permission');
        return false;
      }

      await this.prepareRecording();

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      this.recording = recording;
      this.isRecording = true;
      return true;
    } catch (error) {
      console.error('Failed to start recording:', error);
      return false;
    }
  }

  async stopRecording(): Promise<RecordingResult | null> {
    try {
      if (!this.recording) {
        return null;
      }

      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI() || '';
      const status = await this.recording.getStatusAsync();
      
      this.recording = null;
      this.isRecording = false;

      return {
        uri,
        duration: status.durationMillis || 0,
      };
    } catch (error) {
      console.error('Failed to stop recording:', error);
      this.recording = null;
      this.isRecording = false;
      return null;
    }
  }

  async cancelRecording(): Promise<void> {
    try {
      if (this.recording) {
        await this.recording.stopAndUnloadAsync();
        const uri = this.recording.getURI();
        if (uri) {
          await FileSystem.deleteAsync(uri, { idempotent: true });
        }
      }
    } catch (error) {
      console.error('Failed to cancel recording:', error);
    } finally {
      this.recording = null;
      this.isRecording = false;
    }
  }

  getIsRecording(): boolean {
    return this.isRecording;
  }

  async playRecording(uri: string): Promise<Audio.Sound | null> {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri });
      await sound.playAsync();
      return sound;
    } catch (error) {
      console.error('Failed to play recording:', error);
      return null;
    }
  }

  async deleteRecordingFile(uri: string): Promise<void> {
    try {
      await FileSystem.deleteAsync(uri, { idempotent: true });
    } catch (error) {
      console.error('Failed to delete recording:', error);
    }
  }
}

export const audioService = new AudioService();
