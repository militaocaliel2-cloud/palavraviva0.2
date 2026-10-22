import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

import { useThemeContext } from "@/lib/theme-provider";

export type JourneyKey = "liturgy" | "prayer" | "rosary";
export type ThemePreference = "system" | "light" | "dark";
export type FavoriteReading = { id: string; title: string; section: string; reference: string; text: string; dateLabel: string };

type FaithState = {
  completed: Record<JourneyKey, boolean>;
  streak: number;
  prayerDays: number;
  themePreference: ThemePreference;
  reminderEnabled: boolean;
  reminderTime: string;
  reminderDays: number[];
  rosaryStep: number;
  favorites: FavoriteReading[];
  reflectionNotes: Record<string, string>;
};

type FaithJourneyContextValue = FaithState & {
  ready: boolean;
  progress: number;
  completedCount: number;
  toggleActivity: (key: JourneyKey) => void;
  completeActivity: (key: JourneyKey) => void;
  setRosaryStep: (step: number) => void;
  resetRosary: () => void;
  setThemePreference: (preference: ThemePreference) => void;
  setReminderSettings: (settings: Partial<Pick<FaithState, "reminderEnabled" | "reminderTime" | "reminderDays">>) => void;
  toggleFavorite: (favorite: FavoriteReading) => void;
  setReflectionNote: (dateKey: string, note: string) => void;
};

const STORAGE_KEY = "palavra-viva-faith-journey-v1";

const DEFAULT_STATE: FaithState = {
  completed: { liturgy: false, prayer: false, rosary: false },
  streak: 0,
  prayerDays: 0,
  themePreference: "system",
  reminderEnabled: true,
  reminderTime: "07:30",
  reminderDays: [1, 2, 3, 4, 5, 6, 0],
  rosaryStep: 0,
  favorites: [],
  reflectionNotes: {},
};

const FaithJourneyContext = createContext<FaithJourneyContextValue | null>(null);

export function FaithJourneyProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<FaithState>(DEFAULT_STATE);
  const [ready, setReady] = useState(false);
  const hasLoaded = useRef(false);
  const { setColorScheme } = useThemeContext();

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (value) {
          try {
            const saved = JSON.parse(value) as Partial<FaithState>;
            const nextState = {
              ...DEFAULT_STATE,
              ...saved,
              completed: { ...DEFAULT_STATE.completed, ...(saved.completed ?? {}) },
              favorites: Array.isArray(saved.favorites) ? saved.favorites : [],
              reflectionNotes: saved.reflectionNotes ?? {},
            };
            setState(nextState);
            if (nextState.themePreference !== "system") setColorScheme(nextState.themePreference);
          } catch {
            // Ignore malformed local data and keep the safe defaults.
          }
        }
      })
      .finally(() => {
        hasLoaded.current = true;
        setReady(true);
      });
  }, [setColorScheme]);

  useEffect(() => {
    if (!hasLoaded.current) return;
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const toggleActivity = (key: JourneyKey) => {
    setState((current) => {
      const nextValue = !current.completed[key];
      const completed = { ...current.completed, [key]: nextValue };
      const anyCompleted = Object.values(completed).some(Boolean);
      return {
        ...current,
        completed,
        streak: anyCompleted ? Math.max(current.streak, 1) : 0,
        prayerDays: key === "prayer" ? Math.max(0, current.prayerDays + (nextValue ? 1 : -1)) : current.prayerDays,
      };
    });
  };

  const completeActivity = (key: JourneyKey) => {
    setState((current) => {
      if (current.completed[key]) return current;
      return {
        ...current,
        completed: { ...current.completed, [key]: true },
        streak: Math.max(current.streak, 1),
        prayerDays: key === "prayer" ? current.prayerDays + 1 : current.prayerDays,
      };
    });
  };

  const value = useMemo<FaithJourneyContextValue>(() => {
    const completedCount = Object.values(state.completed).filter(Boolean).length;
    return {
      ...state,
      ready,
      completedCount,
      progress: completedCount / 3,
      toggleActivity,
      completeActivity,
      setRosaryStep: (step) => setState((current) => ({ ...current, rosaryStep: Math.max(0, Math.min(6, step)) })),
      resetRosary: () => setState((current) => ({ ...current, rosaryStep: 0, completed: { ...current.completed, rosary: false } })),
      setThemePreference: (preference) => {
        setState((current) => ({ ...current, themePreference: preference }));
        if (preference !== "system") setColorScheme(preference);
      },
      setReminderSettings: (settings) => setState((current) => ({ ...current, ...settings })),
      toggleFavorite: (favorite) => setState((current) => {
        const exists = current.favorites.some((item) => item.id === favorite.id);
        return { ...current, favorites: exists ? current.favorites.filter((item) => item.id !== favorite.id) : [favorite, ...current.favorites] };
      }),
      setReflectionNote: (dateKey, note) => setState((current) => ({ ...current, reflectionNotes: { ...current.reflectionNotes, [dateKey]: note } })),
    };
  }, [ready, setColorScheme, state]);

  return <FaithJourneyContext.Provider value={value}>{children}</FaithJourneyContext.Provider>;
}

export function useFaithJourney() {
  const context = useContext(FaithJourneyContext);
  if (!context) throw new Error("useFaithJourney must be used inside FaithJourneyProvider");
  return context;
}
