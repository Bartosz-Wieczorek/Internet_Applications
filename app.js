const map = L.map('map').setView([52.23, 21.01], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap'
}).addTo(map);

let marker;
const GRID = 4;
let placed = 0;
const piecesDiv = document.getElementById('pieces');
const boardDiv = document.getElementById('board');
const statusEl = document.getElementById('status');

for (let i = 0; i < GRID * GRID; i++) {
    const cell = document.createElement('div');
    cell.className = 'target';
    cell.dataset.id = i;
    cell.addEventListener('dragover', e => e.preventDefault());
    cell.addEventListener('drop', dropPiece);
    boardDiv.appendChild(cell);
}

document.getElementById('permBtn').onclick = () => {
    if (navigator.geolocation) navigator.geolocation.getCurrentPosition(()=>{},()=>{});
    if ("Notification" in window) Notification.requestPermission();
    statusEl.textContent = "Status: pobrano zgody.";
};

document.getElementById('locBtn').onclick = () => {
    if (!navigator.geolocation) return alert("Brak geolokalizacji");
    navigator.geolocation.getCurrentPosition(pos => {
        const {latitude, longitude} = pos.coords;
        if (marker) map.removeLayer(marker);
        marker = L.marker([latitude, longitude]).addTo(map)
            .bindPopup(`Twoja lokalizacja:<br>${latitude.toFixed(5)}, ${longitude.toFixed(5)}`).openPopup();
        map.setView([latitude, longitude], 15);
        statusEl.textContent = "Status: pokazano lokalizację.";
    });
};

document.getElementById('mapBtn').onclick = async () => {
    statusEl.textContent = "Status: generowanie obrazu...";
    const canvas = await html2canvas(document.getElementById('map'), {useCORS:true});
    createPuzzle(canvas);
    statusEl.textContent = "Status: puzzle gotowe!";
};

function createPuzzle(canvas) {
    piecesDiv.innerHTML = "";
    placed = 0;
    const w = canvas.width / GRID;
    const h = canvas.height / GRID;
    const pieces = [];

    for (let r = 0; r < GRID; r++) {
        for (let c = 0; c < GRID; c++) {
            const off = document.createElement("canvas");
            off.width = w; off.height = h;
            off.getContext("2d").drawImage(canvas, c*w, r*h, w, h, 0, 0, w, h);
            pieces.push({id: r*GRID+c, img: off.toDataURL()});
        }
    }

    pieces.sort(() => Math.random() - 0.5);

    pieces.forEach(({id, img}) => {
        const el = document.createElement("div");
        el.className = "piece";
        el.style.backgroundImage = `url(${img})`;
        el.draggable = true;
        el.dataset.id = id;
        el.addEventListener("dragstart", e => e.dataTransfer.setData("id", id));
        piecesDiv.appendChild(el);
    });
}

function dropPiece(e) {
    const id = e.dataTransfer.getData("id");
    const piece = document.querySelector(`.piece[data-id='${id}']`);
    if (!piece) return;
    if (id == e.target.dataset.id) {
        e.target.appendChild(piece);
        piece.classList.add('placed');
        piece.draggable = false;
        placed++;
        statusEl.textContent = `Status: ${placed}/${GRID*GRID}`;
        if (placed === GRID * GRID) completePuzzle();
    }
}

document.getElementById('resetBtn').onclick = () => {
    piecesDiv.innerHTML = "";
    boardDiv.querySelectorAll('.target').forEach(t => t.innerHTML = "");
    placed = 0;
    statusEl.textContent = "Status: zresetowano.";
};

function completePuzzle() {
    statusEl.textContent = "Status: ukończono!";
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Gratulacje!", { body: "Ułożyłeś mapę!" });
    } else {
        alert("Gratulacje! Ułożyłeś mapę!");
    }
}
