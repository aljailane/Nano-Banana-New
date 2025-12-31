
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

const getAIClient = (overrideKey?: string) => {
  const apiKey = overrideKey || API_KEY;
  if (!apiKey) throw new Error("مفتاح API مفقود.");
  return new GoogleGenAI({ apiKey });
};

export const testApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: 'test',
    });
    return true;
  } catch (error) {
    return false;
  }
};

export const editImageWithGemini = async (
  base64Image: string, 
  mimeType: string, 
  prompt: string,
  intensity: number = 50,
  model: string = 'gemini-2.5-flash-image'
): Promise<string> => {
  try {
    const ai = getAIClient();
    let enhancedPrompt = `${prompt}. CRITICAL: Preserve the original image transparency (alpha channel). Do NOT add any background color. The output must be transparent where the input is transparent.`;
    
    if (intensity < 30) enhancedPrompt = `Apply a subtle change: ${enhancedPrompt}`;
    else if (intensity > 75) enhancedPrompt = `Transform creatively: ${enhancedPrompt}`;
    
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: mimeType } },
          { text: enhancedPrompt },
        ],
      },
    });

    const parts = response.candidates?.[0]?.content?.parts;
    for (const part of parts || []) {
      if (part.inlineData?.data) return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
    }
    throw new Error("لم يتم توليد صورة.");
  } catch (error: any) {
    throw new Error(error.message || "فشل تعديل الصورة.");
  }
};

export const enhanceImageWithGemini = async (
  base64Image: string, 
  mimeType: string, 
  type: 'face' | 'general' | 'denoise' = 'general',
  model: string = 'gemini-2.5-flash-image'
): Promise<string> => {
  try {
    const ai = getAIClient();
    let instruction = "Enhance this image quality, increase sharpness, and fix details while strictly maintaining original content and TRANSPARENCY. Do NOT add a background or change the alpha channel.";
    
    if (type === 'face') instruction = "Focus on enhancing facial features and skin while keeping the background transparent as in the original.";
    if (type === 'denoise') instruction = "Remove noise while preserving the transparency and edges of the subject.";

    const finalPrompt = `${instruction} Ensure the output is a PNG with transparency preserved.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: mimeType } },
          { text: finalPrompt },
        ],
      },
    });

    const parts = response.candidates?.[0]?.content?.parts;
    for (const part of parts || []) {
      if (part.inlineData?.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("لم ينجح التحسين، حاول مرة أخرى.");
  } catch (error: any) {
    throw new Error(error.message || "فشل تحسين الصورة.");
  }
};

export const removeBackgroundWithGemini = async (
  base64Image: string, 
  mimeType: string, 
  model: string = 'gemini-2.5-flash-image'
): Promise<string> => {
  try {
    const ai = getAIClient();
    const instruction = "Carefully remove the background from this image. Identify the main subjects and isolate them perfectly. CRITICAL: The output MUST be a transparent PNG. All areas that were background must be fully transparent (alpha=0). Preserve the fine edges of the subject.";

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: mimeType } },
          { text: instruction },
        ],
      },
    });

    const parts = response.candidates?.[0]?.content?.parts;
    for (const part of parts || []) {
      if (part.inlineData?.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("لم يتمكن الذكاء الاصطناعي من معالجة الخلفية، جرب صورة أخرى.");
  } catch (error: any) {
    throw new Error(error.message || "فشل إزالة الخلفية.");
  }
};

export const generateImageWithGemini = async (
  prompt: string,
  aspectRatio: "1:1" | "3:4" | "4:3" | "9:16" | "16:9" = "1:1",
  model: string = 'gemini-2.5-flash-image',
  quality: "1K" | "2K" | "4K" = "1K",
  negativePrompt: string = '',
  style: string = 'none'
): Promise<string> => {
  try {
    const ai = getAIClient();
    
    // بناء الوصف النهائي بناءً على النمط والوصف السلبي
    let finalPrompt = prompt;
    if (style !== 'none') {
      finalPrompt = `Art Style: ${style}. Subject: ${finalPrompt}`;
    }
    if (negativePrompt) {
      finalPrompt = `${finalPrompt}. AVOID THESE ELEMENTS: ${negativePrompt}.`;
    }

    const config: any = {
      imageConfig: {
        aspectRatio: aspectRatio,
      }
    };

    if (model.includes('pro')) {
      config.imageConfig.imageSize = quality;
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [{ text: finalPrompt }] },
      config: config
    });

    const parts = response.candidates?.[0]?.content?.parts;
    for (const part of parts || []) {
      if (part.inlineData?.data) return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
    }
    throw new Error("فشل الذكاء الاصطناعي في ابتكار صورة لهذا الوصف.");
  } catch (error: any) {
    throw new Error(error.message || "فشل توليد الصورة.");
  }
};
