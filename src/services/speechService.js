// Speech Service for Speech-to-Text and Text-to-Speech functionality
// Handles both comment input speech recognition and Japanese pronunciation

class SpeechService {
  constructor() {
    this.recognition = null;
    this.synthesis = window.speechSynthesis;
    this.isListening = false;
    this.supportedLanguages = {
      'ja-JP': 'Japanese',
      'en-US': 'English (US)',
      'en-GB': 'English (UK)',
      'ko-KR': 'Korean',
      'zh-CN': 'Chinese (Mandarin)',
      'es-ES': 'Spanish',
      'fr-FR': 'French',
      'de-DE': 'German'
    };
    
    this.initializeSpeechRecognition();
  }

  // Initialize Speech Recognition
  initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new window.webkitSpeechRecognition();
    } else if ('SpeechRecognition' in window) {
      this.recognition = new window.SpeechRecognition();
    } else {
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    // Configure speech recognition
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;
  }

  // Check if speech recognition is supported
  isSpeechRecognitionSupported() {
    return this.recognition !== null;
  }

  // Check if text-to-speech is supported
  isTextToSpeechSupported() {
    return 'speechSynthesis' in window;
  }

  // Start speech recognition for comment input
  startSpeechRecognition(language = 'ja-JP', onResult, onError, onEnd) {
    if (!this.recognition) {
      onError('Speech recognition not supported');
      return;
    }

    if (this.isListening) {
      this.stopSpeechRecognition();
      return;
    }

    this.recognition.lang = language;
    this.isListening = true;

    // Set up event handlers
    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      onResult({
        final: finalTranscript,
        interim: interimTranscript,
        confidence: event.results[0] ? event.results[0][0].confidence : 0
      });
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      let errorMessage = 'Speech recognition error';
      
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected. Please try again.';
          break;
        case 'audio-capture':
          errorMessage = 'Microphone not accessible. Please check permissions.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone access denied. Please allow microphone access.';
          break;
        case 'network':
          errorMessage = 'Network error. Please check your connection.';
          break;
        case 'language-not-supported':
          errorMessage = 'Language not supported for speech recognition.';
          break;
        default:
          errorMessage = `Speech recognition error: ${event.error}`;
      }
      
      onError(errorMessage);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (onEnd) onEnd();
    };

    this.recognition.onstart = () => {
      console.log('Speech recognition started');
    };

    // Start recognition
    try {
      this.recognition.start();
    } catch (error) {
      this.isListening = false;
      onError('Failed to start speech recognition: ' + error.message);
    }
  }

  // Stop speech recognition
  stopSpeechRecognition() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  // Get available voices for text-to-speech
  getAvailableVoices() {
    if (!this.isTextToSpeechSupported()) {
      return [];
    }

    const voices = this.synthesis.getVoices();
    return voices.filter(voice => 
      voice.lang.startsWith('ja') || 
      voice.lang.startsWith('en') ||
      voice.lang.startsWith('ko') ||
      voice.lang.startsWith('zh')
    );
  }

  // Speak Japanese text for pronunciation
  speakJapanese(text, options = {}) {
    return new Promise((resolve, reject) => {
      if (!this.isTextToSpeechSupported()) {
        reject(new Error('Text-to-speech not supported'));
        return;
      }

      // Stop any current speech
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure utterance for Japanese
      utterance.lang = options.lang || 'ja-JP';
      utterance.rate = options.rate || 0.8; // Slower for learning
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;

      // Try to find a Japanese voice
      const voices = this.synthesis.getVoices();
      const japaneseVoice = voices.find(voice => 
        voice.lang.startsWith('ja') && 
        (voice.name.includes('Google') || voice.name.includes('Microsoft') || voice.localService)
      );

      if (japaneseVoice) {
        utterance.voice = japaneseVoice;
        console.log('Using Japanese voice:', japaneseVoice.name);
      } else {
        console.warn('No Japanese voice found, using default');
      }

      // Set up event handlers
      utterance.onend = () => {
        console.log('Speech synthesis completed');
        resolve();
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };

      utterance.onstart = () => {
        console.log('Speech synthesis started for:', text);
      };

      // Speak the text
      this.synthesis.speak(utterance);
    });
  }

  // Speak English text
  speakEnglish(text, options = {}) {
    return new Promise((resolve, reject) => {
      if (!this.isTextToSpeechSupported()) {
        reject(new Error('Text-to-speech not supported'));
        return;
      }

      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = options.lang || 'en-US';
      utterance.rate = options.rate || 1.0;
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;

      // Try to find an English voice
      const voices = this.synthesis.getVoices();
      const englishVoice = voices.find(voice => 
        voice.lang.startsWith('en') && voice.localService
      );

      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      utterance.onend = resolve;
      utterance.onerror = (event) => reject(new Error(event.error));

      this.synthesis.speak(utterance);
    });
  }

  // Stop current speech synthesis
  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  // Check if currently speaking
  isSpeaking() {
    return this.synthesis && this.synthesis.speaking;
  }

  // Get supported languages for speech recognition
  getSupportedLanguages() {
    return this.supportedLanguages;
  }

  // Auto-detect language from text (basic implementation)
  detectLanguage(text) {
    const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/;
    const koreanRegex = /[\uAC00-\uD7AF]/;
    const chineseRegex = /[\u4E00-\u9FFF]/;

    if (japaneseRegex.test(text)) {
      return 'ja-JP';
    } else if (koreanRegex.test(text)) {
      return 'ko-KR';
    } else if (chineseRegex.test(text)) {
      return 'zh-CN';
    } else {
      return 'en-US'; // Default to English
    }
  }

  // Request microphone permissions
  async requestMicrophonePermission() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Close the stream immediately as we just needed permission
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      return false;
    }
  }
}

// Create singleton instance
const speechService = new SpeechService();

export default speechService;
