import React from 'react';

interface ChatMessageProps {
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
}

export default function ChatMessage({ sender, text, timestamp }: ChatMessageProps) {
  const isUser = sender === 'user';

  return (
    <div style={{
      display: 'flex',
      width: '100%',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '12px'
    }}>
      <div style={{
        maxWidth: '75%',
        padding: '12px 16px',
        borderRadius: '10px',
        backgroundColor: isUser ? '#007bff' : '#f1f3f5',
        color: isUser ? '#fff' : '#333',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
      }}>
        <p style={{ margin: 0, fontSize: '0.95rem', whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>
          {text}
        </p>
        <span style={{
          display: 'block',
          marginTop: '6px',
          fontSize: '0.7rem',
          opacity: 0.7,
          textAlign: 'right'
        }}>
          {timestamp}
        </span>
      </div>
    </div>
  );
}
