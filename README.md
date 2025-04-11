
# 🎧 Welcome Discord Bot

Bu bot, belirli bir ses kanalına biri katıldığında arka planda müzik çalar ve bir yetkili çağırmak için mesaj gönderir.

---

## 🚀 Özellikler

- Belirlenen ses kanalına **üye girerse**:
  - 🎵 `ses.mp3` çalınır (arka planda).
  - 🚨 Yetkili rolü pinglenir.
  - ⏳ Şarkı bittiğinde kullanıcıya **DM** atılır ve **kanaldan çıkarılır**.
- Belirlenen ses kanalına **yetkili girerse**, bot sessizce çıkar.

---

## 🧰 Gereksinimler

- **Node.js v16+**
- **FFmpeg** kurulu olmalı (sistemsel)
- Discord Bot Token'ı (https://discord.com/developers/applications)

---

## 🛠 Kurulum

### 1️⃣ Bağımlılıkları yükle:

```bash
npm install discord.js @discordjs/voice
```

### 2️⃣ FFmpeg Kurulumu

#### ✅ Windows:

1. https://www.gyan.dev/ffmpeg/builds/ adresine git  
2. "Release full build" altından `.zip` dosyasını indir  
3. Zip'i çıkar, içinden `bin` klasörünü al  
4. `C:\ffmpeg\bin` içine yapıştır  
5. Ardından **Ortam Değişkenleri (Environment Variables)**'a şunu ekle:
   - Yeni sistem değişkeni:  
     - Adı: `Path`
     - Değeri: `C:\ffmpeg\bin`

👉 CMD'yi yeniden başlat ve `ffmpeg -version` yaz. Çalışıyorsa tamamdır!

#### ✅ macOS:

```bash
brew install ffmpeg
```

#### ✅ Ubuntu / Debian:

```bash
sudo apt update
sudo apt install ffmpeg
```

---

## ⚙️ Yapılandırma (config.json)

Tüm ayarlar `config.json` içindedir:

```json
{
  "TOKEN": "BOT_TOKENINIZ",
  "MP3_NAME": "ses.mp3",
  "LOG_CHANNEL_ID": "MESAJ_ATILACAK_LOG_KANAL_ID",
  "MOD_ROLE_ID": "PING_ATILACAK_YETKILI_ROL_ID",
  "TARGET_VOICE_CHANNEL_IDS": ["HEDEF_SES_KANAL_ID"]
}
```

---

## ▶️ Başlatma

```bash
node index.js
```

---

## ❗ Notlar

- Bu bot `@discordjs/voice` kullanır.  
- **Bot rolünün "Ses Kanallarını Yönet" yetkisi** olması zorunludur.  
- `ses.mp3` bot dizininde olmalı.  
- FFmpeg çalışmazsa bot ses çalamaz.

---

## 💡 Geliştirici

📁 GitHub: [SadnesssOfficall](https://github.com/sadnesssofficall)  
✨ Proje katkılarına açık!
