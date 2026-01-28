# Panduan Push ke GitHub - COPY PASTE COMMAND INI

# 1. Initialize Git
git init

# 2. Add all files
git add .

# 3. Commit
git commit -m "Initial commit - Talitali CMS"

# 4. Add remote (GANTI USERNAME dengan username GitHub kamu!)
git remote add origin https://github.com/USERNAME/talitali-cms.git

# 5. Push ke GitHub
git branch -M main
git push -u origin main

# Nanti akan minta login GitHub:
# - Masukkan username GitHub kamu
# - Password: Pakai Personal Access Token (bukan password biasa)

# Token bisa dibuat di: https://github.com/settings/tokens
# Permission yang dibutuhkan: "repo" (full control)
