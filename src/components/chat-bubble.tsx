"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { chat } from "@/ai/flows/chat-flow";

type Message = {
  text: string;
  sender: "user" | "ai";
};

export function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 32, y: window.innerHeight - 96 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const bubbleRef = useRef<HTMLButtonElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => ({
        x: Math.min(prev.x, window.innerWidth - 64),
        y: Math.min(prev.y, window.innerHeight - 64),
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent dragging on right-click
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    if (bubbleRef.current) {
        bubbleRef.current.style.cursor = 'grabbing';
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      let newX = e.clientX - dragStart.x;
      let newY = e.clientY - dragStart.y;
      
      // Boundary checks
      newX = Math.max(0, Math.min(newX, window.innerWidth - 64));
      newY = Math.max(0, Math.min(newY, window.innerHeight - 64));

      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
        setIsDragging(false);
        if (bubbleRef.current) {
            bubbleRef.current.style.cursor = 'grab';
        }
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isDragging) {
        // This is the end of a drag, not a click.
        // We set a small threshold to differentiate clicks from drags.
        const distance = Math.sqrt(Math.pow(e.clientX - dragStart.x - position.x, 2) + Math.pow(e.clientY - dragStart.y - position.y, 2));
        if (distance < 5) {
             setIsOpen(true);
        }
    } else {
        setIsOpen(true);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newMessages: Message[] = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");
    setIsSending(true);

    try {
      const result = await chat({ message: input });
      setMessages([...newMessages, { text: result.response, sender: "ai" }]);
    } catch (error) {
      console.error("AI chat error:", error);
      setMessages([...newMessages, { text: "Sorry, I'm having trouble connecting. Please try again later.", sender: "ai" }]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isSending) {
      handleSendMessage();
    }
  };

  return (
    <div
        className="fixed inset-0 pointer-events-none z-50"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
    >
      <button
        ref={bubbleRef}
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
        className="absolute w-16 h-16 rounded-full bg-primary text-primary-foreground shadow-2xl flex items-center justify-center cursor-grab focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 pointer-events-auto transition-transform"
        aria-label="Open AI Chat"
      >
        <Bot className="w-8 h-8" />
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] flex flex-col h-[70vh] max-h-[600px] bg-background/80 backdrop-blur-lg">
          <DialogHeader>
            <DialogTitle>AI Assistant</DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 p-4 border-y border-border/20">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                  {msg.sender === 'ai' && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback><Bot size={20} /></AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`rounded-lg px-3 py-2 max-w-[80%] break-words ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    {msg.text}
                  </div>
                   {msg.sender === 'user' && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
               {isSending && (
                    <div className="flex items-start gap-3">
                         <Avatar className="w-8 h-8">
                           <AvatarFallback><Bot size={20} /></AvatarFallback>
                         </Avatar>
                         <div className="rounded-lg px-3 py-2 bg-muted flex items-center">
                            <Loader2 className="w-5 h-5 animate-spin"/>
                         </div>
                    </div>
                )}
            </div>
          </ScrollArea>
          <DialogFooter>
            <div className="relative w-full">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-12"
                disabled={isSending}
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={handleSendMessage}
                disabled={isSending || !input.trim()}
              >
                {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
