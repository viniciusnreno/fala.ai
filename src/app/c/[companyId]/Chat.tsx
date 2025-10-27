"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User, Send, Loader2, MessageSquare } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "agent";
  content: string;
};

export default function Chat({ companyId }: { companyId: string }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMutation = useMutation({
    mutationFn: async (prompt: string) => {
      const res = await api.post("/api/agent", { prompt, companyId });
      return res.data as { message: string };
    },
  });

  async function handleSend() {
    if (!input.trim()) return;
    const userMessage: Message = { id: crypto.randomUUID(), role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    try {
      const data = await sendMutation.mutateAsync(userMessage.content);
      const agentMessage: Message = { id: crypto.randomUUID(), role: "agent", content: data.message };
      setMessages((prev) => [...prev, agentMessage]);
    } catch {
      const agentMessage: Message = { id: crypto.randomUUID(), role: "agent", content: "olá" };
      setMessages((prev) => [...prev, agentMessage]);
    }
  }

  return (
    <div className="space-y-2">
      
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 max-h-80 overflow-y-auto">
          {messages.length === 0 && (
            <div className="flex items-center justify-center gap-3 rounded-lg border border-dashed border-input/60 bg-input/20 p-4 text-sm text-muted-foreground mb-5">
              <div className="h-8 w-8 rounded-md bg-primary/15 flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Comece a conversa</p>
                <p>Digite seu feedback no campo ao lado e pressione Enter.</p>
              </div>
            </div>
          )}
          {messages.map((m) => (
            <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
              <div className={m.role === "user" ? "flex items-start gap-2 max-w-[85%]" : "flex items-start gap-2 max-w-[85%]"}>
                {m.role === "agent" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-secondary text-secondary-foreground">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={
                    m.role === "user"
                      ? "rounded-lg bg-primary text-primary-foreground px-3 py-2"
                      : "rounded-lg bg-secondary text-secondary-foreground px-3 py-2"
                  }
                >
                  {m.content}
                </div>
                {m.role === "user" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          ))}
 
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="feedback" className="text-sm font-medium">
            Mensagem
          </label>
          <div className="flex items-start gap-2">
            <Textarea
              id="feedback"
              placeholder="Escreva seu feedback..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              rows={3}
              className="flex-1"
            />
            <Button
              type="button"
              size="icon"
              onClick={handleSend}
              disabled={sendMutation.isPending}
              aria-label="Enviar mensagem"
            >
              {sendMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


