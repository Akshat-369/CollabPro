import React, { useRef } from 'react';
import { Bold, Italic, Underline, Link as LinkIcon, List, AlignLeft, AlignCenter, AlignRight, ListOrdered } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const execCommand = (command: string, val: string | undefined = undefined) => {
    document.execCommand(command, false, val);
    if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
    }
  };

  const handleLink = () => {
    const url = prompt('Enter URL:');
    if (url) execCommand('createLink', url);
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    onChange(e.currentTarget.innerHTML);
  };

  const handleToolbarClick = (e: React.MouseEvent, command: string, val?: string) => {
      e.preventDefault();
      execCommand(command, val);
  };

  return (
    <div className="bg-mine-shaft-900 border border-mine-shaft-700 rounded-lg overflow-hidden flex flex-col h-72">
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-mine-shaft-700 bg-mine-shaft-800/50">
            <button onMouseDown={(e) => handleToolbarClick(e, 'bold')} className="p-1.5 text-mine-shaft-400 hover:text-bright-sun-400 rounded hover:bg-mine-shaft-700 transition-colors" title="Bold"><Bold size={16} /></button>
            <button onMouseDown={(e) => handleToolbarClick(e, 'italic')} className="p-1.5 text-mine-shaft-400 hover:text-bright-sun-400 rounded hover:bg-mine-shaft-700 transition-colors" title="Italic"><Italic size={16} /></button>
            <button onMouseDown={(e) => handleToolbarClick(e, 'underline')} className="p-1.5 text-mine-shaft-400 hover:text-bright-sun-400 rounded hover:bg-mine-shaft-700 transition-colors" title="Underline"><Underline size={16} /></button>
            <div className="w-px h-4 bg-mine-shaft-600 mx-1"></div>
            <button onMouseDown={(e) => handleToolbarClick(e, 'justifyLeft')} className="p-1.5 text-mine-shaft-400 hover:text-bright-sun-400 rounded hover:bg-mine-shaft-700 transition-colors" title="Align Left"><AlignLeft size={16} /></button>
            <button onMouseDown={(e) => handleToolbarClick(e, 'justifyCenter')} className="p-1.5 text-mine-shaft-400 hover:text-bright-sun-400 rounded hover:bg-mine-shaft-700 transition-colors" title="Align Center"><AlignCenter size={16} /></button>
            <button onMouseDown={(e) => handleToolbarClick(e, 'justifyRight')} className="p-1.5 text-mine-shaft-400 hover:text-bright-sun-400 rounded hover:bg-mine-shaft-700 transition-colors" title="Align Right"><AlignRight size={16} /></button>
            <div className="w-px h-4 bg-mine-shaft-600 mx-1"></div>
            <button onMouseDown={(e) => handleToolbarClick(e, 'insertUnorderedList')} className="p-1.5 text-mine-shaft-400 hover:text-bright-sun-400 rounded hover:bg-mine-shaft-700 transition-colors" title="Bullet List"><List size={16} /></button>
            <button onMouseDown={(e) => handleToolbarClick(e, 'insertOrderedList')} className="p-1.5 text-mine-shaft-400 hover:text-bright-sun-400 rounded hover:bg-mine-shaft-700 transition-colors" title="Numbered List"><ListOrdered size={16} /></button>
            <div className="w-px h-4 bg-mine-shaft-600 mx-1"></div>
            <button onMouseDown={(e) => { e.preventDefault(); handleLink(); }} className="p-1.5 text-mine-shaft-400 hover:text-bright-sun-400 rounded hover:bg-mine-shaft-700 transition-colors" title="Insert Link"><LinkIcon size={16} /></button>
        </div>
        <div 
            ref={editorRef}
            className="flex-1 p-4 bg-transparent border-none outline-none text-mine-shaft-50 overflow-y-auto prose prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0"
            contentEditable
            onInput={handleInput}
            suppressContentEditableWarning={true}
            style={{ minHeight: '150px' }}
        />
        <style>{`
            [contenteditable]:empty:before {
                content: 'Write description here...';
                color: #6b7280;
                pointer-events: none;
            }
        `}</style>
    </div>
  );
};

export default RichTextEditor;