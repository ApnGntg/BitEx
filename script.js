document.addEventListener('DOMContentLoaded', () => {
    // 1. Inisialisasi Fabric.js di elemen canvas kita
    const canvas = new fabric.Canvas('twibbon-canvas', {
        width: 500,
        height: 500,
        backgroundColor: null
    });

    // 2. Tentukan nama file bingkai Anda
    const BINGKAI_URL = 'bingkai.png'; 

    // 3. Ambil elemen tombol dari HTML
    const uploadInput = document.getElementById('upload-foto');
    const downloadButton = document.getElementById('download-btn');
    let userPhoto = null; 

    // Fungsi untuk memuat BINGKAI di atas canvas
    function muatBingkai() {
        fabric.Image.fromURL(BINGKAI_URL, (img) => {
            img.scaleToWidth(canvas.width);
            img.scaleToHeight(canvas.height);
            canvas.setOverlayImage(img, canvas.renderAll.bind(canvas), {
                originX: 'left',
                originY: 'top'
            });
        }, { crossOrigin: 'anonymous' });
    }

    muatBingkai();

    // Fungsi yang dipanggil saat pengguna MEMILIH FOTO
    function handleFotoUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();

        reader.onload = (event) => {
            const dataUrl = event.target.result;
            fabric.Image.fromURL(dataUrl, (img) => {
                if (userPhoto) {
                    canvas.remove(userPhoto);
                }
                
                // Atur skala agar foto memenuhi canvas (zoom in)
                const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
                img.scale(scale);
                
                // Posisikan di tengah
                img.set({
                    originX: 'center',
                    originY: 'center',
                    left: canvas.width / 2,
                    top: canvas.height / 2,
                    selectable: true,
                    evented: true,
                    hasControls: false, 
                    hasBorders: false,
                    transparentCorners: true,
                    cornerSize: 10,
                    cornerColor: '#007aff',
                    cornerStyle: 'circle'
                });

                // Mengaktifkan kontrol putar dan skala (hanya sudut)
                img.setControlsVisibility({
                    mt: false, mb: false, ml: false, mr: false, // Sembunyikan kontrol pengubah ukuran sisi
                });

                canvas.add(img);
                canvas.sendToBack(img); // Kirim ke belakang bingkai
                userPhoto = img;
                canvas.setActiveObject(img); // Langsung aktifkan foto
                canvas.renderAll();
            });
        };

        reader.readAsDataURL(file);
    }

    // Fungsi yang dipanggil saat tombol DOWNLOAD diklik
    function handleDownload() {
        canvas.discardActiveObject();
        canvas.renderAll();
        const link = document.createElement('a');
        link.download = 'twibbon-hasil.png';
        link.href = canvas.toDataURL({
            format: 'png',
            quality: 1.0
        });
        link.click();
    }

    // --- SAMBUNGKAN FUNGSI KE TOMBOL ---
    uploadInput.addEventListener('change', handleFotoUpload);
    downloadButton.addEventListener('click', handleDownload);
});
