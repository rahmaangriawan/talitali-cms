# 🚀 Deploy Talitali CMS ke cPanel Hosting

Panduan lengkap untuk deploy aplikasi Nuxt 3 + Prisma ke cPanel hosting dengan Node.js support.

---

## 📋 Prerequisites

Sebelum deploy, pastikan hosting cPanel kamu memiliki:

- ✅ **Node.js** support (minimal v18.x atau v20.x)
- ✅ **SSH Access** (untuk menjalankan command)
- ✅ **MySQL/MariaDB** database
- ✅ Minimal **1GB RAM** (recommended 2GB)
- ✅ **SSL Certificate** (untuk HTTPS)

---

## 🛠️ Langkah 1: Build Aplikasi di Komputer Lokal

### 1.1 Install Dependencies & Build

```bash
# Install semua dependencies
npm install

# Build aplikasi untuk production
npm run build
```

Perintah `npm run build` akan membuat folder `.output` yang berisi semua file production-ready.

### 1.2 Verifikasi Build

Pastikan folder `.output` terbuat dengan struktur seperti ini:
```
.output/
├── server/
│   ├── index.mjs
│   └── ...
├── public/
└── nitro.json
```

---

## 🗄️ Langkah 2: Setup Database di cPanel

### 2.1 Buat Database MySQL

1. Login ke **cPanel**
2. Buka **MySQL Databases**
3. Buat database baru, contoh: `username_talitali`
4. Buat user baru dengan password yang kuat
5. Assign user ke database dengan **ALL PRIVILEGES**
6. Catat informasi berikut:
   - **Database Name**: `username_talitali`
   - **Database User**: `username_talitali_user`
   - **Database Password**: `your_strong_password`
   - **Database Host**: `localhost` (biasanya)

### 2.2 Upload Database Schema

**Opsi A: Menggunakan phpMyAdmin**

1. Buka **phpMyAdmin** di cPanel
2. Pilih database yang baru dibuat
3. Klik tab **Import**
4. Upload file `schema.sql` atau export dari database lokal kamu
5. Klik **Go**

**Opsi B: Menggunakan SSH (Lebih Cepat)**

```bash
# Login ke SSH
ssh username@your-domain.com

# Import database
mysql -u username_talitali_user -p username_talitali < /path/to/schema.sql
```

---

## 📦 Langkah 3: Upload Files ke cPanel

### 3.1 Compress File yang Perlu Diupload

Di komputer lokal, compress folder-folder berikut menjadi **zip**:

```bash
# Buat folder untuk upload
mkdir deploy-package
cd deploy-package

# Copy file-file yang diperlukan
cp -r ../.output .output
cp ../package.json .
cp ../package-lock.json .
cp ../prisma ./prisma -r
cp ../.env.example .env

# Compress menjadi zip
zip -r talitali-deploy.zip .
```

**File yang HARUS diupload:**
- `.output/` (hasil build)
- `package.json`
- `package-lock.json`
- `prisma/` (schema database)
- `.env` (environment variables - edit sesuai production)

**File yang TIDAK PERLU diupload:**
- `node_modules/`
- `.nuxt/`
- `.cache/`
- `dev_log.txt`
- File development lainnya

### 3.2 Upload via File Manager atau FTP

**Opsi A: File Manager cPanel**

1. Login ke cPanel
2. Buka **File Manager**
3. Navigate ke folder aplikasi (contoh: `~/applications/talitali`)
4. Upload `talitali-deploy.zip`
5. **Extract** file zip
6. Hapus file zip setelah extract

**Opsi B: FTP/SFTP**

```bash
# Menggunakan SCP
scp talitali-deploy.zip username@your-domain.com:~/applications/talitali/

# Atau gunakan FTP client seperti FileZilla
```

---

## ⚙️ Langkah 4: Configure Environment Variables

### 4.1 Edit File `.env`

Login ke cPanel dan edit file `.env` di folder aplikasi:

```bash
# Database
DATABASE_URL="mysql://username_talitali_user:your_password@localhost:3306/username_talitali"

# Auth Secret (WAJIB GANTI!)
AUTH_SECRET="generate-random-string-32-characters-minimum"
AUTH_ORIGIN="https://your-domain.com"

# Base URL
BASE_URL="https://your-domain.com"

# Cache Directory
CACHE_DIR="/home/username/applications/talitali/.cache"

# Site Settings (Optional - bisa diatur via admin)
SITE_TITLE="Talitali.co.id"
SITE_DESCRIPTION="Jasa Pembuatan Tali Lanyard Custom"
```

### 4.2 Generate AUTH_SECRET

Untuk generate random string yang aman:

```bash
# Di terminal lokal atau SSH
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy hasilnya ke `AUTH_SECRET`.

---

## 🚀 Langkah 5: Setup Node.js Application di cPanel

### 5.1 Menggunakan Node.js Selector (cPanel Modern)

1. Login ke cPanel
2. Cari **Setup Node.js App**
3. Klik **Create Application**
4. Isi form:
   - **Node.js Version**: Pilih v18.x atau v20.x
   - **Application Mode**: `Production`
   - **Application Root**: `/home/username/applications/talitali`
   - **Application URL**: `your-domain.com` atau subdomain
   - **Application Startup File**: `.output/server/index.mjs`
5. Klik **Create**

### 5.2 Install Dependencies via SSH

```bash
# Login ke SSH
ssh username@your-domain.com

# Navigate ke folder aplikasi
cd ~/applications/talitali

# Setup Node.js environment (sesuaikan path dari cPanel)
source /home/username/nodevenv/applications/talitali/18/bin/activate

# Install production dependencies
npm ci --production

# Generate Prisma Client
npx prisma generate

# (Optional) Run migrations jika belum import schema
npx prisma migrate deploy
```

### 5.3 Restart Application

Kembali ke **Setup Node.js App** di cPanel dan klik **Restart**.

---

## 🌐 Langkah 6: Configure Domain/Subdomain

### 6.1 Setup dengan Domain Utama

Jika menggunakan domain utama (contoh: `talitali.co.id`):

1. Pastikan **Application URL** di Node.js App sudah benar
2. Buka **Apache Configuration** (jika ada)
3. Pastikan reverse proxy sudah aktif

### 6.2 Setup dengan Subdomain

Jika menggunakan subdomain (contoh: `app.talitali.co.id`):

1. Buat subdomain di cPanel **Subdomains**
2. Arahkan document root ke folder aplikasi
3. Update **Application URL** di Node.js App settings

### 6.3 Setup SSL (PENTING!)

1. Buka **SSL/TLS Status** di cPanel
2. Enable AutoSSL atau install Let's Encrypt
3. Pastikan domain/subdomain kamu sudah ada SSL certificate ✅

---

## 🔐 Langkah 7: Setup Admin User Pertama

### 7.1 Buat Admin via SSH

```bash
# Login ke SSH dan navigate ke aplikasi
cd ~/applications/talitali

# Activate Node.js environment
source /home/username/nodevenv/applications/talitali/18/bin/activate

# Create admin user
node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function createAdmin() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const user = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@talitali.co.id',
      password: hashedPassword,
      role: 'ADMIN'
    }
  });
  console.log('Admin created:', user.email);
}

createAdmin().then(() => prisma.\$disconnect());
"
```

**Login pertama kali:**
- Email: `admin@talitali.co.id`
- Password: `admin123`

⚠️ **PENTING:** Segera ganti password setelah login pertama!

---

## 📊 Langkah 8: Seed Initial Data (Optional)

Jika ingin mengisi data homepage default:

```bash
# Seed custom fields
node seed_hero_fields.cjs
node seed_benefit_fields.cjs
node seed_features_pricing.cjs
node seed_feature_defaults.cjs

# Seed settings
node seed_settings.cjs
```

---

## ✅ Verifikasi Deployment

### Checklist:

- [ ] Website bisa diakses via browser
- [ ] SSL/HTTPS aktif (gembok hijau)
- [ ] Login admin berhasil di `/admin/login`
- [ ] Dashboard admin tampil normal
- [ ] Bisa buat dan edit post/page
- [ ] Homepage menampilkan konten dengan benar
- [ ] Blog listing berfungsi
- [ ] Single post page tampil dengan sidebar
- [ ] Upload image berfungsi
- [ ] Custom fields bisa diedit

---

## 🐛 Troubleshooting

### Error: "Cannot find module '@prisma/client'"

**Solusi:**
```bash
cd ~/applications/talitali
source /home/username/nodevenv/applications/talitali/18/bin/activate
npx prisma generate
```

### Error: Database Connection Failed

**Solusi:**
1. Cek file `.env` → pastikan `DATABASE_URL` benar
2. Cek MySQL user privileges
3. Test koneksi database:
```bash
mysql -u username_talitali_user -p -h localhost username_talitali
```

### Error: 502 Bad Gateway / App Not Running

**Solusi:**
1. Cek log error di `~/applications/talitali/logs/`
2. Restart Node.js App dari cPanel
3. Pastikan port tidak konflik
4. Cek apakah memory cukup: `free -h`

### Error: Permission Denied

**Solusi:**
```bash
# Fix folder permissions
chmod 755 ~/applications/talitali
chmod -R 755 ~/applications/talitali/.output
chmod 600 ~/applications/talitali/.env

# Fix cache directory
mkdir -p ~/applications/talitali/.cache
chmod 755 ~/applications/talitali/.cache
```

### Website Lambat / High Memory Usage

**Solusi:**
1. Enable caching di Nuxt config
2. Optimize gambar (compress sebelum upload)
3. Gunakan CDN untuk static assets
4. Upgrade hosting plan jika perlu

---

## 🔄 Update Aplikasi (Future Deployment)

Jika ada update di kode:

```bash
# 1. Di local, build ulang
npm run build

# 2. Compress .output folder
cd .output
zip -r output-update.zip .

# 3. Upload ke server dan extract
# (via File Manager atau SCP)

# 4. SSH ke server
cd ~/applications/talitali
source /home/username/nodevenv/applications/talitali/18/bin/activate

# 5. Install dependencies baru (jika ada)
npm ci --production

# 6. Regenerate Prisma (jika ada perubahan schema)
npx prisma generate
npx prisma migrate deploy

# 7. Restart app dari cPanel
```

---

## 📞 Support & Resources

### Dokumentasi:
- [Nuxt 3 Deployment](https://nuxt.com/docs/getting-started/deployment)
- [Prisma Production Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization/deployment)
- [cPanel Node.js Docs](https://docs.cpanel.net/whm/software/application-manager/)

### Tips Performa:

1. **Enable Compression** di `.htaccess`:
```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>
```

2. **Cache Headers** untuk static assets:
```apache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

3. **PM2 for Process Management** (jika SSH unlimited):
```bash
npm install -g pm2
pm2 start .output/server/index.mjs --name talitali
pm2 save
pm2 startup
```

---

## 🎉 Selesai!

Selamat! Website Talitali CMS kamu sekarang sudah live di production! 🚀

Jangan lupa:
- ✅ Ganti password admin default
- ✅ Setup backup otomatis database
- ✅ Monitor uptime dan performa
- ✅ Update konten homepage via admin panel

**Happy Deploying!** 🎊
