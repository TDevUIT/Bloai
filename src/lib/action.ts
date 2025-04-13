'use server'
import {
    aiGenerateSEOTags,
    aiGenerateMetaDescription,
    aiGenerateSEOKeywords,
    aiGenerateOpenGraphTitle,
    aiGenerateOpenGraphDescription,
    aiGenerateTitleBlog,
    aiGenerateExcerpt,
  } from '@/lib/gemini'
  
  export async function generateMetaDescription(content: string) {
    const generated = await aiGenerateMetaDescription(content)
    return generated
  }
  
  export async function generateSEOTags(content: string) {
    const generated = await aiGenerateSEOTags(content)
    return generated
  }
  
  export async function generateSEOKeywords(content: string) {
    const generated = await aiGenerateSEOKeywords(content)
    return generated
  }
  
  export async function generateOpenGraphTitle(content: string) {
    const generated = await aiGenerateOpenGraphTitle(content)
    return generated
  }
  
  export async function generateOpenGraphDescription(content: string) {
    const generated = await aiGenerateOpenGraphDescription(content)
    return generated
  }

export async function generateTitleBlog(content: string) {
    const generated = await aiGenerateTitleBlog(content)
    return generated
}

export async function generateExcerpt(content: string) {
    const generated = await aiGenerateExcerpt(content)
    return generated
}