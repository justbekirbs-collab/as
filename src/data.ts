import { CPU, RAM, GPU, Storage, DeviceTemplate, OSVersion } from './types';

export const OS_VERSIONS: OSVersion[] = [
  { id: 'macos-sequoia', name: 'macOS Sequoia', family: 'macOS', releaseYear: 2024 },
  { id: 'macos-sonoma', name: 'macOS Sonoma', family: 'macOS', releaseYear: 2023 },
  { id: 'macos-ventura', name: 'macOS Ventura', family: 'macOS', releaseYear: 2022 },
  { id: 'macos-monterey', name: 'macOS Monterey', family: 'macOS', releaseYear: 2021 },
  { id: 'macos-bigsur', name: 'macOS Big Sur', family: 'macOS', releaseYear: 2020 },
  { id: 'ios-18', name: 'iOS 18', family: 'iOS', releaseYear: 2024 },
  { id: 'ios-17', name: 'iOS 17', family: 'iOS', releaseYear: 2023 },
  { id: 'ios-16', name: 'iOS 16', family: 'iOS', releaseYear: 2022 },
  { id: 'ios-15', name: 'iOS 15', family: 'iOS', releaseYear: 2021 },
  { id: 'ios-14', name: 'iOS 14', family: 'iOS', releaseYear: 2020 },
  { id: 'ipados-18', name: 'iPadOS 18', family: 'iPadOS', releaseYear: 2024 },
  { id: 'ipados-17', name: 'iPadOS 17', family: 'iPadOS', releaseYear: 2023 },
  { id: 'ipados-16', name: 'iPadOS 16', family: 'iPadOS', releaseYear: 2022 },
  { id: 'ipados-15', name: 'iPadOS 15', family: 'iPadOS', releaseYear: 2021 },
  { id: 'ipados-14', name: 'iPadOS 14', family: 'iPadOS', releaseYear: 2020 },
  { id: 'ipodos-15', name: 'iPod touch OS 15', family: 'iPodOS', releaseYear: 2021 },
  { id: 'ipodos-classic-2', name: 'iPod Classic OS 2.0', family: 'iPodOS', releaseYear: 2008 },
  { id: 'ipodos-classic-1', name: 'iPod Classic OS 1.1', family: 'iPodOS', releaseYear: 2007 },
  { id: 'tvos-18', name: 'tvOS 18', family: 'tvOS', releaseYear: 2024 },
  { id: 'tvos-17', name: 'tvOS 17', family: 'tvOS', releaseYear: 2023 },
  { id: 'tvos-16', name: 'tvOS 16', family: 'tvOS', releaseYear: 2022 },
];

export const CPUS: CPU[] = [
  // Apple M-series
  { id: 'm5-pro', name: 'Apple M5 Pro', type: 'M-series', performance: 100, efficiency: 98, cores: 16 },
  { id: 'm5', name: 'Apple M5', type: 'M-series', performance: 92, efficiency: 96, cores: 12 },
  { id: 'm4-pro', name: 'Apple M4 Pro', type: 'M-series', performance: 90, efficiency: 95, cores: 14 },
  { id: 'm4', name: 'Apple M4', type: 'M-series', performance: 85, efficiency: 94, cores: 10 },
  { id: 'm3-max', name: 'Apple M3 Max', type: 'M-series', performance: 88, efficiency: 90, cores: 16 },
  { id: 'm3-pro', name: 'Apple M3 Pro', type: 'M-series', performance: 82, efficiency: 92, cores: 12 },
  { id: 'm3', name: 'Apple M3', type: 'M-series', performance: 75, efficiency: 94, cores: 8 },
  { id: 'm2-max', name: 'Apple M2 Max', type: 'M-series', performance: 80, efficiency: 88, cores: 12 },
  { id: 'm2-pro', name: 'Apple M2 Pro', type: 'M-series', performance: 75, efficiency: 90, cores: 12 },
  { id: 'm2', name: 'Apple M2', type: 'M-series', performance: 68, efficiency: 92, cores: 8 },
  { id: 'm1-max', name: 'Apple M1 Max', type: 'M-series', performance: 78, efficiency: 85, cores: 10 },
  { id: 'm1-pro', name: 'Apple M1 Pro', type: 'M-series', performance: 72, efficiency: 88, cores: 10 },
  { id: 'm1', name: 'Apple M1', type: 'M-series', performance: 62, efficiency: 90, cores: 8 },
  
  // Intel
  { id: 'i9-intel', name: 'Intel Core i9', type: 'Intel', performance: 90, efficiency: 40, cores: 24 },
  { id: 'i7-intel', name: 'Intel Core i7', type: 'Intel', performance: 82, efficiency: 45, cores: 16 },
  { id: 'i5-intel', name: 'Intel Core i5', type: 'Intel', performance: 68, efficiency: 50, cores: 8 },
  { id: 'i3-intel', name: 'Intel Core i3', type: 'Intel', performance: 48, efficiency: 55, cores: 4 },
  
  // Apple A-series
  { id: 'a18-pro', name: 'Apple A18 Pro', type: 'A-series', performance: 92, efficiency: 99, cores: 6 },
  { id: 'a18-bionic', name: 'Apple A18', type: 'A-series', performance: 88, efficiency: 99, cores: 6 },
  { id: 'a17-pro', name: 'Apple A17 Pro', type: 'A-series', performance: 85, efficiency: 98, cores: 6 },
  { id: 'a16-bionic', name: 'Apple A16', type: 'A-series', performance: 78, efficiency: 96, cores: 6 },
  { id: 'a15-bionic', name: 'Apple A15', type: 'A-series', performance: 72, efficiency: 95, cores: 6 },
  { id: 'a14-bionic', name: 'Apple A14', type: 'A-series', performance: 65, efficiency: 94, cores: 6 },
  { id: 'a13-bionic', name: 'Apple A13', type: 'A-series', performance: 60, efficiency: 92, cores: 6 },
  { id: 'a12-bionic', name: 'Apple A12', type: 'A-series', performance: 55, efficiency: 90, cores: 6 },
  { id: 'a11-bionic', name: 'Apple A11', type: 'A-series', performance: 45, efficiency: 85, cores: 6 },
];

export const GPU_OPTIONS: GPU[] = [
  // Apple M-series GPUs
  { id: 'm5-pro-gpu', name: 'Apple M5 Pro GPU', performance: 100, type: 'Integrated', brand: 'Apple', architecture: 'M-series' },
  { id: 'm5-gpu', name: 'Apple M5 GPU', performance: 92, type: 'Integrated', brand: 'Apple', architecture: 'M-series' },
  { id: 'm4-pro-gpu', name: 'Apple M4 Pro GPU', performance: 90, type: 'Integrated', brand: 'Apple', architecture: 'M-series' },
  { id: 'm4-gpu', name: 'Apple M4 GPU', performance: 85, type: 'Integrated', brand: 'Apple', architecture: 'M-series' },
  { id: 'm3-max-gpu', name: 'Apple M3 Max GPU', performance: 88, type: 'Integrated', brand: 'Apple', architecture: 'M-series' },
  { id: 'm3-pro-gpu', name: 'Apple M3 Pro GPU', performance: 82, type: 'Integrated', brand: 'Apple', architecture: 'M-series' },
  { id: 'm3-gpu', name: 'Apple M3 GPU', performance: 75, type: 'Integrated', brand: 'Apple', architecture: 'M-series' },
  { id: 'm2-max-gpu', name: 'Apple M2 Max GPU', performance: 80, type: 'Integrated', brand: 'Apple', architecture: 'M-series' },
  { id: 'm2-pro-gpu', name: 'Apple M2 Pro GPU', performance: 75, type: 'Integrated', brand: 'Apple', architecture: 'M-series' },
  { id: 'm2-gpu', name: 'Apple M2 GPU', performance: 68, type: 'Integrated', brand: 'Apple', architecture: 'M-series' },
  { id: 'm1-max-gpu', name: 'Apple M1 Max GPU', performance: 78, type: 'Integrated', brand: 'Apple', architecture: 'M-series' },
  { id: 'm1-pro-gpu', name: 'Apple M1 Pro GPU', performance: 72, type: 'Integrated', brand: 'Apple', architecture: 'M-series' },
  { id: 'm1-gpu', name: 'Apple M1 GPU', performance: 62, type: 'Integrated', brand: 'Apple', architecture: 'M-series' },

  // Apple A-series GPUs
  { id: 'a18-pro-gpu', name: 'Apple A18 Pro GPU', performance: 92, type: 'Integrated', brand: 'Apple', architecture: 'A-series' },
  { id: 'a18-gpu', name: 'Apple A18 GPU', performance: 88, type: 'Integrated', brand: 'Apple', architecture: 'A-series' },
  { id: 'a17-pro-gpu', name: 'Apple A17 Pro GPU', performance: 85, type: 'Integrated', brand: 'Apple', architecture: 'A-series' },
  { id: 'a16-gpu', name: 'Apple A16 GPU', performance: 78, type: 'Integrated', brand: 'Apple', architecture: 'A-series' },
  { id: 'a15-gpu', name: 'Apple A15 GPU', performance: 72, type: 'Integrated', brand: 'Apple', architecture: 'A-series' },
  { id: 'a14-gpu', name: 'Apple A14 GPU', performance: 65, type: 'Integrated', brand: 'Apple', architecture: 'A-series' },
  { id: 'a13-gpu', name: 'Apple A13 GPU', performance: 60, type: 'Integrated', brand: 'Apple', architecture: 'A-series' },
  { id: 'a12-gpu', name: 'Apple A12 GPU', performance: 55, type: 'Integrated', brand: 'Apple', architecture: 'A-series' },
  { id: 'a11-gpu', name: 'Apple A11 GPU', performance: 45, type: 'Integrated', brand: 'Apple', architecture: 'A-series' },

  // Intel & AMD
  { id: 'amd-radeon', name: 'AMD Radeon Pro', performance: 90, type: 'Discrete', brand: 'AMD', architecture: 'AMD' },
  { id: 'intel-iris', name: 'Intel Iris Graphics', performance: 40, type: 'Integrated', brand: 'Intel', architecture: 'Intel' },
];

export const RAM_OPTIONS: RAM[] = [
  { id: 'ram-4', size: 4, type: 'LPDDR4X', performance: 30 },
  { id: 'ram-8', size: 8, type: 'LPDDR5', performance: 55 },
  { id: 'ram-16', size: 16, type: 'LPDDR5', performance: 75 },
  { id: 'ram-32', size: 32, type: 'LPDDR5', performance: 90 },
  { id: 'ram-64', size: 64, type: 'LPDDR5', performance: 100 },
];

export const STORAGE_OPTIONS: Storage[] = [
  { id: 'ssd-256', size: 256, type: 'SSD', speed: 60 },
  { id: 'ssd-512', size: 512, type: 'SSD', speed: 75 },
  { id: 'ssd-1tb', size: 1024, type: 'SSD', speed: 90 },
  { id: 'ssd-2tb', size: 2048, type: 'SSD', speed: 98 },
  { id: 'hdd-1tb', size: 1024, type: 'HDD', speed: 20 },
];

export const DEVICE_TEMPLATES: DeviceTemplate[] = [
  // MacBooks
  {
    slug: 'macbook-neo',
    category: 'MacBook',
    name: 'MacBook Neo',
    defaultOSFamily: 'macOS',
    compatibleOSFamilies: ['macOS', 'iOS', 'iPadOS'],
    compatibleCPUTypes: ['A-series'],
    compatibleGPUArchitectures: ['A-series'],
    basePrice: 899,
    image: 'https://platform.theverge.com/wp-content/uploads/sites/2/2026/03/030426_Apple_MacBook_Neo_ADiBenedetto_0001_f67bd4.jpg?quality=90&strip=all&crop=0,0,100,100',
    description: 'The experimental MacBook with A-series silicon.'
  },
  {
    slug: 'macbook-pro-16-m3',
    category: 'MacBook',
    name: 'MacBook Pro 16" (M3)',
    defaultOSFamily: 'macOS',
    compatibleOSFamilies: ['macOS'],
    compatibleCPUTypes: ['M-series'],
    compatibleGPUArchitectures: ['M-series', 'AMD'],
    basePrice: 2499,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQhIRopX2FP3oaS9U0I8gjoHhNNPDDyBdmzw&s',
    description: 'The ultimate pro laptop, now with M3 Max.'
  },
  {
    slug: 'macbook-air-m2',
    category: 'MacBook',
    name: 'MacBook Air (M2)',
    defaultOSFamily: 'macOS',
    compatibleOSFamilies: ['macOS'],
    compatibleCPUTypes: ['M-series'],
    compatibleGPUArchitectures: ['M-series'],
    basePrice: 1099,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLqYbhchldmkScbU1KmIDaSEZMvJfqDlW5pg&s',
    description: 'Strikingly thin and fast.'
  },
  {
    slug: 'macbook-intel-legacy',
    category: 'MacBook',
    name: 'MacBook (Intel Legacy)',
    defaultOSFamily: 'macOS',
    compatibleOSFamilies: ['macOS'],
    compatibleCPUTypes: ['Intel'],
    compatibleGPUArchitectures: ['Intel', 'AMD'],
    basePrice: 1299,
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=1000&h=800',
    description: 'The classic Intel-based MacBook.'
  },
  
  // iMacs
  {
    slug: 'imac-24-m3',
    category: 'iMac',
    name: 'iMac 24" (M3)',
    defaultOSFamily: 'macOS',
    compatibleOSFamilies: ['macOS'],
    compatibleCPUTypes: ['M-series'],
    compatibleGPUArchitectures: ['M-series'],
    basePrice: 1299,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=1000&h=800',
    description: 'Say hello to the new iMac.'
  },
  
  // Mac Studio & Pro
  {
    slug: 'mac-studio',
    category: 'Mac Studio',
    name: 'Mac Studio',
    defaultOSFamily: 'macOS',
    compatibleOSFamilies: ['macOS'],
    compatibleCPUTypes: ['M-series'],
    compatibleGPUArchitectures: ['M-series'],
    basePrice: 1999,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwOYbnNNpwBcC3oc6WGAkCv-Dsfriuv3Dd4Q&s',
    description: 'Empower station.'
  },
  {
    slug: 'mac-pro-tower',
    category: 'Mac Pro',
    name: 'Mac Pro (Tower)',
    defaultOSFamily: 'macOS',
    compatibleOSFamilies: ['macOS'],
    compatibleCPUTypes: ['M-series', 'Intel'],
    compatibleGPUArchitectures: ['M-series', 'Intel', 'AMD'],
    basePrice: 6999,
    image: 'https://www.apple.com/newsroom/images/live-action/wwdc-2023/standard/mac-studio-mac-pro/Apple-WWDC23-Mac-Pro-M2-Ultra-Mac-Studio-M2-Max-M2-Ultra-230605_inline.jpg.large.jpg',
    description: 'Power to change everything.'
  },
  
  // iPhones
  {
    slug: 'iphone-16-pro-max',
    category: 'iPhone',
    name: 'iPhone 16 Pro Max',
    defaultOSFamily: 'iOS',
    compatibleOSFamilies: ['iOS'],
    compatibleCPUTypes: ['A-series'],
    compatibleGPUArchitectures: ['A-series'],
    basePrice: 1199,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWnTuCNe5mfbiDPDUUYZ8m8rDD0E0tExfM-g&s',
    description: 'The ultimate iPhone with the A18 Pro chip and Titanium design.'
  },
  {
    slug: 'iphone-14',
    category: 'iPhone',
    name: 'iPhone 14',
    defaultOSFamily: 'iOS',
    compatibleOSFamilies: ['iOS'],
    compatibleCPUTypes: ['A-series'],
    compatibleGPUArchitectures: ['A-series'],
    basePrice: 799,
    image: 'https://st-troy.mncdn.com/mnresize/775/775/Content/media/ProductImg/original/mpuf3tua-apple-iphone-14-128gb-gece-yarisi-638835133751486808.jpg',
    description: 'A total powerhouse.'
  },
  
  // iPads
  {
    slug: 'ipad-pro-12-9',
    category: 'iPad',
    name: 'iPad Pro 12.9"',
    defaultOSFamily: 'iPadOS',
    compatibleOSFamilies: ['iPadOS'],
    compatibleCPUTypes: ['M-series', 'A-series'],
    compatibleGPUArchitectures: ['M-series', 'A-series'],
    basePrice: 1099,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=1000&h=800',
    description: 'Supercharged by M2.'
  },
  {
    slug: 'ipad-air',
    category: 'iPad',
    name: 'iPad Air',
    defaultOSFamily: 'iPadOS',
    compatibleOSFamilies: ['iPadOS'],
    compatibleCPUTypes: ['M-series', 'A-series'],
    compatibleGPUArchitectures: ['M-series', 'A-series'],
    basePrice: 599,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCRKkCXvxKDAQqeVvpt0kvI9yMW9sj9uSesQ&s',
    description: 'Light. Bright. Full of might.'
  },
  
  // iPods
  {
    slug: 'ipod-touch-7th-gen',
    category: 'iPod',
    name: 'iPod Touch (7th Gen)',
    defaultOSFamily: 'iPodOS',
    compatibleOSFamilies: ['iPodOS', 'iOS'],
    compatibleCPUTypes: ['A-series'],
    compatibleGPUArchitectures: ['A-series'],
    basePrice: 199,
    image: 'https://m.media-amazon.com/images/I/71DGjy0C97L._AC_UF1000,1000_QL80_.jpg',
    description: 'The music lives on.'
  },
  {
    slug: 'ipod-classic',
    category: 'iPod',
    name: 'iPod Classic',
    defaultOSFamily: 'iPodOS',
    compatibleOSFamilies: ['iPodOS'],
    compatibleCPUTypes: ['A-series'],
    compatibleGPUArchitectures: ['A-series'],
    basePrice: 249,
    image: 'https://cdsassets.apple.com/live/7WUAS350/images/ipod/ipod-classic/ipod-6th-classic-gen.png',
    description: '1,000 songs in your pocket.'
  },
  
  // Apple TV
  {
    slug: 'apple-tv-4k',
    category: 'Apple TV',
    name: 'Apple TV 4K (3rd Gen)',
    defaultOSFamily: 'tvOS',
    compatibleOSFamilies: ['tvOS'],
    compatibleCPUTypes: ['A-series'],
    compatibleGPUArchitectures: ['A-series'],
    basePrice: 129,
    image: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/apple-tv-og-202210?wid=1200&hei=630&fmt=jpeg&qlt=90&.v=1664384900290',
    description: 'The best of TV. And the best of Apple.'
  }
];
