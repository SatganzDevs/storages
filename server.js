const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs')
const Swal = require('sweetalert2');
const audioFolderPath = './audio';

// Mengatur folder penyimpanan file audio yang diunggah
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'audio/');
  },
  filename: function (req, file, cb) {
    const uniqueFilename = uuidv4();
    cb(null, uniqueFilename + path.extname(file.originalname));
  }
});

const upload = multer({ storage });
app.get('/bg', function (req, res) {
 res.sendFile(path.join(__dirname, 'templates/images/bg.jpg'));
})
// Endpoint untuk mendapatkan suara acak dalam format JSON
app.get('/api/random-sound', function (req, res) {
  // Baca file MP3 dari folder audio
  fs.readdir('audio/', (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read audio files.' });
    }

    // Ambil nama file acak dari daftar file MP3 yang ada
    const randomIndex = Math.floor(Math.random() * files.length);
    const randomFileName = files[randomIndex];

    // Buat URL untuk file acak tersebut
    const randomSoundUrl = `https://satganz.cyclic.app/audio/${randomFileName}`;

    res.json({ status: 200,
              creator: 'SatganzDevs',
              url: randomSoundUrl });
  });
});

app.get('/app/random-sound', function (req, res) {
  // Baca file MP3 dari folder audio
  fs.readdir('audio/', (err, files) => {
    if (err) {
      return res.status(500).send('Failed to read audio files.');
    }

    // Ambil nama file acak dari daftar file MP3 yang ada
    const randomIndex = Math.floor(Math.random() * files.length);
    const randomFileName = files[randomIndex];

    // Buat path untuk file acak tersebut
    const randomSoundPath = `audio/${randomFileName}`;

    // Kirim file langsung ke client
    res.sendFile(randomSoundPath, { root: '.' });
  });
});

// Serve static files from the 'audio' folder
app.use('/audio', express.static(path.join(__dirname, 'audio')));

// Endpoint to upload audio file
app.post('/api/upload', upload.single('audio'), function (req, res) {
  res.json({ message: 'Audio file uploaded successfully.' });
});



// Endpoint untuk mendapatkan halaman upload musik
app.get('/upload', function (req, res) {
  res.sendFile(path.join(__dirname, 'templates/upload.html'));
});

app.get('/api/audio-count', function(req, res) {
  fs.readdir("./audio", (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading audio folder.' });
    }
    const audioCount = files.length;
    res.json({ count: audioCount });
  });
});


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'templates/index.html'));
});


app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
