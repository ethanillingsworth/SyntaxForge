// Common utilities and shared functionality
import $ from "jquery";
import { initMobileMenu } from '../mobile-menu.js';

/**
 * Initialize common functionality that should be available on all pages
 */
export function initializeApp() {
    // Initialize mobile menu
    initMobileMenu();
    
    // Add any other common initialization here
    console.log('SyntaxForge app initialized');
}

/**
 * Shared code execution functionality
 */
export class CodeExecutor {
    constructor(editor, options = {}) {
        this.editor = editor;
        this.options = {
            showRunningState: true,
            showCompletionMessage: true,
            buttonFeedback: true,
            terminalOutput: true,
            ...options
        };
    }

    /**
     * Execute code with consistent feedback across the app
     */
    execute(code, targetElement = null) {
        const button = this.editor.runButton;
        const terminal = targetElement || this.editor.terminal;
        const originalText = button.text();
        
        // Update button state if feedback is enabled
        if (this.options.buttonFeedback) {
            button.text('Running...').prop('disabled', true);
        }
        
        // Show running state
        if (this.options.showRunningState && this.options.terminalOutput) {
            terminal.empty();
            terminal.append('<div class="text-yellow-400">🚀 Executing code...</div>');
        }
        
        setTimeout(() => {
            try {
                const result = this.editor.safeEval(code);
                
                if (this.options.terminalOutput) {
                    this._displayResults(result, terminal);
                }
                
                if (this.options.buttonFeedback) {
                    this._updateButtonSuccess(button, originalText);
                }
                
                return result;
            } catch (error) {
                if (this.options.terminalOutput) {
                    this._displayError(error, terminal);
                }
                
                if (this.options.buttonFeedback) {
                    this._updateButtonError(button, originalText);
                }
                
                throw error;
            }
        }, 1000);
    }

    /**
     * Display execution results in terminal
     */
    _displayResults(result, terminal) {
        terminal.empty();
        
        // Add command line prompt
        terminal.append('<div class="text-green-400">$ node playground.js</div>');
        
        if (result.logs && result.logs.length > 0) {
            result.logs.forEach((log, index) => {
                setTimeout(() => {
                    const logElement = $('<div class="text-forge-text"></div>').text(log);
                    terminal.append(logElement);
                    terminal.scrollTop(terminal.get(0).scrollHeight);
                }, 100 * (index + 1));
            });
            
            if (this.options.showCompletionMessage) {
                setTimeout(() => {
                    terminal.append('<div class="text-forge-subtext mt-2">✅ Process finished with exit code 0</div>');
                    terminal.append('<div class="text-forge-accent mt-1 text-xs">Press Ctrl+Enter to run again!</div>');
                    terminal.scrollTop(terminal.get(0).scrollHeight);
                }, 100 * (result.logs.length + 1));
            }
        } else {
            terminal.append('<div class="text-forge-subtext mt-2">No output generated</div>');
            if (this.options.showCompletionMessage) {
                terminal.append('<div class="text-forge-accent mt-1 text-xs">Press Ctrl+Enter to run again!</div>');
            }
        }
    }

    /**
     * Display error in terminal
     */
    _displayError(error, terminal) {
        terminal.empty();
        terminal.append('<div class="text-red-400">❌ Runtime Error:</div>');
        terminal.append(`<div class="text-red-300 ml-4">${error.message}</div>`);
        terminal.append('<div class="text-forge-subtext mt-2">❌ Process finished with exit code 1</div>');
    }

    /**
     * Update button to success state
     */
    _updateButtonSuccess(button, originalText) {
        button.text('✓ Executed')
              .removeClass('bg-forge-accent hover:bg-forge-accent-hover')
              .addClass('bg-green-500 hover:bg-green-600');
        
        setTimeout(() => {
            button.text(originalText)
                  .removeClass('bg-green-500 hover:bg-green-600')
                  .addClass('bg-forge-accent hover:bg-forge-accent-hover')
                  .prop('disabled', false);
        }, 2000);
    }

    /**
     * Update button to error state
     */
    _updateButtonError(button, originalText) {
        button.text('❌ Error')
              .removeClass('bg-forge-accent hover:bg-forge-accent-hover')
              .addClass('bg-red-500 hover:bg-red-600');
        
        setTimeout(() => {
            button.text(originalText)
                  .removeClass('bg-red-500 hover:bg-red-600')
                  .addClass('bg-forge-accent hover:bg-forge-accent-hover')
                  .prop('disabled', false);
        }, 2000);
    }
}

/**
 * Shared authentication utilities
 */
export class AuthUtils {
    /**
     * Handle authentication state changes consistently
     */
    static onAuthChange(callback) {
        // This can be extended for common auth handling
        return callback;
    }

    /**
     * Redirect to login if not authenticated
     */
    static requireAuth(auth) {
        if (!auth.currentUser) {
            window.location.href = "/login";
            return false;
        }
        return true;
    }
}

/**
 * Storage utilities for consistent data persistence
 */
export class StorageUtils {
    static save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.warn('Failed to save to localStorage:', error);
        }
    }

    static load(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.warn('Failed to load from localStorage:', error);
            return defaultValue;
        }
    }

    static remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.warn('Failed to remove from localStorage:', error);
        }
    }
}
