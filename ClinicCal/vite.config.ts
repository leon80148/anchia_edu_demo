import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 設定 base 為 './' 代表使用相對路徑。
  // 這能解決部署到 GitHub Pages (或其他子目錄) 時，
  // 因找不到 JS/CSS 檔案而導致畫面空白的問題。
  base: './',
})