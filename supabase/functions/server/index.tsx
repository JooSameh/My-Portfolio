import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { secureHeaders } from "npm:hono/secure-headers"; // إضافة مكتبة الترويسات الأمنية
import * as kv from "./kv_store.tsx";
const app = new Hono();

// 1. Enable logger
app.use('*', logger(console.log));

// 2. تطبيق سياسة أمان المحتوى (CSP) والترويسات الأمنية الأخرى
// استخدام Middleware الجاهز من Hono لتأمين الردود
app.use(
  '*',
  secureHeaders({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"], // السماح فقط للموارد من نفس النطاق
        scriptSrc: ["'self'", "'unsafe-inline'"], // تعديل هذا لاحقاً لتقييد السكربتات إذا لزم الأمر
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://rfvojxtqmelksvuxbfjz.supabase.co"], // السماح بالاتصال بـ Supabase فقط
      },
    },
    xFrameOptions: "DENY", // منع وضع الموقع في IFrame لحمايته من Clickjacking
    xContentTypeOptions: "nosniff", // منع المتصفح من تخمين نوع الملف
  })
);

// 3. Secure CORS configuration (الخطوة التي قمنا بها سابقاً)
app.use(
  "/*",
  cors({
    origin: ["http://localhost:5173", "https://your-portfolio-domain.com"], // استبدل بالدومين الفعلي لاحقاً
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// 4. تطبيق نظام Rate Limiting مبسط (للحد من الطلبات)
// سنقوم بتخزين عدد طلبات الـ IP في الذاكرة المؤقتة (ملاحظة: للاستخدام الإنتاجي الضخم يفضل استخدام Redis)
const ipRequestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // دقيقة واحدة
const MAX_REQUESTS_PER_WINDOW = 10; // الحد الأقصى للطلبات في الدقيقة

app.use('/api/*', async (c, next) => {
  const ip = c.req.header('x-forwarded-for') || 'unknown-ip';
  const now = Date.now();
  const requestData = ipRequestCounts.get(ip);

  if (!requestData || now > requestData.resetTime) {
    // مستخدم جديد أو مر وقت النافذة (دقيقة)
    ipRequestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
  } else {
    // مستخدم موجود وفي نفس النافذة الزمنية
    if (requestData.count >= MAX_REQUESTS_PER_WINDOW) {
      return c.json({ error: "Too many requests, please try again later." }, 429); // كود الخطأ 429
    }
    requestData.count++;
  }
  await next();
});

// Health check endpoint
app.get("/make-server-8807cd9f/health", (c) => {
  return c.json({ status: "ok" });
});

// مثال لمسار جديد (Endpoint) مخصص لاستقبال نموذج الاتصال 
// (قمنا بتغطيته بمسار يبدأ بـ /api ليطبق عليه الـ Rate Limiting)
app.post("/api/contact", async (c) => {
  try {
    const body = await c.req.json();
    // هنا تقوم بإدخال البيانات إلى قاعدة بيانات Supabase باستخدام kv_store أو دوال Supabase المباشرة
    // مثال توضيحي فقط:
    // await kv.set(`contact_${Date.now()}`, body); // حفظ البيانات في قاعدة بيانات Supabase
await kv.set(`contact_${Date.now()}`, body);
    
    return c.json({ success: true, message: "Message received safely." });
  } catch (error) {
    return c.json({ error: "Invalid request" }, 400);
  }
});

Deno.serve(app.fetch);
