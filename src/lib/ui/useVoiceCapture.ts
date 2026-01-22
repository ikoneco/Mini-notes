/**
 * useVoiceCapture hook
 * 
 * Provides browser-based speech-to-text functionality.
 * Handles permission states and result callbacks.
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

export interface UseVoiceCaptureOptions {
    onResult?: (text: string, isFinal: boolean) => void;
    onError?: (error: string) => void;
    onEnd?: () => void;
}

// Minimal types for Web Speech API to avoid 'any'
interface SpeechRecognitionEvent extends Event {
    resultIndex: number;
    results: {
        length: number;
        [index: number]: {
            isFinal: boolean;
            [index: number]: {
                transcript: string;
            };
        };
    };
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string;
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start: () => void;
    stop: () => void;
    abort: () => void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
    onend: () => void;
}

interface SpeechRecognitionConstructor {
    new(): SpeechRecognition;
}

export function useVoiceCapture(options: UseVoiceCaptureOptions = {}) {
    const { onResult, onError, onEnd } = options;
    const [isListening, setIsListening] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    const [interimText, setInterimText] = useState('');
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    // Keep handlers in refs to avoid re-initializing recognition on Every render
    const onResultRef = useRef(onResult);
    const onErrorRef = useRef(onError);
    const onEndRef = useRef(onEnd);

    useEffect(() => {
        onResultRef.current = onResult;
        onErrorRef.current = onError;
        onEndRef.current = onEnd;
    }, [onResult, onError, onEnd]);

    // Check support on mount and initialize
    useEffect(() => {
        const win = window as unknown as Window & {
            SpeechRecognition?: SpeechRecognitionConstructor;
            webkitSpeechRecognition?: SpeechRecognitionConstructor;
        };
        const SpeechRecognitionConstructor = win.SpeechRecognition || win.webkitSpeechRecognition;

        if (SpeechRecognitionConstructor) {
            // Use a slight delay to avoid "synchronous setup" warnings
            const timer = setTimeout(() => {
                setIsSupported(true);
            }, 0);

            const recognition = new SpeechRecognitionConstructor();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onresult = (event: SpeechRecognitionEvent) => {
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }

                setInterimText(interimTranscript);

                if (finalTranscript && onResultRef.current) {
                    onResultRef.current(finalTranscript, true);
                } else if (interimTranscript && onResultRef.current) {
                    onResultRef.current(interimTranscript, false);
                }
            };

            recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
                console.error('Speech recognition error:', event.error);
                if (onErrorRef.current) onErrorRef.current(event.error);
                setIsListening(false);
                setInterimText('');
            };

            recognition.onend = () => {
                setIsListening(false);
                setInterimText('');
                if (onEndRef.current) onEndRef.current();
            };

            recognitionRef.current = recognition;

            return () => {
                clearTimeout(timer);
                if (recognitionRef.current) {
                    recognitionRef.current.abort();
                }
            };
        }
    }, []);

    const startListening = useCallback(() => {
        if (recognitionRef.current && !isListening) {
            try {
                recognitionRef.current.start();
                setIsListening(true);
                setInterimText('');
            } catch (error) {
                console.error('Failed to start speech recognition:', error);
                if (onErrorRef.current) onErrorRef.current('Failed to start');
            }
        }
    }, [isListening]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current && isListening) {
            try {
                recognitionRef.current.stop();
            } catch (error) {
                console.error('Failed to stop speech recognition:', error);
            }
            setIsListening(false);
            setInterimText('');
        }
    }, [isListening]);

    const toggleListening = useCallback(() => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    }, [isListening, startListening, stopListening]);

    return {
        isListening,
        isSupported,
        interimText,
        startListening,
        stopListening,
        toggleListening
    };
}
