"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type DialogVariant = "default" | "destructive" | "success";

interface BaseDialog {
  id: string;
  title: string;
  description?: string;
  variant?: DialogVariant;
}

interface ConfirmDialog extends BaseDialog {
  type: "confirm";
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

interface AlertDialog extends BaseDialog {
  type: "alert";
  confirmLabel?: string;
  onClose: () => void;
}

interface PromptDialog extends BaseDialog {
  type: "prompt";
  placeholder?: string;
  defaultValue?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onSubmit: (value: string) => void;
  onCancel?: () => void;
}

type DialogItem = ConfirmDialog | AlertDialog | PromptDialog;

interface ToastItem {
  id: string;
  message: string;
  variant?: "default" | "success" | "error";
}

interface DialogContextValue {
  confirm: (opts: Omit<ConfirmDialog, "type" | "id">) => void;
  alert: (opts: Omit<AlertDialog, "type" | "id">) => void;
  prompt: (opts: Omit<PromptDialog, "type" | "id">) => void;
  toast: (message: string, variant?: ToastItem["variant"]) => void;
}

const DialogContext = createContext<DialogContextValue | null>(null);

let dialogId = 0;
function nextId() {
  dialogId += 1;
  return String(dialogId);
}

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [dialogs, setDialogs] = useState<DialogItem[]>([]);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [promptValue, setPromptValue] = useState("");

  const closeDialog = useCallback((id: string) => {
    setDialogs((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const confirm = useCallback((opts: Omit<ConfirmDialog, "type" | "id">) => {
    const id = nextId();
    setDialogs((prev) => [...prev, { ...opts, type: "confirm", id }]);
  }, []);

  const alert = useCallback((opts: Omit<AlertDialog, "type" | "id">) => {
    const id = nextId();
    setDialogs((prev) => [...prev, { ...opts, type: "alert", id }]);
  }, []);

  const prompt = useCallback((opts: Omit<PromptDialog, "type" | "id">) => {
    const id = nextId();
    setPromptValue(opts.defaultValue || "");
    setDialogs((prev) => [...prev, { ...opts, type: "prompt", id }]);
  }, []);

  const toast = useCallback((message: string, variant: ToastItem["variant"] = "default") => {
    const id = nextId();
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const active = dialogs[dialogs.length - 1];

  return (
    <DialogContext.Provider value={{ confirm, alert, prompt, toast }}>
      {children}

      {active && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              if (active.type === "confirm") {
                active.onCancel?.();
                closeDialog(active.id);
              } else if (active.type === "alert") {
                active.onClose();
                closeDialog(active.id);
              } else {
                active.onCancel?.();
                closeDialog(active.id);
              }
            }}
            aria-hidden
          />
          <div
            role="dialog"
            aria-modal
            aria-labelledby="dialog-title"
            className="relative w-full max-w-md rounded-xl border bg-card p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200"
          >
            <h2 id="dialog-title" className="text-lg font-semibold pr-8">
              {active.title}
            </h2>
            {active.description && (
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {active.description}
              </p>
            )}

            {active.type === "prompt" && (
              <input
                autoFocus
                type="text"
                value={promptValue}
                onChange={(e) => setPromptValue(e.target.value)}
                placeholder={active.placeholder}
                className="mt-4 w-full h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    active.onSubmit(promptValue);
                    closeDialog(active.id);
                  }
                }}
              />
            )}

            <div className="mt-6 flex justify-end gap-2">
              {active.type !== "alert" && (
                <Button
                  variant="outline"
                  onClick={() => {
                    if (active.type === "confirm") active.onCancel?.();
                    if (active.type === "prompt") active.onCancel?.();
                    closeDialog(active.id);
                  }}
                >
                  {active.type === "confirm"
                    ? active.cancelLabel || "Cancel"
                    : active.cancelLabel || "Cancel"}
                </Button>
              )}
              <Button
                variant={
                  active.variant === "destructive"
                    ? "destructive"
                    : active.variant === "success"
                      ? "default"
                      : "default"
                }
                onClick={() => {
                  if (active.type === "confirm") {
                    active.onConfirm();
                    closeDialog(active.id);
                  } else if (active.type === "alert") {
                    active.onClose();
                    closeDialog(active.id);
                  } else {
                    active.onSubmit(promptValue);
                    closeDialog(active.id);
                  }
                }}
              >
                {active.type === "confirm"
                  ? active.confirmLabel || "Confirm"
                  : active.type === "prompt"
                    ? active.confirmLabel || "OK"
                    : active.confirmLabel || "OK"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-4 right-4 z-[110] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium shadow-lg ${
              t.variant === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-100"
                : t.variant === "error"
                  ? "bg-destructive/10 border-destructive/30 text-destructive"
                  : "bg-card border-border"
            }`}
          >
            <span>{t.message}</span>
            <button
              type="button"
              className="opacity-60 hover:opacity-100"
              onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("useDialog must be used within DialogProvider");
  return ctx;
}
