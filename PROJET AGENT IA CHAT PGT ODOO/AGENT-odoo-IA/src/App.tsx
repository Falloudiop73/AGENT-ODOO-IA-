import React, { useState } from 'react';
import OpenAI from 'openai';
import ChatMessage from './components/ChatMessage';
import './App.css';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'cle-fictive',
  dangerouslyAllowBrowser: true
});

interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'agent',
      text: 'Bonjour Fallou ! Je suis votre agent IA propulsé par OpenAI. Prêt pour FinAura, Odoo et vos travaux SYSCOHADA.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `Tu es un expert-comptable chevronné, développeur full-stack et architecte technique spécialisé sur Odoo, Next.js, Prisma et SYSCOHADA. Tu aides l'utilisateur dans son cabinet comptable et pour FinAura.`
          },
          { role: 'user', content: userText }
        ],
        temperature: 0.3,
      });

      const replyText = response.choices[0].message.content || "Aucune réponse reçue.";
      const agentReply: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, agentReply]);
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: `Erreur API : ${error.message || 'Vérifiez votre clé dans .env'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>FinAura & Odoo Assistant IA</h1>
        <p style={styles.subtitle}>Cabinet Comptable & Pilotage Financier</p>
      </header>

      <div style={styles.chatBox}>
        {messages.map((msg) => (
          <ChatMessage key={msg.id} sender={msg.sender} text={msg.text} timestamp={msg.timestamp} />
        ))}
        {loading && (
          <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-start', marginBottom: '12px' }}>
            <div style={{ maxWidth: '75%', padding: '12px 16px', borderRadius: '10px', backgroundColor: '#f1f3f5', color: '#666' }}>
              <p style={{ margin: 0, fontSize: '0.95rem' }}>L'agent réfléchit...</p>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} style={styles.form}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Posez une question sur Odoo ou la compta SYSCOHADA..."
          style={styles.input}
        />
        <button type="submit" style={styles.button} disabled={loading}>
          Envoyer
        </button>
      </form>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '850px',
    margin: '30px auto',
    fontFamily: 'Inter, system-ui, sans-serif',
    border: '1px solid #dee2e6',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    height: '85vh',
    backgroundColor: '#fff'
  },
  header: {
    padding: '20px',
    backgroundColor: '#343a40',
    color: '#fff',
    textAlign: 'center'
  },
  title: { margin: 0, fontSize: '1.25rem' },
  subtitle: { margin: '5px 0 0 0', fontSize: '0.85rem', color: '#adb5bd' },
  chatBox: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f8f9fa'
  },
  form: {
    display: 'flex',
    padding: '15px',
    borderTop: '1px solid #dee2e6',
    backgroundColor: '#fff'
  },
  input: {
    flex: 1,
    padding: '10px 14px',
    borderRadius: '6px',
    border: '1px solid #ced4da',
    fontSize: '0.95rem',
    outline: 'none'
  },
  button: {
    marginLeft: '10px',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};