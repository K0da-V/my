import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '5mb' }));

  // AI Design Studio Endpoint for PAINEL ADM
  app.post('/api/admin/ai-design', async (req, res) => {
    try {
      const { targetSection, sectionLabel, userPrompt, currentConfig } = req.body || {};

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({
          error: 'Chave GEMINI_API_KEY não encontrada no servidor.'
        });
      }

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      const systemInstruction = `Você é o Diretor de Arte e Arquiteto de UI/UX Sênior do aplicativo "Aura Privé" (rede social exclusiva de encontros reais, estilo de vida liberal, BDSM, lives, status e venda de conteúdo +18 com Moedas Aura).
O administrador selecionou a seção "${sectionLabel || targetSection}" no PAINEL ADM e pediu: "${
        userPrompt || 'Crie 3 variações de design elegantes, naturais, sem cara de IA, com alta conversão e excelente leitura no celular e computador.'
      }".
Configuração atual resumida: ${JSON.stringify(currentConfig || {})}.
Gere exatamente 3 propostas de design distintas, completas e prontas para serem aplicadas em tempo real na seção selecionada e no tema do site.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Gere 3 variações de design exclusivas e altamente eficazes para a seção "${
          sectionLabel || targetSection
        }" seguindo o pedido do administrador: "${
          userPrompt || 'Design mais orgânico, natural, sofisticado e responsivo'
        }".`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            description: 'Lista com 3 variações de design para a seção selecionada',
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: {
                  type: Type.STRING,
                  description: 'Nome criativo do design (ex: Editorial Parisienne, Noir Acetinado, Ouro Veneziano)'
                },
                tagline: {
                  type: Type.STRING,
                  description: 'Resumo curto do foco visual e ergonômico'
                },
                rationale: {
                  type: Type.STRING,
                  description: 'Explicação clara de como esse design melhora a seção selecionada no celular e computador'
                },
                primaryColor: {
                  type: Type.STRING,
                  description: 'Cor principal em HEX (ex: #E11D48, #D97706, #9333EA, #BE123C)'
                },
                accentColor: {
                  type: Type.STRING,
                  description: 'Cor de destaque em HEX (ex: #FB7185, #FBBF24, #F472B6)'
                },
                bgColor: {
                  type: Type.STRING,
                  description: 'Cor de fundo principal escura e sofisticada em HEX (ex: #0D090B, #0A0A0C, #120C0E)'
                },
                cardBgColor: {
                  type: Type.STRING,
                  description: 'Cor de superfície do card em HEX (ex: #161013, #181316, #141418)'
                },
                borderRadiusStyle: {
                  type: Type.STRING,
                  description: 'Estilo de cantos: soft (24px), editorial (14px), ou organic (32px)'
                },
                cardDensity: {
                  type: Type.STRING,
                  description: 'Densidade: spacious, balanced, ou compact'
                },
                mobileCardScale: {
                  type: Type.STRING,
                  description: 'Escala no celular: large (ampliado), fullscreen (imersivo), ou standard'
                },
                buttonStyle: {
                  type: Type.STRING,
                  description: 'Estilo dos botões: gradient, solid, ou glass-outline'
                },
                suggestedHeading: {
                  type: Type.STRING,
                  description: 'Sugestão de título persuasivo para a seção selecionada'
                },
                suggestedSubheading: {
                  type: Type.STRING,
                  description: 'Sugestão de subtítulo natural e humano para a seção selecionada'
                },
                cssPreviewSnippet: {
                  type: Type.STRING,
                  description: 'Resumo técnico dos tokens visuais aplicados'
                },
                highlights: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '3 melhorias práticas que este design aplica imediatamente'
                }
              },
              required: [
                'id',
                'title',
                'tagline',
                'rationale',
                'primaryColor',
                'accentColor',
                'bgColor',
                'cardBgColor',
                'borderRadiusStyle',
                'cardDensity',
                'mobileCardScale',
                'buttonStyle',
                'suggestedHeading',
                'suggestedSubheading',
                'cssPreviewSnippet',
                'highlights'
              ]
            }
          }
        }
      });

      const rawText = response.text || '[]';
      const proposals = JSON.parse(rawText);
      return res.json({ proposals });
    } catch (error: any) {
      console.error('Erro na geração de design IA:', error);
      return res.status(500).json({
        error: error?.message || 'Falha ao consultar a IA de Design do Painel ADM.'
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Aura Privé Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
