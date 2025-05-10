import { useEffect } from "react";

type HotkeyListenerOptions = {
  onHotkeyPress: (key: string) => void;
  hotkeys: string[];
};

export const useHotkeyListener = ({
  onHotkeyPress,
  hotkeys,
}: HotkeyListenerOptions) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (typeof window === "undefined") return;
      // Only trigger on body
      if (!(event.target instanceof HTMLBodyElement)) {
        return;
      }

      if (hotkeys.includes(event.key)) {
        onHotkeyPress(event.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [hotkeys, onHotkeyPress]);
};
