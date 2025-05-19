import React, { useRef, useEffect, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message, Pet } from "@/pages/Dashboard";

type ChatPanelProps = {
  messages: Message[];
  selectedPet: Pet | null;
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
};

const ChatPanel = ({ messages, selectedPet, onSendMessage, isLoading = false }: ChatPanelProps) => {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Removed the useEffect hook for playing audio
  // useEffect(() => {
  //   // Play audio for the last message if it has an audioUrl
  //   if (messages.length > 0) {
  //     const lastMessage = messages[messages.length - 1];
  //     // Added check for valid audioUrl string
  //     if (lastMessage.sender === "pet" && lastMessage.audioUrl && typeof lastMessage.audioUrl === 'string' && lastMessage.audioUrl.length > 0) {
  //       try {
  //         const audio = new Audio(lastMessage.audioUrl);
  //         audio.play().catch(error => console.error("Error playing audio:", error));
  //       } catch (error) {
  //          console.error("Error creating Audio object:", error);
  //       }
  //     }
  //   }
  // }, [messages]); // Trigger effect when messages change


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (inputValue.trim() && selectedPet) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const formatMessageContent = (content: string) => {
    // Replace *text* with italic text
    let formattedContent = content.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Add line breaks
    formattedContent = formattedContent.replace(/\n/g, '<br />');

    return formattedContent;
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {selectedPet ? (
        <>
          <div className="p-4 border-b border-border bg-card">
            <div className="flex items-center gap-3">
              <span className="text-3xl" role="img" aria-label={selectedPet.type}>
                {selectedPet.avatar}
              </span>
              <div>
                <h2 className="font-semibold">{selectedPet.name}</h2>
                <div className="text-xs text-muted-foreground flex gap-1 flex-wrap">
                   {/* Display breed if available */}
                   {selectedPet.breed && <span className="capitalize">{selectedPet.breed} • </span>}
                   {/* Display selected traits */}
                  {selectedPet.traits.map((trait, i) => (
                    <span key={i} className="capitalize">
                      {i > 0 ? "• " : ""}{trait}
                    </span>
                  ))}
                   {selectedPet.traits.length === 0 && !selectedPet.breed && <span>No traits selected</span>}
                </div>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    } flex flex-col space-y-2`}
                  >
                    {/* Display sticker if available */}
                    {message.stickerUrl && (
                      <img
                        src={message.stickerUrl}
                        alt="Pet sticker"
                        className="w-16 h-16 object-contain self-center"
                      />
                    )}
                    <div dangerouslySetInnerHTML={{
                      __html: formatMessageContent(message.content)
                    }} />
                     {/* Removed audio element/logic */}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Chat with ${selectedPet.name}...`}
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                size="icon"
                disabled={isLoading || !inputValue.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {isLoading && (
              <p className="text-xs text-muted-foreground mt-2">
                {selectedPet.name} is thinking...
              </p>
            )}
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          Select a pet to start chatting
        </div>
      )}
    </div>
  );
};

export default ChatPanel;