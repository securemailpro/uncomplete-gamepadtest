"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { Gamepad2, Zap, CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Progress } from "@/app/components/ui/progress";
import { cn } from "@/app/lib/utils";
import { RecommendedProductsSection } from "@/app/components/RecommendedProducts";

interface GamepadState {
  connected: boolean;
  id: string;
  index: number;
  buttons: boolean[];
  axes: number[];
  timestamp: number;
  triggers?: number[];
}

interface InputStats {
  buttonPresses: number;
  totalInputTime: number;
  averageReactionTime: number;
  maxStickDistance: number;
}

interface InputEvent {
  type: "press" | "release";
  button: number;
  gamepadIndex: number;
  timestamp: number;
}

const recommendedProducts = [
  {
    name: "Official Luna Wireless Controller",
    description:
      "Built for Amazon Luna with ultra-low latency, Bluetooth/USB support, and a comfortable grip for smooth cloud gaming.",
    href: "https://amzn.to/42wogzI",
    imageSrc:
      "https://m.media-amazon.com/images/I/51qbcWzHSML._AC_SL1000_.jpg",
    alt: "Luna Wireless Controller",
  },
  {
    name: "Xbox Wireless Gaming Controller – Ice Breaker Special Edition",
    description:
      "Cool transparent design, hybrid D-pad, and textured grips. Works with Xbox Series X|S, Xbox One, and PC via Bluetooth or USB.",
    href: "https://amzn.to/3KmlSW4",
    imageSrc: "https://m.media-amazon.com/images/I/71Js3hjffrL._SL1500_.jpg",
    alt: "Xbox Wireless Gaming Controller",
  },
  {
    name: "PlayStation DualSense® Wireless Controller",
    description:
      "Immersive haptic feedback, adaptive triggers, and built-in mic. Perfect for PS5 and PC gaming.",
    href: "https://amzn.to/3K1XlWl",
    imageSrc: "https://m.media-amazon.com/images/I/51PmeLGEkML._SL1500_.jpg",
    alt: "PlayStation DualSense",
  },
];

export function GamepadTesterClient() {
  const [gamepads, setGamepads] = useState<GamepadState[]>([]);
  const [isVibrating, setIsVibrating] = useState(false);
  const [inputStats, setInputStats] = useState<InputStats>({
    buttonPresses: 0,
    totalInputTime: 0,
    averageReactionTime: 0,
    maxStickDistance: 0,
  });
  const [isLatencyTest, setIsLatencyTest] = useState(false);
  const [latencyTestStart, setLatencyTestStart] = useState<number>(0);
  const [latencyResults, setLatencyResults] = useState<number[]>([]);
  const [deadzone, setDeadzone] = useState(8);
  const [recentInputs, setRecentInputs] = useState<InputEvent[]>([]);
  const [buttonUsage, setButtonUsage] = useState<Record<number, number[]>>({});
  const [snapshotCopied, setSnapshotCopied] = useState(false);

  const prevButtonsRef = useRef<Record<number, boolean[]>>({});
  const lastTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const snapshotTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const applyDeadzone = useCallback(
    (value: number) => {
      const threshold = Math.min(Math.max(deadzone / 100, 0), 0.95);
      if (Math.abs(value) <= threshold) return 0;
      const normalized = (Math.abs(value) - threshold) / (1 - threshold);
      return Math.sign(value) * Math.min(normalized, 1);
    },
    [deadzone],
  );

  const updateGamepadState = useCallback(
    (dtMs: number) => {
      if (typeof navigator === "undefined" || !navigator.getGamepads) return;
      const gamepadList = navigator.getGamepads();
      const newGamepads: GamepadState[] = [];

      for (let i = 0; i < gamepadList.length; i++) {
        const gamepad = gamepadList[i];
        if (!gamepad) continue;

        const currentButtons = gamepad.buttons.map((button) => button.pressed);
        const previousButtons =
          prevButtonsRef.current[gamepad.index] ||
          new Array(currentButtons.length).fill(false);

        const pressedButtons: number[] = [];
        const releasedButtons: number[] = [];
        for (let b = 0; b < currentButtons.length; b++) {
          if (currentButtons[b] && !previousButtons[b]) pressedButtons.push(b);
          if (!currentButtons[b] && previousButtons[b]) releasedButtons.push(b);
        }

        if (pressedButtons.length > 0) {
          setInputStats((prev) => ({
            ...prev,
            buttonPresses: prev.buttonPresses + pressedButtons.length,
            totalInputTime: prev.totalInputTime + dtMs,
          }));

          if (isLatencyTest && latencyTestStart > 0) {
            const latency = Date.now() - latencyTestStart;
            setLatencyResults((prev) => [...prev, latency]);
            setIsLatencyTest(false);
            setLatencyTestStart(0);
            setInputStats((prev) => ({
              ...prev,
              averageReactionTime:
                prev.averageReactionTime === 0
                  ? latency
                  : (prev.averageReactionTime + latency) / 2,
            }));
          }
        } else {
          setInputStats((prev) => ({
            ...prev,
            totalInputTime: prev.totalInputTime + dtMs,
          }));
        }

        if (pressedButtons.length > 0 || releasedButtons.length > 0) {
          const timestamp = Date.now();
          const events: InputEvent[] = [
            ...pressedButtons.map((button) => ({
              type: "press" as const,
              button,
              gamepadIndex: gamepad.index,
              timestamp,
            })),
            ...releasedButtons.map((button) => ({
              type: "release" as const,
              button,
              gamepadIndex: gamepad.index,
              timestamp,
            })),
          ];
          setRecentInputs((prev) => [...events, ...prev].slice(0, 14));
        }

        if (pressedButtons.length > 0) {
          setButtonUsage((prev) => {
            const existing = prev[gamepad.index]
              ? [...prev[gamepad.index]]
              : new Array(currentButtons.length).fill(0);
            pressedButtons.forEach((button) => {
              if (button >= existing.length) {
                const extendBy = button - existing.length + 1;
                existing.push(...new Array(extendBy).fill(0));
              }
              existing[button] = (existing[button] ?? 0) + 1;
            });
            return { ...prev, [gamepad.index]: existing };
          });
        }

        if (releasedButtons.length > 0 && isLatencyTest) {
          setIsLatencyTest(false);
          setLatencyTestStart(0);
        }

        const normalizedAxes = Array.from(gamepad.axes, (v) =>
          applyDeadzone(v),
        );

        let triggers: number[] | undefined;
        if (gamepad.axes.length > 4) {
          triggers = gamepad.axes
            .slice(4)
            .map((v) => Math.max(-1, Math.min(1, v)));
        } else if (gamepad.buttons.length >= 8) {
          const l2 = gamepad.buttons[6]?.value ?? 0;
          const r2 = gamepad.buttons[7]?.value ?? 0;
          triggers = [l2 * 2 - 1, r2 * 2 - 1];
        }

        if (gamepad.axes.length >= 2) {
          const x = normalizedAxes[0] ?? 0;
          const y = normalizedAxes[1] ?? 0;
          const stickDistance = Math.sqrt(x * x + y * y);
          setInputStats((prev) => ({
            ...prev,
            maxStickDistance: Math.max(prev.maxStickDistance, stickDistance),
          }));
        }

        prevButtonsRef.current[gamepad.index] = currentButtons;

        newGamepads.push({
          connected: gamepad.connected,
          id: gamepad.id,
          index: gamepad.index,
          buttons: currentButtons,
          axes: normalizedAxes,
          timestamp: gamepad.timestamp,
          triggers,
        });
      }

      setGamepads(newGamepads);
    },
    [applyDeadzone, isLatencyTest, latencyTestStart],
  );

  const testVibration = async (gamepadIndex: number) => {
    if (typeof navigator === "undefined" || !navigator.getGamepads) return;
    const gamepad = navigator.getGamepads()[gamepadIndex];
    if (gamepad && (gamepad as any).vibrationActuator) {
      setIsVibrating(true);
      try {
        await (gamepad as any).vibrationActuator.playEffect("dual-rumble", {
          duration: 1000,
          strongMagnitude: 0.5,
          weakMagnitude: 0.3,
        });
      } catch {
        console.log("Vibration not supported on this gamepad");
      }
      setTimeout(() => setIsVibrating(false), 1000);
    }
  };

  const startLatencyTest = () => {
    setIsLatencyTest(true);
    setLatencyTestStart(Date.now());
  };

  const resetStats = () => {
    setInputStats({
      buttonPresses: 0,
      totalInputTime: 0,
      averageReactionTime: 0,
      maxStickDistance: 0,
    });
    setLatencyResults([]);
    prevButtonsRef.current = {};
    setButtonUsage({});
    setRecentInputs([]);
  };

  const averageLatency =
    latencyResults.length > 0
      ? latencyResults.reduce((a, b) => a + b, 0) / latencyResults.length
      : 0;

  useEffect(() => {
    return () => {
      if (snapshotTimeoutRef.current) {
        clearTimeout(snapshotTimeoutRef.current);
      }
    };
  }, []);

  const primaryPadIndex = gamepads[0]?.index;
  const primaryButtonUsage =
    primaryPadIndex !== undefined ? buttonUsage[primaryPadIndex] : undefined;

  const exportSnapshot = async () => {
    if (typeof navigator === "undefined" || typeof window === "undefined")
      return;

    const summary = [
      `Controllers detected: ${gamepads.length}`,
      `Button presses: ${inputStats.buttonPresses}`,
      `Average latency: ${averageLatency ? `${averageLatency.toFixed(0)}ms` : "n/a"}`,
      `Max stick range: ${(inputStats.maxStickDistance * 100).toFixed(1)}%`,
      `Deadzone: ${deadzone}%`,
    ];

    if (primaryButtonUsage) {
      const topButtons = primaryButtonUsage
        .map((count, index) => ({ index, count }))
        .filter((entry) => entry.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
        .map((entry) => `Button ${entry.index + 1}: ${entry.count}`);
      if (topButtons.length > 0) {
        summary.push("Top buttons:", ...topButtons);
      }
    }

    try {
      await navigator.clipboard.writeText(summary.join("\n"));
      setSnapshotCopied(true);
      if (snapshotTimeoutRef.current) {
        clearTimeout(snapshotTimeoutRef.current);
      }
      snapshotTimeoutRef.current = setTimeout(
        () => setSnapshotCopied(false),
        2500,
      );
    } catch {
      console.error("Clipboard copy failed");
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleGamepadConnected = (e: GamepadEvent) => {
      console.log("Gamepad connected:", e.gamepad.id);
    };

    const handleGamepadDisconnected = (e: GamepadEvent) => {
      console.log("Gamepad disconnected:", e.gamepad.id);
    };

    window.addEventListener("gamepadconnected", handleGamepadConnected);
    window.addEventListener("gamepaddisconnected", handleGamepadDisconnected);

    const loop = (t: number) => {
      const last = lastTimeRef.current ?? t;
      const dt = Math.min(100, t - last);
      lastTimeRef.current = t;
      updateGamepadState(dt);
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("gamepadconnected", handleGamepadConnected);
      window.removeEventListener(
        "gamepaddisconnected",
        handleGamepadDisconnected,
      );
    };
  }, [updateGamepadState]);

  const renderJoystick = (x: number, y: number, label: string) => (
    <div className="flex flex-col items-center gap-2">
      <span className="text-sm font-medium">{label}</span>
      <div className="relative w-24 h-24 bg-muted rounded-full border-2 border-border">
        <div
          className="absolute w-4 h-4 bg-primary rounded-full transform -translate-x-2 -translate-y-2 transition-all"
          style={{
            left: `${((x + 1) / 2) * 100}%`,
            top: `${((y + 1) / 2) * 100}%`,
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1 h-1 bg-border rounded-full" />
        </div>
      </div>
      <div className="text-xs text-muted-foreground">
        X: {x.toFixed(2)} Y: {y.toFixed(2)}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-down">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Gamepad2 className="h-8 w-8 text-primary animate-bounce-in" />
            <h1 className="text-3xl font-bold animate-fade-in-right animate-stagger-1">
              Gamepad Tester
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up animate-stagger-2">
            Test your gaming controllers with real-time input detection, button
            mapping, and vibration feedback.
          </p>
        </div>

        <Card className="mb-8 animate-fade-in-up animate-stagger-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle
                className={cn(
                  "h-5 w-5 transition-colors duration-500",
                  gamepads.length > 0
                    ? "text-green-500 animate-pulse"
                    : "text-muted-foreground",
                )}
              />
              Connection Status
            </CardTitle>
            <CardDescription
              className={gamepads.length > 0 ? "animate-fade-in" : ""}
            >
              {gamepads.length > 0
                ? `${gamepads.length} gamepad(s) detected`
                : "No gamepads detected. Please connect a controller and press any button."}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="mb-8 animate-fade-in-up">
          <CardHeader>
            <CardTitle>Input Lab</CardTitle>
            <CardDescription>
              Tune dead zones, review input history, and export diagnostics.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="p-4 rounded-lg border bg-slate-50 dark:bg-slate-900">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Analog Deadzone</span>
                  <span className="text-xs text-muted-foreground">
                    {deadzone}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={30}
                  step={1}
                  value={deadzone}
                  onChange={(event) => setDeadzone(Number(event.target.value))}
                  className="w-full mt-3"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Reduce drift by increasing the deadzone or set it low for
                  competitive play.
                </p>
              </div>

              <div className="p-4 rounded-lg border bg-slate-50 dark:bg-slate-900">
                <span className="text-sm font-medium">Recent Inputs</span>
                <div className="mt-3 max-h-36 overflow-y-auto space-y-2 text-xs">
                  {recentInputs.length === 0 && (
                    <p className="text-muted-foreground">
                      No inputs yet. Press any button to capture diagnostics.
                    </p>
                  )}
                  {recentInputs.map((event, idx) => (
                    <div
                      key={`${event.timestamp}-${event.button}-${idx}`}
                      className="flex items-center justify-between gap-3 px-2 py-1 rounded bg-white dark:bg-slate-800"
                    >
                      <span className="font-medium">
                        #{event.gamepadIndex} · B{event.button + 1}
                      </span>
                      <span
                        className={
                          event.type === "press"
                            ? "text-green-600"
                            : "text-red-500"
                        }
                      >
                        {event.type === "press" ? "Pressed" : "Released"}
                      </span>
                      <span className="text-muted-foreground">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-lg border bg-slate-50 dark:bg-slate-900">
                <span className="text-sm font-medium">Most Used Buttons</span>
                <div className="mt-3 space-y-2 text-sm">
                  {!primaryButtonUsage ||
                  primaryButtonUsage.every((count) => count === 0) ? (
                    <p className="text-xs text-muted-foreground">
                      Press buttons to build usage stats.
                    </p>
                  ) : (
                    primaryButtonUsage
                      .map((count, index) => ({ index, count }))
                      .filter((entry) => entry.count > 0)
                      .sort((a, b) => b.count - a.count)
                      .slice(0, 5)
                      .map((entry) => (
                        <div
                          key={entry.index}
                          className="flex items-center justify-between rounded bg-white dark:bg-slate-800 px-3 py-1 text-xs"
                        >
                          <span>Button {entry.index + 1}</span>
                          <span className="font-semibold">{entry.count}</span>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={exportSnapshot}
                className="gap-2"
              >
                <Zap className="h-4 w-4" />
                Copy Diagnostic Snapshot
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRecentInputs([])}
              >
                Clear Input History
              </Button>
              {snapshotCopied && (
                <span className="text-sm text-green-600">
                  Snapshot copied to clipboard.
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {gamepads.length > 0 && (
          <Card className="mb-8 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950 animate-fade-in-up animate-stagger-4 hover-glow">
            <CardHeader>
              <CardTitle className="text-blue-800 dark:text-blue-200 flex items-center gap-2">
                Advanced Testing Features
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              </CardTitle>
              <CardDescription className="text-blue-700 dark:text-blue-300">
                Unique features to test your gamepad&apos;s performance and
                responsiveness
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-white dark:bg-blue-900 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {inputStats.buttonPresses}
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    Button Presses
                  </div>
                </div>
                <div className="text-center p-3 bg-white dark:bg-blue-900 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {(inputStats.maxStickDistance * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    Max Stick Range
                  </div>
                </div>
                <div className="text-center p-3 bg-white dark:bg-blue-900 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {averageLatency ? `${averageLatency.toFixed(0)}ms` : "--"}
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    Avg Latency
                  </div>
                </div>
                <div className="text-center p-3 bg-white dark:bg-blue-900 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {latencyResults.length}
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    Tests Complete
                  </div>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={startLatencyTest}
                  disabled={isLatencyTest}
                  variant="outline"
                  size="sm"
                >
                  {isLatencyTest ? "Press Any Button!" : "Test Latency"}
                </Button>
                <Button onClick={resetStats} variant="outline" size="sm">
                  Reset Stats
                </Button>
              </div>
              {isLatencyTest && (
                <div className="text-center p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <div className="text-yellow-800 dark:text-yellow-200 font-semibold">
                    Latency Test Active - Press any button as fast as you can!
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {gamepads.length === 0 && (
          <Card className="mb-8 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950 animate-fade-in-up">
            <CardHeader>
              <CardTitle className="text-orange-800 dark:text-orange-200 flex items-center gap-2">
                How to Connect Your Gamepad
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-orange-700 dark:text-orange-300">
              <div className="flex items-start gap-2 animate-fade-in-left animate-stagger-1">
                <span className="font-semibold">1.</span>
                <span>Connect your gamepad via USB or Bluetooth</span>
              </div>
              <div className="flex items-start gap-2 animate-fade-in-left animate-stagger-2">
                <span className="font-semibold">2.</span>
                <span>Press any button on your controller to activate it</span>
              </div>
              <div className="flex items-start gap-2 animate-fade-in-left animate-stagger-3">
                <span className="font-semibold">3.</span>
                <span>Your gamepad will appear below once detected</span>
              </div>
            </CardContent>
          </Card>
        )}

        {gamepads.map((gamepad) => (
          <Card key={gamepad.index} className="mb-8">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="outline">#{gamepad.index}</Badge>
                    Gamepad Connected
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {gamepad.id}
                  </CardDescription>
                </div>
                <Button
                  onClick={() => testVibration(gamepad.index)}
                  disabled={isVibrating}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Zap className="h-4 w-4" />
                  {isVibrating ? "Vibrating..." : "Test Vibration"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Controller Status
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-1">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Button Status
                      </h4>
                      <div className="grid grid-cols-4 gap-2">
                        {gamepad.buttons.slice(0, 16).map((pressed, index) => (
                          <div
                            key={index}
                            className={cn(
                              "aspect-square rounded-md border flex items-center justify-center text-xs font-medium transition-all",
                              pressed
                                ? "bg-green-500 text-white border-green-500 shadow-md"
                                : "bg-gray-100 text-gray-600 border-gray-200",
                            )}
                          >
                            {index + 1}
                          </div>
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        {gamepad.buttons.filter(Boolean).length} of{" "}
                        {gamepad.buttons.length} buttons active
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <div className="bg-gray-50 rounded-xl p-6 border">
                      <div className="relative w-full max-w-sm mx-auto">
                        <div className="relative bg-gray-300 rounded-2xl px-8 py-4 shadow-lg">
                          <div className="absolute top-4 left-4">
                            <div className="relative w-12 h-12">
                              <div
                                className={cn(
                                  "absolute top-0 left-1/2 w-4 h-4 bg-gray-400 rounded-sm transform -translate-x-1/2",
                                  gamepad.buttons[12] && "bg-green-500",
                                )}
                              ></div>
                              <div
                                className={cn(
                                  "absolute bottom-0 left-1/2 w-4 h-4 bg-gray-400 rounded-sm transform -translate-x-1/2",
                                  gamepad.buttons[13] && "bg-green-500",
                                )}
                              ></div>
                              <div
                                className={cn(
                                  "absolute left-0 top-1/2 w-4 h-4 bg-gray-400 rounded-sm transform -translate-y-1/2",
                                  gamepad.buttons[14] && "bg-green-500",
                                )}
                              ></div>
                              <div
                                className={cn(
                                  "absolute right-0 top-1/2 w-4 h-4 bg-gray-400 rounded-sm transform -translate-y-1/2",
                                  gamepad.buttons[15] && "bg-green-500",
                                )}
                              ></div>
                            </div>
                          </div>

                          <div className="absolute top-4 right-4">
                            <div className="relative w-12 h-12">
                              <div
                                className={cn(
                                  "absolute top-0 left-1/2 w-4 h-4 bg-gray-400 rounded-full transform -translate-x-1/2",
                                  gamepad.buttons[3] && "bg-green-500",
                                )}
                              ></div>
                              <div
                                className={cn(
                                  "absolute bottom-0 left-1/2 w-4 h-4 bg-gray-400 rounded-full transform -translate-x-1/2",
                                  gamepad.buttons[0] && "bg-green-500",
                                )}
                              ></div>
                              <div
                                className={cn(
                                  "absolute left-0 top-1/2 w-4 h-4 bg-gray-400 rounded-full transform -translate-y-1/2",
                                  gamepad.buttons[2] && "bg-green-500",
                                )}
                              ></div>
                              <div
                                className={cn(
                                  "absolute right-0 top-1/2 w-4 h-4 bg-gray-400 rounded-full transform -translate-y-1/2",
                                  gamepad.buttons[1] && "bg-green-500",
                                )}
                              ></div>
                            </div>
                          </div>

                          <div className="absolute bottom-2 left-6">
                            <div
                              className={cn(
                                "w-6 h-6 bg-gray-400 rounded-full border-2 border-gray-500",
                                gamepad.buttons[10] && "bg-green-500",
                              )}
                            ></div>
                          </div>
                          <div className="absolute bottom-2 right-6">
                            <div
                              className={cn(
                                "w-6 h-6 bg-gray-400 rounded-full border-2 border-gray-500",
                                gamepad.buttons[11] && "bg-green-500",
                              )}
                            ></div>
                          </div>

                          <div className="absolute -top-2 left-4">
                            <div
                              className={cn(
                                "w-8 h-3 bg-gray-400 rounded-t-lg",
                                gamepad.buttons[4] && "bg-green-500",
                              )}
                            ></div>
                          </div>
                          <div className="absolute -top-2 right-4">
                            <div
                              className={cn(
                                "w-8 h-3 bg-gray-400 rounded-t-lg",
                                gamepad.buttons[5] && "bg-green-500",
                              )}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-1">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">
                          Connection
                        </h4>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Connected</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">
                          Input Count
                        </h4>
                        <div className="text-2xl font-bold">
                          {inputStats.buttonPresses}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">
                          Latency
                        </h4>
                        <div className="text-lg font-semibold">
                          {averageLatency
                            ? `${averageLatency.toFixed(0)}ms`
                            : "--"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {gamepad.axes.length >= 4 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Analog Sticks</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 justify-items-center">
                    {renderJoystick(
                      gamepad.axes[0],
                      gamepad.axes[1],
                      "Left Stick",
                    )}
                    {renderJoystick(
                      gamepad.axes[2],
                      gamepad.axes[3],
                      "Right Stick",
                    )}
                  </div>
                </div>
              )}

              {((gamepad.triggers && gamepad.triggers.length > 0) ||
                gamepad.axes.length > 4) && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Triggers</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(gamepad.triggers ?? gamepad.axes.slice(4)).map(
                      (value, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Trigger {index + 1}</span>
                            <span>{(((value + 1) / 2) * 100).toFixed(0)}%</span>
                          </div>
                          <Progress
                            value={((value + 1) / 2) * 100}
                            className="h-3"
                          />
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        <RecommendedProductsSection products={recommendedProducts} />

        <section className="mt-12 space-y-8 text-base leading-7 text-foreground">
          <header className="space-y-3">
            <h2 className="text-2xl font-bold">
              Gamepad Tester – Diagnose Your Controller Online
            </h2>
            <p>
              Ensure your game controller works perfectly with our free online
              Gamepad Tester. Check every button, joystick, trigger, and
              vibration motor directly in your browser—no software installation
              needed.
            </p>
          </header>

          <section className="space-y-2">
            <h3 className="text-xl font-semibold">What Is a Gamepad Tester?</h3>
            <p>
              A{" "}
              <Link href="/gamepad-tester" className="text-primary underline">
                Gamepad Tester
              </Link>{" "}
              is a browser-based tool that reads controller inputs using the Web
              Gamepad API. It provides live feedback on:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>Button presses and releases</li>
              <li>Analog stick movement (X/Y axes)</li>
              <li>Trigger sensitivity (L2/R2, LT/RT)</li>
              <li>Vibration feedback</li>
              <li>Connection type and battery status</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-xl font-semibold">Supported Controllers</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">Xbox</h4>
                <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1">
                  <li>Xbox One</li>
                  <li>Xbox Series X|S</li>
                  <li>Xbox 360 (wired/wireless)</li>
                </ul>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">
                  PlayStation
                </h4>
                <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1">
                  <li>PS3</li>
                  <li>PS4 DualShock 4</li>
                  <li>PS5 DualSense</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">
                  Nintendo & Others
                </h4>
                <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1">
                  <li>Switch Pro Controller</li>
                  <li>Joy-Cons</li>
                  <li>Logitech, 8BitDo, generic USB/Bluetooth controllers</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-xl font-semibold">
              Frequently Asked Questions
            </h3>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>
                <strong>Q: Why isn&apos;t my controller detected?</strong>
                <br />
                Check your USB or Bluetooth connection. Some wireless
                controllers require pairing or updated drivers.
              </li>
              <li>
                <strong>
                  Q: Can I test vibration and trigger sensitivity?
                </strong>
                <br />
                Yes, most modern controllers, including PS5 DualSense and Xbox
                Series X|S, are supported.
              </li>
              <li>
                <strong>Q: Which controllers are supported?</strong>
                <br />
                Almost all modern controllers: Xbox, PlayStation, Nintendo, and
                popular third-party USB/Bluetooth options.
              </li>
            </ul>
          </section>
        </section>
      </div>
    </div>
  );
}
