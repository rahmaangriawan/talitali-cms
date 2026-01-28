# ⚠️ Node.js Tidak Terinstall - Solusi

Jika `node -v` mengembalikan "command not found", berarti Node.js belum ada di server. Berikut beberapa solusi:

---

## 🔍 LANGKAH 0: Cek Node.js di cPanel

Sebelum install manual, cek dulu apakah cPanel kamu punya Node.js installer built-in:

### Opsi A: Cek di cPanel Interface

1. Login ke **cPanel**
2. Cari menu **"Software"** atau **"Select PHP Version"** 
3. Lihat apakah ada menu **"Setup Node.js App"** atau **"Node.js Selector"**

**Jika ADA:**
- Gunakan interface tersebut untuk install Node.js v20.x
- Skip ke dokumentasi utama (DEPLOYMENT-MANUAL.md)

**Jika TIDAK ADA:**
- Lanjut ke solusi manual di bawah

---

## 💡 SOLUSI 1: Install Node.js via NVM (Recommended)

NVM (Node Version Manager) adalah cara paling mudah install Node.js tanpa akses root.

### 1.1 Install NVM via SSH

```bash
# Login ke SSH
ssh username@talitali.co.id

# Download & Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Atau jika curl tidak ada, pakai wget:
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

### 1.2 Load NVM ke Shell

```bash
# Reload bash profile
source ~/.bashrc

# Atau jika pakai zsh:
source ~/.zshrc

# Verifikasi NVM terinstall
nvm --version
# Output: 0.39.7
```

### 1.3 Install Node.js via NVM

```bash
# List versi Node.js yang available
nvm list-remote

# Install Node.js LTS (v20.x)
nvm install 20

# Set sebagai default
nvm use 20
nvm alias default 20

# Verifikasi instalasi
node -v
# Output: v20.x.x

npm -v
# Output: 10.x.x
```

### 1.4 Permanent Setup (PENTING!)

Agar Node.js tetap available setiap kali login SSH:

```bash
# Edit .bashrc
nano ~/.bashrc

# Tambahkan di paling bawah file:
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Save: Ctrl+X, Y, Enter

# Reload
source ~/.bashrc
```

**Test:** Logout dari SSH, login lagi, ketik `node -v`. Harus muncul versi Node.js ✅

---

## 💡 SOLUSI 2: Hubungi Support Hosting

Jika NVM tidak bisa diinstall (error permission atau lainnya), hubungi **support hosting** kamu:

### Template Email/Ticket ke Support:

```
Subject: Request Install Node.js di Server

Halo Support,

Saya ingin deploy aplikasi Node.js di hosting saya untuk domain talitali.co.id.
Mohon bantuan untuk:

1. Install Node.js versi 20.x (LTS) atau minimal v18.x
2. Install NPM (Node Package Manager)
3. Enable mod_proxy dan mod_proxy_http di Apache
4. Informasi port yang available untuk aplikasi Node.js

Terima kasih!
```

**Biasanya support akan:**
- Install Node.js untuk kamu
- Kasih tau port yang bisa kamu pakai
- Enable module Apache yang dibutuhkan

---

## 💡 SOLUSI 3: Alternative Deployment (Jika Node.js Tidak Bisa)

Jika hosting benar-benar tidak support Node.js dan tidak bisa install:

### Opsi A: Deploy ke Hosting Lain yang Support Node.js

**Hosting Recommended untuk Node.js:**
- **Niagahoster** (VPS/Cloud - support Node.js)
- **Hostinger** (VPS - full control)
- **DigitalOcean** (VPS/Droplet - $6/bulan)
- **Railway.app** (PaaS - free tier available)
- **Vercel** (Serverless - free untuk project seperti ini)
- **Netlify** (JAMstack - dengan Netlify Functions untuk backend)

### Opsi B: Hybrid Deployment

1. **Frontend (SSG)** → Deploy ke cPanel biasa
   - Generate static HTML via `nuxt generate`
   - Upload hasil build ke `public_html`
   - Tidak perlu Node.js

2. **Backend (API)** → Deploy ke platform lain
   - Deploy API endpoints ke Railway/Vercel
   - Update `BASE_URL` di frontend ke URL API

**Catatan:** Opsi ini memerlukan refactoring aplikasi untuk pisah frontend & backend.

---

## 💡 SOLUSI 4: Deploy di Subdomain dengan Port Direct

Jika Node.js bisa diinstall tapi Apache reverse proxy tidak work:

### Setup Subdomain

1. **cPanel** → **Subdomains**
2. Buat subdomain: `app.talitali.co.id`
3. Document root: `/home/username/nodejs-apps/talitali/.output/public`

### Jalankan Aplikasi di Port Public

Edit `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'talitali',
    script: './.output/server/index.mjs',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 8080, // Port yang disediakan hosting
      HOST: '0.0.0.0'
    }
  }]
}
```

Akses aplikasi via: `http://app.talitali.co.id:8080`

**Kelemahan:** Port terlihat di URL, kurang profesional.

---

## 🔧 Troubleshooting Install NVM

### Error: "command not found: nvm" setelah install

**Solusi:**
```bash
# Check apakah NVM terinstall
ls -la ~/.nvm

# Jika folder ada, manual load NVM:
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Coba lagi
nvm --version
```

### Error: "Permission denied" saat install NVM

**Solusi:**
```bash
# Gunakan flag --no-use
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash --no-use

# Atau install ke custom directory
export NVM_DIR="$HOME/.local/nvm"
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

### Error: "curl: command not found"

**Solusi:** Pakai `wget` sebagai alternatif:
```bash
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

### Error: NVM install Node.js gagal (timeout/network)

**Solusi:** Install versi specific dengan retry:
```bash
# Retry install
nvm install 20 --reinstall-packages-from=current

# Atau install dari binary
NVM_NODEJS_ORG_MIRROR=https://nodejs.org/dist nvm install 20
```

---

## ✅ Verifikasi Node.js Berhasil Terinstall

Setelah install, test dengan:

```bash
# Cek Node.js
node -v
# Harus keluar: v20.x.x

# Cek NPM
npm -v
# Harus keluar: 10.x.x

# Test run simple script
node -e "console.log('Hello from Node.js!')"
# Harus keluar: Hello from Node.js!

# Cek path Node.js
which node
# Output: /home/username/.nvm/versions/node/v20.x.x/bin/node
```

Jika semua test di atas **PASSED ✅**, kamu bisa lanjut ke deployment utama di `DEPLOYMENT-MANUAL.md`!

---

## 📞 Rekomendasi

**Untuk kasus kamu:**

1. **PRIORITAS 1:** Coba install NVM (Solusi 1) - paling mudah
2. **PRIORITAS 2:** Hubungi support hosting (Solusi 2) - mereka yang handle
3. **PRIORITAS 3:** Consider pindah hosting jika benar-benar tidak support (Solusi 3)

**Estimasi waktu:**
- Install NVM: 5-10 menit
- Waiting support: 1-24 jam
- Pindah hosting: 1-2 hari

---

Kalau ada error atau butuh bantuan lebih lanjut, kabarin ya! 🚀
