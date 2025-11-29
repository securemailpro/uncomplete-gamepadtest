"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Music, Piano, Activity } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";

const RecommendedProductsSection = dynamic(
  () => import("@/app/components/RecommendedProducts").then(mod => mod.RecommendedProductsSection),
  { ssr: false }
);

interface MIDIDeviceInfo {
  id: string;
  name: string;
  manufacturer: string;
  version: string;
  type: "input" | "output";
  state: "connected" | "disconnected";
}

interface MIDIMessage {
  timestamp: number;
  type: "noteOn" | "noteOff" | "controlChange" | "pitchBend" | "programChange" | "aftertouch" | "other";
  channel: number;
  note?: number;
  velocity?: number;
  controller?: number;
  value?: number;
  raw: number[];
}

interface NoteInfo {
  note: number;
  name: string;
  octave: number;
  frequency: number;
  isActive: boolean;
  velocity: number;
}

const recommendedProducts = [
  {
    name: "Akai Professional MPK Mini MK3",
    description: "25-key MIDI controller with drum pads, knobs, and bundled production software.",
    href: "https://amzn.to/4n15UiE",
    imageSrc: "https://m.media-amazon.com/images/I/717qmGlA7ZL._AC_SL1500_.jpg",
    alt: "AKAI MPK Mini MK3",
  },
  {
    name: "M-VAVE 25 Key USB MIDI Keyboard Controller",
    description: "Bluetooth MIDI controller with semi-weighted keys and drum pads.",
    href: "https://amzn.to/47MPWE5",
    imageSrc: "https://m.media-amazon.com/images/I/61NyksD22vL._AC_SL1500_.jpg",
    alt: "MIDI Keyboard Controller",
  },
  {
    name: "Arturia MiniLab 3",
    description: "Compact 25-key controller with pads and software for music production.",
    href: "https://www.amazon.com/dp/B0711V4S8N",
    imageSrc: "https://m.media-amazon.com/images/I/61EjCG4omGL._AC_SL1500_.jpg",
    alt: "Arturia MiniLab 3",
  },
];

const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export function MIDITesterClient() {
  const [midiAccess, setMidiAccess] = useState<MIDIAccess | null>(null);
  const [devices, setDevices] = useState<MIDIDeviceInfo[]>([]);
  const [messages, setMessages] = useState<MIDIMessage[]>([]);
  const [activeNotes, setActiveNotes] = useState<Map<number, NoteInfo>>(new Map());
  const [midiSupported, setMidiSupported] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [totalMessages, setTotalMessages] = useState(0);
  const [midiError, setMidiError] = useState<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const activeOscRef = useRef<Map<number, { osc: OscillatorNode; gain: GainNode; baseFreq: number }>>(new Map());

  const ensureAudioContext = async () => {
    if (typeof window === "undefined") return;

    if (!audioCtxRef.current) {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new Ctx();
    }
    if (audioCtxRef.current.state === "suspended") {
      try {
        await audioCtxRef.current.resume();
      } catch {}
    }
  };

  const getNoteInfo = (midiNote: number): { name: string; octave: number; frequency: number } => {
    const name = noteNames[midiNote % 12];
    const octave = Math.floor(midiNote / 12) - 1;
    const frequency = 440 * Math.pow(2, (midiNote - 69) / 12);
    return { name, octave, frequency };
  };

  const getMIDIMessageType = (status: number): MIDIMessage["type"] => {
    const messageType = status & 0xf0;
    switch (messageType) {
      case 0x80:
        return "noteOff";
      case 0x90:
        return "noteOn";
      case 0xb0:
        return "controlChange";
      case 0xc0:
        return "programChange";
      case 0xd0:
        return "aftertouch";
      case 0xe0:
        return "pitchBend";
      default:
        return "other";
    }
  };

  const playNote = (note: number, velocity: number) => {
    if (!audioCtxRef.current) return;

    const baseFreq = 440 * Math.pow(2, (note - 69) / 12);
    const ctx = audioCtxRef.current;

    if (activeOscRef.current.has(note)) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.value = baseFreq;

    const v = Math.max(0.05, Math.min(1, velocity / 127));
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.25 * v, ctx.currentTime + 0.01);

    osc.connect(gain).connect(ctx.destination);
    osc.start();

    activeOscRef.current.set(note, { osc, gain, baseFreq });
  };

  const stopNote = (note: number) => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const entry = activeOscRef.current.get(note);
    if (!entry) return;

    entry.gain.gain.cancelScheduledValues(ctx.currentTime);
    entry.gain.gain.setValueAtTime(entry.gain.gain.value, ctx.currentTime);
    entry.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.08);
    entry.osc.stop(ctx.currentTime + 0.1);
    activeOscRef.current.delete(note);
  };

  const handleMIDIMessage = useCallback((event: MIDIMessageEvent) => {
    const data: number[] = Array.from(event.data as Iterable<number>);
    const status: number = data[0] as number;
    const channel: number = ((status & 0x0f) + 1) as number;
    const type = getMIDIMessageType(status);

    const message: MIDIMessage = {
      timestamp: event.timeStamp,
      type,
      channel,
      raw: data,
    };

    if (type === "noteOn" || type === "noteOff") {
      const note: number = data[1] as number;
      const velocity: number = data[2] as number;
      message.note = note;
      message.velocity = velocity;

      const noteInfo = getNoteInfo(note);

      setActiveNotes((prev) => {
        const newMap = new Map(prev);
        if (type === "noteOn" && velocity > 0) {
          newMap.set(note, {
            note,
            name: `${noteInfo.name}${noteInfo.octave}`,
            octave: noteInfo.octave,
            frequency: noteInfo.frequency,
            isActive: true,
            velocity,
          });
          playNote(note, velocity);
        } else {
          newMap.delete(note);
          stopNote(note);
        }
        return newMap;
      });
    } else if (type === "controlChange") {
      message.controller = data[1] as number;
      message.value = data[2] as number;
    } else if (type === "pitchBend") {
      message.value = ((data[2] as number) << 7) | (data[1] as number);
    } else if (type === "programChange") {
      message.value = data[1] as number;
    }

    setMessages((prev) => [message, ...prev.slice(0, 49)]);
    setTotalMessages((prev) => prev + 1);
  }, []);

  const updateDeviceList = (access: MIDIAccess) => {
    const deviceList: MIDIDeviceInfo[] = [];

    access.inputs.forEach((input) => {
      deviceList.push({
        id: input.id,
        name: input.name || "Unknown Device",
        manufacturer: input.manufacturer || "Unknown",
        version: input.version || "1.0",
        type: "input",
        state: input.state as "connected" | "disconnected",
      });
    });

    access.outputs.forEach((output) => {
      deviceList.push({
        id: output.id,
        name: output.name || "Unknown Device",
        manufacturer: output.manufacturer || "Unknown",
        version: output.version || "1.0",
        type: "output",
        state: output.state as "connected" | "disconnected",
      });
    });

    setDevices(deviceList);
  };

  const setupInputListeners = (access: MIDIAccess) => {
    access.inputs.forEach((input) => {
      input.onmidimessage = handleMIDIMessage;
    });
  };

  const requestMIDIAccess = async () => {
    if (typeof navigator === "undefined") return;

    try {
      if (!navigator.requestMIDIAccess) {
        setMidiSupported(false);
        return;
      }

      await ensureAudioContext();
      const access = await navigator.requestMIDIAccess({ sysex: false });
      setMidiAccess(access);
      setIsConnected(true);

      updateDeviceList(access);
      access.onstatechange = () => updateDeviceList(access);
      setupInputListeners(access);
    } catch (error: any) {
      setMidiSupported(false);
      const message = typeof error?.message === "string" ? error.message : "";
      if (error?.name === "SecurityError" || /permissions policy/i.test(message)) {
        setMidiError("Web MIDI is blocked. Open this page directly (not in an embedded preview).");
      } else {
        setMidiError("MIDI access failed. Please ensure your browser supports Web MIDI.");
      }
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const inputDevices = devices.filter((d) => d.type === "input" && d.state === "connected");
  const outputDevices = devices.filter((d) => d.type === "output" && d.state === "connected");

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-down">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Music className="h-8 w-8 text-primary animate-bounce-in" />
            <h1 className="text-3xl font-bold animate-fade-in-right animate-stagger-1">
              MIDI Tester
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up animate-stagger-2">
            Test your MIDI devices with real-time signal detection and note visualization.
          </p>
        </div>

        {midiError && (
          <Card className="mb-8 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
            <CardContent className="pt-6">
              <p className="text-red-600 dark:text-red-400">{midiError}</p>
            </CardContent>
          </Card>
        )}

        <Card className="mb-8 animate-fade-in-up animate-stagger-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Connection Status
            </CardTitle>
            <CardDescription>
              {!midiSupported
                ? "Web MIDI is not supported in this browser"
                : isConnected
                  ? `${devices.length} device(s) detected`
                  : "Click Connect to detect MIDI devices"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isConnected && midiSupported && (
              <Button onClick={requestMIDIAccess} className="gap-2">
                <Music className="h-4 w-4" />
                Connect MIDI Devices
              </Button>
            )}

            {isConnected && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Input Devices ({inputDevices.length})</h4>
                  {inputDevices.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No input devices found</p>
                  ) : (
                    <div className="space-y-2">
                      {inputDevices.map((device) => (
                        <div key={device.id} className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-900 rounded">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span className="text-sm">{device.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium mb-2">Output Devices ({outputDevices.length})</h4>
                  {outputDevices.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No output devices found</p>
                  ) : (
                    <div className="space-y-2">
                      {outputDevices.map((device) => (
                        <div key={device.id} className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-900 rounded">
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          <span className="text-sm">{device.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {isConnected && (
          <>
            <Card className="mb-8 animate-fade-in-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Piano className="h-5 w-5" />
                  Active Notes
                </CardTitle>
                <CardDescription>
                  Notes currently being played ({activeNotes.size} active)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeNotes.size === 0 ? (
                  <p className="text-muted-foreground">Play notes on your MIDI device to see them here</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {Array.from(activeNotes.values()).map((note) => (
                      <Badge
                        key={note.note}
                        variant="default"
                        className="text-lg px-4 py-2"
                      >
                        {note.name} (vel: {note.velocity})
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="mb-8 animate-fade-in-up">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>MIDI Messages</span>
                  <Badge variant="outline">{totalMessages} total</Badge>
                </CardTitle>
                <CardDescription>Recent MIDI messages received</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {messages.length === 0 ? (
                    <p className="text-muted-foreground">No messages yet. Play your MIDI device to see messages.</p>
                  ) : (
                    messages.map((msg, i) => (
                      <div
                        key={`${msg.timestamp}-${i}`}
                        className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-900 rounded text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{msg.type}</Badge>
                          <span>Ch: {msg.channel}</span>
                          {msg.note !== undefined && <span>Note: {msg.note}</span>}
                          {msg.velocity !== undefined && <span>Vel: {msg.velocity}</span>}
                          {msg.controller !== undefined && <span>CC: {msg.controller}</span>}
                          {msg.value !== undefined && msg.type !== "noteOn" && msg.type !== "noteOff" && (
                            <span>Val: {msg.value}</span>
                          )}
                        </div>
                        <span className="text-muted-foreground text-xs">
                          [{msg.raw.map((b) => b.toString(16).padStart(2, "0")).join(" ")}]
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        <RecommendedProductsSection products={recommendedProducts} />

        <section className="mt-12 space-y-8 text-base leading-7 text-foreground">
          <header className="space-y-3">
            <h2 className="text-2xl font-bold">MIDI Tester – Check Your MIDI Devices Online</h2>
            <p>
              Test your MIDI keyboard, controller, or other MIDI devices with our free online tester. See notes, control changes, and pitch bend in real-time.
            </p>
          </header>

          <section className="space-y-2">
            <h3 className="text-xl font-semibold">What This Tool Detects</h3>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>Note on/off messages with velocity</li>
              <li>Control change (CC) messages</li>
              <li>Pitch bend values</li>
              <li>Program change messages</li>
              <li>Channel aftertouch</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-xl font-semibold">Frequently Asked Questions</h3>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>
                <strong>Q: Why isn&apos;t my MIDI device detected?</strong>
                <br />
                Web MIDI requires Chrome, Edge, or Opera. Safari and Firefox don&apos;t support it natively.
              </li>
              <li>
                <strong>Q: Can I use this to check if my keyboard is working?</strong>
                <br />
                Yes! Play any key and you&apos;ll see the note name, velocity, and MIDI channel in real-time.
              </li>
            </ul>
          </section>
        </section>
      </div>
    </div>
  );
}
