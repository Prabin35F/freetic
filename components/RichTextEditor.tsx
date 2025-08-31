import React, { useRef, useCallback } from 'react';
import { Bold, Italic, Underline, Link } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const execCmd = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) editorRef.current.focus();
    handleInput(); // Immediately update state after command
  };
  
  const handleLink = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    // Check if the selection is inside the editor
    if (editorRef.current && !editorRef.current.contains(selection.anchorNode)) {
        alert("Please select text within the editor to create a link.");
        return;
    }
    
    const existingLink = selection.anchorNode?.parentElement?.closest('a');
    const defaultUrl = existingLink ? existingLink.href : 'https://';
    
    const url = prompt('Enter the URL:', defaultUrl);
    
    if (url) {
        if(existingLink) {
            existingLink.href = url;
        } else {
            execCmd('createLink', url);
        }

        // After creating, find all links and ensure they have target="_blank"
        if (editorRef.current) {
            const links = editorRef.current.getElementsByTagName('a');
            for (let i = 0; i < links.length; i++) {
                if (!links[i].hasAttribute('target')) {
                    links[i].setAttribute('target', '_blank');
                    links[i].setAttribute('rel', 'noopener noreferrer');
                }
            }
        }
        handleInput();
    }
  };

  const toolbarButtonClass = "p-2 hover:bg-neutral-600 rounded-md transition-colors text-white";

  return (
    <div className="rich-text-editor-container">
      <div className="rich-text-editor-toolbar">
        <button type="button" onClick={() => execCmd('bold')} className={toolbarButtonClass} title="Bold"><Bold size={16} /></button>
        <button type="button" onClick={() => execCmd('italic')} className={toolbarButtonClass} title="Italic"><Italic size={16} /></button>
        <button type="button" onClick={() => execCmd('underline')} className={toolbarButtonClass} title="Underline"><Underline size={16} /></button>
        <button type="button" onClick={handleLink} className={toolbarButtonClass} title="Link"><Link size={16} /></button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: value }}
        className="rich-text-editor-content"
        data-placeholder={placeholder}
      ></div>
    </div>
  );
};
