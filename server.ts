import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Ensure upload & data directories exist
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
const dataDir = path.join(process.cwd(), 'data');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const configFilePath = path.join(dataDir, 'restaurant_config.json');

// Default initial config
const DEFAULT_CONFIG = {
  name: 'Dendê e Brasa',
  tagline: 'Acarajé & Parrilla em Stella Maris',
  description: 'O encontro perfeito da rica tradição baiana no azeite de dendê com o calor e suculência da legítima parrilla na brasa.',
  whatsappNumber: '5571999992025',
  phoneDisplay: '(71) 99999-2025',
  instagramHandle: '@dendeebrasaoficial',
  instagramUrl: 'https://www.instagram.com/dendeebrasaoficial?stkn=MWd4OXRlcGUyamhmNw==',
  cardapioUrl: 'https://www.dguests.com.br/cardapio/dendeebrasa',
  address: {
    street: 'Alameda Dilson Jatahy Fonseca',
    number: '1248',
    complement: 'Empório Greco',
    neighborhood: 'Stella Maris',
    city: 'Salvador',
    state: 'BA',
    cep: '41600-100',
    reference: 'Próximo à orla de Stella Maris e Alameda Praia de Guaratuba'
  },
  hours: [
    { day: 'Segunda-feira', dayCode: 1, open: '', close: '', isClosed: true },
    { day: 'Terça-feira', dayCode: 2, open: '17:00', close: '23:30' },
    { day: 'Quarta-feira', dayCode: 3, open: '17:00', close: '23:30' },
    { day: 'Quinta-feira', dayCode: 4, open: '17:00', close: '23:30' },
    { day: 'Sexta-feira', dayCode: 5, open: '17:00', close: '00:30' },
    { day: 'Sábado', dayCode: 6, open: '12:00', close: '00:30' },
    { day: 'Domingo', dayCode: 0, open: '12:00', close: '22:00' }
  ],
  features: [
    'Acarajé frito na hora no puro dendê',
    'Cortes nobres na brasa e parrilla',
    'Ambiente aconchegante e familiar',
    'Área ao ar livre & Espaço Kids no complexo',
    'Cerveja trincando e drinks artesanais',
    'Estacionamento no Empório Greco'
  ],
  videoUrl: '/dende-e-brasa-espaco.mp4',
  videoTitle: 'Espaço Real • Dendê e Brasa em Stella Maris',
  videoDescription: 'Parrilla Brava com brasas incandescentes, espetinhos e queijo coalho grelhados na hora, mesas ao ar livre com famílias e amigos, telão transmitindo futebol ao vivo e cerveja geladíssima no Empório Greco.',
  lastVideoUpdate: null
};

// Helper to read current config
function readConfig() {
  try {
    if (fs.existsSync(configFilePath)) {
      const data = fs.readFileSync(configFilePath, 'utf8');
      return { ...DEFAULT_CONFIG, ...JSON.parse(data) };
    }
  } catch (err) {
    console.error('Error reading config file:', err);
  }
  return DEFAULT_CONFIG;
}

// Helper to write config
function writeConfig(cfg: any) {
  try {
    fs.writeFileSync(configFilePath, JSON.stringify(cfg, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing config file:', err);
    return false;
  }
}

// Configure multer storage for video uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    // Keep extension or default to .mp4
    const ext = path.extname(file.originalname).toLowerCase() || '.mp4';
    // Clean filename
    const safeName = `restaurant-video-${Date.now()}${ext}`;
    cb(null, safeName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 300 * 1024 * 1024 // up to 300MB
  },
  fileFilter: (_req, file, cb) => {
    // Accept all video types from iOS/Android/PC
    if (file.mimetype.startsWith('video/') || /\.(mp4|mov|m4v|webm|avi|mkv|3gp)$/i.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos de vídeo são permitidos (MP4, MOV, WEBM, etc).'));
    }
  }
});

// Middleware
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static route for uploaded videos with byte-range support for video player scrubbing
app.use('/uploads', express.static(uploadsDir, {
  setHeaders: (res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Accept-Ranges', 'bytes');
  }
}));

// API Routes
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get restaurant config
app.get('/api/config', (_req, res) => {
  const currentConfig = readConfig();
  res.json(currentConfig);
});

// Update restaurant config
app.post('/api/config', (req, res) => {
  try {
    const existing = readConfig();
    const updated = { ...existing, ...req.body };
    writeConfig(updated);
    res.json({ success: true, config: updated });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Erro ao salvar configuração' });
  }
});

// Upload video from phone or PC
app.post('/api/upload-video', (req, res) => {
  upload.single('video')(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'O arquivo de vídeo excede o tamanho máximo de 300MB.' });
      }
      return res.status(400).json({ error: `Erro no upload: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ error: err.message || 'Erro ao processar o vídeo.' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo de vídeo foi enviado.' });
    }

    const filename = req.file.filename;
    // URL with cache-busting timestamp so all clients immediately see the new video
    const videoUrl = `/uploads/${filename}?t=${Date.now()}`;
    const fileSizeMB = (req.file.size / (1024 * 1024)).toFixed(1);

    // Update global restaurant config so all visits load this video
    const current = readConfig();
    const updated = {
      ...current,
      videoUrl,
      lastVideoUpdate: {
        filename,
        originalName: req.file.originalname,
        sizeMB: fileSizeMB,
        uploadedAt: new Date().toISOString()
      }
    };
    writeConfig(updated);

    console.log(`[Video Upload] New video published successfully: ${filename} (${fileSizeMB} MB)`);

    return res.json({
      success: true,
      videoUrl,
      filename,
      size: req.file.size,
      sizeMB: fileSizeMB,
      config: updated,
      message: 'Vídeo publicado com sucesso para todos os clientes do site!'
    });
  });
});

// Reset video to default
app.post('/api/reset-video', (_req, res) => {
  try {
    const current = readConfig();
    const updated = {
      ...current,
      videoUrl: '/dende-e-brasa-espaco.mp4',
      lastVideoUpdate: null
    };
    writeConfig(updated);
    res.json({
      success: true,
      videoUrl: '/dende-e-brasa-espaco.mp4',
      message: 'Vídeo restaurado para a gravação original da casa.'
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Erro ao restaurar vídeo' });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Production static files
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🔥 Dendê e Brasa server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
