# 🚀 Deploy Talitali CMS ke Railway.app

Panduan super simple deploy aplikasi Nuxt 3 + Prisma ke Railway dalam **5 langkah**.

**Domain akhir:** https://talitali.co.id (bisa pakai custom domain!)

---

## 🎯 Kenapa Railway?

✅ **Gratis** untuk mulai (500 jam/bulan)  
✅ **Setup 10 menit** (lebih cepat dari cPanel!)  
✅ **Node.js built-in** (tidak perlu install apa-apa)  
✅ **Database included** (MySQL gratis)  
✅ **Auto SSL** (HTTPS otomatis)  
✅ **Auto deploy** dari Git (optional)  
✅ **Custom domain** support (talitali.co.id)  
✅ **Monitoring** dashboard gratis  

---

## 📦 LANGKAH 0: Prepare Files (SUDAH KELAR!)

Saya sudah buatkan script untuk kamu. Tinggal jalankan:

```bash
# Pastikan sudah build dulu
npm run build

# Jalankan script prepare
prepare-deployment.bat
```

Script akan buat folder `deploy-package/` berisi:
- ✅ `.output/` (hasil build)
- ✅ `prisma/` (database schema)
- ✅ `package.json` (dependencies)
- ✅ `.env.example` (template config)

**Kemudian compress folder `deploy-package` jadi ZIP.**

---

## 🚀 LANGKAH 1: Buat Akun Railway

### 1.1 Sign Up

1. Buka https://railway.app
2. Klik **"Start a New Project"**
3. Sign up dengan **GitHub** (recommended) atau email
4. Verify email
5. Login ke dashboard

**Gratis tanpa kartu kredit!** ✅

---

## 🗄️ LANGKAH 2: Setup Database MySQL

### 2.1 Buat Database

1. Di Railway dashboard, klik **"New Project"**
2. Pilih **"Deploy MySQL"**
3. Tunggu provisioning selesai (30 detik)
4. Database siap! ✅

### 2.2 Catat Database Credentials

1. Klik **MySQL service** yang baru dibuat
2. Buka tab **"Variables"**
3. Catat credentials berikut:

```
MYSQL_HOST: [akan muncul]
MYSQL_PORT: [akan muncul]
MYSQL_USER: root
MYSQL_PASSWORD: [akan muncul]
MYSQL_DATABASE: railway
```

### 2.3 Buat Database URL

Format:
```
mysql://USER:PASSWORD@HOST:PORT/DATABASE
```

Contoh:
```
mysql://root:abc123xyz@containers-us-west-1.railway.app:7894/railway
```

**Simpan URL ini, nanti dipakai!**

---

## 📤 LANGKAH 3: Upload Aplikasi ke Railway

### Opsi A: Upload via Web (TERMUDAH)

1. Di Railway dashboard, klik **"New"** → **"Empty Service"**
2. Klik service yang baru dibuat
3. Buka tab **"Settings"**
4. Scroll ke **"Source"**
5. Klik **"Deploy from local directory"**
6. Install Railway CLI:

```bash
# Windows (via npm)
npm install -g @railway/cli

# Atau download installer:
# https://docs.railway.app/develop/cli#installation
```

7. Login Railway CLI:
```bash
railway login
```

8. Link ke project:
```bash
cd d:\filament\talitali\deploy-package
railway link
# Pilih project yang tadi dibuat
```

9. Deploy:
```bash
railway up
```

Tunggu upload selesai (2-5 menit).

### Opsi B: Deploy dari GitHub (AUTO-DEPLOY)

1. Push code ke GitHub:
```bash
# Di folder project utama
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/talitali-cms.git
git push -u origin main
```

2. Di Railway dashboard:
   - Klik **"New"** → **"GitHub Repo"**
   - Pilih repository `talitali-cms`
   - Klik **"Deploy Now"**

3. Railway otomatis detect Nuxt dan build!

**UPDATE:** Setiap push ke GitHub = auto deploy ✅

---

## ⚙️ LANGKAH 4: Configure Environment Variables

### 4.1 Set Variables di Railway

1. Buka service aplikasi di Railway
2. Klik tab **"Variables"**
3. Klik **"+ New Variable"**
4. Tambahkan satu per satu:

```env
DATABASE_URL=mysql://root:PASSWORD@HOST:PORT/railway
```
(Pakai URL yang tadi kamu catat)

```env
AUTH_SECRET=generate-random-32-chars
```
(Generate di https://generate-secret.vercel.app/32)

```env
AUTH_ORIGIN=https://talitali-production.up.railway.app
```
(Ganti dengan domain Railway kamu)

```env
BASE_URL=https://talitali-production.up.railway.app
```

```env
CACHE_DIR=./.cache
```

```env
NODE_ENV=production
```

5. Klik **"Save"**

Railway otomatis restart aplikasi dengan config baru!

### 4.2 Verifikasi Variables

Check di tab "Variables" - harus ada 6 variables ✅

---

## 🔧 LANGKAH 5: Setup Database & Create Admin

### 5.1 Run Migrations

via Railway CLI:

```bash
# Dari folder deploy-package
railway run npx prisma migrate deploy
```

Atau pakai Railway shell:
1. Di dashboard, klik service
2. Klik tab **"Deployments"**
3. Klik **latest deployment**
4. Klik **"View Logs"**
5. Scroll ke atas, klik **"Shell"**
6. Run command:
```bash
npx prisma migrate deploy
```

### 5.2 Create Admin User

Di Railway shell:

```bash
node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function createAdmin() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const user = await prisma.user.create({
    data: {
      name: 'Admin Talitali',
      email: 'admin@talitali.co.id',
      password: hashedPassword,
      role: 'ADMIN'
    }
  });
  console.log('Admin created:', user.email);
  await prisma.\$disconnect();
}

createAdmin();
"
```

**Login Credentials:**
- Email: `admin@talitali.co.id`
- Password: `admin123`

⚠️ Ganti password setelah login!

### 5.3 Seed Initial Data (Optional)

```bash
# Dari Railway shell atau CLI
railway run node seed_hero_fields.cjs
railway run node seed_benefit_fields.cjs
railway run node seed_features_pricing.cjs
railway run node seed_feature_defaults.cjs
```

---

## 🌐 LANGKAH 6: Setup Custom Domain (talitali.co.id)

### 6.1 Generate Domain di Railway

1. Buka service di Railway
2. Klik tab **"Settings"**
3. Scroll ke **"Domains"**
4. Klik **"Generate Domain"**
5. Railway kasih URL: `talitali-production.up.railway.app`

**Test:** Buka URL di browser - website harus muncul! ✅

### 6.2 Add Custom Domain

1. Masih di tab "Settings" → "Domains"
2. Klik **"Custom Domain"**
3. Masukkan: `talitali.co.id` dan `www.talitali.co.id`
4. Railway kasih **CNAME record** untuk setup:

```
Type: CNAME
Name: @
Value: talitali-production.up.railway.app
```

```
Type: CNAME
Name: www
Value: talitali-production.up.railway.app
```

### 6.3 Update DNS di Domain Provider

1. Login ke **domain registrar** kamu (tempat beli talitali.co.id)
2. Buka **DNS Management** / **DNS Settings**
3. **Hapus semua A record** untuk @ dan www
4. Tambahkan **CNAME records** seperti di atas
5. Save changes

**Wait time:** 10 menit - 24 jam (biasanya cepat, ~1 jam)

### 6.4 Update Environment Variables

Setelah domain ready, update:

1. Railway dashboard → Variables
2. Edit `AUTH_ORIGIN`:
```env
AUTH_ORIGIN=https://talitali.co.id
```

3. Edit `BASE_URL`:
```env
BASE_URL=https://talitali.co.id
```

4. Save → Auto redeploy

### 6.5 Force HTTPS

Railway otomatis kasih SSL (Let's Encrypt) ✅

Test: https://talitali.co.id - harus ada **gembok hijau**!

---

## ✅ Verifikasi Deployment

### Checklist:

- [ ] Website bisa diakses: https://talitali.co.id ✅
- [ ] HTTPS/SSL aktif (gembok hijau) ✅
- [ ] Homepage loading ✅
- [ ] Admin login works: https://talitali.co.id/admin/login ✅
- [ ] Dashboard tampil ✅
- [ ] Bisa create post ✅
- [ ] Bisa edit page ✅
- [ ] Blog page works ✅
- [ ] Upload image works ✅
- [ ] Custom fields works ✅

**Jika semua ✅ = DEPLOYMENT SUKSES!** 🎉

---

## 📊 Monitoring & Logs

### View Logs Real-time

1. Railway dashboard
2. Klik service
3. Tab **"Deployments"**
4. Klik deployment terbaru
5. **"View Logs"**

### Metrics

1. Tab **"Metrics"**
2. Lihat:
   - CPU usage
   - Memory usage
   - Request count
   - Response time

---

## 💰 Biaya Railway

### Free Tier:
- ✅ **$5 credit** setiap bulan
- ✅ **500 execution hours** per bulan
- ✅ Cukup untuk website dengan **traffic sedang**

### Estimasi Usage:
- App running 24/7 = ~720 jam/bulan
- Database 24/7 = ~720 jam/bulan
- **Total: ~$10/bulan** (jika exceed free tier)

**Tapi untuk start, GRATIS dulu sampai exceed!** 🎁

### Upgrade:
- **Hobby Plan:** $5/bulan untuk unlimited execution hours
- Auto charge kalau exceed limit

---

## 🔄 Update Aplikasi (Future Deployment)

### Jika pakai GitHub (Auto-deploy):

```bash
# Di local, setelah edit code
git add .
git commit -m "Update feature XYZ"
git push origin main

# Railway otomatis detect & deploy! ✅
```

### Jika pakai Railway CLI:

```bash
# Build di local
npm run build

# Update deploy-package
prepare-deployment.bat

# Deploy
cd deploy-package
railway up
```

---

## 🐛 Troubleshooting

### Error: Build Failed

**Check logs:**
1. Railway dashboard → Deployments → View Logs
2. Lihat error message

**Common issues:**
- Missing dependencies → Check package.json
- Build timeout → Contact Railway support (increase limits)

### Error: Database Connection Failed

**Check:**
1. Variables tab → DATABASE_URL correct?
2. MySQL service running?
3. Firewall? (Railway handle ini automatically)

**Fix:**
```bash
# Test connection via shell
railway run npx prisma db push --skip-generate
```

### Error: Application Crashed

**Check logs:**
```bash
railway logs
```

**Common causes:**
- Missing env variables
- Port not set (Railway auto set ini)
- Prisma not generated

**Fix:**
```bash
railway run npx prisma generate
```

### Domain DNS Not Propagating

**Wait:** DNS propagation bisa 1-24 jam

**Check status:**
```bash
# Windows Command Prompt
nslookup talitali.co.id

# Harus return Railway IP
```

**Or use:** https://dnschecker.org

---

## 🎉 SELESAI!

Website **Talitali.co.id** sekarang LIVE di production! 🚀

### Access Points:
- **Website:** https://talitali.co.id
- **Admin:** https://talitali.co.id/admin/login
- **Blog:** https://talitali.co.id/blog
- **Railway Dashboard:** https://railway.app/dashboard

### Next Steps:
1. ✅ Login admin & ganti password
2. ✅ Edit homepage content
3. ✅ Upload logo
4. ✅ Create first blog post
5. ✅ Setup Google Analytics (optional)
6. ✅ Share website link!

**Congratulations!** 🎊✨

---

## 🆘 Butuh Bantuan?

**Railway Docs:** https://docs.railway.app  
**Railway Discord:** https://discord.gg/railway  
**Railway Status:** https://status.railway.app

---

**Total waktu setup:** ~20-30 menit  
**Difficulty:** ⭐⭐☆☆☆ (Easy)  
**Result:** Production-ready website with full CMS! 🎯
