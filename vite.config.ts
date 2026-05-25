import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { description, keywords } from './src/keywords'

const escapeAttribute = (value: string) =>
    value
        .replaceAll('&', '&amp;')
        .replaceAll('"', '&quot;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')

const seoHtmlPlugin = () => ({
    name: 'seo-html',
    transformIndexHtml(html: string) {
        return html
            .replace('%SEO_DESCRIPTION%', escapeAttribute(description))
            .replace('%SEO_KEYWORDS%', escapeAttribute(keywords.join(', ')))
    },
})

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        seoHtmlPlugin(),
        vue(),
        tailwindcss()
    ]
});
