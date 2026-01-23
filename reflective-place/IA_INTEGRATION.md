# Integración de IA en Reflective Place

Esta guía explica cómo usar la funcionalidad de IA integrada en la aplicación.

## Configuración Inicial

### 1. Variables de Entorno

Copia el archivo `.env.example` a `.env` y completa con tus credenciales:

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:

```env
VITE_AI_PROVIDER=openai
VITE_AI_API_KEY=tu_api_key_aqui
VITE_AI_MODEL=gpt-4o-mini
```

### 2. Proveedores Soportados

#### OpenAI
- Obtén tu API key en: https://platform.openai.com/api-keys
- Modelos recomendados: `gpt-4o-mini`, `gpt-4o`, `gpt-4-turbo`
- Configuración:
  ```env
  VITE_AI_PROVIDER=openai
  VITE_AI_API_KEY=sk-...
  VITE_AI_MODEL=gpt-4o-mini
  ```

#### Anthropic (Claude)
- Obtén tu API key en: https://console.anthropic.com/
- Modelos recomendados: `claude-3-5-sonnet-20241022`, `claude-3-opus-20240229`
- Configuración:
  ```env
  VITE_AI_PROVIDER=anthropic
  VITE_AI_API_KEY=sk-ant-...
  VITE_AI_MODEL=claude-3-5-sonnet-20241022
  ```

## Uso en Componentes

### Opción 1: Usar el Componente AIAssistant

El componente `AIAssistant` es un modal completo listo para usar:

```tsx
import { useState } from 'react';
import AIAssistant from '../components/AIAssistant';

function MiPantalla() {
  const [showAI, setShowAI] = useState(false);

  return (
    <>
      <button onClick={() => setShowAI(true)}>
        Abrir Asistente de IA
      </button>
      
      {showAI && (
        <AIAssistant
          userText="Texto del usuario para reflexionar"
          context={{
            rol: "INDIVIDUAL",
            clasificacion: "decision",
            valores: [
              { name: "Autenticidad", description: "Quieres ser fiel a ti mismo" }
            ]
          }}
          onClose={() => setShowAI(false)}
        />
      )}
    </>
  );
}
```

### Opción 2: Usar el Hook useAI

Para más control, usa el hook `useAI` directamente:

```tsx
import { useAI } from '../hooks/useAI';

function MiPantalla() {
  const { response, isLoading, error, generateReflection } = useAI({
    onSuccess: (response) => {
      console.log('Respuesta recibida:', response);
    },
    onError: (error) => {
      console.error('Error:', error);
    }
  });

  const handleReflect = async () => {
    await generateReflection(
      "Quiero cambiar de trabajo pero tengo miedo",
      {
        rol: "INDIVIDUAL",
        clasificacion: "decision",
        valores: [
          { name: "Seguridad", description: "Necesitas estabilidad" }
        ]
      }
    );
  };

  return (
    <div>
      <button onClick={handleReflect} disabled={isLoading}>
        {isLoading ? 'Reflexionando...' : 'Reflexionar'}
      </button>
      {response && <p>{response}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
```

### Opción 3: Usar el Servicio Directamente

Para casos avanzados, usa el servicio directamente:

```tsx
import { aiService } from '../services/aiService';

// Configuración manual (opcional)
aiService.initialize({
  provider: 'openai',
  apiKey: 'tu-api-key',
  model: 'gpt-4o-mini'
});

// Uso
const response = await aiService.generateReflection(
  "Texto del usuario",
  { rol: "INDIVIDUAL" }
);

console.log(response.content);
```

## Ejemplo Completo

Revisa `src/pages/pantalla4-with-ai.tsx` para ver un ejemplo completo de integración.

## Características

- ✅ Soporte para OpenAI y Anthropic
- ✅ Hook personalizado `useAI` para fácil integración
- ✅ Componente `AIAssistant` listo para usar
- ✅ Contexto automático (rol, clasificación, valores)
- ✅ Manejo de errores integrado
- ✅ Estados de carga
- ✅ Configuración flexible mediante variables de entorno

## Personalización

### Modificar el Prompt del Sistema

Edita `src/services/aiService.ts`, función `generateReflection`, para cambiar el comportamiento del asistente.

### Agregar Nuevos Proveedores

Extiende `AIService` en `src/services/aiService.ts` agregando nuevos métodos privados siguiendo el patrón de `chatOpenAI` y `chatAnthropic`.

## Troubleshooting

### Error: "Servicio de IA no configurado"
- Verifica que el archivo `.env` existe y tiene `VITE_AI_API_KEY`
- Reinicia el servidor de desarrollo después de crear/modificar `.env`

### Error: "Error 401: Unauthorized"
- Verifica que tu API key es correcta
- Asegúrate de tener créditos en tu cuenta del proveedor

### Error: "Error 429: Too Many Requests"
- Has excedido el límite de rate limit
- Espera unos minutos o actualiza tu plan

## Seguridad

⚠️ **Importante**: Nunca subas tu archivo `.env` al repositorio. Está incluido en `.gitignore` por defecto.

Para producción, configura las variables de entorno en tu plataforma de hosting (Vercel, Netlify, etc.).
