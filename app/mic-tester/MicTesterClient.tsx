"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Mic, MicOff, Volume2, RotateCcw, Activity, ClipboardCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Slider } from "@/app/components/ui/slider";

const RecommendedProductsSection = dynamic(
  () => import("@/app/components/RecommendedProducts").then(mod => mod.RecommendedProductsSection),
  { ssr: false }
);

interface AudioStats {
  level: number;
  peak: number;
  noiseFloor: number;
  signalToNoise: number;
  frequency: number;
}

const recommendedProducts = [
  {
    name: "Logitech Blue Yeti USB Microphone",
    description: "Studio-quality sound with multiple pickup patterns, perfect for streaming and podcasts.",
    href: "https://amzn.to/46sl4Xn",
    imageSrc: "https://m.media-amazon.com/images/I/61KTMvS5JBL._AC_SL1500_.jpg",
    alt: "Blue Yeti USB Microphone",
  },
  {
    name: "HyperX SoloCast USB Condenser Microphone",
    description: "Compact, plug-and-play mic with tap-to-mute for gaming and streaming.",
    href: "https://amzn.to/3IncdOu",
    imageSrc: "https://m.media-amazon.com/images/I/71HnM5DFBBL._AC_SL1500_.jpg",
    alt: "HyperX SoloCast Microphone",
  },
  {
    name: "Shure SM58 Pro Dynamic Microphone",
    description: "Legendary vocal mic with built-in pop filter, ideal for live performance.",
    href: "https://www.amazon.com/dp/B07QR6Z1JB",
    imageSrc: "https://m.media-amazon.com/images/I/616y7aDplTL._AC_SL1500_.jpg",
    alt: "Shure SM58 Microphone",
  },
];

export function MicTesterClient() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioStats, setAudioStats] = useState<AudioStats>({
    level: 0,
    peak: 0,
    noiseFloor: 0,
    signalToNoise: 0,
    frequency: 0,
  });
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>("");
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const [sensitivity, setSensitivity] = useState([50]);
  const [peakHold, setPeakHold] = useState(0);
  const [levelHistory, setLevelHistory] = useState<number[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>(0);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  const getDevices = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices) return;

    try {
      const deviceList = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = deviceList.filter((device) => device.kind === "audioinput");
      setDevices(audioInputs);
      if (audioInputs.length > 0 && !selectedDevice) {
        setSelectedDevice(audioInputs[0].deviceId);
      }
    } catch {
      setError("Unable to enumerate audio devices");
    }
  }, [selectedDevice]);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices) return;

    getDevices();

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        stream.getTracks().forEach((track) => track.stop());
        getDevices();
      })
      .catch(() => {
        setError("Microphone access denied. Please allow microphone access to test your audio input.");
      });
  }, [getDevices]);

  const startRecording = async () => {
    if (typeof navigator === "undefined" || typeof window === "undefined") return;

    try {
      setError("");
      setPeakHold(0);
      setLevelHistory([]);

      const constraints = {
        audio: {
          deviceId: selectedDevice ? { exact: selectedDevice } : undefined,
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setMediaStream(stream);

      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const audioContext = audioContextRef.current;

      analyserRef.current = audioContext.createAnalyser();
      analyserRef.current.fftSize = 2048;
      analyserRef.current.smoothingTimeConstant = 0.3;

      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      setIsRecording(true);
      analyzeAudio();
    } catch (err: any) {
      setError(`Failed to access microphone: ${err.message}`);
    }
  };

  const stopRecording = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    setIsRecording(false);
    setLevelHistory([]);
    setPeakHold(0);
    setAudioStats({
      level: 0,
      peak: 0,
      noiseFloor: 0,
      signalToNoise: 0,
      frequency: 0,
    });
  };

  const resetPeakHold = () => {
    setPeakHold(0);
  };

  const analyzeAudio = () => {
    if (!analyserRef.current || !dataArrayRef.current) return;

    const analyser = analyserRef.current;
    const dataArray = dataArrayRef.current;
    const bufferLength = analyser.frequencyBinCount;

    analyser.getByteFrequencyData(dataArray as Uint8Array<ArrayBuffer>);

    let sum = 0;
    let peak = 0;
    for (let i = 0; i < bufferLength; i++) {
      const value = dataArray[i] / 255;
      sum += value * value;
      peak = Math.max(peak, value);
    }
    const rms = Math.sqrt(sum / bufferLength);
    const level = rms * 100 * (sensitivity[0] / 50);

    let maxIndex = 0;
    let maxValue = 0;
    for (let i = 1; i < bufferLength / 2; i++) {
      if (dataArray[i] > maxValue) {
        maxValue = dataArray[i];
        maxIndex = i;
      }
    }
    const frequency = (maxIndex * (audioContextRef.current?.sampleRate || 44100)) / (2 * bufferLength);

    let noiseSum = 0;
    const noiseRange = Math.min(50, bufferLength / 4);
    for (let i = 1; i < noiseRange; i++) {
      noiseSum += dataArray[i];
    }
    const noiseFloor = (noiseSum / noiseRange / 255) * 100;

    const signalToNoise = level > 0 && noiseFloor > 0 ? 20 * Math.log10(level / noiseFloor) : 0;

    setPeakHold((prev) => Math.max(prev, peak * 100));
    setLevelHistory((prev) => [...prev.slice(-119), Math.min(100, level)]);

    setAudioStats({
      level: Math.min(level, 100),
      peak: peak * 100,
      noiseFloor,
      signalToNoise: Math.max(0, signalToNoise),
      frequency: maxValue > 50 ? frequency : 0,
    });

    drawWaveform();
    animationRef.current = requestAnimationFrame(analyzeAudio);
  };

  const drawWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas || !analyserRef.current || !dataArrayRef.current) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const analyser = analyserRef.current;
    const dataArray = dataArrayRef.current;
    const bufferLength = analyser.frequencyBinCount;

    analyser.getByteTimeDomainData(dataArray as Uint8Array<ArrayBuffer>);

    ctx.fillStyle = "rgb(15, 23, 42)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgb(59, 130, 246)";
    ctx.beginPath();

    const sliceWidth = canvas.width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * canvas.height) / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-down">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Mic className="h-8 w-8 text-primary animate-bounce-in" />
            <h1 className="text-3xl font-bold animate-fade-in-right animate-stagger-1">
              Mic Tester
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up animate-stagger-2">
            Test your microphone with real-time audio visualization and quality analysis.
          </p>
        </div>

        {error && (
          <Card className="mb-8 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
            <CardContent className="pt-6">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </CardContent>
          </Card>
        )}

        <Card className="mb-8 animate-fade-in-up animate-stagger-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isRecording ? (
                <Volume2 className="h-5 w-5 text-green-500 animate-pulse" />
              ) : (
                <MicOff className="h-5 w-5 text-muted-foreground" />
              )}
              Microphone Status
            </CardTitle>
            <CardDescription>
              {isRecording
                ? "Recording audio - speak into your microphone"
                : "Click Start to begin testing your microphone"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <select
                value={selectedDevice}
                onChange={(e) => setSelectedDevice(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md bg-background"
                disabled={isRecording}
              >
                {devices.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Microphone ${device.deviceId.slice(0, 8)}`}
                  </option>
                ))}
              </select>
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                variant={isRecording ? "destructive" : "default"}
                className="gap-2"
              >
                {isRecording ? (
                  <>
                    <MicOff className="h-4 w-4" />
                    Stop
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4" />
                    Start
                  </>
                )}
              </Button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Sensitivity</span>
                <span className="text-sm text-muted-foreground">{sensitivity[0]}%</span>
              </div>
              <Slider
                value={sensitivity}
                onValueChange={setSensitivity}
                min={10}
                max={100}
                step={5}
              />
            </div>

            <canvas
              ref={canvasRef}
              width={800}
              height={200}
              className="w-full h-48 rounded-lg border bg-slate-900"
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(audioStats.level)}%
                </div>
                <div className="text-sm text-muted-foreground">Level</div>
              </div>
              <div className="text-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(peakHold)}%
                </div>
                <div className="text-sm text-muted-foreground">Peak Hold</div>
              </div>
              <div className="text-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {audioStats.noiseFloor.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Noise Floor</div>
              </div>
              <div className="text-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {audioStats.signalToNoise.toFixed(1)} dB
                </div>
                <div className="text-sm text-muted-foreground">S/N Ratio</div>
              </div>
            </div>

            {isRecording && (
              <Button variant="outline" size="sm" onClick={resetPeakHold} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Reset Peak Hold
              </Button>
            )}
          </CardContent>
        </Card>

        <RecommendedProductsSection products={recommendedProducts} />

        <section className="mt-12 space-y-8 text-base leading-7 text-foreground">
          <header className="space-y-3">
            <h2 className="text-2xl font-bold">Mic Tester – Check Your Microphone Online</h2>
            <p>
              Test your microphone online with our free mic tester. Check audio input levels, visualize sound waves, and verify your mic is working properly before calls, recordings, or streams.
            </p>
          </header>

          <section className="space-y-2">
            <h3 className="text-xl font-semibold">What This Tool Measures</h3>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>Real-time audio input levels</li>
              <li>Peak volume detection</li>
              <li>Background noise floor analysis</li>
              <li>Signal-to-noise ratio</li>
              <li>Waveform visualization</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-xl font-semibold">Frequently Asked Questions</h3>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>
                <strong>Q: Why can&apos;t I see my microphone?</strong>
                <br />
                Make sure you&apos;ve granted microphone permission and that your mic is properly connected.
              </li>
              <li>
                <strong>Q: What&apos;s a good signal-to-noise ratio?</strong>
                <br />
                A ratio above 10 dB is acceptable, above 20 dB is good, and above 30 dB is excellent.
              </li>
            </ul>
          </section>
        </section>
      </div>
    </div>
  );
}
