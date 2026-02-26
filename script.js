async function cariData(){

const namaInput = document.getElementById("nama").value;

if(!namaInput){
    alert("Masukkan nama terlebih dahulu!");
    return;
}

const url = "https://script.google.com/macros/s/AKfycbxr0X97Fzm5RnRZAusJ1WiCqXC-Oi2ruU5nW1_QI9wrcdqBwJAnoxQg5nG_DPK1vU-pnw/exec?nama=" + encodeURIComponent(namaInput);

const response = await fetch(url);
const text = await response.text();

if(text === "Not Found"){
    alert("Nama tidak ditemukan!");
    return;
}

const data = JSON.parse(text);
generatePDF(data);
}

function generatePDF(data){

const { jsPDF } = window.jspdf;
const doc = new jsPDF("landscape");

// Background
doc.addImage("background.jpg", "JPEG", 0, 0, 297, 210);

// Logo
doc.addImage("logo-smk.png", "PNG", 135, 20, 30, 30);

// Header
doc.setFont("times","bold");
doc.setFontSize(28);
doc.text("SERTIFIKAT PENGHARGAAN", 148, 60, null, null, "center");

doc.setFontSize(18);
doc.text("Kegiatan E-Karomah", 148, 75, null, null, "center");
doc.text("SMK Negeri Bojonggambir", 148, 85, null, null, "center");
doc.text("1447 H / 2026 M", 148, 95, null, null, "center");

// Nama
doc.setFontSize(24);
doc.text(data.nama, 148, 115, null, null, "center");

// Nilai
doc.setFontSize(16);
doc.text("Kedisiplinan : " + data.kedisiplinan, 70, 135);
doc.text("Kelengkapan : " + data.kelengkapan, 70, 145);
doc.text("Ibadah : " + data.ibadah, 70, 155);
doc.text("Rata-rata : " + data.rata, 70, 165);
doc.text("Predikat : " + data.predikat, 70, 175);

// Nomor Sertifikat
doc.setFontSize(12);
doc.text("Nomor: " + data.nomor, 20, 20);

// TTD Ketua
doc.addImage("ttd-ketua.png", "PNG", 60, 170, 40, 20);
doc.text("Ali Maulana, S.Pd.", 60, 195);

// TTD Kepala Sekolah
doc.addImage("ttd-kepsek.png", "PNG", 200, 170, 40, 20);
doc.text("Iman Rahmat, S. Pd. I", 200, 195);

// QR Verifikasi
const verifikasiURL = "https://smknbojonggambir.github.io/Sertifikat-E-Karomah-1447-H/verifikasi.html?nomor=" + data.nomor;

const qrDiv = document.createElement("div");
new QRCode(qrDiv, {
    text: verifikasiURL,
    width:100,
    height:100
});

setTimeout(()=>{
    const qrImg = qrDiv.querySelector("img").src;
    doc.addImage(qrImg, "PNG", 250, 20, 30, 30);
    doc.save("Sertifikat-"+data.nama+".pdf");
}, 500);

}
