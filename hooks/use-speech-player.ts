import * as Speech from "expo-speech";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Platform } from "react-native";

export type SpeechItem = { id: string; label: string; text: string };

export function useSpeechPlayer(items: SpeechItem[]) {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(1);
  const rateRef = useRef(1);
  const itemsRef = useRef(items);
  const playingRef = useRef(false);
  const pausedRef = useRef(false);
  const currentRef = useRef(-1);
  const playAtRef = useRef<(index: number) => void>(() => undefined);
  const isWebSpeechAvailable = Platform.OS === "web" && typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => { itemsRef.current = items; }, [items]);

  const stop = useCallback(() => {
    playingRef.current = false;
    pausedRef.current = false;
    currentRef.current = -1;
    if (Platform.OS === "web" && typeof window !== "undefined") window.speechSynthesis?.cancel();
    else void Speech.stop();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentIndex(-1);
  }, []);

  const playAt = useCallback((index: number) => {
    const item = itemsRef.current[index];
    if (!item) {
      stop();
      return;
    }
    playingRef.current = true;
    pausedRef.current = false;
    currentRef.current = index;
    setCurrentIndex(index);
    setIsPlaying(true);
    setIsPaused(false);

    const onFinished = () => {
      if (!playingRef.current || pausedRef.current) return;
      const next = index + 1;
      if (next < itemsRef.current.length) playAtRef.current(next);
      else stop();
    };

    if (Platform.OS === "web" && typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(item.text);
      utterance.lang = "pt-BR";
      utterance.rate = rateRef.current;
      const voice = window.speechSynthesis.getVoices().find((candidate) => candidate.lang.toLowerCase().replace("_", "-") === "pt-br")
        ?? window.speechSynthesis.getVoices().find((candidate) => candidate.lang.toLowerCase().startsWith("pt"));
      if (voice) utterance.voice = voice;
      utterance.onend = onFinished;
      utterance.onerror = onFinished;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } else {
      void Speech.stop();
      Speech.speak(item.text, { language: "pt-BR", rate: rateRef.current, onDone: onFinished, onStopped: onFinished, onError: onFinished });
    }
  }, [stop]);

  useEffect(() => { playAtRef.current = playAt; }, [playAt]);

  const playAll = useCallback(() => {
    if (isPaused) {
      if (Platform.OS === "web" && typeof window !== "undefined") window.speechSynthesis?.resume();
      else void Speech.resume();
      pausedRef.current = false;
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }
    playAt(0);
  }, [isPaused, playAt]);

  const playItem = useCallback((index: number) => {
    if (currentRef.current === index && playingRef.current) {
      if (Platform.OS === "web" && typeof window !== "undefined") window.speechSynthesis?.pause();
      else void Speech.pause();
      pausedRef.current = true;
      setIsPaused(true);
      setIsPlaying(false);
      return;
    }
    stop();
    playAt(index);
  }, [playAt, stop]);

  const togglePause = useCallback(() => {
    if (!playingRef.current && !pausedRef.current) return playAll();
    if (isPaused) return playAll();
    if (Platform.OS === "web" && typeof window !== "undefined") window.speechSynthesis?.pause();
    else void Speech.pause();
    pausedRef.current = true;
    setIsPaused(true);
    setIsPlaying(false);
  }, [isPaused, playAll]);

  const updateRate = useCallback((nextRate: number) => {
    rateRef.current = nextRate;
    setRate(nextRate);
    if (playingRef.current && currentRef.current >= 0) playAt(currentRef.current);
  }, [playAt]);

  const itemSignature = useMemo(() => items.map((item) => item.id).join("|"), [items]);
  useEffect(() => {
    if (itemSignature) stop();
    return stop;
  }, [itemSignature, stop]);

  return { supported: isWebSpeechAvailable || Platform.OS !== "web", currentIndex, currentLabel: currentIndex >= 0 ? items[currentIndex]?.label ?? "Liturgia" : "Pronto para ouvir a liturgia", isPlaying, isPaused, rate, playAll, playItem, togglePause, stop, setRate: updateRate };
}
