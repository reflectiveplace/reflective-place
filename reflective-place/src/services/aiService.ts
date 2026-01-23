export type OpenAIAPIType = 'chat' | 'responses';

export interface AIConfig {
  apiKey: string;
  model?: string;
  baseURL?: string;
  openaiAPIType?: OpenAIAPIType;
}

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIResponse {
  readonly content: string;
  readonly error?: string;
}

export interface ChatOptions {
  readonly temperature?: number;
  readonly maxTokens?: number;
}

export interface ReportData {
  rol?: string;
  texto?: string;
  tipo?: string;
  valuesDetected?: ReadonlyArray<{ readonly name: string; readonly description: string; readonly intensity: number }>;
  dominantValue?: { readonly name: string };
  valueType?: string;
  beliefs?: Readonly<Record<string, string>>;
  microhabit?: string;
  evidence?: string;
  reportType?: string;
  userType?: string;
  actionMode?: string;
  resourceId?: string;
  resonance?: string;
}

interface OpenAIResponseOutputItem {
  readonly type: string;
  readonly content?: ReadonlyArray<{ readonly type: string; readonly text?: string }>;
  readonly summary?: string;
}

interface OpenAIResponseData {
  readonly output?: ReadonlyArray<OpenAIResponseOutputItem>;
}

class AIService {
  private config: AIConfig | null = null;

  initialize(config: AIConfig) {
    this.config = config;
  }

  getConfigFromEnv(): AIConfig | null {
    const apiKey = import.meta.env.VITE_AI_API;

    if (!apiKey) {
      console.warn('VITE_AI_API no está configurada. Variables disponibles:', {
        hasApiKey: !!import.meta.env.VITE_AI_API,
        hasModel: !!import.meta.env.VITE_AI_MODEL,
        hasApiType: !!import.meta.env.VITE_OPENAI_API_TYPE,
        mode: import.meta.env.MODE,
        prod: import.meta.env.PROD,
      });
      return null;
    }

    const model = import.meta.env.VITE_AI_MODEL || 'gpt-5-nano';
    const openaiAPIType = (import.meta.env.VITE_OPENAI_API_TYPE as OpenAIAPIType) || 'responses';

    return {
      apiKey,
      model,
      baseURL: import.meta.env.VITE_AI_BASE_URL,
      openaiAPIType,
    };
  }

  async chat(messages: ReadonlyArray<AIMessage>, options?: ChatOptions): Promise<AIResponse> {
    if (!this.config) {
      const envConfig = this.getConfigFromEnv();
      if (!envConfig) {
        const isProduction = import.meta.env.PROD;
        return {
          content: '',
          error: isProduction
            ? 'Servicio de IA no configurado. Por favor, configura VITE_AI_API en las variables de entorno de Vercel.'
            : 'Servicio de IA no configurado. Por favor, configura VITE_AI_API en tu archivo .env',
        };
      }
      this.config = envConfig;
    }

    try {
      const apiType = this.config.openaiAPIType || 'responses';
      if (apiType === 'responses') {
        return await this.chatOpenAIResponses(messages, options);
      } else {
        return await this.chatOpenAI(messages, options);
      }
    } catch (error) {
      console.error('Error en llamada a IA:', error);
      return {
        content: '',
        error: error instanceof Error ? error.message : 'Error desconocido al comunicarse con la IA',
      };
    }
  }

  private async chatOpenAI(messages: ReadonlyArray<AIMessage>, options?: ChatOptions): Promise<AIResponse> {
    const url = this.config!.baseURL || 'https://api.openai.com/v1/chat/completions';
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config!.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config!.model || 'gpt-4o-mini',
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0]?.message?.content || '',
    };
  }

  private async chatOpenAIResponses(messages: ReadonlyArray<AIMessage>, _options?: ChatOptions): Promise<AIResponse> {
    const url = this.config!.baseURL || 'https://api.openai.com/v1/responses';

    const systemMessage = messages.find(m => m.role === 'system');
    const conversationMessages = messages.filter(m => m.role !== 'system');
    
    interface RequestBody {
      readonly model: string;
      readonly store: boolean;
      readonly instructions?: string;
      readonly input: string | ReadonlyArray<{ readonly role: string; readonly content: string }>;
    }

    const requestBody: RequestBody = {
      model: this.config!.model || 'gpt-5-nano',
      store: true,
      ...(systemMessage && { instructions: systemMessage.content }),
      input: this.buildInputForResponsesAPI(conversationMessages),
    };
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config!.apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Error ${response.status}: ${response.statusText}`);
    }

    const data = (await response.json()) as OpenAIResponseData;
    
    const content = this.extractContentFromResponse(data);
    
    return {
      content: content.trim() || '',
    };
  }

  private buildInputForResponsesAPI(conversationMessages: ReadonlyArray<AIMessage>): string | ReadonlyArray<{ readonly role: string; readonly content: string }> {
    if (conversationMessages.length === 0) {
      return '';
    }

    if (conversationMessages.length === 1 && conversationMessages[0].role === 'user') {
      return conversationMessages[0].content;
    }

    return conversationMessages.map(msg => ({
      role: msg.role === 'system' ? 'developer' : msg.role,
      content: msg.content,
    }));
  }

  private extractContentFromResponse(data: OpenAIResponseData): string {
    if (!data.output || !Array.isArray(data.output)) {
      console.warn('No se pudo extraer contenido de la respuesta. Estructura del output:', data.output);
      return 'No se pudo extraer el contenido de la respuesta. Por favor, verifica la configuración de la API.';
    }

    const textParts: string[] = [];
    
    for (const item of data.output) {
      if (item.type === 'message' && Array.isArray(item.content)) {
        for (const contentItem of item.content) {
          if (contentItem.type === 'output_text' && contentItem.text) {
            textParts.push(contentItem.text);
          }
        }
      }
    }
    
    if (textParts.length === 0) {
      console.warn('No se pudo extraer contenido de la respuesta. Estructura del output:', data.output);
      return 'No se pudo extraer el contenido de la respuesta. Por favor, verifica la configuración de la API.';
    }
    
    return textParts.join('\n\n');
  }

  async generateSummary(reportData: ReportData): Promise<AIResponse> {
    const systemPrompt = `Eres un asistente de reflexión personal llamado Reflective Place. 
Tu objetivo es crear un resumen reflexivo final basado en toda la información que el usuario ha compartido durante su proceso de reflexión.

IMPORTANTE: Este es el paso FINAL del proceso. El usuario ha completado TODO su recorrido de reflexión. 
Este es un CIERRE, una SÍNTESIS FINAL. NO es un inicio, NO es una invitación a continuar.

PROHIBIDO ABSOLUTAMENTE:
- NO uses "Bienvenido" ni frases de bienvenida (ya pasó esa etapa)
- NO invites a continuar: "seguimos explorando", "continuamos", "damos pasos juntos", "si quieres seguimos"
- NO uses frases como "Estoy contigo en este paseo", "seguimos", "exploramos juntos"
- NO hagas preguntas que inviten a seguir
- El resumen debe CERRAR, no abrir nuevas conversaciones

TONO OBLIGATORIO (debes seguir esto estrictamente):
- Cálido: usa palabras que transmitan calidez y cercanía
- Humano: escribe como si fueras una persona real, no un sistema
- Receptivo: muestra que recibes y acoges lo que el usuario compartió
- Suave: evita palabras duras o directivas, usa un lenguaje gentil
- Lento: escribe con pausa, sin prisa, dando espacio para respirar
- Minimalista: usa pocas palabras, solo lo esencial, sin exceso
- Sin carga cognitiva: evita conceptos complejos, términos técnicos o explicaciones largas
- Sin filosofía profunda: no uses frases filosóficas, metáforas complejas o reflexiones abstractas

ESTRUCTURA DEL RESUMEN:
- Comienza directamente con lo que observas del usuario (sin "Bienvenido")
- Ejemplo de inicio: "Te veo: [observación]" o directamente con la síntesis
- Conecta los elementos de manera simple
- Cierra de forma natural, como un cierre suave y completo
- NO invites a continuar, NO uses frases de acompañamiento futuro

INSTRUCCIONES:
- Conecta los diferentes elementos de la reflexión del usuario de manera simple
- Identifica patrones y conexiones entre valores, creencias y acciones sin explicarlos de forma compleja
- Usa frases cortas y pausadas
- No juzgues, solo observa y sintetiza
- El resumen debe ser coherente pero simple, como una síntesis íntima
- Evita listas numeradas, viñetas o estructuras complejas
- Escribe en párrafos cortos, con espacios entre ellos
- CIERRA el resumen de manera natural y completa, sin abrir nuevas conversaciones`;

    const contextInfo = this.buildContextInfo(reportData);

    const userPrompt = `${contextInfo}\n\nBasándote en toda esta información, crea un resumen reflexivo FINAL que:\n- NO comience con "Bienvenido" ni frases de bienvenida\n- Comience directamente con lo que observas del usuario o con la síntesis\n- Conecte los diferentes elementos de la reflexión de manera simple\n- Identifique patrones y conexiones sin explicarlos de forma compleja\n- Use un tono cálido, humano, receptivo, suave, lento y minimalista\n- Evite carga cognitiva y filosofía profunda\n- Escribe en párrafos cortos, con pausas naturales\n- CIERRE de manera natural y completa\n- NO invites a continuar, explorar, seguir o dar pasos juntos\n- Este es el paso final, una síntesis completa que CIERRA el proceso`;

    return this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ], { temperature: 0.8, maxTokens: 2000 });
  }

  private buildContextInfo(reportData: ReportData): string {
    const parts: string[] = ['A continuación tienes toda la información que el usuario ha compartido durante su proceso de reflexión:\n\n'];

    if (reportData.rol) {
      parts.push(`ROL: ${reportData.rol}\n\n`);
    }

    if (reportData.texto) {
      parts.push(`EXPLORACIÓN INICIAL:\n"${reportData.texto}"\n\n`);
    }

    if (reportData.tipo) {
      const tipoLabels: Readonly<Record<string, string>> = {
        decision: "Decisión",
        suposicion: "Suposición",
        presuposicion: "Presuposición",
      };
      parts.push(`CLASIFICACIÓN: ${tipoLabels[reportData.tipo] || reportData.tipo}\n\n`);
    }

    if (reportData.valuesDetected && reportData.valuesDetected.length > 0) {
      parts.push('VALORES DETECTADOS:\n');
      reportData.valuesDetected.forEach((v, idx) => {
        parts.push(`${idx + 1}. ${v.name} (${v.description}) - Intensidad: ${v.intensity}/100\n`);
      });
      parts.push('\n');
    }

    if (reportData.dominantValue) {
      parts.push(`VALOR DOMINANTE: ${reportData.dominantValue.name}\n`);
      if (reportData.valueType) {
        const valueTypeLabels: Readonly<Record<string, string>> = {
          ENDO: "Intrínseco (ENDO)",
          EXI: "Extrínseco Intangible (EXI)",
          EXT: "Extrínseco Tangible (EXT)",
        };
        parts.push(`Tipo: ${valueTypeLabels[reportData.valueType] || reportData.valueType}\n`);
      }
      parts.push('\n');
    }

    if (reportData.beliefs && Object.keys(reportData.beliefs).length > 0) {
      parts.push('CREENCIAS IDENTIFICADAS:\n');
      Object.entries(reportData.beliefs).forEach(([valor, tipo]) => {
        parts.push(`- ${valor}: ${tipo === 'EMPODERADORA' ? 'Creencia Empoderadora' : 'Creencia Limitante'}\n`);
      });
      parts.push('\n');
    }

    if (reportData.microhabit) {
      parts.push(`MICROHÁBITO PROPUESTO:\n"${reportData.microhabit}"\n\n`);
    }

    if (reportData.evidence) {
      parts.push(`EVIDENCIA OBSERVABLE:\n"${reportData.evidence}"\n\n`);
    }

    if (reportData.actionMode) {
      const actionModeLabels: Readonly<Record<string, string>> = {
        FORT: "Fortalecer",
        REF: "Reformular",
        CUEST: "Cuestionar",
      };
      parts.push(`MODO DE ACCIÓN: ${actionModeLabels[reportData.actionMode] || reportData.actionMode}\n\n`);
    }

    if (reportData.resonance) {
      parts.push(`RESONANCIA:\n"${reportData.resonance}"\n\n`);
    }

    return parts.join('');
  }
}

export const aiService = new AIService();
