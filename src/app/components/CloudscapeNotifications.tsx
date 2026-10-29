"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import Flashbar, { FlashbarProps } from "@cloudscape-design/components/flashbar";

type NoticeType = "success" | "error" | "warning" | "info";
type NoticeContextValue = Record<NoticeType, (content: string) => void>;

const NoticeContext = createContext<NoticeContextValue | null>(null);

export function CloudscapeNotificationProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<FlashbarProps.MessageDefinition[]>([]);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer) clearTimeout(timer);
    timers.current.delete(id);
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const notify = useCallback((type: NoticeType, content: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setItems((current) => [...current, {
      id,
      type,
      content,
      dismissible: true,
      dismissLabel: "Dismiss notification",
      ariaRole: type === "error" || type === "warning" ? "alert" : "status",
      onDismiss: () => dismiss(id),
    }]);
    timers.current.set(id, setTimeout(() => dismiss(id), 6000));
  }, [dismiss]);

  useEffect(() => () => {
    timers.current.forEach(clearTimeout);
    timers.current.clear();
  }, []);

  const contextValue: NoticeContextValue = {
    success: (content) => notify("success", content),
    error: (content) => notify("error", content),
    warning: (content) => notify("warning", content),
    info: (content) => notify("info", content),
  };

  return (
    <NoticeContext.Provider value={contextValue}>
      {children}
      <div className="cloudscape-notifications" aria-live="polite">
        <Flashbar items={items} stackItems={false} i18nStrings={{ ariaLabel: "Notifications" }} />
      </div>
    </NoticeContext.Provider>
  );
}

export function useCloudscapeNotifications() {
  const context = useContext(NoticeContext);
  if (!context) throw new Error("useCloudscapeNotifications must be used within CloudscapeNotificationProvider.");
  return context;
}
