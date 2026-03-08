export type DeviceCategory = 'MacBook' | 'iMac' | 'Mac mini' | 'Mac Studio' | 'Mac Pro' | 'iPhone' | 'iPad' | 'iPod' | 'Apple TV';

export type OSFamily = 'macOS' | 'iOS' | 'iPadOS' | 'iPodOS' | 'tvOS';

export interface OSVersion {
  id: string;
  name: string;
  family: OSFamily;
  releaseYear: number;
}

export interface CPU {
  id: string;
  name: string;
  type: 'Intel' | 'M-series' | 'A-series';
  performance: number; // 1-100
  efficiency: number; // 1-100
  cores: number;
}

export interface RAM {
  id: string;
  size: number; // GB
  type: string;
  performance: number;
}

export interface GPU {
  id: string;
  name: string;
  performance: number;
  type: 'Integrated' | 'Discrete' | 'External';
  brand: 'Apple' | 'Intel' | 'AMD' | 'NVIDIA';
  architecture: 'Intel' | 'M-series' | 'A-series' | 'AMD' | 'NVIDIA';
}

export interface Storage {
  id: string;
  size: number; // GB
  type: 'SSD' | 'HDD';
  speed: number;
}

export interface DeviceTemplate {
  slug: string;
  category: DeviceCategory;
  name: string;
  defaultOSFamily: OSFamily;
  compatibleOSFamilies: OSFamily[];
  compatibleCPUTypes: ('Intel' | 'M-series' | 'A-series')[];
  compatibleGPUArchitectures: ('Intel' | 'M-series' | 'A-series' | 'AMD' | 'NVIDIA')[];
  basePrice: number;
  image: string;
  description: string;
}

export interface UserDevice {
  template: DeviceTemplate;
  cpu: CPU;
  ram: RAM;
  gpu: GPU;
  storage: Storage;
  os: OSVersion;
  screenSize: string;
  accentColor: string;
}

export interface PerformanceMetrics {
  fps: number;
  loadTime: number;
  batteryLife: number;
  graphicsQuality: number;
  totalScore: number;
}
