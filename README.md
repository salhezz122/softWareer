# Amman FactCheck (LocalStorage Demo)

منصة تدقيق أخبار كاملة **بدون باك-إند** (HTML/CSS/JS فقط) مبنية على **LocalStorage**.

## الصفحات
- `index.html` تسجيل دخول / إنشاء حساب / دخول أدمن
- `dashboard.html` لوحة المستخدم
- `admin.html` لوحة الأدمن (قبول المستخدمين + مراجعة الأخبار + تعديل خبر نصي)
- `archive.html` الأرشيف العام (صحيح/خطأ + بحث + فلترة)

## ملاحظات مهمة
- هذا المشروع للعرض فقط. حفظ كلمة المرور و الملفات في LocalStorage **غير آمن** للإنتاج.
- رفع الملفات يتم تحويله Base64 وحفظه في LocalStorage (حجم كبير قد يسبب مشاكل).
- كلمة مرور الأدمن ثابتة داخل `assets/app.js`:
  - `SS4625ss`

## تشغيل المشروع محليًا
افتح `index.html` مباشرة (Double click) أو استخدم Live Server.

## نشره على GitHub Pages (مختصر)
1) أنشئ Repository جديد
2) ارفع الملفات كما هي
3) من Settings → Pages
4) اختر Branch: `main` و Folder: `/ (root)`
5) احفظ، وسيعطيك رابط الموقع
