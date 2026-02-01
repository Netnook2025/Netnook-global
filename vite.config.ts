import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  // هام جداً:
  // لكي يعمل الموقع على Vercel بدون إعدادات إضافية، ضع مفتاح Gemini الخاص بك هنا بدلاً من النص الموجود
  // ملاحظة: هذا سيجعل المفتاح مرئياً في كود GitHub.
  const HARDCODED_KEY = "PASTE_YOUR_GEMINI_KEY_HERE"; 

  // يستخدم المفتاح من ملف .env إذا وجد، وإلا يستخدم المفتاح المكتوب أعلاه
  const finalApiKey = env.API_KEY || HARDCODED_KEY;

  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
      sourcemap: false
    },
    define: {
      // Properly stringify the API key so it's available globally as process.env.API_KEY
      'process.env.API_KEY': JSON.stringify(finalApiKey)
    }
  };
});