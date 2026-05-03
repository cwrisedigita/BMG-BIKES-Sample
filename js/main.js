// ===================== NAVBAR =====================
const navbar    = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const navLinks  = document.getElementById("navLinks");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 40);
});

hamburger?.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  hamburger.classList.toggle("active");
});

navLinks?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    hamburger?.classList.remove("active");
  });
});

// ===================== AVAILABILITY BADGE =====================
function availabilityBadge(bike) {
  if (bike.status === "available") {
    return `<span class="badge badge-available">&#10003; Available</span>`;
  }
  const dateNote = bike.availableFrom
    ? `<div class="badge-booked-date">Free from ${bike.availableFrom}</div>`
    : "";
  return `<span class="badge badge-booked">&#10005; Booked</span>${dateNote}`;
}

// ===================== HERO BIKES GRID =====================
function renderHeroGrid(bikes) {
  const grid = document.getElementById("heroBikesGrid");
  if (!grid) return;

  grid.innerHTML = bikes.map((bike, i) => {
    const delay     = (i * 0.28).toFixed(2);
    const isBkd     = bike.status === "booked";
    const statusTxt = isBkd
      ? (bike.availableFrom ? `Free from ${bike.availableFrom}` : "Currently Booked")
      : "Available Now";
    const typeLabel = bike.type === "sportbike" ? "Sportbike" : "Naked Bike";

    // Show the 24hr rate if available, otherwise fall back to pricePerDay
    const dayRate = (bike.rates && bike.rates.find(r => r.duration === "24 hrs"))
      ? bike.rates.find(r => r.duration === "24 hrs").price
      : bike.pricePerDay;

    return `
      <a href="bike.html?id=${bike.docId}" class="hbc-card" style="animation-delay:${delay}s">
        <div class="hbc-img">
          <img src="${bike.image}" alt="${bike.name}"
               onerror="this.parentElement.innerHTML='<div class=hbc-ph>🏍️</div>'">
        </div>
        <div class="hbc-info">
          <div class="hbc-row">
            <span class="hbc-type">${typeLabel}</span>
            <span class="hbc-price">&#8369;${Number(dayRate).toLocaleString()}<em>/day</em></span>
          </div>
          <div class="hbc-name">${bike.name}</div>
          <div class="hbc-status ${isBkd ? "booked" : "available"}">${statusTxt}</div>
        </div>
      </a>`;
  }).join("");
}

// ===================== FLEET =====================
function buildBikeCard(bike) {
  const imgEl   = `<img src="${bike.image}" alt="${bike.name}" onerror="this.parentElement.innerHTML='<div class=\\'bike-card-img-placeholder\\'>🏍️</div>'">`;
  const hasRates = bike.rates && bike.rates.length > 0;
  const startPrice = hasRates ? Math.min(...bike.rates.map(r => r.price)) : bike.pricePerDay;

  const ratesHTML = hasRates
    ? bike.rates.map(r =>
        `<div class="card-rate-row">
          <span class="card-rate-dur">${r.duration}</span>
          ${r.km ? `<span class="card-rate-km">${r.km} km</span>` : `<span class="card-rate-km"></span>`}
          <span class="card-rate-price">&#8369;${Number(r.price).toLocaleString()}</span>
        </div>`).join("")
    : `<div class="card-rate-row">
        <span class="card-rate-dur">Per Day</span>
        <span class="card-rate-km"></span>
        <span class="card-rate-price">&#8369;${Number(bike.pricePerDay).toLocaleString()}</span>
      </div>`;

  const depositHTML = bike.deposit
    ? `<div class="card-deposit">&#8369;${Number(bike.deposit).toLocaleString()} deposit <span>(refundable)</span></div>`
    : "";

  return `
    <div class="bike-card">
      <a href="bike.html?id=${bike.docId}" class="bike-card-img">${imgEl}</a>
      <div class="bike-card-body">
        <div class="bike-card-top">
          <div class="bike-card-name">${bike.name}</div>
          <div>${availabilityBadge(bike)}</div>
        </div>
        <div class="bike-card-specs">
          <div class="spec-item"><span class="spec-label">Engine</span><span class="spec-value">${bike.cc}cc</span></div>
          <div class="spec-item"><span class="spec-label">Year</span><span class="spec-value">${bike.year}</span></div>
          <div class="spec-item"><span class="spec-label">Color</span><span class="spec-value">${bike.color}</span></div>
          <div class="spec-item"><span class="spec-label">Mileage</span><span class="spec-value">${bike.mileage}</span></div>
        </div>
        <div class="card-rates-section">
          <div class="card-rates-header"><span>Duration</span><span>Limit</span><span>Rate</span></div>
          ${ratesHTML}
          ${depositHTML}
        </div>
        <div class="bike-card-footer">
          <div class="bike-price">From &#8369;${Number(startPrice).toLocaleString()}</div>
          <a href="bike.html?id=${bike.docId}" class="btn-details">Full Details</a>
        </div>
      </div>
    </div>`;
}

function buildPricingCard(bike) {
  const typeLabel = bike.type === "sportbike" ? "Sportbike" : "Naked Bike";
  const rates     = bike.rates && bike.rates.length > 0 ? bike.rates : null;

  const ratesHTML = rates
    ? rates.map(r => `
        <div class="pricing-tier">
          <span class="tier-duration">${r.duration}</span>
          ${r.km ? `<span class="tier-km">${r.km} km</span>` : `<span class="tier-km"></span>`}
          <span class="tier-price">&#8369;${Number(r.price).toLocaleString()}</span>
        </div>`).join("")
    : `<div class="pricing-tier">
        <span class="tier-duration">Per Day</span>
        <span class="tier-km"></span>
        <span class="tier-price">&#8369;${Number(bike.pricePerDay).toLocaleString()}</span>
       </div>`;

  const depositHTML = bike.deposit
    ? `<div class="pricing-deposit">&#128176; &#8369;${Number(bike.deposit).toLocaleString()} security deposit <span>(refundable)</span></div>`
    : "";

  return `
    <div class="pricing-card">
      <div class="pricing-card-top-row">
        <div class="pricing-card-type">${typeLabel}</div>
        <div class="pricing-card-cc">${bike.cc}cc</div>
      </div>
      <div class="pricing-card-name">${bike.name}</div>
      <div class="pricing-tiers-header">
        <span>Duration</span><span>Limit</span><span>Rate</span>
      </div>
      <div class="pricing-tiers">${ratesHTML}</div>
      ${depositHTML}
    </div>`;
}

function renderFleet(bikes) {
  const sportGrid   = document.getElementById("sportbikesGrid");
  const nakedGrid   = document.getElementById("nakedbikesGrid");
  const pricingGrid = document.getElementById("pricingGrid");
  const countEl     = document.getElementById("availableCount");
  if (!sportGrid) return;

  sportGrid.innerHTML   = bikes.filter(b => b.type === "sportbike").map(buildBikeCard).join("");
  nakedGrid.innerHTML   = bikes.filter(b => b.type === "naked").map(buildBikeCard).join("");
  pricingGrid.innerHTML = bikes.map(buildPricingCard).join("");
  if (countEl) countEl.textContent = bikes.filter(b => b.status === "available").length;
}

// ===================== BIKE DETAIL =====================
function renderDetail(bikes) {
  const root = document.getElementById("bikeDetail");
  if (!root) return;

  const id   = new URLSearchParams(window.location.search).get("id");
  const bike = bikes.find(b => b.docId === id);

  if (!bike) {
    root.innerHTML = `<div class="container" style="padding:120px 0;text-align:center">
      <h2>Bike not found.</h2>
      <a href="index.html" class="btn btn-primary" style="margin-top:24px;display:inline-flex">Back to Fleet</a>
    </div>`;
    return;
  }

  document.title = `${bike.name} | BMG Big Bike Rentals`;
  const typeLabel  = bike.type === "sportbike" ? "Sportbike" : "Naked Bike";
  const availBlock = bike.status === "available"
    ? `<div class="detail-availability available"><div class="availability-status available">&#10003; Available for Rent</div></div>`
    : `<div class="detail-availability booked">
        <div class="availability-status booked">&#10005; Currently Booked</div>
        ${bike.availableFrom ? `<div class="availability-date">Available from ${bike.availableFrom}</div>` : ""}
       </div>`;

  root.innerHTML = `
    <div class="back-btn-section"><div class="container"><a href="index.html#fleet" class="back-link">&#8592; Back to Fleet</a></div></div>
    <div class="detail-hero"><div class="container">
      <div class="detail-hero-img">
        <img src="${bike.image}" alt="${bike.name}" onerror="this.parentElement.innerHTML='<span style=\\'font-size:80px\\'>🏍️</span>'">
      </div>
    </div></div>
    <div class="detail-content"><div class="container"><div class="detail-grid">
      <div class="detail-info">
        <div class="detail-category-badge">${typeLabel}</div>
        <h1 class="detail-name">${bike.name}</h1>
        <p class="detail-description">${bike.description}</p>
        <div class="detail-specs-title">Specifications</div>
        <div class="detail-specs">
          <div class="detail-spec"><div class="detail-spec-label">Engine</div><div class="detail-spec-value">${bike.specs.engine}</div></div>
          <div class="detail-spec"><div class="detail-spec-label">Power</div><div class="detail-spec-value">${bike.specs.power}</div></div>
          <div class="detail-spec"><div class="detail-spec-label">Torque</div><div class="detail-spec-value">${bike.specs.torque}</div></div>
          <div class="detail-spec"><div class="detail-spec-label">Transmission</div><div class="detail-spec-value">${bike.specs.transmission}</div></div>
          <div class="detail-spec"><div class="detail-spec-label">Weight</div><div class="detail-spec-value">${bike.specs.weight}</div></div>
          <div class="detail-spec"><div class="detail-spec-label">Seat Height</div><div class="detail-spec-value">${bike.specs.seatHeight}</div></div>
          <div class="detail-spec"><div class="detail-spec-label">Color</div><div class="detail-spec-value">${bike.color}</div></div>
          <div class="detail-spec"><div class="detail-spec-label">Year</div><div class="detail-spec-value">${bike.year}</div></div>
          <div class="detail-spec"><div class="detail-spec-label">Mileage</div><div class="detail-spec-value">${bike.mileage}</div></div>
        </div>
      </div>
      <div class="detail-sidebar"><div class="detail-sidebar-card">
        <div class="detail-price-label">Rental Rates</div>
        ${bike.rates && bike.rates.length > 0 ? `
          <div class="detail-rates">
            ${bike.rates.map(r => `
              <div class="detail-rate-row">
                <span class="detail-rate-duration">${r.duration}</span>
                ${r.km ? `<span class="detail-rate-km">${r.km} km</span>` : ""}
                <span class="detail-rate-price">&#8369;${Number(r.price).toLocaleString()}</span>
              </div>`).join("")}
          </div>
          ${bike.deposit ? `<div class="detail-deposit">&#8369;${Number(bike.deposit).toLocaleString()} security deposit <span>(refundable)</span></div>` : ""}
        ` : `<div class="detail-price">&#8369;${Number(bike.pricePerDay).toLocaleString()}<span> / day</span></div>`}
        ${availBlock}
        <a href="${FACEBOOK_URL}" target="_blank" class="btn btn-primary detail-book-btn">Book This Bike on Facebook</a>
        <div class="detail-sidebar-note">We'll confirm your dates via Messenger.</div>
        <div class="detail-contact">
          <div class="detail-contact-item"><span>&#128222;</span><span>Call / Text: <a href="tel:${PHONE.replace(/\s/g,'')}">${PHONE}</a></span></div>
          <div class="detail-contact-item"><span>&#128172;</span><span><a href="${FACEBOOK_URL}" target="_blank">Message on Facebook</a></span></div>
        </div>
      </div></div>
    </div></div></div>`;
}

// ===================== LOAD FROM FIRESTORE (live) =====================
db.collection("bikes").orderBy("order").onSnapshot(snapshot => {
  const bikes = snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }));
  renderHeroGrid(bikes);
  renderFleet(bikes);
  renderDetail(bikes);
}, err => console.error("Firestore error:", err));
