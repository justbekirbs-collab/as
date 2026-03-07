import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Routes, Route, Navigate, useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import { 
  Laptop, 
  Smartphone, 
  Tablet, 
  Monitor, 
  HardDrive, 
  Cpu, 
  Settings, 
  Play, 
  ChevronRight, 
  ChevronLeft,
  Zap,
  Battery,
  Layers,
  Palette,
  CheckCircle2,
  AlertTriangle,
  Info,
  Star,
  Trophy,
  LogIn,
  UserPlus,
  LogOut,
  User,
  Loader2
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  DeviceCategory, 
  OSFamily, 
  OSVersion,
  CPU, 
  RAM, 
  GPU, 
  Storage, 
  DeviceTemplate, 
  UserDevice, 
  PerformanceMetrics 
} from './types';
import { 
  CPUS, 
  RAM_OPTIONS, 
  GPU_OPTIONS, 
  STORAGE_OPTIONS, 
  DEVICE_TEMPLATES,
  OS_VERSIONS
} from './data';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Leaderboard from './components/Leaderboard/Leaderboard';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type View = 'selection' | 'customization' | 'test' | 'result';

export default function App() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const location = useLocation();
  
  const [accentColor, setAccentColor] = useState('#00ff88');
  const [device, setDevice] = useState<UserDevice | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Check auth status on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.emailVerified) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync device state with URL slug if needed
  useEffect(() => {
    const pathParts = location.pathname.split('/');
    const currentSlug = pathParts[2]; // /device/:slug or /test/:slug or /result/:slug
    
    if (currentSlug && (!device || device.template.slug !== currentSlug)) {
      const template = DEVICE_TEMPLATES.find(t => t.slug === currentSlug);
      if (template) {
        // Initialize with defaults if navigating directly
        const defaultCPU = CPUS.find(c => template.compatibleCPUTypes.includes(c.type)) || CPUS[0];
        const defaultOS = OS_VERSIONS.find(v => v.family === template.defaultOSFamily) || OS_VERSIONS[0];
        const defaultGPU = GPU_OPTIONS.find(g => 
          template.compatibleGPUArchitectures.includes(g.architecture) && 
          (g.id.includes(defaultCPU.id.split('-')[0]) || g.brand === 'Apple')
        ) || GPU_OPTIONS.find(g => template.compatibleGPUArchitectures.includes(g.architecture)) || GPU_OPTIONS[0];
        
        setDevice({
          template,
          cpu: defaultCPU,
          ram: RAM_OPTIONS[1], // 16GB
          gpu: defaultGPU,
          storage: STORAGE_OPTIONS[1], // 512GB
          os: defaultOS,
          screenSize: '14"',
          accentColor: accentColor
        });
      }
    }
  }, [location.pathname, device, accentColor]);

  // Performance calculation logic
  const metrics = useMemo((): PerformanceMetrics | null => {
    if (!device) return null;

    const cpuPerf = device.cpu.performance;
    const ramPerf = device.ram.performance;
    const gpuPerf = device.gpu.performance;
    const storagePerf = device.storage.speed;
    const coreCount = device.cpu.cores;

    // Enhanced realistic metrics
    const fps = Math.round((cpuPerf * 0.3 + gpuPerf * 0.5 + ramPerf * 0.2) * (1 + coreCount / 100) * 1.2);
    const loadTime = Math.max(0.5, Number((10 - (storagePerf / 10 + cpuPerf / 20)).toFixed(1)));
    const batteryLife = Math.round((device.cpu.efficiency * 0.7 + device.ram.performance * 0.1) * 0.2);
    const graphicsQuality = Math.round(gpuPerf / 10);
    
    // OS overhead calculation
    const osYear = device.os.releaseYear;
    const getHardwareYear = (id: string) => {
      if (id.includes('m5')) return 2025;
      if (id.includes('m4') || id.includes('a18')) return 2024;
      if (id.includes('m3') || id.includes('a17')) return 2023;
      if (id.includes('m2') || id.includes('a16')) return 2022;
      if (id.includes('m1') || id.includes('a15') || id.includes('a14')) return 2021;
      if (id.includes('a13')) return 2019;
      if (id.includes('a12')) return 2018;
      if (id.includes('a11')) return 2017;
      return 2020;
    };
    const hardwareYear = getHardwareYear(device.cpu.id);
    const osPenalty = Math.max(0, (osYear - hardwareYear) * 0.3);
    
    const totalScore = Number(((cpuPerf * 0.35 + gpuPerf * 0.35 + ramPerf * 0.2 + storagePerf * 0.1) / 10 - osPenalty).toFixed(1));

    return {
      fps: Math.min(fps, 240),
      loadTime,
      batteryLife: Math.min(batteryLife, 24),
      graphicsQuality: Math.min(graphicsQuality, 10),
      totalScore: Math.max(0, Math.min(totalScore, 10))
    };
  }, [device]);

  // Dynamic Page Title
  useEffect(() => {
    let title = "JustGame 44";
    if (location.pathname === '/home') {
      title = "Select Device | JustGame 44";
    } else if (location.pathname.startsWith('/device/')) {
      title = `Build ${device?.template.name || 'Device'} | JustGame 44`;
    } else if (location.pathname.startsWith('/test/')) {
      title = `Testing ${device?.template.name || 'Device'} | JustGame 44`;
    } else if (location.pathname.startsWith('/result/')) {
      title = `Report: ${device?.template.name || 'Device'} | JustGame 44`;
    }
    document.title = title;
  }, [location.pathname, device]);

  useEffect(() => {
    if (location.pathname.startsWith('/test/')) {
      const timer = setTimeout(() => {
        const currentSlug = location.pathname.split('/')[2];
        navigate(`/result/${currentSlug}`);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, navigate]);

  const handleSelectTemplate = (template: DeviceTemplate) => {
    // Initialize with defaults
    const defaultCPU = CPUS.find(c => template.compatibleCPUTypes.includes(c.type)) || CPUS[0];
    const defaultOS = OS_VERSIONS.find(v => v.family === template.defaultOSFamily) || OS_VERSIONS[0];
    const defaultGPU = GPU_OPTIONS.find(g => 
      template.compatibleGPUArchitectures.includes(g.architecture) && 
      (g.id.includes(defaultCPU.id.split('-')[0]) || g.brand === 'Apple')
    ) || GPU_OPTIONS.find(g => template.compatibleGPUArchitectures.includes(g.architecture)) || GPU_OPTIONS[0];
    
    setDevice({
      template,
      cpu: defaultCPU,
      ram: RAM_OPTIONS[1], // 16GB
      gpu: defaultGPU,
      storage: STORAGE_OPTIONS[1], // 512GB
      os: defaultOS,
      screenSize: '14"',
      accentColor: accentColor
    });
    navigate(`/device/${template.slug}`);
  };

  const renderSelection = () => (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500 tracking-tighter">
          JustGame 44
        </h1>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
          Engineer your perfect Apple machine. From vintage iPods to next-gen Mac Studios, 
          customize every component and benchmark your build.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DEVICE_TEMPLATES.map((template, idx) => (
          <motion.div
            key={template.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            onClick={() => handleSelectTemplate(template)}
            className="group relative bg-zinc-900/50 border border-white/10 rounded-3xl overflow-hidden cursor-pointer hover:border-white/30 transition-all"
            style={{ boxShadow: `0 0 20px ${accentColor}10` }}
          >
            <div className="aspect-video relative overflow-hidden">
              <img 
                src={template.image} 
                alt={template.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-bold text-white">{template.name}</h3>
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-gray-300">
                  {template.category}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-4">Starting from ${template.basePrice}</p>
              <div className="flex items-center text-sm font-semibold" style={{ color: accentColor }}>
                Customize <ChevronRight className="ml-1 w-4 h-4" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderCustomization = () => {
    if (!device || !metrics) return null;

    return (
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Panel: Preview & Stats */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div 
            layoutId="device-preview"
            className="bg-zinc-900/80 border border-white/10 rounded-3xl p-8 sticky top-8"
            style={{ boxShadow: `0 0 40px ${accentColor}20` }}
          >
            <div className="relative aspect-square mb-8 rounded-2xl overflow-hidden bg-black flex items-center justify-center group">
              <img 
                src={device.template.image} 
                alt="Preview" 
                className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div 
                className="absolute inset-0 pointer-events-none opacity-30 mix-blend-screen"
                style={{ background: `radial-gradient(circle at center, ${accentColor}60 0%, transparent 70%)` }}
              />
              {/* RGB Border Glow */}
              <div className="absolute inset-0 border-2 border-white/5 rounded-2xl group-hover:border-white/20 transition-colors" />
            </div>

            {/* Component Visuals */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              <div className="flex flex-col items-center p-2 rounded-xl bg-white/5 border border-white/5" style={{ borderColor: device.cpu.type === 'M-series' ? accentColor : 'transparent' }}>
                <Cpu className="w-4 h-4 mb-1" style={{ color: device.cpu.type === 'M-series' ? accentColor : '#666' }} />
                <span className="text-[8px] uppercase font-bold text-gray-500">CPU</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-xl bg-white/5 border border-white/5" style={{ borderColor: device.gpu.brand === 'Apple' ? accentColor : 'transparent' }}>
                <Monitor className="w-4 h-4 mb-1" style={{ color: device.gpu.brand === 'Apple' ? accentColor : '#666' }} />
                <span className="text-[8px] uppercase font-bold text-gray-500">GPU</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-xl bg-white/5 border border-white/5" style={{ borderColor: device.ram.size >= 32 ? accentColor : 'transparent' }}>
                <Layers className="w-4 h-4 mb-1" style={{ color: device.ram.size >= 32 ? accentColor : '#666' }} />
                <span className="text-[8px] uppercase font-bold text-gray-500">RAM</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-xl bg-white/5 border border-white/5" style={{ borderColor: device.storage.size >= 1024 ? accentColor : 'transparent' }}>
                <HardDrive className="w-4 h-4 mb-1" style={{ color: device.storage.size >= 1024 ? accentColor : '#666' }} />
                <span className="text-[8px] uppercase font-bold text-gray-500">SSD</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-bold text-white">{device.template.name}</h2>
                  <p className="text-gray-400">Custom Build</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black" style={{ color: accentColor }}>
                    {metrics.totalScore}
                  </div>
                  <div className="text-xs uppercase tracking-widest text-gray-500">Score</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                  <div className="flex items-center text-gray-400 text-[10px] uppercase tracking-wider mb-1">
                    <Zap className="w-3 h-3 mr-1" /> FPS
                  </div>
                  <div className="text-lg font-bold text-white">{metrics.fps}</div>
                </div>
                <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                  <div className="flex items-center text-gray-400 text-[10px] uppercase tracking-wider mb-1">
                    <Battery className="w-3 h-3 mr-1" /> Battery
                  </div>
                  <div className="text-lg font-bold text-white">{metrics.batteryLife}h</div>
                </div>
                <div className="bg-white/5 p-3 rounded-2xl border border-white/5" style={{ borderColor: `${accentColor}40` }}>
                  <div className="flex items-center text-gray-400 text-[10px] uppercase tracking-wider mb-1">
                    <Star className="w-3 h-3 mr-1" style={{ color: accentColor }} /> Score
                  </div>
                  <div className="text-lg font-bold" style={{ color: accentColor }}>{metrics.totalScore}/10</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate(`/test/${device.template.slug}`)}
              className="w-full mt-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: accentColor, color: '#000' }}
            >
              <Play className="w-5 h-5 fill-current" /> Run Simulation
            </button>
            
            <button
              onClick={() => navigate('/home')}
              className="w-full mt-3 py-3 rounded-2xl font-medium text-gray-400 hover:text-white transition-colors"
            >
              Change Model
            </button>
          </motion.div>
        </div>

        {/* Right Panel: Options */}
        <div className="lg:col-span-8 space-y-8">
          <section>
            <div className="flex items-center gap-2 mb-4 text-white font-semibold">
              <Cpu className="w-5 h-5" /> Processor (CPU)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CPUS.filter(c => device.template.compatibleCPUTypes.includes(c.type)).map(cpu => (
                <button
                  key={cpu.id}
                  onClick={() => setDevice({ ...device, cpu })}
                  className={cn(
                    "p-4 rounded-2xl border text-left transition-all relative overflow-hidden group",
                    device.cpu.id === cpu.id 
                      ? "bg-white/10 border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.1)]" 
                      : "bg-zinc-900/40 border-white/5 hover:border-white/20"
                  )}
                  style={device.cpu.id === cpu.id ? { boxShadow: `0 0 20px ${accentColor}30` } : {}}
                >
                  <div className="font-bold text-white">{cpu.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{cpu.type} Architecture</div>
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4 text-white font-semibold">
              <Layers className="w-5 h-5" /> Memory (RAM)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {RAM_OPTIONS.map(ram => (
                <button
                  key={ram.id}
                  onClick={() => setDevice({ ...device, ram })}
                  className={cn(
                    "p-4 rounded-2xl border text-center transition-all relative overflow-hidden group",
                    device.ram.id === ram.id 
                      ? "bg-white/10 border-white/40" 
                      : "bg-zinc-900/40 border-white/5 hover:border-white/20"
                  )}
                  style={device.ram.id === ram.id ? { boxShadow: `0 0 20px ${accentColor}30` } : {}}
                >
                  <div className="font-bold text-white">{ram.size}GB</div>
                  <div className="text-[10px] text-gray-500 uppercase">{ram.type}</div>
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4 text-white font-semibold">
              <Monitor className="w-5 h-5" /> Graphics (GPU)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {GPU_OPTIONS.filter(g => device.template.compatibleGPUArchitectures.includes(g.architecture)).map(gpu => (
                <button
                  key={gpu.id}
                  onClick={() => setDevice({ ...device, gpu })}
                  className={cn(
                    "p-4 rounded-2xl border text-left transition-all relative overflow-hidden group",
                    device.gpu.id === gpu.id 
                      ? "bg-white/10 border-white/40" 
                      : "bg-zinc-900/40 border-white/5 hover:border-white/20"
                  )}
                  style={device.gpu.id === gpu.id ? { boxShadow: `0 0 20px ${accentColor}30` } : {}}
                >
                  <div className="font-bold text-white">{gpu.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{gpu.type} GPU</div>
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4 text-white font-semibold">
              <HardDrive className="w-5 h-5" /> Storage
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {STORAGE_OPTIONS.map(storage => (
                <button
                  key={storage.id}
                  onClick={() => setDevice({ ...device, storage })}
                  className={cn(
                    "p-4 rounded-2xl border text-center transition-all relative overflow-hidden group",
                    device.storage.id === storage.id 
                      ? "bg-white/10 border-white/40" 
                      : "bg-zinc-900/40 border-white/5 hover:border-white/20"
                  )}
                  style={device.storage.id === storage.id ? { boxShadow: `0 0 20px ${accentColor}30` } : {}}
                >
                  <div className="font-bold text-white">{storage.size >= 1024 ? `${storage.size / 1024}TB` : `${storage.size}GB`}</div>
                  <div className="text-[10px] text-gray-500 uppercase">{storage.type}</div>
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4 text-white font-semibold">
              <Settings className="w-5 h-5" /> Operating System
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {OS_VERSIONS.filter(v => device.template.compatibleOSFamilies.includes(v.family)).map(os => (
                <button
                  key={os.id}
                  onClick={() => setDevice({ ...device, os })}
                  className={cn(
                    "p-4 rounded-2xl border text-left transition-all relative overflow-hidden group",
                    device.os.id === os.id 
                      ? "bg-white/10 border-white/40" 
                      : "bg-zinc-900/40 border-white/5 hover:border-white/20"
                  )}
                  style={device.os.id === os.id ? { boxShadow: `0 0 20px ${accentColor}30` } : {}}
                >
                  <div className="font-bold text-white">{os.name}</div>
                  <div className="text-[10px] text-gray-500 uppercase">Released {os.releaseYear}</div>
                </button>
              ))}
            </div>
          </section>

          <section className="p-6 bg-zinc-900/40 border border-white/5 rounded-3xl">
            <div className="flex items-center gap-2 mb-6 text-white font-semibold">
              <Palette className="w-5 h-5" /> RGB Customization
            </div>
            <div className="flex flex-wrap gap-4">
              {['#00ff88', '#00ccff', '#ff3366', '#ffcc00', '#9933ff', '#ffffff'].map(color => (
                <button
                  key={color}
                  onClick={() => setAccentColor(color)}
                  className={cn(
                    "w-12 h-12 rounded-full border-4 transition-all hover:scale-110",
                    accentColor === color ? "border-white" : "border-transparent"
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
              <div className="flex-1 min-w-[200px]">
                <input 
                  type="range" 
                  min="0" 
                  max="360" 
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
                  onChange={(e) => setAccentColor(`hsl(${e.target.value}, 100%, 50%)`)}
                />
                <div className="flex justify-between text-[10px] text-gray-500 mt-2 uppercase tracking-widest">
                  <span>Hue Spectrum</span>
                  <span>{accentColor}</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  };

  const renderTest = () => {
    if (!device || !metrics) return null;

    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-8 overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ 
          backgroundImage: `radial-gradient(circle at center, ${accentColor} 0%, transparent 70%)`,
          animation: 'pulse 4s infinite'
        }} />
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-full max-w-4xl aspect-video bg-zinc-900 rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
        >
          {/* Simulated Game/App View */}
          <div className="absolute inset-0 flex flex-col">
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/40 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-4 text-sm font-mono text-gray-400">Benchmarking: {device.template.name}</span>
              </div>
              <div className="flex gap-6 text-xs font-mono">
                <div className="flex flex-col items-end">
                  <span className="text-gray-500 uppercase">FPS</span>
                  <span className="text-white font-bold">{metrics.fps}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-gray-500 uppercase">Temp</span>
                  <span className="text-white font-bold">42°C</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-gray-500 uppercase">Usage</span>
                  <span className="text-white font-bold">88%</span>
                </div>
              </div>
            </div>

            <div className="flex-1 relative flex items-center justify-center">
              {/* Simulated visual test */}
              <div className="text-center">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-24 h-24 border-4 border-t-transparent rounded-full mb-6 mx-auto"
                  style={{ borderColor: `${accentColor}40`, borderTopColor: accentColor }}
                />
                <h3 className="text-2xl font-bold text-white mb-2">Rendering 3D Scene...</h3>
                <p className="text-gray-500 font-mono">Loading assets: {metrics.loadTime}s estimated</p>
              </div>

              {/* Particle effects based on performance */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{ backgroundColor: accentColor }}
                  animate={{
                    x: [0, (Math.random() - 0.5) * 1000],
                    y: [0, (Math.random() - 0.5) * 600],
                    opacity: [1, 0],
                    scale: [1, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: "easeOut"
                  }}
                />
              ))}
            </div>

            <div className="p-6 bg-black/60 border-t border-white/5">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold text-white">System Stability</span>
                <span className="text-sm font-bold" style={{ color: accentColor }}>Optimal</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 5 }}
                  className="h-full"
                  style={{ backgroundColor: accentColor }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 flex gap-4"
        >
          <button
            onClick={() => navigate(`/result/${device.template.slug}`)}
            className="px-8 py-4 bg-white text-black font-bold rounded-2xl hover:scale-105 transition-transform"
          >
            View Final Report
          </button>
          <button
            onClick={() => navigate(`/device/${device.template.slug}`)}
            className="px-8 py-4 bg-zinc-800 text-white font-bold rounded-2xl hover:bg-zinc-700 transition-colors"
          >
            Back to Build
          </button>
        </motion.div>
      </div>
    );
  };

  const renderResult = () => {
    if (!device || !metrics) return null;

    const handleSubmitScore = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      setIsSubmitting(true);
      try {
        await addDoc(collection(db, 'leaderboard'), {
          username: user.displayName || user.email?.split('@')[0] || 'Anonymous',
          deviceSlug: device.template.slug,
          cpu: device.cpu.name,
          gpu: device.gpu.name,
          ram: device.ram.size,
          os: device.os.name,
          overallRating: metrics.totalScore,
          peakFPS: metrics.fps,
          batteryLife: metrics.batteryLife,
          timestamp: new Date().toISOString()
        });
        setSubmitSuccess(true);
        setTimeout(() => navigate('/leaderboard'), 2000);
      } catch (err) {
        console.error('Failed to submit score:', err);
        alert('Failed to submit score. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-zinc-900/80 border border-white/10 rounded-[40px] p-12 text-center relative overflow-hidden"
          style={{ boxShadow: `0 0 60px ${accentColor}20` }}
        >
          <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: accentColor }} />
          
          <div className="mb-8 inline-flex items-center justify-center p-4 rounded-3xl bg-white/5">
            <CheckCircle2 className="w-12 h-12" style={{ color: accentColor }} />
          </div>

          <h1 className="text-4xl font-black text-white mb-2">Build Certified</h1>
          <p className="text-gray-400 mb-12">Your custom {device.template.name} is ready for production.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
              <div className="text-5xl font-black mb-2" style={{ color: accentColor }}>{metrics.totalScore}</div>
              <div className="text-xs uppercase tracking-widest text-gray-500">Overall Rating</div>
            </div>
            <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
              <div className="text-5xl font-black mb-2 text-white">{metrics.fps}</div>
              <div className="text-xs uppercase tracking-widest text-gray-500">Peak FPS</div>
            </div>
            <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
              <div className="text-5xl font-black mb-2 text-white">{metrics.batteryLife}h</div>
              <div className="text-xs uppercase tracking-widest text-gray-500">Battery Life</div>
            </div>
          </div>

          <div className="space-y-4 text-left mb-12">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Info className="w-4 h-4" /> AI Optimization Suggestions
            </h3>
            {Math.abs(device.cpu.performance - device.gpu.performance) > 25 && metrics.totalScore < 9.5 && (
              <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
                <p className="text-sm text-yellow-200/80">
                  Hardware Bottleneck: The {device.cpu.performance > device.gpu.performance ? 'GPU' : 'CPU'} is significantly slower than the {device.cpu.performance > device.gpu.performance ? 'CPU' : 'GPU'}, which may limit peak performance in demanding tasks.
                </p>
              </div>
            )}
            {device.storage.type === 'HDD' && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-sm text-red-200/80">
                  HDD storage is a major bottleneck. Switching to an SSD will improve load times by up to 400%.
                </p>
              </div>
            )}
            <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
              <p className="text-sm text-green-200/80">
                The {device.os.name} integration is perfectly optimized for your hardware choice.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleSubmitScore}
              disabled={isSubmitting || submitSuccess}
              className="px-12 py-4 rounded-2xl font-bold bg-yellow-500 text-black hover:scale-105 transition-transform flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : submitSuccess ? <CheckCircle2 className="w-5 h-5" /> : <Trophy className="w-5 h-5" />}
              {submitSuccess ? 'Submitted!' : 'Submit to Leaderboard'}
            </button>
            <button
              onClick={() => navigate('/home')}
              className="px-12 py-4 rounded-2xl font-bold bg-white text-black hover:scale-105 transition-transform"
            >
              Build New Device
            </button>
            <button
              onClick={() => window.print()}
              className="px-12 py-4 rounded-2xl font-bold bg-zinc-800 text-white hover:bg-zinc-700 transition-colors"
            >
              Export Specs
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-zinc-300 font-sans selection:bg-white selection:text-black">
      {/* Global Background Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20"
          style={{ backgroundColor: accentColor }}
        />
        <div 
          className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-10"
          style={{ backgroundColor: accentColor }}
        />
      </div>

      <nav className="border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2 font-bold text-white text-xl">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: accentColor }}>
              <Laptop className="w-5 h-5 text-black" />
            </div>
            JustGame 44
          </Link>
          <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-[0.2em]">
            <Link 
              to="/leaderboard" 
              className={cn(
                "transition-colors flex items-center gap-1", 
                location.pathname === '/leaderboard' ? "text-white" : "text-zinc-600 hover:text-zinc-400"
              )}
            >
              <Trophy className="w-3 h-3" /> Leaderboard
            </Link>
            <Link 
              to="/home" 
              className={cn(
                "transition-colors", 
                location.pathname === '/home' ? "text-white" : "text-zinc-600 hover:text-zinc-400"
              )}
            >
              Selection
            </Link>
            {location.pathname !== '/home' && !['/login', '/signup', '/leaderboard'].includes(location.pathname) && (
              <>
                <ChevronRight className="w-3 h-3 text-zinc-800" />
                <span className={cn(
                  "transition-colors", 
                  location.pathname.startsWith('/device') ? "text-white" : "text-zinc-600"
                )}>
                  {device?.template.name || 'Build'}
                </span>
              </>
            )}
            {location.pathname.startsWith('/result') && (
              <>
                <ChevronRight className="w-3 h-3 text-zinc-800" />
                <span className="text-white">Report</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-white">
                  <User className="w-4 h-4 text-zinc-500" />
                  {user.displayName || user.email}
                </div>
                <button
                  onClick={async () => {
                    await signOut(auth);
                    navigate('/home');
                  }}
                  className="p-2 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4 text-zinc-400" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-white text-black text-xs font-bold rounded-xl hover:scale-105 transition-transform"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Routes location={location}>
              <Route path="/home" element={renderSelection()} />
              <Route path="/device/:slug" element={renderCustomization()} />
              <Route path="/test/:slug" element={renderTest()} />
              <Route path="/result/:slug" element={renderResult()} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/" element={<Navigate to="/home" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="py-12 border-t border-white/5 text-center text-gray-600 text-sm">
        <p>© 2026 Apple Device Simulator. Built for performance enthusiasts.</p>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #000;
        }
        ::-webkit-scrollbar-thumb {
          background: #222;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #333;
        }
      `}</style>
    </div>
  );
}
