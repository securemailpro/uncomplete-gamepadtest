"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Monitor, Zap, Info, Play } from "lucide-react";
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
import { RecommendedProductsSection } from "@/app/components/RecommendedProducts";

interface GPUInfo {
  vendor: string;
  renderer: string;
  version: string;
  shadingLanguageVersion: string;
  maxTextureSize: number;
  maxVertexAttributes: number;
  maxFragmentUniforms: number;
  maxRenderBufferSize: number;
  maxCubeMapTextureSize: number;
  maxVertexTextureImageUnits: number;
  maxTextureImageUnits: number;
  maxViewportDims: number[];
}

interface DisplayMetrics {
  width: number;
  height: number;
  effectiveWidth: number;
  effectiveHeight: number;
  colorDepth: number;
  pixelRatio: number;
}

interface BenchmarkResult {
  trianglesPerSecond: number;
  fps: number;
  duration: number;
  score: number;
}

const recommendedProducts = [
  {
    name: "NVIDIA GeForce RTX 4070 SUPER",
    description: "High-performance gaming GPU with ray tracing and DLSS 3 support.",
    href: "https://amzn.to/4070super",
    imageSrc: "https://m.media-amazon.com/images/I/81Dky+tD8-L._AC_SL1500_.jpg",
    alt: "NVIDIA RTX 4070 SUPER",
  },
  {
    name: "AMD Radeon RX 7800 XT",
    description: "Excellent 1440p gaming performance with 16GB VRAM.",
    href: "https://amzn.to/rx7800xt",
    imageSrc: "https://m.media-amazon.com/images/I/81xmLT5tGHL._AC_SL1500_.jpg",
    alt: "AMD RX 7800 XT",
  },
  {
    name: "ASUS ROG Strix Gaming Monitor",
    description: "27-inch 1440p 165Hz gaming monitor with G-Sync.",
    href: "https://amzn.to/rogmonitor",
    imageSrc: "https://m.media-amazon.com/images/I/81T-VWqLuNL._AC_SL1500_.jpg",
    alt: "ASUS ROG Gaming Monitor",
  },
];

export function GPUTesterClient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gpuInfo, setGpuInfo] = useState<GPUInfo | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [benchmarkResult, setBenchmarkResult] = useState<BenchmarkResult | null>(null);
  const [testProgress, setTestProgress] = useState(0);
  const [webglSupported, setWebglSupported] = useState(true);
  const [displayMetrics, setDisplayMetrics] = useState<DisplayMetrics>({
    width: 0,
    height: 0,
    effectiveWidth: 0,
    effectiveHeight: 0,
    colorDepth: 0,
    pixelRatio: 1,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateMetrics = () => {
      const pixelRatio = window.devicePixelRatio || 1;
      const width = Math.round(window.innerWidth);
      const height = Math.round(window.innerHeight);
      setDisplayMetrics({
        width,
        height,
        effectiveWidth: Math.round(width * pixelRatio),
        effectiveHeight: Math.round(height * pixelRatio),
        colorDepth: window.screen?.colorDepth || 24,
        pixelRatio,
      });
    };

    updateMetrics();
    window.addEventListener("resize", updateMetrics);

    return () => {
      window.removeEventListener("resize", updateMetrics);
    };
  }, []);

  useEffect(() => {
    detectGPU();
  }, []);

  const formatCompactNumber = (value: number) =>
    new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);

  const getGL = (canvas: HTMLCanvasElement) => {
    const attrs: WebGLContextAttributes = {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: "high-performance",
    };
    return (
      canvas.getContext("webgl", attrs) ||
      canvas.getContext("experimental-webgl", attrs)
    ) as WebGLRenderingContext | null;
  };

  const detectGPU = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const gl = getGL(canvas);

    if (!gl) {
      setWebglSupported(false);
      return;
    }

    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");

    const info: GPUInfo = {
      vendor: debugInfo
        ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
        : gl.getParameter(gl.VENDOR),
      renderer: debugInfo
        ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        : gl.getParameter(gl.RENDERER),
      version: gl.getParameter(gl.VERSION),
      shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
      maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
      maxVertexAttributes: gl.getParameter(gl.MAX_VERTEX_ATTRIBS),
      maxFragmentUniforms: gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS),
      maxRenderBufferSize: gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),
      maxCubeMapTextureSize: gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE),
      maxVertexTextureImageUnits: gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS),
      maxTextureImageUnits: gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS),
      maxViewportDims: gl.getParameter(gl.MAX_VIEWPORT_DIMS),
    };

    setGpuInfo(info);
  };

  const runBenchmark = async () => {
    if (!canvasRef.current || !webglSupported) return;

    setIsTesting(true);
    setTestProgress(0);
    setBenchmarkResult(null);

    const canvas = canvasRef.current;
    const gl = getGL(canvas);
    if (!gl) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(384 * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);

    const vertexShaderSource = `
      attribute vec2 a_position;
      attribute vec3 a_color;
      varying vec3 v_color;
      uniform vec2 u_resolution;
      uniform float u_time;

      void main() {
        vec2 position = a_position + sin(u_time * 3.0 + a_position.x * 0.01) * 4.0;
        vec2 zeroToOne = position / u_resolution;
        vec2 zeroToTwo = zeroToOne * 2.0;
        vec2 clipSpace = zeroToTwo - 1.0;
        gl_Position = vec4(clipSpace * vec2(1.0, -1.0), 0.0, 1.0);
        v_color = a_color;
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;
      varying vec3 v_color;
      uniform float u_time;

      void main() {
        vec3 color = v_color + vec3(sin(u_time*0.9), sin(u_time*1.1), sin(u_time*1.3)) * 0.2;
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

    const program = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const colorLocation = gl.getAttribLocation(program, "a_color");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const timeLocation = gl.getUniformLocation(program, "u_time");

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    const triangleCount = 12000;
    const vertices: number[] = [];

    for (let i = 0; i < triangleCount; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = 4 + Math.random() * 12;

      vertices.push(
        x, y, Math.random(), Math.random(), Math.random(),
        x + size, y, Math.random(), Math.random(), Math.random(),
        x + size / 2, y + size, Math.random(), Math.random(), Math.random()
      );
    }

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 20, 0);

    gl.enableVertexAttribArray(colorLocation);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 20, 8);

    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

    const startTime = performance.now();
    let frameCount = 0;
    const duration = 5000;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      setTestProgress(Math.min(elapsed / duration, 1) * 100);

      if (elapsed < duration) {
        gl.clearColor(0.06, 0.06, 0.06, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.uniform1f(timeLocation, elapsed * 0.001);
        gl.drawArrays(gl.TRIANGLES, 0, triangleCount * 3);

        frameCount++;
        requestAnimationFrame(animate);
      } else {
        const fps = frameCount / (elapsed / 1000);
        const trianglesPerSecond = (triangleCount * frameCount) / (elapsed / 1000);
        const score = Math.round(fps * 10 + trianglesPerSecond / 10000);

        setBenchmarkResult({
          trianglesPerSecond,
          fps,
          duration: elapsed,
          score,
        });
        setIsTesting(false);
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-down">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Monitor className="h-8 w-8 text-primary animate-bounce-in" />
            <h1 className="text-3xl font-bold animate-fade-in-right animate-stagger-1">
              GPU Tester
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up animate-stagger-2">
            Analyze your graphics card performance with WebGL rendering tests and hardware information.
          </p>
        </div>

        <Card className="mb-8 animate-fade-in-up animate-stagger-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              GPU Information
            </CardTitle>
            <CardDescription>
              {webglSupported
                ? "WebGL is supported. Your GPU details are shown below."
                : "WebGL is not supported in this browser."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {gpuInfo ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-muted-foreground">Vendor:</span>
                    <p className="font-medium">{gpuInfo.vendor}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Renderer:</span>
                    <p className="font-medium">{gpuInfo.renderer}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">WebGL Version:</span>
                    <p className="font-medium">{gpuInfo.version}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-muted-foreground">Max Texture Size:</span>
                    <p className="font-medium">{formatCompactNumber(gpuInfo.maxTextureSize)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Max Render Buffer:</span>
                    <p className="font-medium">{formatCompactNumber(gpuInfo.maxRenderBufferSize)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Texture Units:</span>
                    <p className="font-medium">{gpuInfo.maxTextureImageUnits}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Loading GPU information...</p>
            )}
          </CardContent>
        </Card>

        <Card className="mb-8 animate-fade-in-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Display Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Screen Size:</span>
                <p className="font-medium">{displayMetrics.width} x {displayMetrics.height}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Effective Resolution:</span>
                <p className="font-medium">{displayMetrics.effectiveWidth} x {displayMetrics.effectiveHeight}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Pixel Ratio:</span>
                <p className="font-medium">{displayMetrics.pixelRatio.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Color Depth:</span>
                <p className="font-medium">{displayMetrics.colorDepth}-bit</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8 animate-fade-in-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Performance Benchmark
            </CardTitle>
            <CardDescription>
              Run a WebGL benchmark to test your GPU&apos;s rendering performance.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <canvas
              ref={canvasRef}
              className="w-full h-96 rounded-lg border bg-gray-900"
            />

            {isTesting && (
              <div className="space-y-2">
                <Progress value={testProgress} className="h-2" />
                <p className="text-sm text-center text-muted-foreground">
                  Testing... {Math.round(testProgress)}%
                </p>
              </div>
            )}

            {benchmarkResult && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {benchmarkResult.fps.toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">FPS</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCompactNumber(benchmarkResult.trianglesPerSecond)}
                  </div>
                  <div className="text-sm text-muted-foreground">Triangles/sec</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {(benchmarkResult.duration / 1000).toFixed(1)}s
                  </div>
                  <div className="text-sm text-muted-foreground">Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {benchmarkResult.score}
                  </div>
                  <div className="text-sm text-muted-foreground">Score</div>
                </div>
              </div>
            )}

            <Button
              onClick={runBenchmark}
              disabled={isTesting || !webglSupported}
              className="w-full gap-2"
            >
              <Play className="h-4 w-4" />
              {isTesting ? "Running Benchmark..." : "Run Benchmark"}
            </Button>
          </CardContent>
        </Card>

        <RecommendedProductsSection products={recommendedProducts} />

        <section className="mt-12 space-y-8 text-base leading-7 text-foreground">
          <header className="space-y-3">
            <h2 className="text-2xl font-bold">GPU Tester – Check Your Graphics Card Online</h2>
            <p>
              Test your graphics card performance with our free online GPU tester. Get detailed hardware information and run WebGL benchmarks to ensure your GPU is performing at its best.
            </p>
          </header>

          <section className="space-y-2">
            <h3 className="text-xl font-semibold">What This Tool Measures</h3>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>WebGL rendering capabilities and version support</li>
              <li>GPU vendor and renderer identification</li>
              <li>Maximum texture and buffer sizes</li>
              <li>Real-time FPS and triangle throughput</li>
              <li>Display resolution and pixel density</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-xl font-semibold">Frequently Asked Questions</h3>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>
                <strong>Q: Why is my GPU showing as &quot;Google SwiftShader&quot;?</strong>
                <br />
                This means WebGL is using software rendering instead of your hardware GPU. Try updating your graphics drivers.
              </li>
              <li>
                <strong>Q: What&apos;s a good benchmark score?</strong>
                <br />
                Scores vary by hardware. Modern dedicated GPUs typically score 1000+, while integrated graphics may score 200-500.
              </li>
            </ul>
          </section>
        </section>
      </div>
    </div>
  );
}
