import React, { useState } from "react";
import { Key, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

type ApiKeyInputProps = {
  apiKey: string;
  onStoreApiKey: (key: string) => void;
};

const ApiKeyInput = ({ apiKey, onStoreApiKey }: ApiKeyInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onStoreApiKey(inputValue);
      setIsOpen(false);
    }
  };
  
  return (
    <div className="border-t border-border p-2">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-full flex gap-2 justify-center">
            <Key className="h-4 w-4" />
            {apiKey ? "OpenAI API Key Configured" : "Enter OpenAI API Key"}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-2">
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="api-key">OpenAI API Key</Label>
              <div className="flex gap-2">
                <Input
                  id="api-key"
                  type={showKey ? "text" : "password"}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="sk-..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Your API key is stored locally and never sent to our servers.
              </p>
            </div>
            <Button type="submit" size="sm" className="w-full">
              Save API Key
            </Button>
          </form>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default ApiKeyInput;