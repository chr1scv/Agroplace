import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { getAxiosConfig } from '../../utils/csrf';
import './AsistenteIA.css';

const AsistenteIA = ({ vendedor }) => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: `Hola ${vendedor?.first_name || 'Vendedor'}, soy tu asistente de negocios inteligente. ¿En qué puedo ayudarte hoy?`,
            sender: 'ai'
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await axios.post(
                'http://localhost:8000/api/chat/vendedor/',
                { pregunta: userMessage.text },
                getAxiosConfig()
            );

            const aiMessage = {
                id: Date.now() + 1,
                text: response.data.respuesta,
                sender: 'ai'
            };
            setMessages(prev => [...prev, aiMessage]);

        } catch (error) {
            console.error('Error chat IA:', error);
            const errorMessage = {
                id: Date.now() + 1,
                text: 'Lo siento, tuve un problema al conectar con mi cerebro. Por favor intenta de nuevo.',
                sender: 'ai',
                isError: true
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="asistente-ia-container">
            <div className="chat-header">
                <div className="ai-avatar">🤖</div>
                <div>
                    <h2>Asistente AgroPlace</h2>
                    <p>Potenciado por Llama 3.2:1B</p>
                </div>
            </div>

            <div className="chat-messages">
                {messages.map((msg) => (
                    <div key={msg.id} className={`message ${msg.sender} ${msg.isError ? 'error' : ''}`}>
                        <div className="message-content">
                            {msg.text}
                        </div>
                        <div className="message-time">
                            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="message ai loading">
                        <div className="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="chat-input-area">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Pregunta sobre tus ventas, stock o consejos..."
                    disabled={loading}
                />
                <button type="submit" disabled={loading || !input.trim()}>
                    Enviar
                </button>
            </form>
        </div>
    );
};

export default AsistenteIA;