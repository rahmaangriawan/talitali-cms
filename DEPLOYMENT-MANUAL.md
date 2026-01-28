# 🚀 Deploy Talitali CMS ke cPanel (Manual Setup)

Panduan deployment untuk cPanel yang support Node.js tapi **tidak memiliki Node.js App Manager interface**. Deployment dilakukan secara manual via SSH dengan PM2.

**Domain:** https://talitali.co.id

---

## 📋 Prerequisites

- ✅ **cPanel Hosting** dengan SSH access
- ✅ **Node.js** terinstall (cek dengan `node -v`)
- ✅ **MySQL/MariaDB** database
- ✅ **Port khusus** untuk aplikasi (biasanya disediakan oleh hosting)
- ✅ **SSL Certificate** (Let's Encrypt sudah OK)

---

## 🛠️ LANGKAH 1: Build Aplikasi di Lokal

### 1.1 Persiapan Build

```bash
# Di komputer lokal (Windows)
cd d:\filament\talitali

# Install dependencies
npm install

# Build untuk production
npm run build
```

Setelah build selesai, kamu akan punya folder `.output/` yang berisi aplikasi production-ready.

### 1.2 Buat Package untuk Upload

```bash
# Buat folder packaging
mkdir deploy
cd deploy

# Copy file yang diperlukan
xcopy /E /I ..\.output .output
copy ..\package.json .
copy ..\package-lock.json .
xcopy /E /I ..\prisma prisma
copy ..\.env.example .env

# Compress semua jadi ZIP (bisa pakai WinRAR/7zip)
# Nama file: talitali-production.zip
```

**File yang HARUS ada di ZIP:**
- `.output/` (hasil build)
- `package.json`
- `package-lock.json` 
- `prisma/` (schema)
- `.env` (akan di-edit nanti)

---

## 🗄️ LANGKAH 2: Setup Database MySQL

### 2.1 Buat Database di cPanel

1. Login ke cPanel **talitali.co.id/cpanel**
2. Buka **MySQL Databases**
3. Buat database baru:
   - **Database Name:** `talidb` (akan jadi `username_talidb`)
4. Buat user baru:
   - **Username:** `taliuser`
   - **Password:** buat password kuat (simpan baik-baik!)
5. **Add User to Database** dan beri **ALL PRIVILEGES**
6. Catat info ini:
   ```
   Database: [username]_talidb
   User: [username]_taliuser
   Password: [password yang kamu buat]
   Host: localhost
   ```

### 2.2 Import Database Schema

**Via phpMyAdmin:**
1. Buka **phpMyAdmin** di cPanel
2. Pilih database `[username]_talidb`
3. Klik tab **SQL**
4. Copy-paste isi file `prisma/schema.sql` atau jalankan:
   ```sql
   -- Database akan otomatis dibuat via Prisma migrate nanti
   ```

---

## 📦 LANGKAH 3: Upload File ke Server

### 3.1 Upload via File Manager

1. Login ke **cPanel** → **File Manager**
2. Navigate ke **home directory** (`/home/username/`)
3. Buat folder baru: `nodejs-apps`
4. Masuk ke folder `nodejs-apps`
5. Upload `talitali-production.zip`
6. **Extract** file zip → pilih folder `talitali`
7. Hapus file zip setelah extract

**Struktur folder final:**
```
/home/username/nodejs-apps/talitali/
├── .output/
├── prisma/
├── package.json
├── package-lock.json
└── .env
```

---

## ⚙️ LANGKAH 4: Configure Environment (.env)

### 4.1 Edit File .env via File Manager

1. Buka **File Manager** → navigate ke `/home/username/nodejs-apps/talitali/`
2. Klik kanan `.env` → **Edit**
3. Paste konfigurasi berikut:

```env
# Database - SESUAIKAN DENGAN INFO DATABASE KAMU
DATABASE_URL="mysql://username_taliuser:PASSWORD_KAMU@localhost:3306/username_talidb"

# Auth Secret - GENERATE RANDOM STRING 32+ KARAKTER
AUTH_SECRET="ganti-dengan-random-string-minimal-32-karakter-panjang"
AUTH_ORIGIN="https://talitali.co.id"

# Base URL
BASE_URL="https://talitali.co.id"

# Cache Directory
CACHE_DIR="/home/username/nodejs-apps/talitali/.cache"

# Port - PENTING! Tanyakan ke hosting provider port berapa yang available
PORT=3000

# Site Info (optional)
SITE_TITLE="Talitali.co.id"
SITE_DESCRIPTION="Jasa Pembuatan Tali Lanyard Custom"
```

### 4.2 Generate AUTH_SECRET

**Cara 1: Via SSH**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Cara 2: Via Online Generator**
https://generate-secret.vercel.app/32

Copy hasilnya dan paste ke `AUTH_SECRET` di file `.env`.

---

## 🚀 LANGKAH 5: Setup via SSH

### 5.1 Login ke SSH

```bash
# Dari komputer lokal
ssh username@talitali.co.id

# Atau gunakan SSH Terminal di cPanel
```

### 5.2 Check Node.js & NPM

```bash
# Cek versi Node.js
node -v
# Harus minimal v18.x atau v20.x

# Cek npm
npm -v

# Cek dimana Node.js terinstall
which node
```

**Jika Node.js belum ada atau versi lama:**
```bash
# Install Node.js via NVM (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
```

### 5.3 Navigate ke Aplikasi & Install Dependencies

```bash
# Pindah ke folder aplikasi
cd ~/nodejs-apps/talitali

# Install production dependencies
npm ci --production

# Generate Prisma Client
npx prisma generate

# Run database migration (buat tables)
npx prisma migrate deploy
```

### 5.4 Install PM2 (Process Manager)

```bash
# Install PM2 globally
npm install -g pm2

# Verifikasi instalasi
pm2 -v
```

### 5.5 Buat File Startup PM2

Buat file `ecosystem.config.js` di folder aplikasi:

```bash
nano ecosystem.config.js
```

Paste konfigurasi ini:

```javascript
module.exports = {
  apps: [{
    name: 'talitali',
    script: './.output/server/index.mjs',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000, // Sesuaikan dengan port yang disediakan hosting
      HOST: '0.0.0.0'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
}
```

**Save file:** Tekan `Ctrl+X`, lalu `Y`, lalu `Enter`

### 5.6 Buat Folder Logs

```bash
mkdir -p ~/nodejs-apps/talitali/logs
mkdir -p ~/nodejs-apps/talitali/.cache
chmod 755 ~/nodejs-apps/talitali/.cache
```

### 5.7 Start Aplikasi dengan PM2

```bash
# Start aplikasi
pm2 start ecosystem.config.js

# Cek status
pm2 status

# Lihat logs real-time
pm2 logs talitali

# Save PM2 process list (auto-restart on reboot)
pm2 save

# Setup PM2 startup script
pm2 startup
# Copy-paste command yang muncul dan jalankan
```

### 5.8 Test Aplikasi Berjalan

```bash
# Cek apakah aplikasi listening di port
curl http://localhost:3000

# Jika muncul HTML response, berarti aplikasi jalan! ✅
```

---

## 🌐 LANGKAH 6: Configure Reverse Proxy (Apache)

Karena aplikasi Node.js berjalan di port internal (contoh: 3000), kamu perlu setup **reverse proxy** agar bisa diakses via domain `talitali.co.id`.

### 6.1 Buat/Edit .htaccess di Public Root

```bash
# Via SSH
cd ~/public_html
nano .htaccess
```

**Atau via File Manager cPanel:**
1. Navigate ke `/home/username/public_html/`
2. Edit atau buat file `.htaccess`

### 6.2 Konfigurasi .htaccess

Paste konfigurasi ini:

```apache
# Enable Rewrite Engine
RewriteEngine On

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Proxy requests to Node.js app
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]

# Setup Proxy
<IfModule mod_proxy.c>
    ProxyPreserveHost On
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
</IfModule>
```

**⚠️ CATATAN PENTING:**
- Ganti `3000` dengan port yang kamu gunakan di `ecosystem.config.js`
- Jika hosting tidak support `mod_proxy`, minta ke support hosting untuk enable

**Save file** dan tutup editor.

---

## 🔐 LANGKAH 7: Setup SSL Certificate

### 7.1 Install Let's Encrypt SSL

1. Login ke **cPanel**
2. Cari **SSL/TLS Status**
3. Centang domain **talitali.co.id**
4. Klik **Run AutoSSL**
5. Tunggu proses selesai (biasanya 1-2 menit)

### 7.2 Verifikasi SSL

Buka browser dan akses:
```
https://talitali.co.id
```

Pastikan ada **gembok hijau** di address bar ✅

---

## 👤 LANGKAH 8: Create Admin User

### 8.1 Seed Admin User via SSH

```bash
# Masih di SSH, navigate ke folder aplikasi
cd ~/nodejs-apps/talitali

# Create admin user
node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const user = await prisma.user.create({
      data: {
        name: 'Admin Talitali',
        email: 'admin@talitali.co.id',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });
    console.log('✅ Admin created:', user.email);
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.\$disconnect();
  }
}

createAdmin();
"
```

**Login ke Admin:**
- URL: https://talitali.co.id/admin/login
- Email: `admin@talitali.co.id`
- Password: `admin123`

⚠️ **PENTING:** Ganti password setelah login pertama!

### 8.2 Seed Initial Data (Optional)

```bash
# Jalankan seeder untuk data homepage
node seed_hero_fields.cjs
node seed_benefit_fields.cjs
node seed_features_pricing.cjs
node seed_feature_defaults.cjs
```

---

## ✅ LANGKAH 9: Verifikasi Deployment

### Checklist Final:

- [ ] Website bisa diakses: https://talitali.co.id ✅
- [ ] SSL/HTTPS aktif (gembok hijau) ✅
- [ ] Homepage loading dengan benar ✅
- [ ] Admin login berhasil: https://talitali.co.id/admin/login ✅
- [ ] Dashboard admin tampil ✅
- [ ] Bisa create/edit pages & posts ✅
- [ ] Blog page berfungsi: https://talitali.co.id/blog ✅
- [ ] Single post dengan sidebar tampil ✅
- [ ] Upload image berfungsi ✅
- [ ] PM2 status running: `pm2 status` ✅

---

## 🔄 Command PM2 yang Berguna

```bash
# Lihat status aplikasi
pm2 status

# Restart aplikasi
pm2 restart talitali

# Stop aplikasi
pm2 stop talitali

# Lihat logs real-time
pm2 logs talitali

# Lihat logs error saja
pm2 logs talitali --err

# Clear logs
pm2 flush

# Monitoring CPU & Memory
pm2 monit

# Info detail aplikasi
pm2 info talitali

# Hapus aplikasi dari PM2
pm2 delete talitali
```

---

## 🐛 Troubleshooting

### 1. Error: "Cannot find module '@prisma/client'"

**Solusi:**
```bash
cd ~/nodejs-apps/talitali
npx prisma generate
pm2 restart talitali
```

### 2. Error: Database Connection Failed

**Cek `.env` file:**
```bash
cd ~/nodejs-apps/talitali
cat .env | grep DATABASE_URL
```

**Test koneksi database:**
```bash
mysql -u username_taliuser -p -h localhost username_talidb
# Masukkan password, jika berhasil berarti database OK
```

### 3. Website Tidak Bisa Diakses (502 Bad Gateway)

**Debugging:**
```bash
# Cek PM2 status
pm2 status
# Pastikan status "online"

# Cek logs error
pm2 logs talitali --err --lines 50

# Cek apakah port listening
netstat -tulpn | grep :3000

# Restart aplikasi
pm2 restart talitali
```

### 4. Error: mod_proxy tidak available

Jika `.htaccess` tidak work karena `mod_proxy` tidak enabled:

**Solusi 1: Minta hosting enable mod_proxy**
- Hubungi support hosting
- Minta enable `mod_proxy` dan `mod_proxy_http`

**Solusi 2: Gunakan subdomain khusus**
- Setup subdomain `app.talitali.co.id`
- Point langsung ke port aplikasi
- Tidak perlu reverse proxy

### 5. PM2 Tidak Auto-Start Setelah Server Reboot

```bash
# Generate startup script
pm2 startup

# Copy command yang muncul dan jalankan
# Contoh output:
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u username --hp /home/username

# Save PM2 list
pm2 save
```

### 6. Error: Permission Denied

```bash
# Fix permissions
chmod 755 ~/nodejs-apps/talitali
chmod -R 755 ~/nodejs-apps/talitali/.output
chmod 600 ~/nodejs-apps/talitali/.env
chmod 755 ~/nodejs-apps/talitali/.cache
```

### 7. Port 3000 Sudah Dipakai

**Cek port yang available:**
```bash
netstat -tulpn | grep LISTEN
```

**Ganti port di 2 tempat:**
1. File `.env`:
   ```env
   PORT=3001
   ```

2. File `ecosystem.config.js`:
   ```javascript
   env: {
     PORT: 3001
   }
   ```

3. File `.htaccess`:
   ```apache
   RewriteRule ^(.*)$ http://localhost:3001/$1 [P,L]
   ProxyPass / http://localhost:3001/
   ProxyPassReverse / http://localhost:3001/
   ```

4. Restart PM2:
   ```bash
   pm2 restart talitali
   ```

---

## 📈 Optimasi Performa

### 1. Enable Gzip Compression

Tambahkan di `.htaccess`:
```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css
  AddOutputFilterByType DEFLATE text/javascript application/javascript application/x-javascript
  AddOutputFilterByType DEFLATE application/json application/xml
</IfModule>
```

### 2. Browser Caching

Tambahkan di `.htaccess`:
```apache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType application/font-woff2 "access plus 1 year"
</IfModule>
```

### 3. Increase PM2 Instances (Jika RAM Cukup)

Edit `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'talitali',
    script: './.output/server/index.mjs',
    instances: 2, // Ganti dari 1 jadi 2
    exec_mode: 'cluster', // Ganti dari 'fork' jadi 'cluster'
    // ... sisa config
  }]
}
```

Restart:
```bash
pm2 reload ecosystem.config.js
```

---

## 🔄 Update Aplikasi (Deployment Berikutnya)

Jika ada perubahan kode di masa depan:

### 1. Build di Lokal

```bash
# Di komputer lokal
cd d:\filament\talitali
npm install
npm run build

# Compress .output folder jadi zip
# Nama: talitali-update.zip
```

### 2. Upload ke Server

1. Login cPanel → File Manager
2. Navigate ke `/home/username/nodejs-apps/talitali/`
3. Upload `talitali-update.zip`
4. **Backup folder .output lama** (rename jadi .output-backup)
5. Extract `talitali-update.zip`

### 3. Update via SSH

```bash
# Login SSH
ssh username@talitali.co.id

# Navigate ke aplikasi
cd ~/nodejs-apps/talitali

# Install dependencies baru (jika ada)
npm ci --production

# Regenerate Prisma (jika ada perubahan schema)
npx prisma generate
npx prisma migrate deploy

# Restart aplikasi
pm2 restart talitali

# Monitor logs
pm2 logs talitali
```

---

## 📊 Monitoring & Maintenance

### Daily Check:

```bash
# Cek status aplikasi
pm2 status

# Lihat memory usage
pm2 monit

# Cek disk space
df -h

# Lihat recent logs
pm2 logs talitali --lines 20
```

### Weekly Backup:

```bash
# Backup database
mysqldump -u username_taliuser -p username_talidb > ~/backups/talitali-$(date +%Y%m%d).sql

# Backup .env & uploads
tar -czf ~/backups/talitali-files-$(date +%Y%m%d).tar.gz ~/nodejs-apps/talitali/.env ~/nodejs-apps/talitali/.cache
```

---

## 🎉 Deployment Selesai!

Website **Talitali.co.id** sekarang sudah **LIVE** di production! 🚀

### Akses:
- **Website:** https://talitali.co.id
- **Admin:** https://talitali.co.id/admin/login
- **Blog:** https://talitali.co.id/blog

### Next Steps:
1. ✅ Login admin dan ganti password
2. ✅ Upload logo di settings
3. ✅ Customise homepage via custom fields
4. ✅ Buat post pertama
5. ✅ Setup Google Analytics (optional)
6. ✅ Setup backup otomatis

**Selamat! Website sudah siap digunakan!** 🎊✨
