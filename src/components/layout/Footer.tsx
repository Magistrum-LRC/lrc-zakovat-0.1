import { Send } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-card/50 backdrop-blur-sm">
      <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          © Zakovat by LRC Studio
        </p>
        <p className="text-xs text-muted-foreground text-center">
          Академический дашборд интеллектуальных игр
        </p>
        <a
          href="https://t.me/zakovat"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
        >
          <Send className="size-3" />
          Telegram
        </a>
      </div>
    </footer>
  );
}
