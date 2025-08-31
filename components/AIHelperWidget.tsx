
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from '@google/genai';
import { Book } from '../types';
import { useAppContext } from '../AppContext';
import Spinner from './Spinner';
import { ChatBubbleOvalLeftEllipsisIcon, XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { marked } from 'marked';

export const AIHelperWidget: React.FC = () => {
    const { books } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    const isAIAvailable = !!process.env.API_KEY;

    useEffect(() => {
        if (isOpen && !chat && isAIAvailable) {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const bookCatalog = books.map(b => ({
                id: b.id,
                title: b.title,
                author: b.author,
                summary: b.detailedSummary,
                truth: b.brutalTruth,
                category: b.category,
                tags: b.tags,
            }));
            
            const systemInstruction = `You are Freetic AI, a helpful and friendly assistant for a book discovery app.
Your goal is to help users find books, answer questions about them, and suggest what to read next based on their mood or goals.
You MUST base your book recommendations *only* on the books provided in the catalog below. When you recommend a book, mention its title clearly.
Be conversational and engaging. You can use markdown for formatting.

Here is the catalog of available books:
${JSON.stringify(bookCatalog)}`;

            const newChat = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: { systemInstruction },
            });
            setChat(newChat);
            setMessages([{ role: 'model', text: "Hello! I'm the Freetic AI Assistant. How can I help you find your next great read today?" }]);
        }
    }, [isOpen, chat, books, isAIAvailable]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading || !chat) return;

        const userMessage = userInput;
        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setUserInput('');
        setIsLoading(true);

        try {
            const responseStream = await chat.sendMessageStream({ message: userMessage });
            
            setIsLoading(false);
            
            let aiResponseText = '';
            setMessages(prev => [...prev, { role: 'model', text: '' }]);

            for await (const chunk of responseStream) {
                aiResponseText += chunk.text;
                const sanitizedHtml = await marked.parse(aiResponseText, { breaks: true, gfm: true });
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { role: 'model', text: sanitizedHtml };
                    return newMessages;
                });
            }

        } catch (error) {
            console.error("Error sending message to AI:", error);
            setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please try again." }]);
            setIsLoading(false);
        }
    };

    if (!isAIAvailable) return null;

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="ai-widget-trigger"
                aria-label={isOpen ? "Close AI assistant" : "Open AI assistant"}
            >
                {isOpen ? <XMarkIcon className="w-8 h-8"/> : <ChatBubbleOvalLeftEllipsisIcon className="w-8 h-8"/>}
            </button>

            {isOpen && (
                <div className="ai-widget-container animate-widget-in">
                    <div className="ai-widget-header">
                        <h3 className="text-lg font-semibold">Freetic AI Assistant</h3>
                    </div>
                    <div className="ai-widget-messages scrollbar-hide">
                        {messages.map((msg, index) => (
                            <div key={index} className={`ai-message ${msg.role === 'user' ? 'ai-message-user' : 'ai-message-model'}`}>
                                <div className="message-content" dangerouslySetInnerHTML={{ __html: msg.role === 'user' ? msg.text : msg.text || '<span class="inline-block w-2 h-5 bg-white animate-pulse"></span>' }} />
                            </div>
                        ))}
                        {isLoading && (
                            <div className="ai-message ai-message-model">
                                <div className="message-content">
                                    <Spinner size="sm" color="text-white" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="ai-widget-input-area">
                        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder="Ask about a book..."
                                className="ai-widget-input"
                                disabled={isLoading}
                                aria-label="Your message"
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !userInput.trim()}
                                className="ai-widget-send-button"
                                aria-label="Send message"
                            >
                                <PaperAirplaneIcon className="w-5 h-5"/>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};
