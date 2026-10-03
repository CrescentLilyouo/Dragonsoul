import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
export default defineConfig({root:'pages',plugins:[react()],base:'/Dragonsoul/',publicDir:false,resolve:{alias:{'@':path.resolve('.')}},define:{'process.env.NEXT_PUBLIC_PAGES':JSON.stringify('true')},build:{outDir:'../pages-dist',emptyOutDir:true}});
