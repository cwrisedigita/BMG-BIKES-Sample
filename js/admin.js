// ============================================================
//  BMG BIG BIKE RENTALS — Admin Panel Logic
// ============================================================

let pendingBookDocId = null;

// ===================== AUTH =====================
auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById("loginSection").style.display    = "none";
    document.getElementById("dashboardSection").style.display = "block";
    document.getElementById("adminEmail").textContent = user.email;
    loadBikes();
  } else {
    document.getElementById("loginSection").style.display    = "flex";
    document.getElementById("dashboardSection").style.display = "none";
  }
});

document.getElementById("loginForm").addEventListener("submit", async e => {
  e.preventDefault();
  const errEl = document.getElementById("loginError");
  errEl.textContent = "";
  try {
    await auth.signInWithEmailAndPassword(
      document.getElementById("loginEmail").value,
      document.getElementById("loginPass").value
    );
  } catch {
    errEl.textContent = "Incorrect email or password. Please try again.";
  }
});

document.getElementById("logoutBtn").addEventListener("click", () => auth.signOut());

// ===================== LOAD BIKES =====================
function loadBikes() {
  db.collection("bikes").orderBy("order").onSnapshot(snapshot => {
    const bikes = snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }));
    renderAdminBikes(bikes);
    updateStats(bikes);
    document.getElementById("seedPrompt").style.display = bikes.length === 0 ? "block" : "none";
  });
}

// ===================== RENDER BIKE LIST =====================
function renderAdminBikes(bikes) {
  const list = document.getElementById("bikeList");
  if (bikes.length === 0) {
    list.innerHTML = `<p class="empty-msg">No bikes yet. Click "Add New Bike" or load the default fleet above.</p>`;
    return;
  }
  const typeLabel = t => t === "sportbike" ? "🏁 Sportbike" : "🏍️ Naked Bike";

  list.innerHTML = bikes.map(bike => {
    const avail = bike.status === "available";
    return `
      <div class="admin-bike-card ${avail ? "available-card" : "booked"}">
        <div class="admin-bike-img">
          <img src="${bike.image}" alt="${bike.name}" onerror="this.parentElement.textContent='🏍️'">
        </div>
        <div class="admin-bike-info">
          <div class="admin-bike-name">${bike.name}</div>
          <div class="admin-bike-meta">${typeLabel(bike.type)} &bull; ${bike.cc}cc &bull; ₱${Number(bike.pricePerDay).toLocaleString()}/day</div>
          ${!avail && bike.availableFrom ? `<div class="admin-bike-date">📅 Free from: ${bike.availableFrom}</div>` : ""}
        </div>
        <div>
          <span class="status-badge ${avail ? "available" : "booked"}">
            ${avail ? "● Available" : "✗ Booked"}
          </span>
        </div>
        <div class="admin-bike-actions">
          ${avail
            ? `<button class="btn-admin btn-book"  onclick="openDateModal('${bike.docId}')">Mark Booked</button>`
            : `<button class="btn-admin btn-avail" onclick="markAvailable('${bike.docId}')">Mark Available</button>`
          }
          <button class="btn-admin btn-edit" onclick="openEditModal('${bike.docId}')">Edit</button>
          <button class="btn-admin btn-del"  onclick="deleteBike('${bike.docId}', '${bike.name.replace(/'/g,"\\'")}')">Delete</button>
        </div>
      </div>`;
  }).join("");
}

// ===================== STATS =====================
function updateStats(bikes) {
  document.getElementById("statTotal").textContent  = bikes.length;
  document.getElementById("statAvail").textContent  = bikes.filter(b => b.status === "available").length;
  document.getElementById("statBooked").textContent = bikes.filter(b => b.status === "booked").length;
}

// ===================== TOGGLE STATUS =====================
function openDateModal(docId) {
  pendingBookDocId = docId;
  document.getElementById("dateInput").value = "";
  document.getElementById("dateModal").style.display = "flex";
}

function closeDateModal() {
  document.getElementById("dateModal").style.display = "none";
  pendingBookDocId = null;
}

async function confirmBooked() {
  if (!pendingBookDocId) return;
  const dateStr = document.getElementById("dateInput").value.trim();
  await db.collection("bikes").doc(pendingBookDocId).update({
    status:        "booked",
    availableFrom: dateStr || null
  });
  closeDateModal();
}

async function markAvailable(docId) {
  await db.collection("bikes").doc(docId).update({
    status:        "available",
    availableFrom: null
  });
}

// ===================== DELETE =====================
async function deleteBike(docId, name) {
  if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
  await db.collection("bikes").doc(docId).delete();
}

// ===================== ADD / EDIT MODAL =====================
let editingDocId = null;

function openAddModal() {
  editingDocId = null;
  document.getElementById("modalTitle").textContent = "Add New Bike";
  document.getElementById("bikeForm").reset();
  document.getElementById("bikeModal").style.display = "flex";
}

async function openEditModal(docId) {
  editingDocId = docId;
  const doc  = await db.collection("bikes").doc(docId).get();
  const bike = doc.data();
  document.getElementById("modalTitle").textContent = "Edit Bike";
  document.getElementById("fName").value          = bike.name          || "";
  document.getElementById("fType").value          = bike.type          || "sportbike";
  document.getElementById("fCc").value            = bike.cc            || "";
  document.getElementById("fColor").value         = bike.color         || "";
  document.getElementById("fYear").value          = bike.year          || "";
  document.getElementById("fMileage").value       = bike.mileage       || "";
  document.getElementById("fPrice").value         = bike.pricePerDay   || "";
  document.getElementById("fImage").value         = bike.image         || "";
  document.getElementById("fDescription").value   = bike.description   || "";
  document.getElementById("fEngine").value        = bike.specs?.engine       || "";
  document.getElementById("fPower").value         = bike.specs?.power        || "";
  document.getElementById("fTorque").value        = bike.specs?.torque       || "";
  document.getElementById("fTransmission").value  = bike.specs?.transmission || "";
  document.getElementById("fWeight").value        = bike.specs?.weight       || "";
  document.getElementById("fSeatHeight").value    = bike.specs?.seatHeight   || "";
  document.getElementById("bikeModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("bikeModal").style.display = "none";
  editingDocId = null;
}

// Close modals on backdrop click
document.getElementById("bikeModal").addEventListener("click", e => {
  if (e.target === document.getElementById("bikeModal")) closeModal();
});
document.getElementById("dateModal").addEventListener("click", e => {
  if (e.target === document.getElementById("dateModal")) closeDateModal();
});

// ===================== SAVE BIKE =====================
document.getElementById("bikeForm").addEventListener("submit", async e => {
  e.preventDefault();
  const saveBtn = document.getElementById("saveBtn");
  saveBtn.textContent = "Saving...";
  saveBtn.disabled    = true;

  const bikeData = {
    name:        document.getElementById("fName").value.trim(),
    type:        document.getElementById("fType").value,
    cc:          parseInt(document.getElementById("fCc").value) || 0,
    color:       document.getElementById("fColor").value.trim()   || "TBA",
    year:        parseInt(document.getElementById("fYear").value) || new Date().getFullYear(),
    mileage:     document.getElementById("fMileage").value.trim() || "TBA",
    pricePerDay: parseInt(document.getElementById("fPrice").value) || 0,
    image:       document.getElementById("fImage").value.trim()   || "images/bikes/placeholder.jpg",
    description: document.getElementById("fDescription").value.trim(),
    specs: {
      engine:       document.getElementById("fEngine").value.trim()       || "—",
      power:        document.getElementById("fPower").value.trim()        || "—",
      torque:       document.getElementById("fTorque").value.trim()       || "—",
      transmission: document.getElementById("fTransmission").value.trim() || "6-speed",
      weight:       document.getElementById("fWeight").value.trim()       || "—",
      seatHeight:   document.getElementById("fSeatHeight").value.trim()   || "—",
    }
  };

  try {
    if (editingDocId) {
      await db.collection("bikes").doc(editingDocId).update(bikeData);
    } else {
      // Auto-generate slug ID from name
      const docId  = bikeData.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      // Get next order number
      const snap   = await db.collection("bikes").orderBy("order", "desc").limit(1).get();
      const maxOrd = snap.empty ? 0 : (snap.docs[0].data().order || 0) + 1;
      await db.collection("bikes").doc(docId).set({
        ...bikeData,
        status:        "available",
        availableFrom: null,
        order:         maxOrd
      });
    }
    closeModal();
  } catch (err) {
    alert("Error saving: " + err.message);
  } finally {
    saveBtn.textContent = "Save Bike";
    saveBtn.disabled    = false;
  }
});

// ===================== SEED DEFAULT FLEET =====================
const SEED_BIKES = [
  { id: "cfmoto-450sr",      name: "CFMOTO 450SR",       type: "sportbike", cc: 449,  color: "Black / Red",  year: 2024, mileage: "4,200 km",  pricePerDay: 1800, deposit: 3000, rates: [ { duration: "12 hrs", price: 1800, km: 200 }, { duration: "24 hrs", price: 2500, km: 300 } ], image: "images/bikes/cfmoto-450sr.jpg",       description: "The CFMOTO 450SR is a sharp, full-fairing sportbike featuring aggressive styling and a smooth 449cc parallel-twin engine. Perfect for riders craving the sportbike experience with refined everyday usability.",                                                                                           specs: { engine: "449cc, Parallel Twin",  power: "47 HP @ 9,500 rpm",   torque: "43 Nm @ 7,500 rpm",  transmission: "6-speed", weight: "193 kg", seatHeight: "790 mm" } },
  { id: "suzuki-gsxr-750",   name: "Suzuki GSX-R 750",   type: "sportbike", cc: 750,  color: "Black",         year: 2009, mileage: "22,000 km", pricePerDay: 2500, deposit: null, rates: [], image: "images/bikes/suzuki-gsxr.jpg",        description: "The legendary Suzuki GSX-R 750 — the benchmark of sportbikes. A perfect harmony of power, handling, and track-bred performance. The Gixxer delivers an electrifying ride on open highways and twisty mountain roads alike.",                                                                             specs: { engine: "749cc, Inline-4",       power: "150 HP @ 13,200 rpm", torque: "85 Nm @ 10,800 rpm", transmission: "6-speed", weight: "163 kg", seatHeight: "810 mm" } },
  { id: "suzuki-gsxs-750",   name: "Suzuki GSX-S 750",   type: "naked",     cc: 749,  color: "Black / Blue",  year: 2020, mileage: "12,500 km", pricePerDay: 1800, deposit: 3000, rates: [ { duration: "6 hrs",  price: 1800, km: 100 }, { duration: "12 hrs", price: 2500, km: 200 }, { duration: "24 hrs", price: 3500, km: 300 } ], image: "images/bikes/suzuki-gsxs.jpg",        description: "Built on GSX-R DNA, the Suzuki GSX-S 750 is a naked street fighter that packs punchy inline-4 performance into an upright, commanding riding position. Versatile enough for daily rides, thrilling enough for weekend escapes.",                                                                         specs: { engine: "749cc, Inline-4",       power: "114 HP @ 10,500 rpm", torque: "81 Nm @ 9,000 rpm",  transmission: "6-speed", weight: "213 kg", seatHeight: "815 mm" } },
  { id: "cfmoto-nk400",      name: "CFMOTO NK400",        type: "naked",     cc: 400,  color: "TBA",           year: 2024, mileage: "TBA",       pricePerDay: 1200, deposit: null, rates: [ { duration: "12 hrs", price: 1200, km: null }, { duration: "24 hrs", price: 2000, km: null } ], image: "images/bikes/cfmoto-nk400.jpg",       description: "The CFMOTO NK400 is a sleek, mid-sized naked bike built for the streets. Its punchy 400cc parallel-twin engine delivers smooth, confident power — whether you're commuting through the city or carving open roads.",                                                                                    specs: { engine: "400cc, Parallel Twin",  power: "42 HP @ 9,500 rpm",   torque: "37 Nm @ 7,500 rpm",  transmission: "6-speed", weight: "175 kg", seatHeight: "780 mm" } },
  { id: "kawasaki-z1",       name: "Kawasaki Z1",         type: "naked",     cc: 900,  color: "TBA",           year: 2025, mileage: "TBA",       pricePerDay: 4200, deposit: 5000, rates: [ { duration: "24 hrs", price: 4200, km: 250 } ], image: "images/bikes/kawasaki-z1.jpg",        description: "The Kawasaki Z1 is an icon — raw, upright, and unmistakably aggressive. With its powerful engine and streetfighter stance, it commands every road and turns heads wherever it goes.",                                                                                                                  specs: { engine: "900cc, Inline-4",       power: "125 HP @ 10,000 rpm", torque: "98 Nm @ 7,700 rpm",  transmission: "6-speed", weight: "210 kg", seatHeight: "820 mm" } },
  { id: "kawasaki-zx10r",    name: "Kawasaki ZX-10R",     type: "sportbike", cc: 998,  color: "TBA",           year: 2024, mileage: "TBA",       pricePerDay: 4500, deposit: 4000, rates: [ { duration: "24 hrs", price: 4500, km: 250 } ], image: "images/bikes/kawasaki-zx10r.jpg",     description: "The Kawasaki ZX-10R is a World Superbike Championship-derived liter-class beast. Ferocious power, world-class electronics, and track-ready performance make this the ultimate ride for experienced riders chasing the limit.",                                                                            specs: { engine: "998cc, Inline-4",       power: "203 HP @ 13,200 rpm", torque: "114 Nm @ 11,400 rpm",transmission: "6-speed", weight: "207 kg", seatHeight: "835 mm" } },
  { id: "kawasaki-ninja1000",name: "Kawasaki Ninja 1000",  type: "sportbike", cc: 1043, color: "TBA",           year: 2024, mileage: "TBA",       pricePerDay: 3000, deposit: null, rates: [], image: "images/bikes/kawasaki-ninja1000.jpg",  description: "The Kawasaki Ninja 1000 is a sport-touring powerhouse — combining aggressive inline-4 performance with long-ride comfort. Whether you're carving mountain passes or cruising long stretches of highway, the Ninja 1000 handles it all with confidence.",                                               specs: { engine: "1,043cc, Inline-4",     power: "142 HP @ 10,000 rpm", torque: "111 Nm @ 7,300 rpm", transmission: "6-speed", weight: "235 kg", seatHeight: "820 mm" } },
];

async function seedData() {
  if (!confirm("This will add 7 default bikes to your database. Continue?")) return;
  const btn = document.getElementById("seedBtn");
  btn.textContent = "Loading...";
  btn.disabled    = true;
  try {
    for (let i = 0; i < SEED_BIKES.length; i++) {
      const { id, ...data } = SEED_BIKES[i];
      await db.collection("bikes").doc(id).set({
        ...data, status: "available", availableFrom: null, order: i
      });
    }
    btn.textContent = "✓ Done!";
  } catch (err) {
    alert("Seed error: " + err.message);
    btn.textContent = "Load Default Fleet (7 bikes)";
    btn.disabled    = false;
  }
}
