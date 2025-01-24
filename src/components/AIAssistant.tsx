import { useState } from "react";
import { MessageCircle, Send, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Priority } from "@/types/task";
import { cn } from "@/lib/utils";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface AIAssistantProps {
  onAddTask: (title: string, priority: Priority) => void;
}

const AIAssistant = ({ onAddTask }: AIAssistantProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !apiKey.trim()) return;

    setIsLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `You are a task management assistant. Based on this task description, create a JSON response with a concise task title and priority level (low, medium, or high) based on urgency and importance. The response should be in this format: {"title": "task title", "priority": "low|medium|high"}. Task description: ${message}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from the response
      const jsonMatch = text.match(/\{.*\}/);
      if (!jsonMatch) throw new Error('Invalid response format');
      
      const parsedResult = JSON.parse(jsonMatch[0]);
      
      onAddTask(parsedResult.title, parsedResult.priority as Priority);
      setMessage("");
      toast({
        title: "Task created",
        description: `Added "${parsedResult.title}" with ${parsedResult.priority} priority`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none",
          "absolute bottom-full right-0 mb-4 w-[90vw] max-w-[380px] transform"
        )}
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">AI Task Assistant (Gemini)</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {!apiKey && (
            <div className="mb-4 animate-fade-in">
              <Input
                type="password"
                placeholder="Enter your Google AI API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="mb-2 bg-gray-50 dark:bg-gray-900"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Enter your Google AI API key to use the AI assistant
              </p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="relative">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your task..."
                disabled={isLoading || !apiKey}
                className="pr-10 bg-gray-50 dark:bg-gray-900"
              />
              {isLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                </div>
              )}
            </div>
            
            <Button 
              type="submit" 
              disabled={isLoading || !apiKey}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              <Send className="h-4 w-4 mr-2" />
              {isLoading ? "Processing..." : "Send"}
            </Button>
          </form>
        </div>
      </div>

      <Button
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "rounded-full h-14 w-14 shadow-lg transition-transform duration-200",
          "bg-blue-600 hover:bg-blue-700 text-white",
          "flex items-center justify-center",
          "hover:scale-105 active:scale-95",
          isOpen && "rotate-180"
        )}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default AIAssistant;