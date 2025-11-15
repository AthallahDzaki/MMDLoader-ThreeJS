# MMDLoader-ThreeJS

Sebuah proyek web interaktif untuk menampilkan dan menganimasikan model MMD (MikuMikuDance) menggunakan Three.js dengan efek fisika yang realistis.

## 🎭 Tentang Proyek

MMDLoader-ThreeJS adalah aplikasi web yang memungkinkan pengguna untuk memvisualisasikan model MMD dengan animasi dan musik. Proyek ini menggunakan Three.js dan MMDLoader untuk merender model 3D PMD/PMX dengan animasi VMD secara real-time di browser.

## ✨ Fitur

- 🎨 **Rendering Model MMD**: Mendukung format PMD dan PMX
- 💃 **Animasi VMD**: Memutar animasi dengan sinkronisasi musik
- 📷 **Kontrol Kamera**: Opsi untuk menggunakan animasi kamera atau kontrol manual
- 🎮 **Interaktif**: Orbit controls untuk memutar dan memperbesar/memperkecil tampilan
- 📱 **Responsif**: Mendukung desktop dan perangkat mobile
- 🎭 **Custom Model**: Kemampuan untuk mengunggah model dan animasi kustom
- ⚡ **Fisika Realistis**: Menggunakan Ammo.js untuk simulasi fisika

## 🎭 Model yang Tersedia

Semua model yang disertakan dalam proyek ini bersifat **Open Source**:

1. **CJ** - Model karakter dari GTA San Andreas
2. **Hatsune Miku** - Vocaloid populer dengan model v2
3. **Gumi** - Vocaloid dengan kostum alternatif

## 💃 Animasi yang Tersedia

1. **Kewer-Kewer Dance** - Animasi dance energik
2. **Yoasobi Dance** - Animasi dance untuk lagu Yoasobi (2 versi tersedia)
3. **Heavy Rotation** - Animasi dance untuk lagu AKB48

## 🚀 Cara Menggunakan

### Langsung di Browser

1. Buka `index.html` di browser modern (Chrome, Firefox, Edge, atau Safari)
2. Pilih model yang ingin ditampilkan
3. Pilih animasi yang diinginkan
4. Centang "Enable Camera" jika ingin menggunakan animasi kamera (tersedia untuk beberapa animasi)
5. Klik tombol "Play" untuk memulai

### Menjalankan dengan Local Server

Untuk menghindari masalah CORS, disarankan untuk menjalankan dengan local server:

```bash
# Menggunakan Python 3
python -m http.server 8000

# Atau menggunakan Python 2
python -m SimpleHTTPServer 8000

# Atau menggunakan Node.js http-server
npx http-server -p 8000
```

Kemudian buka browser dan akses `http://localhost:8000`

## 📤 Menggunakan Model Kustom

1. Pilih "Custom" dari dropdown model
2. Klik tombol "Upload Your Model"
3. Pilih file model (.pmx atau .pmd) beserta file tekstur yang diperlukan
4. Pilih animasi yang diinginkan
5. Klik "Play"

## 🛠️ Teknologi yang Digunakan

- **Three.js** v0.167.0 - Library 3D untuk rendering
- **MMDLoader** - Loader untuk model dan animasi MMD
- **Ammo.js** - Physics engine untuk simulasi fisika
- **OrbitControls** - Kontrol kamera interaktif
- **OutlineEffect** - Efek outline untuk tampilan cel-shaded

## 📁 Struktur Proyek

```
MMDLoader-ThreeJS/
├── index.html              # File HTML utama
├── main.css               # Stylesheet
├── js/
│   ├── index.js           # Logika aplikasi utama
│   ├── ammo.wasm.js       # Physics engine
│   └── ammo.wasm.wasm     # Physics engine WebAssembly
└── model/
    ├── char_model/        # Folder model karakter
    │   ├── cj/           # Model CJ
    │   ├── miku/         # Model Hatsune Miku
    │   └── gumi/         # Model Gumi
    ├── mmd/
    │   ├── animations/   # File animasi VMD
    │   ├── audios/       # File audio
    │   └── camera/       # File animasi kamera
    └── stage/            # Model stage/panggung
```

## 🎨 Kontrol

- **Mouse Kiri + Drag**: Putar kamera
- **Mouse Kanan + Drag**: Pan kamera
- **Scroll Mouse**: Zoom in/out
- **Touch (Mobile)**: Swipe untuk putar, pinch untuk zoom

## ⚙️ Persyaratan Sistem

- Browser modern dengan dukungan WebGL
- Koneksi internet untuk memuat Three.js dari CDN
- Minimal 2GB RAM untuk performa optimal
- GPU yang mendukung WebGL untuk rendering yang lebih baik

## 📝 Lisensi

Proyek ini dilisensikan di bawah MIT License - lihat file [LICENSE](LICENSE) untuk detail lebih lanjut.

## 🙏 Credits & Acknowledgments

- **Three.js** - https://threejs.org/
- **MMD (MikuMikuDance)** - Untuk format model dan animasi
- **Model Open Source**: Semua model yang digunakan dalam proyek ini bersifat open source dan bebas digunakan
- Animasi dan musik - Kredit kepada pembuat konten original

## 🐛 Known Issues

- Performa mungkin lebih rendah pada perangkat mobile dengan kamera aktif
- Beberapa model kustom mungkin memerlukan penyesuaian path tekstur

## 💡 Tips

- Untuk performa terbaik, nonaktifkan "Enable Camera" pada perangkat mobile
- Pastikan semua file tekstur model kustom diunggah bersamaan dengan file model
- Gunakan browser dengan akselerasi hardware untuk pengalaman terbaik

## 🤝 Kontribusi

Kontribusi selalu diterima! Silakan fork repository ini dan submit pull request untuk perbaikan atau fitur baru.

## 📧 Kontak

Athallah Dzaki - [GitHub](https://github.com/AthallahDzaki)

---

**Catatan**: Semua model yang disertakan dalam proyek ini bersifat **open source** dan gratis untuk digunakan sesuai dengan lisensi masing-masing.
