/* ============================================
   ZEPHYR — Fullscreen 360° Studio Viewer
   Simple, Clean, Full-Viewport 3D Frame Player
   ============================================ */

'use strict';

const STUDIO_FRAMES = {
  "hoodie": [
    "3d/hoodie/frame_001.jpg",
    "3d/hoodie/frame_003.jpg",
    "3d/hoodie/frame_006.jpg",
    "3d/hoodie/frame_008.jpg",
    "3d/hoodie/frame_010.jpg",
    "3d/hoodie/frame_012.jpg",
    "3d/hoodie/frame_014.jpg",
    "3d/hoodie/frame_017.jpg",
    "3d/hoodie/frame_019.jpg",
    "3d/hoodie/frame_021.jpg",
    "3d/hoodie/frame_022.jpg",
    "3d/hoodie/frame_024.jpg",
    "3d/hoodie/frame_027.jpg",
    "3d/hoodie/frame_030.jpg",
    "3d/hoodie/frame_033.jpg",
    "3d/hoodie/frame_035.jpg",
    "3d/hoodie/frame_038.jpg",
    "3d/hoodie/frame_041.jpg",
    "3d/hoodie/frame_043.jpg",
    "3d/hoodie/frame_046.jpg",
    "3d/hoodie/frame_048.jpg",
    "3d/hoodie/frame_050.jpg",
    "3d/hoodie/frame_052.jpg",
    "3d/hoodie/frame_054.jpg",
    "3d/hoodie/frame_056.jpg",
    "3d/hoodie/frame_058.jpg",
    "3d/hoodie/frame_060.jpg",
    "3d/hoodie/frame_062.jpg",
    "3d/hoodie/frame_064.jpg",
    "3d/hoodie/frame_066.jpg",
    "3d/hoodie/frame_068.jpg",
    "3d/hoodie/frame_070.jpg",
    "3d/hoodie/frame_072.jpg",
    "3d/hoodie/frame_074.jpg",
    "3d/hoodie/frame_076.jpg",
    "3d/hoodie/frame_078.jpg",
    "3d/hoodie/frame_080.jpg",
    "3d/hoodie/frame_082.jpg",
    "3d/hoodie/frame_084.jpg",
    "3d/hoodie/frame_086.jpg",
    "3d/hoodie/frame_087.jpg",
    "3d/hoodie/frame_088.jpg",
    "3d/hoodie/frame_089.jpg",
    "3d/hoodie/frame_090.jpg",
    "3d/hoodie/frame_091.jpg",
    "3d/hoodie/frame_092.jpg",
    "3d/hoodie/frame_093.jpg",
    "3d/hoodie/frame_094.jpg",
    "3d/hoodie/frame_095.jpg",
    "3d/hoodie/frame_096.jpg",
    "3d/hoodie/frame_098.jpg",
    "3d/hoodie/frame_100.jpg",
    "3d/hoodie/frame_102.jpg",
    "3d/hoodie/frame_104.jpg",
    "3d/hoodie/frame_106.jpg",
    "3d/hoodie/frame_108.jpg",
    "3d/hoodie/frame_110.jpg",
    "3d/hoodie/frame_112.jpg",
    "3d/hoodie/frame_114.jpg",
    "3d/hoodie/frame_116.jpg",
    "3d/hoodie/frame_118.jpg",
    "3d/hoodie/frame_120.jpg",
    "3d/hoodie/frame_122.jpg",
    "3d/hoodie/frame_124.jpg",
    "3d/hoodie/frame_126.jpg",
    "3d/hoodie/frame_128.jpg",
    "3d/hoodie/frame_130.jpg",
    "3d/hoodie/frame_132.jpg",
    "3d/hoodie/frame_134.jpg",
    "3d/hoodie/frame_136.jpg",
    "3d/hoodie/frame_138.jpg",
    "3d/hoodie/frame_140.jpg",
    "3d/hoodie/frame_142.jpg",
    "3d/hoodie/frame_144.jpg",
    "3d/hoodie/frame_146.jpg",
    "3d/hoodie/frame_148.jpg",
    "3d/hoodie/frame_150.jpg",
    "3d/hoodie/frame_152.jpg",
    "3d/hoodie/frame_154.jpg",
    "3d/hoodie/frame_156.jpg",
    "3d/hoodie/frame_158.jpg",
    "3d/hoodie/frame_160.jpg",
    "3d/hoodie/frame_162.jpg",
    "3d/hoodie/frame_164.jpg",
    "3d/hoodie/frame_166.jpg",
    "3d/hoodie/frame_168.jpg",
    "3d/hoodie/frame_170.jpg",
    "3d/hoodie/frame_172.jpg",
    "3d/hoodie/frame_174.jpg",
    "3d/hoodie/frame_176.jpg",
    "3d/hoodie/frame_178.jpg",
    "3d/hoodie/frame_180.jpg",
    "3d/hoodie/frame_182.jpg",
    "3d/hoodie/frame_184.jpg",
    "3d/hoodie/frame_186.jpg",
    "3d/hoodie/frame_188.jpg",
    "3d/hoodie/frame_190.jpg",
    "3d/hoodie/frame_192.jpg",
    "3d/hoodie/frame_194.jpg",
    "3d/hoodie/frame_196.jpg",
    "3d/hoodie/frame_198.jpg",
    "3d/hoodie/frame_200.jpg",
    "3d/hoodie/frame_202.jpg",
    "3d/hoodie/frame_204.jpg",
    "3d/hoodie/frame_206.jpg",
    "3d/hoodie/frame_208.jpg",
    "3d/hoodie/frame_210.jpg",
    "3d/hoodie/frame_212.jpg",
    "3d/hoodie/frame_214.jpg",
    "3d/hoodie/frame_216.jpg",
    "3d/hoodie/frame_218.jpg",
    "3d/hoodie/frame_220.jpg",
    "3d/hoodie/frame_222.jpg",
    "3d/hoodie/frame_224.jpg",
    "3d/hoodie/frame_226.jpg",
    "3d/hoodie/frame_228.jpg",
    "3d/hoodie/frame_230.jpg",
    "3d/hoodie/frame_232.jpg",
    "3d/hoodie/frame_234.jpg",
    "3d/hoodie/frame_236.jpg",
    "3d/hoodie/frame_238.jpg"
  ],
  "shoes": [
    "3d/shoes/frame_000.jpg",
    "3d/shoes/frame_001.jpg",
    "3d/shoes/frame_002.jpg",
    "3d/shoes/frame_003.jpg",
    "3d/shoes/frame_004.jpg",
    "3d/shoes/frame_005.jpg",
    "3d/shoes/frame_006.jpg",
    "3d/shoes/frame_007.jpg",
    "3d/shoes/frame_008.jpg",
    "3d/shoes/frame_009.jpg",
    "3d/shoes/frame_010.jpg",
    "3d/shoes/frame_011.jpg",
    "3d/shoes/frame_012.jpg",
    "3d/shoes/frame_013.jpg",
    "3d/shoes/frame_014.jpg",
    "3d/shoes/frame_015.jpg",
    "3d/shoes/frame_016.jpg",
    "3d/shoes/frame_017.jpg",
    "3d/shoes/frame_018.jpg",
    "3d/shoes/frame_019.jpg",
    "3d/shoes/frame_020.jpg",
    "3d/shoes/frame_021.jpg",
    "3d/shoes/frame_022.jpg",
    "3d/shoes/frame_023.jpg",
    "3d/shoes/frame_024.jpg",
    "3d/shoes/frame_025.jpg",
    "3d/shoes/frame_026.jpg",
    "3d/shoes/frame_027.jpg",
    "3d/shoes/frame_028.jpg",
    "3d/shoes/frame_029.jpg",
    "3d/shoes/frame_030.jpg",
    "3d/shoes/frame_031.jpg",
    "3d/shoes/frame_032.jpg",
    "3d/shoes/frame_033.jpg",
    "3d/shoes/frame_034.jpg",
    "3d/shoes/frame_035.jpg",
    "3d/shoes/frame_036.jpg",
    "3d/shoes/frame_037.jpg",
    "3d/shoes/frame_038.jpg",
    "3d/shoes/frame_039.jpg",
    "3d/shoes/frame_040.jpg",
    "3d/shoes/frame_041.jpg",
    "3d/shoes/frame_042.jpg",
    "3d/shoes/frame_043.jpg",
    "3d/shoes/frame_044.jpg",
    "3d/shoes/frame_045.jpg",
    "3d/shoes/frame_046.jpg",
    "3d/shoes/frame_047.jpg",
    "3d/shoes/frame_048.jpg",
    "3d/shoes/frame_049.jpg",
    "3d/shoes/frame_050.jpg",
    "3d/shoes/frame_051.jpg",
    "3d/shoes/frame_052.jpg",
    "3d/shoes/frame_053.jpg",
    "3d/shoes/frame_054.jpg",
    "3d/shoes/frame_055.jpg",
    "3d/shoes/frame_056.jpg",
    "3d/shoes/frame_057.jpg",
    "3d/shoes/frame_058.jpg",
    "3d/shoes/frame_059.jpg",
    "3d/shoes/frame_060.jpg",
    "3d/shoes/frame_061.jpg",
    "3d/shoes/frame_062.jpg",
    "3d/shoes/frame_063.jpg",
    "3d/shoes/frame_064.jpg",
    "3d/shoes/frame_065.jpg",
    "3d/shoes/frame_066.jpg",
    "3d/shoes/frame_067.jpg",
    "3d/shoes/frame_068.jpg",
    "3d/shoes/frame_069.jpg",
    "3d/shoes/frame_070.jpg",
    "3d/shoes/frame_071.jpg",
    "3d/shoes/frame_072.jpg",
    "3d/shoes/frame_073.jpg",
    "3d/shoes/frame_074.jpg",
    "3d/shoes/frame_075.jpg",
    "3d/shoes/frame_076.jpg",
    "3d/shoes/frame_077.jpg",
    "3d/shoes/frame_078.jpg",
    "3d/shoes/frame_079.jpg",
    "3d/shoes/frame_080.jpg",
    "3d/shoes/frame_081.jpg",
    "3d/shoes/frame_082.jpg",
    "3d/shoes/frame_083.jpg",
    "3d/shoes/frame_084.jpg",
    "3d/shoes/frame_085.jpg",
    "3d/shoes/frame_086.jpg",
    "3d/shoes/frame_087.jpg",
    "3d/shoes/frame_088.jpg",
    "3d/shoes/frame_089.jpg",
    "3d/shoes/frame_090.jpg",
    "3d/shoes/frame_091.jpg",
    "3d/shoes/frame_092.jpg",
    "3d/shoes/frame_093.jpg",
    "3d/shoes/frame_094.jpg",
    "3d/shoes/frame_095.jpg",
    "3d/shoes/frame_096.jpg",
    "3d/shoes/frame_097.jpg",
    "3d/shoes/frame_098.jpg",
    "3d/shoes/frame_099.jpg",
    "3d/shoes/frame_100.jpg",
    "3d/shoes/frame_101.jpg",
    "3d/shoes/frame_102.jpg",
    "3d/shoes/frame_103.jpg",
    "3d/shoes/frame_104.jpg",
    "3d/shoes/frame_105.jpg",
    "3d/shoes/frame_106.jpg",
    "3d/shoes/frame_107.jpg",
    "3d/shoes/frame_108.jpg",
    "3d/shoes/frame_109.jpg",
    "3d/shoes/frame_110.jpg",
    "3d/shoes/frame_111.jpg",
    "3d/shoes/frame_112.jpg",
    "3d/shoes/frame_113.jpg",
    "3d/shoes/frame_114.jpg",
    "3d/shoes/frame_115.jpg",
    "3d/shoes/frame_116.jpg",
    "3d/shoes/frame_117.jpg",
    "3d/shoes/frame_118.jpg",
    "3d/shoes/frame_119.jpg",
    "3d/shoes/frame_120.jpg",
    "3d/shoes/frame_121.jpg",
    "3d/shoes/frame_122.jpg",
    "3d/shoes/frame_123.jpg",
    "3d/shoes/frame_124.jpg",
    "3d/shoes/frame_125.jpg",
    "3d/shoes/frame_126.jpg",
    "3d/shoes/frame_127.jpg",
    "3d/shoes/frame_128.jpg",
    "3d/shoes/frame_129.jpg"
  ],
  "tshirt": [
    "3d/tshirt/frame_000.jpg",
    "3d/tshirt/frame_001.jpg",
    "3d/tshirt/frame_002.jpg",
    "3d/tshirt/frame_003.jpg",
    "3d/tshirt/frame_004.jpg",
    "3d/tshirt/frame_005.jpg",
    "3d/tshirt/frame_006.jpg",
    "3d/tshirt/frame_007.jpg",
    "3d/tshirt/frame_008.jpg",
    "3d/tshirt/frame_009.jpg",
    "3d/tshirt/frame_010.jpg",
    "3d/tshirt/frame_011.jpg",
    "3d/tshirt/frame_012.jpg",
    "3d/tshirt/frame_013.jpg",
    "3d/tshirt/frame_014.jpg",
    "3d/tshirt/frame_015.jpg",
    "3d/tshirt/frame_016.jpg",
    "3d/tshirt/frame_017.jpg",
    "3d/tshirt/frame_018.jpg",
    "3d/tshirt/frame_019.jpg",
    "3d/tshirt/frame_020.jpg",
    "3d/tshirt/frame_021.jpg",
    "3d/tshirt/frame_022.jpg",
    "3d/tshirt/frame_023.jpg",
    "3d/tshirt/frame_024.jpg",
    "3d/tshirt/frame_025.jpg",
    "3d/tshirt/frame_026.jpg",
    "3d/tshirt/frame_027.jpg",
    "3d/tshirt/frame_028.jpg",
    "3d/tshirt/frame_029.jpg",
    "3d/tshirt/frame_030.jpg",
    "3d/tshirt/frame_031.jpg",
    "3d/tshirt/frame_032.jpg",
    "3d/tshirt/frame_033.jpg",
    "3d/tshirt/frame_034.jpg",
    "3d/tshirt/frame_035.jpg",
    "3d/tshirt/frame_036.jpg",
    "3d/tshirt/frame_037.jpg",
    "3d/tshirt/frame_038.jpg",
    "3d/tshirt/frame_039.jpg",
    "3d/tshirt/frame_040.jpg",
    "3d/tshirt/frame_041.jpg",
    "3d/tshirt/frame_042.jpg",
    "3d/tshirt/frame_043.jpg",
    "3d/tshirt/frame_044.jpg",
    "3d/tshirt/frame_045.jpg",
    "3d/tshirt/frame_046.jpg",
    "3d/tshirt/frame_047.jpg",
    "3d/tshirt/frame_048.jpg",
    "3d/tshirt/frame_049.jpg",
    "3d/tshirt/frame_050.jpg",
    "3d/tshirt/frame_051.jpg",
    "3d/tshirt/frame_052.jpg",
    "3d/tshirt/frame_053.jpg",
    "3d/tshirt/frame_054.jpg",
    "3d/tshirt/frame_055.jpg",
    "3d/tshirt/frame_056.jpg",
    "3d/tshirt/frame_057.jpg",
    "3d/tshirt/frame_058.jpg",
    "3d/tshirt/frame_059.jpg",
    "3d/tshirt/frame_060.jpg",
    "3d/tshirt/frame_061.jpg",
    "3d/tshirt/frame_062.jpg",
    "3d/tshirt/frame_063.jpg",
    "3d/tshirt/frame_064.jpg",
    "3d/tshirt/frame_065.jpg",
    "3d/tshirt/frame_066.jpg",
    "3d/tshirt/frame_067.jpg",
    "3d/tshirt/frame_068.jpg",
    "3d/tshirt/frame_069.jpg",
    "3d/tshirt/frame_070.jpg",
    "3d/tshirt/frame_071.jpg",
    "3d/tshirt/frame_072.jpg",
    "3d/tshirt/frame_073.jpg",
    "3d/tshirt/frame_074.jpg",
    "3d/tshirt/frame_075.jpg",
    "3d/tshirt/frame_076.jpg",
    "3d/tshirt/frame_077.jpg",
    "3d/tshirt/frame_078.jpg",
    "3d/tshirt/frame_079.jpg",
    "3d/tshirt/frame_080.jpg",
    "3d/tshirt/frame_081.jpg",
    "3d/tshirt/frame_082.jpg",
    "3d/tshirt/frame_083.jpg",
    "3d/tshirt/frame_084.jpg",
    "3d/tshirt/frame_085.jpg",
    "3d/tshirt/frame_086.jpg",
    "3d/tshirt/frame_087.jpg",
    "3d/tshirt/frame_088.jpg",
    "3d/tshirt/frame_089.jpg",
    "3d/tshirt/frame_090.jpg",
    "3d/tshirt/frame_091.jpg",
    "3d/tshirt/frame_092.jpg",
    "3d/tshirt/frame_093.jpg",
    "3d/tshirt/frame_094.jpg",
    "3d/tshirt/frame_095.jpg",
    "3d/tshirt/frame_096.jpg",
    "3d/tshirt/frame_097.jpg",
    "3d/tshirt/frame_098.jpg",
    "3d/tshirt/frame_099.jpg",
    "3d/tshirt/frame_100.jpg",
    "3d/tshirt/frame_101.jpg",
    "3d/tshirt/frame_102.jpg",
    "3d/tshirt/frame_103.jpg",
    "3d/tshirt/frame_104.jpg",
    "3d/tshirt/frame_105.jpg",
    "3d/tshirt/frame_106.jpg",
    "3d/tshirt/frame_107.jpg",
    "3d/tshirt/frame_108.jpg",
    "3d/tshirt/frame_109.jpg",
    "3d/tshirt/frame_110.jpg",
    "3d/tshirt/frame_111.jpg",
    "3d/tshirt/frame_112.jpg",
    "3d/tshirt/frame_113.jpg",
    "3d/tshirt/frame_114.jpg",
    "3d/tshirt/frame_115.jpg",
    "3d/tshirt/frame_116.jpg",
    "3d/tshirt/frame_117.jpg",
    "3d/tshirt/frame_118.jpg",
    "3d/tshirt/frame_119.jpg"
  ],
  "cap": [
    "3d/cap/frame_014.jpg",
    "3d/cap/frame_015.jpg",
    "3d/cap/frame_016.jpg",
    "3d/cap/frame_017.jpg",
    "3d/cap/frame_018.jpg",
    "3d/cap/frame_019.jpg",
    "3d/cap/frame_020.jpg",
    "3d/cap/frame_021.jpg",
    "3d/cap/frame_022.jpg",
    "3d/cap/frame_023.jpg",
    "3d/cap/frame_024.jpg",
    "3d/cap/frame_025.jpg",
    "3d/cap/frame_026.jpg",
    "3d/cap/frame_027.jpg",
    "3d/cap/frame_028.jpg",
    "3d/cap/frame_029.jpg",
    "3d/cap/frame_030.jpg",
    "3d/cap/frame_031.jpg",
    "3d/cap/frame_032.jpg",
    "3d/cap/frame_033.jpg",
    "3d/cap/frame_034.jpg",
    "3d/cap/frame_035.jpg",
    "3d/cap/frame_036.jpg",
    "3d/cap/frame_037.jpg",
    "3d/cap/frame_038.jpg",
    "3d/cap/frame_039.jpg",
    "3d/cap/frame_040.jpg",
    "3d/cap/frame_041.jpg",
    "3d/cap/frame_042.jpg",
    "3d/cap/frame_043.jpg",
    "3d/cap/frame_044.jpg",
    "3d/cap/frame_045.jpg",
    "3d/cap/frame_046.jpg",
    "3d/cap/frame_047.jpg",
    "3d/cap/frame_048.jpg",
    "3d/cap/frame_049.jpg",
    "3d/cap/frame_050.jpg",
    "3d/cap/frame_051.jpg",
    "3d/cap/frame_052.jpg",
    "3d/cap/frame_053.jpg",
    "3d/cap/frame_054.jpg",
    "3d/cap/frame_055.jpg",
    "3d/cap/frame_056.jpg",
    "3d/cap/frame_057.jpg",
    "3d/cap/frame_058.jpg",
    "3d/cap/frame_059.jpg",
    "3d/cap/frame_060.jpg",
    "3d/cap/frame_061.jpg",
    "3d/cap/frame_062.jpg",
    "3d/cap/frame_063.jpg",
    "3d/cap/frame_064.jpg",
    "3d/cap/frame_065.jpg",
    "3d/cap/frame_066.jpg",
    "3d/cap/frame_067.jpg",
    "3d/cap/frame_068.jpg",
    "3d/cap/frame_069.jpg",
    "3d/cap/frame_070.jpg",
    "3d/cap/frame_071.jpg",
    "3d/cap/frame_072.jpg",
    "3d/cap/frame_073.jpg",
    "3d/cap/frame_074.jpg",
    "3d/cap/frame_075.jpg",
    "3d/cap/frame_076.jpg",
    "3d/cap/frame_077.jpg",
    "3d/cap/frame_078.jpg",
    "3d/cap/frame_079.jpg",
    "3d/cap/frame_080.jpg",
    "3d/cap/frame_081.jpg",
    "3d/cap/frame_082.jpg",
    "3d/cap/frame_083.jpg",
    "3d/cap/frame_084.jpg",
    "3d/cap/frame_085.jpg",
    "3d/cap/frame_086.jpg",
    "3d/cap/frame_087.jpg",
    "3d/cap/frame_088.jpg",
    "3d/cap/frame_089.jpg",
    "3d/cap/frame_090.jpg",
    "3d/cap/frame_091.jpg",
    "3d/cap/frame_092.jpg",
    "3d/cap/frame_093.jpg",
    "3d/cap/frame_094.jpg",
    "3d/cap/frame_095.jpg",
    "3d/cap/frame_096.jpg",
    "3d/cap/frame_097.jpg",
    "3d/cap/frame_098.jpg",
    "3d/cap/frame_099.jpg",
    "3d/cap/frame_100.jpg",
    "3d/cap/frame_101.jpg",
    "3d/cap/frame_102.jpg",
    "3d/cap/frame_103.jpg",
    "3d/cap/frame_104.jpg",
    "3d/cap/frame_105.jpg",
    "3d/cap/frame_106.jpg",
    "3d/cap/frame_107.jpg",
    "3d/cap/frame_108.jpg",
    "3d/cap/frame_109.jpg",
    "3d/cap/frame_110.jpg",
    "3d/cap/frame_111.jpg",
    "3d/cap/frame_112.jpg",
    "3d/cap/frame_113.jpg",
    "3d/cap/frame_114.jpg",
    "3d/cap/frame_115.jpg",
    "3d/cap/frame_116.jpg",
    "3d/cap/frame_117.jpg",
    "3d/cap/frame_118.jpg",
    "3d/cap/frame_119.jpg",
    "3d/cap/frame_120.jpg",
    "3d/cap/frame_121.jpg",
    "3d/cap/frame_122.jpg",
    "3d/cap/frame_123.jpg",
    "3d/cap/frame_124.jpg",
    "3d/cap/frame_125.jpg",
    "3d/cap/frame_126.jpg",
    "3d/cap/frame_127.jpg",
    "3d/cap/frame_128.jpg",
    "3d/cap/frame_129.jpg",
    "3d/cap/frame_130.jpg",
    "3d/cap/frame_131.jpg",
    "3d/cap/frame_132.jpg",
    "3d/cap/frame_133.jpg",
    "3d/cap/frame_134.jpg",
    "3d/cap/frame_135.jpg",
    "3d/cap/frame_136.jpg",
    "3d/cap/frame_137.jpg",
    "3d/cap/frame_138.jpg",
    "3d/cap/frame_139.jpg",
    "3d/cap/frame_140.jpg",
    "3d/cap/frame_141.jpg",
    "3d/cap/frame_142.jpg",
    "3d/cap/frame_143.jpg",
    "3d/cap/frame_144.jpg",
    "3d/cap/frame_145.jpg",
    "3d/cap/frame_146.jpg",
    "3d/cap/frame_147.jpg",
    "3d/cap/frame_148.jpg",
    "3d/cap/frame_149.jpg",
    "3d/cap/frame_150.jpg",
    "3d/cap/frame_151.jpg",
    "3d/cap/frame_152.jpg",
    "3d/cap/frame_153.jpg",
    "3d/cap/frame_154.jpg"
  ]
};

class Studio360Viewer {
  constructor(options = {}) {
    this.container = document.getElementById(options.containerId || 'studio360Viewer');
    this.canvas = document.getElementById(options.canvasId || 'studio360Canvas');
    if (!this.container || !this.canvas) return;

    this.ctx = this.canvas.getContext('2d', { alpha: false });
    this.activeCategory = 'hoodie';
    this.currentFrame = 0;
    this.totalFrames = STUDIO_FRAMES[this.activeCategory].length;

    // Image Caching
    this.imageCache = {
      hoodie: new Map(),
      shoes: new Map(),
      tshirt: new Map(),
      cap: new Map()
    };

    // Interaction State (Simple horizontal drag)
    this.isDragging = false;
    this.startX = 0;
    this.startFrame = 0;
    this.dragSensitivity = 7; // px per frame
    this.velocity = 0;
    this.lastX = 0;
    this.lastTime = 0;

    this.init();
  }

  init() {
    this.setupCanvasDimensions();
    window.addEventListener('resize', () => this.handleResize());

    this.setupCategoryPills();
    this.setupGestureListeners();

    // Start with active category
    this.switchCategory('hoodie', true);
  }

  setupCanvasDimensions() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const container = this.canvas.parentElement;
    const width = container ? container.clientWidth : (this.canvas.clientWidth || 960);
    const height = Math.round(width * (1080 / 1920));

    this.canvas.width = Math.round(width * dpr);
    this.canvas.height = Math.round(height * dpr);
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';
    
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);
    this.renderWidth = width;
    this.renderHeight = height;
  }

  handleResize() {
    this.setupCanvasDimensions();
    this.drawCurrentFrame();
  }

  switchCategory(category, isInitial = false) {
    if (!STUDIO_FRAMES[category]) return;
    this.activeCategory = category;
    this.totalFrames = STUDIO_FRAMES[category].length;
    this.currentFrame = 0;

    // Update active pill UI
    document.querySelectorAll('.studio-pill-btn').forEach(btn => {
      const isActive = btn.dataset.category === category;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Preload frames progressively
    this.preloadCategoryFrames(category);

    // Initial render
    this.drawCurrentFrame();
  }

  preloadCategoryFrames(category) {
    const urls = STUDIO_FRAMES[category];
    const cache = this.imageCache[category];
    const total = urls.length;

    // 1. Immediately load frame 0
    if (!cache.has(0)) {
      const img0 = new Image();
      img0.src = urls[0];
      img0.onload = () => {
        cache.set(0, img0);
        if (this.activeCategory === category && this.currentFrame === 0) {
          this.drawCurrentFrame();
        }
      };
    }

    // 2. Progressively preload key frames first, then remaining
    const priorityIndices = [];
    for (let i = 0; i < total; i += 4) priorityIndices.push(i);
    for (let i = 0; i < total; i++) {
      if (i % 4 !== 0) priorityIndices.push(i);
    }

    let idx = 0;
    const loadNextBatch = () => {
      const batchSize = 6;
      for (let b = 0; b < batchSize && idx < priorityIndices.length; b++, idx++) {
        const frameIdx = priorityIndices[idx];
        if (cache.has(frameIdx)) continue;

        const img = new Image();
        img.src = urls[frameIdx];
        img.onload = () => {
          cache.set(frameIdx, img);
          if (this.activeCategory === category && Math.round(this.currentFrame) === frameIdx) {
            this.drawCurrentFrame();
          }
        };
      }

      if (idx < priorityIndices.length) {
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(loadNextBatch);
        } else {
          setTimeout(loadNextBatch, 30);
        }
      }
    };

    loadNextBatch();
  }

  drawCurrentFrame() {
    const urls = STUDIO_FRAMES[this.activeCategory];
    const cache = this.imageCache[this.activeCategory];
    const frameIndex = Math.round(this.currentFrame) % this.totalFrames;
    const safeIndex = (frameIndex + this.totalFrames) % this.totalFrames;

    let img = cache.get(safeIndex);

    // Fallback: search nearest loaded frame if current frame is still loading
    if (!img || !img.complete) {
      for (let offset = 1; offset < 20; offset++) {
        const prev = (safeIndex - offset + this.totalFrames) % this.totalFrames;
        const next = (safeIndex + offset) % this.totalFrames;
        const prevImg = cache.get(prev);
        if (prevImg && prevImg.complete) { img = prevImg; break; }
        const nextImg = cache.get(next);
        if (nextImg && nextImg.complete) { img = nextImg; break; }
      }
    }

    if (!img || !img.complete) {
      // Try to load on-demand
      const directImg = new Image();
      directImg.src = urls[safeIndex];
      directImg.onload = () => {
        cache.set(safeIndex, directImg);
        if (Math.round(this.currentFrame) === safeIndex) this.drawFrameImage(directImg);
      };
      return;
    }

    this.drawFrameImage(img);
  }

  drawFrameImage(img) {
    const { ctx, renderWidth, renderHeight } = this;
    if (!ctx || !img) return;

    ctx.clearRect(0, 0, renderWidth, renderHeight);

    // Fill / contain aspect ratio fitting (1920x1080)
    const imgRatio = 1920 / 1080;
    const canvasRatio = renderWidth / renderHeight;

    let dw, dh, dx, dy;
    if (canvasRatio > imgRatio) {
      dh = renderHeight;
      dw = renderHeight * imgRatio;
      dx = (renderWidth - dw) / 2;
      dy = 0;
    } else {
      dw = renderWidth;
      dh = renderWidth / imgRatio;
      dx = 0;
      dy = (renderHeight - dh) / 2;
    }

    ctx.drawImage(img, dx, dy, dw, dh);
  }

  setFrame(frameIndex) {
    this.currentFrame = (frameIndex % this.totalFrames + this.totalFrames) % this.totalFrames;
    this.drawCurrentFrame();
  }

  setupCategoryPills() {
    const pills = document.querySelectorAll('.studio-pill-btn');
    pills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        const cat = pill.dataset.category;
        if (cat && cat !== this.activeCategory) {
          this.switchCategory(cat);
        }
      });
    });
  }

  setupGestureListeners() {
    const target = this.canvas.parentElement; // stage container
    if (!target) return;

    // Desktop Mouse Events
    target.addEventListener('mousedown', (e) => this.onDragStart(e.clientX));
    window.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        e.preventDefault();
        this.onDragMove(e.clientX);
      }
    });
    window.addEventListener('mouseup', () => this.onDragEnd());

    // Mobile Touch Events
    target.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.onDragStart(e.touches[0].clientX);
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (this.isDragging && e.touches.length === 1) {
        this.onDragMove(e.touches[0].clientX);
      }
    }, { passive: true });

    window.addEventListener('touchend', () => this.onDragEnd());
    window.addEventListener('touchcancel', () => this.onDragEnd());
  }

  onDragStart(clientX) {
    this.isDragging = true;
    this.startX = clientX;
    this.lastX = clientX;
    this.lastTime = performance.now();
    this.startFrame = this.currentFrame;
    this.velocity = 0;
    this.canvas.style.cursor = 'grabbing';

    const hint = document.getElementById('studioDragInstruction');
    if (hint) hint.classList.add('faded');
  }

  onDragMove(clientX) {
    if (!this.isDragging) return;
    const now = performance.now();
    const dt = Math.max(1, now - this.lastTime);
    const dx = clientX - this.lastX;

    this.velocity = dx / dt;
    this.lastX = clientX;
    this.lastTime = now;

    // Horizontal drag rotation
    const deltaFrames = (clientX - this.startX) / this.dragSensitivity;
    this.setFrame(this.startFrame + deltaFrames);
  }

  onDragEnd() {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.canvas.style.cursor = 'grab';

    const hint = document.getElementById('studioDragInstruction');
    if (hint) {
      setTimeout(() => hint.classList.remove('faded'), 1500);
    }

    // Smooth inertia
    if (Math.abs(this.velocity) > 0.15) {
      this.applyInertia();
    }
  }

  applyInertia() {
    const decay = 0.93;
    const tick = () => {
      if (this.isDragging) return;
      this.velocity *= decay;
      if (Math.abs(this.velocity) > 0.02) {
        this.setFrame(this.currentFrame + this.velocity * 3.5);
        requestAnimationFrame(tick);
      } else {
        this.velocity = 0;
      }
    };
    requestAnimationFrame(tick);
  }
}

// Initialize 360 Studio when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.studio360Instance = new Studio360Viewer({
    containerId: 'studio360Viewer',
    canvasId: 'studio360Canvas'
  });
});
