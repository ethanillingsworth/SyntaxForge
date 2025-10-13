import '../css/tailwind.css';
import { Editor } from './main.js';
import { initializeApp, CodeExecutor } from './utils/common.js';
import $ from "jquery";

// Initialize common app functionality
initializeApp();

const previewCode = `// Welcome to SyntaxForge!
const amICool = true

if (amICool) {
    console.log("I am very cool!")
} else {
    console.log("I am not very cool :(")
}

// Try editing this code!
const skills = ["JavaScript", "Python", "Ruby"]
console.log("My skills:", skills.join(", "))`;

const editor = new Editor($("#editor"), previewCode);
const codeExecutor = new CodeExecutor(editor, {
    terminalOutput: false, // Use HTML output panel instead
    buttonFeedback: true,
    showCompletionMessage: false
});

// Disable terminal for homepage preview
editor.disableTerminal();

// Add interactive features to the editor preview
$(document).ready(() => {
    const outputPanel = $('#output-panel');
    
    // Function to execute preview code using common executor
    function executePreviewCode() {
        // Clear output
        outputPanel.empty();
        
        // Add command line
        outputPanel.append('<div class="text-green-400">$ node main.js</div>');
        
        try {
            const result = editor.safeEval(editor.getContent());
            
            // Add output lines with delay for better UX
            if (result.logs && result.logs.length > 0) {
                result.logs.forEach((log, index) => {
                    setTimeout(() => {
                        outputPanel.append(`<div class="text-forge-text">${log}</div>`);
                    }, 300 * (index + 1));
                });
                
                // Add completion message
                setTimeout(() => {
                    outputPanel.append('<div class="text-forge-subtext mt-2">Process finished with exit code 0</div>');
                }, 300 * (result.logs.length + 1));
            } else {
                outputPanel.append('<div class="text-forge-subtext mt-2">No output generated</div>');
            }
        } catch (error) {
            outputPanel.append('<div class="text-red-400 mt-2">Error: ' + error.message + '</div>');
        }
    }
    
    // Add run button functionality
    $('.editor-window button').on('click', function() {
        const button = $(this);
        const originalText = button.text();
        
        // Update button state
        button.text('Running...').prop('disabled', true);
        
        // Show running state in output
        outputPanel.empty();
        outputPanel.append('<div class="text-yellow-400">Running code...</div>');
        
        setTimeout(() => {
            // Execute the code
            executePreviewCode();
            
            // Update button to success state
            button.text('✓ Executed').removeClass('bg-forge-accent hover:bg-forge-accent-hover')
                   .addClass('bg-green-500 hover:bg-green-600');
            
            setTimeout(() => {
                button.text(originalText).removeClass('bg-green-500 hover:bg-green-600')
                       .addClass('bg-forge-accent hover:bg-forge-accent-hover')
                       .prop('disabled', false);
            }, 2000);
        }, 1000);
    });
    
    // Show initial demo output
    setTimeout(() => {
        executePreviewCode();
        outputPanel.append('<div class="text-forge-accent mt-3 text-xs">👆 Click "Run Code" to execute again!</div>');
    }, 2000);
    
    // Add typing effect on first load
    setTimeout(() => {
        if (editor && editor.view) {
            // Simulate a small code change to show interactivity
            const currentCode = editor.view.state.doc.toString();
            const newLine = '\n\n// Click "Run Code" to see the magic! ✨';
            
            // Add the new line with a subtle animation
            const transaction = editor.view.state.update({
                changes: {
                    from: currentCode.length,
                    insert: newLine
                }
            });
            
            editor.view.dispatch(transaction);
        }
    }, 5000);
    
    // Add hover effects to feature highlights
    $('.editor-preview-container .grid > div').hover(
        function() {
            $(this).find('svg').addClass('scale-110');
        },
        function() {
            $(this).find('svg').removeClass('scale-110');
        }
    );
});

