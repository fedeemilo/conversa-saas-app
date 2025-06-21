# Eduvoice

**Eduvoice** es una plataforma educativa impulsada por IA que permite a los usuarios crear y conversar con tutores personalizados en tiempo real usando voz. La app está construida con Next.js 15, Vapi AI, Clerk, Supabase y Sentry.

---

## 🚀 Tecnologías principales

- **Next.js 15.3.3** con App Router
- **Vapi AI**: conversaciones por voz con LLMs (OpenAI + TTS + STT)
- **11labs** para síntesis de voz natural
- **Clerk**: autenticación y gestión de usuarios
- **Supabase**: base de datos y backend-as-a-service
- **Sentry**: monitoreo de errores y replays
- **TailwindCSS + Radix UI**: estilado moderno y accesible
- **Zod + React Hook Form** para validación de formularios

---

## 🚀 Características principales

- 📚 Creación de tutores con nombre, voz, estilo y asignatura personalizada
- 🗣️ Interacción por voz en tiempo real
- 🎧 Transcripción en vivo de la conversación
- ✍️ Generación automática de resúmenes al finalizar cada sesión
- 🧾 Descarga de resumen en pantalla con opción de copia
- 🌐 Soporte multilenguaje (inglés y español) con detección automática
- 🧠 IA ajustada al contexto (tema + estilo conversacional)
- 🔒 Autenticación segura con Clerk
- 📊 Sitemap generado automáticamente para mejor indexación en Google
- 🖼️ Metadata y Open Graph configurados para mejorar el SEO y las vistas previas
- 🧱 Arquitectura moderna: Next.js 14 App Router + Tailwind + Supabase + Vapi
- 🐞 Monitoreo de errores y trazas con Sentry

---

## 📁 Estructura del proyecto

```
/app
  layout.tsx           ✅ Layout multilenguaje con NextIntlProvider y ClerkProvider
  api/                 ✅ Endpoints API (incluye integraciones con Sentry y Vapi)
  companions/          ✅ Lógica de tutores y sesiones (crear, listar, interactuar)
  sign-in/             ✅ Autenticación con Clerk
  subscription/        ✅ Página de planes (Free/Pro) e integración con Mercado Pago
  my-journey/          ✅ Historial de sesiones y resúmenes generados por usuario

/components
  ui/                  ✅ Componentes reutilizables (Select, Input, etc.)
  CompanionComponent.tsx
  CompanionForm.tsx    ✅ Crear un nuevo tutor con nombre, estilo, voz, tema
  SessionLimit.tsx     ✅ Aviso de límite de sesiones para usuarios Free
  SummaryBlock.tsx     ✅ Vista del resumen generado + botón de copia

/constants             ✅ Paletas, sonidos, IDs de voces, textos predefinidos
/i18n                  ✅ Traducciones, idiomas disponibles y helpers de NextIntl
/hooks                 ✅ Custom hooks (uso de voz, scroll, datos de sesión)

/lib
  actions/             ✅ Server actions para companions, subs, user y conversaciones
  assistant.server.ts  ✅ Lógica principal de conversación con la IA
  assistant-utils.ts   ✅ Helpers para armar el prompt y manejar el contexto
  openai.ts            ✅ Cliente y config para OpenAI (funciones y llamadas)
  supabase.ts          ✅ Instancia del cliente Supabase
  vapi.sdk.ts          ✅ Configuración y helpers para uso de Vapi
  utils.ts             ✅ Funciones genéricas reutilizables

/messages              ✅ Archivos de traducción por idioma
/public                ✅ Archivos estáticos: favicon, manifest, og-image
/types                 ✅ Tipados globales para la app (User, Companion, etc.)

```

---

## 🎧 Sistema de voz con Vapi AI

- **Text-to-Speech (11labs)**

    - Voz y estilo configurables: casual/formal y masculino/femenino
    - Soporte para voces custom en español (ej: Mauricio, Jhenny)

- **Speech-to-Text (Deepgram)**

    - Modelos `nova-2` para `es` y `nova-3` para `en`
    - Trigger de pausa mediante palabras clave: "Para" / "Stop"

- **IA Conversacional (OpenAI)**

    - Instrucciones dinámicas con `systemPrompt`
    - Modo conversación en tiempo real con respuestas breves

---

## 🔒 Autenticación con Clerk

- Clerk integrado en layout global con `<ClerkProvider>`
- `currentUser` disponible en server components
- Soporte para avatares, nombres y rutas protegidas

---

## 📉 Monitoreo con Sentry

- Integración completa usando `@sentry/nextjs`
- Soporte para `replay`, `captureException`, trazas y errores
- Configurado en `sentry.server.config.ts`, `sentry.edge.config.ts` y `instrumentation.ts`
- Replays activados con grabación de sesión

---

## 🚀 Roadmap de Desarrollo

### ✅ Estado actual

- Primera versión funcional desplegada.
- Interacción por voz con IA operativa en español e inglés.
- Sistema de tutores personalizables según voz, tema y estilo.
- Transcripción y resumen de sesiones disponibles.
- Sistema de suscripción Free/Pro con integración a Mercado Pago.
- Panel de historial (`/my-journey`) con acceso a resúmenes pasados.

---

### 🔧 Mejoras planificadas

#### 🔊 Mejora en la calidad del habla en español

- [x] Identificar problemas de pronunciación.
- [x] Cambiar proveedor a Azure con voces `Neural` específicas.
- [x] Implementar lógica dinámica de selección de voz según género/estilo/idioma.

#### 💳 Integración con Mercado Pago

- [x] Configurar MercadoPago en modo producción (Checkout Pro).
- [x] Implementar webhook para actualización automática de suscripciones.
- [x] Mostrar botones de suscripción habilitados según plan actual del usuario.

#### 📦 Fortalecimiento del sistema de suscripciones

- [x] Límite de resúmenes en plan Free (10).
- [x] Límite de sesiones activas para plan Free.
- [x] Página de upgrade con lógica condicional según plan.
- [ ] Notificaciones en la UI al alcanzar límites del plan.

#### 🧠 Nuevas funcionalidades inteligentes

- [x] Generación automática de resumen al finalizar la sesión.
- [x] Guardado de resumen y transcripción en base de datos.
- [ ] Descarga de sesión en formato PDF / MP3 (Pro).
- [ ] Recomendaciones inteligentes post-sesión (materia relacionada, práctica, etc).
- [ ] Continuidad entre sesiones (memoria de conversación por tutor).

#### 📱 UX/UI y experiencia mobile

- [x] Menú hamburguesa responsive en dispositivos móviles.
- [ ] Mejorar diseño en `/sign-in` y `/subscription` en pantallas pequeñas.
- [ ] Mejoras visuales en componentes de voz, loading y resumen.

#### 🧪 SEO, performance y visibilidad

- [x] Sitemap generado y enviado a Google Search Console.
- [x] Verificación de dominio.
- [x] Ajuste de etiquetas meta y OG en más páginas internas.
- [ ] Inclusión de rich snippets (si aplica) para mejorar visibilidad.

### 🐞 Bugs a revisar

#### 📱 Comportamiento del menú hamburguesa en mobile

- [ ] El menú no se cierra automáticamente al hacer click fuera del área visible.
- [ ] El menú no se cierra al seleccionar una opción del menú que redirige a otra ruta.
- [ ] A veces el ícono no cambia correctamente de hamburger (`☰`) a ícono de cierre (`✖`).
- [ ] Evaluar usar `Dialog` o `Sheet` para mejor accesibilidad y control del foco en mobile.

#### 🎨 Mejoras visuales en pantallas pequeñas

- [ ] Aumentar el padding lateral para evitar que los contenidos queden muy pegados al borde.
- [ ] Revisión general de espaciados, tamaños de fuente y botones en dispositivos móviles.
- [ ] Asegurar coherencia visual entre modo claro/oscuro en componentes como navbar, cards y formularios.


---

## 🌟 Crédito y contacto

Desarrollado por **Federico Milone**. Contactame a través de mi portfolio: https://fedmilo.com
