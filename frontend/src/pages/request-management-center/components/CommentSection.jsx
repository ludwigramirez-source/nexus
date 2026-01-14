import React, { useState, useRef, useEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const CommentSection = ({ 
  requestId, 
  comments = [], 
  onAddComment, 
  teamMembers = [],
  currentUser 
}) => {
  const [commentText, setCommentText] = useState('');
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);
  const textareaRef = useRef(null);
  const mentionDropdownRef = useRef(null);

  const filteredMembers = teamMembers?.filter(member =>
    member?.name?.toLowerCase()?.includes(mentionSearch?.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mentionDropdownRef?.current && !mentionDropdownRef?.current?.contains(event?.target)) {
        setShowMentionDropdown(false);
      }
    };

    if (showMentionDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMentionDropdown]);

  const handleTextChange = (e) => {
    const value = e?.target?.value;
    setCommentText(value);

    const cursorPosition = e?.target?.selectionStart;
    const textBeforeCursor = value?.substring(0, cursorPosition);
    const lastAtSymbol = textBeforeCursor?.lastIndexOf('@');

    if (lastAtSymbol !== -1) {
      const textAfterAt = textBeforeCursor?.substring(lastAtSymbol + 1);
      if (!textAfterAt?.includes(' ')) {
        setMentionSearch(textAfterAt);
        setShowMentionDropdown(true);
        setSelectedMentionIndex(0);

        const textarea = textareaRef?.current;
        if (textarea) {
          const { top, left } = getCaretCoordinates(textarea, cursorPosition);
          setMentionPosition({ top: top + 20, left });
        }
      } else {
        setShowMentionDropdown(false);
      }
    } else {
      setShowMentionDropdown(false);
    }
  };

  const getCaretCoordinates = (element, position) => {
    const div = document.createElement('div');
    const style = getComputedStyle(element);
    div.style.position = 'absolute';
    div.style.visibility = 'hidden';
    div.style.whiteSpace = 'pre-wrap';
    div.style.wordWrap = 'break-word';
    div.style.font = style?.font;
    div.style.padding = style?.padding;
    div.style.border = style?.border;
    div.textContent = element?.value?.substring(0, position);
    document.body?.appendChild(div);
    const span = document.createElement('span');
    span.textContent = element?.value?.substring(position) || '.';
    div?.appendChild(span);
    const coordinates = {
      top: span?.offsetTop,
      left: span?.offsetLeft
    };
    document.body?.removeChild(div);
    return coordinates;
  };

  const insertMention = (member) => {
    const cursorPosition = textareaRef?.current?.selectionStart;
    const textBeforeCursor = commentText?.substring(0, cursorPosition);
    const textAfterCursor = commentText?.substring(cursorPosition);
    const lastAtSymbol = textBeforeCursor?.lastIndexOf('@');
    
    const newText = 
      textBeforeCursor?.substring(0, lastAtSymbol) + 
      `@${member?.name} ` + 
      textAfterCursor;
    
    setCommentText(newText);
    setShowMentionDropdown(false);
    setMentionSearch('');
    textareaRef?.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (showMentionDropdown) {
      if (e?.key === 'ArrowDown') {
        e?.preventDefault();
        setSelectedMentionIndex((prev) => 
          prev < filteredMembers?.length - 1 ? prev + 1 : prev
        );
      } else if (e?.key === 'ArrowUp') {
        e?.preventDefault();
        setSelectedMentionIndex((prev) => prev > 0 ? prev - 1 : 0);
      } else if (e?.key === 'Enter') {
        e?.preventDefault();
        if (filteredMembers?.[selectedMentionIndex]) {
          insertMention(filteredMembers?.[selectedMentionIndex]);
        }
      } else if (e?.key === 'Escape') {
        setShowMentionDropdown(false);
      }
    } else if (e?.key === 'Enter' && (e?.ctrlKey || e?.metaKey)) {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!commentText?.trim()) return;

    const mentionRegex = /@([\w\s]+)/g;
    const mentions = [];
    let match;

    while ((match = mentionRegex?.exec(commentText)) !== null) {
      const mentionedName = match?.[1]?.trim();
      const member = teamMembers?.find(m => m?.name === mentionedName);
      if (member) {
        mentions?.push(member?.id);
      }
    }

    onAddComment({
      content: commentText,
      mentions
    });

    setCommentText('');
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
      return 'Ahora mismo';
    } else if (diffMins < 60) {
      return `Hace ${diffMins} min`;
    } else if (diffHours < 24) {
      return `Hace ${diffHours}h`;
    } else if (diffDays < 7) {
      return `Hace ${diffDays}d`;
    } else {
      return date?.toLocaleDateString('es-MX', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const renderCommentContent = (content) => {
    const mentionRegex = /@([\w\s]+)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = mentionRegex?.exec(content)) !== null) {
      if (match?.index > lastIndex) {
        parts?.push(content?.substring(lastIndex, match?.index));
      }
      parts?.push(
        <span key={match?.index} className="text-primary font-medium bg-primary/10 px-1 rounded">
          @{match?.[1]}
        </span>
      );
      lastIndex = match?.index + match?.[0]?.length;
    }

    if (lastIndex < content?.length) {
      parts?.push(content?.substring(lastIndex));
    }

    return parts;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {comments?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Icon name="MessageSquare" size={48} className="text-muted-foreground mb-3" />
            <p className="text-sm font-caption text-muted-foreground text-center">
              No hay comentarios aún. Sé el primero en comentar.
            </p>
          </div>
        ) : (
          comments?.map((comment) => (
            <div key={comment?.id} className="flex gap-3">
              <Image
                src={comment?.user?.avatar}
                alt={`Avatar de ${comment?.user?.name}`}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-caption font-medium text-foreground">
                    {comment?.user?.name}
                  </span>
                  <span className="text-xs font-caption text-muted-foreground">
                    {formatTimestamp(comment?.createdAt)}
                  </span>
                </div>
                <div className="text-sm font-caption text-foreground bg-muted/30 rounded-lg p-3">
                  {renderCommentContent(comment?.content)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-border p-4 bg-muted/20">
        <div className="relative">
          <TextareaAutosize
            ref={textareaRef}
            value={commentText}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder="Escribe un comentario... (usa @ para mencionar)"
            className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none bg-background"
            minRows={2}
            maxRows={6}
          />
          {showMentionDropdown && filteredMembers?.length > 0 && (
            <div
              ref={mentionDropdownRef}
              className="absolute z-50 bg-popover border border-border rounded-lg shadow-elevation-3 max-h-48 overflow-y-auto"
              style={{
                top: `${mentionPosition?.top}px`,
                left: `${mentionPosition?.left}px`,
                minWidth: '200px'
              }}
            >
              {filteredMembers?.map((member, index) => (
                <button
                  key={member?.id}
                  onClick={() => insertMention(member)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-muted transition-smooth ${
                    index === selectedMentionIndex ? 'bg-muted' : ''
                  }`}
                >
                  <Image
                    src={member?.avatar}
                    alt={member?.avatarAlt}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-caption font-medium text-foreground truncate">
                      {member?.name}
                    </p>
                    <p className="text-xs font-caption text-muted-foreground truncate">
                      {member?.email}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs font-caption text-muted-foreground">
            Presiona Ctrl+Enter para enviar
          </p>
          <Button
            onClick={handleSubmit}
            disabled={!commentText?.trim()}
            size="sm"
            iconName="Send"
          >
            Enviar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
