# النشر عبر GitHub Pages 🐙🚀

مرحباً بك في دليل النشر الآلي باستخدام **GitHub**. سنستخدم خاصية **GitHub Actions** لبناء المشروع ورفعه تلقائياً في كل مرة تقوم فيها بتحديث الكود.

## الخطوة 1: تهيئة المستودع (Repository)
1. قم بإنشاء مستودع جديد على حسابك في GitHub.
2. ارفع كود المشروع إلى المستودع:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/USERNAME/REPO_NAME.git
   git push -u origin main
   ```

## الخطوة 2: إضافة مفتاح الـ API (Secrets)
لحماية مفتاح Gemini API الخاص بك:
1. اذهب إلى إعدادات المستودع **Settings**.
2. من القائمة الجانبية اختر **Secrets and variables** > **Actions**.
3. اضغط على **New repository secret**.
4. الاسم: `API_KEY` | القيمة: (ضع مفتاح Gemini الخاص بك).

## الخطوة 3: إعداد GitHub Action
قم بإنشاء ملف في المسار التالي: `.github/workflows/deploy.yml` وضع فيه الكود التالي:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install and Build
        run: |
          npm install
          npm run build
        env:
          API_KEY: ${{ secrets.API_KEY }}

      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: dist # أو build حسب مخرجات المشروع
```

## الخطوة 4: تفعيل Pages
1. اذهب إلى **Settings** > **Pages**.
2. تحت قسم **Build and deployment**، تأكد من اختيار **GitHub Actions** كمصدر للنشر.

---
**ملاحظة**: تأكد من إضافة `base: '/REPO_NAME/'` في ملف إعدادات Vite (إذا كنت تستخدمه) لضمان عمل المسارات بشكل صحيح على GitHub Pages.