import { soundscape } from "./audio.js";
import { createIcons, icons } from "lucide";
import khojWindingRoad from "../assets/images/khoj_winding_road.jpg";
import morningFrisbee from "../assets/images/morning_frisbee.jpg";
import cyclingDawn from "../assets/images/cycling_dawn.jpg";
import chaiCommunityCircle from "../assets/images/chai_community_circle.jpg";
import aravalliTrailHike from "../assets/images/aravalli_trail_hike.jpg";
import lakeSunsetMeditation from "../assets/images/lake_sunset_meditation.jpg";

// Initialize Lucide icons
document.addEventListener("DOMContentLoaded", () => {
  createIcons({ icons });
  initApp();
});

function initApp() {
  initAudio();
  initHeroSwitcher();
  initMissionFilters();
  initMissionModal();
  initYouMightFind();
  initInteractiveChecklist();
  initMobileMenu();
  initCommunityModal();
  initLightbox();
}

// -------------------------------------------------------------
// 1. Audio Soundscape Controller
// -------------------------------------------------------------
function initAudio() {
  const toggleBtn = document.getElementById("soundscapeToggle");
  const toggleText = document.getElementById("soundscapeText");

  if (!toggleBtn) return;

  function updateUI(isPlaying) {
    if (isPlaying) {
      toggleBtn.classList.add("playing");
      if (toggleText) toggleText.textContent = "AUDIO: ON";
      showToast("Soundscape activated: Aravalli morning breeze & birds.");
    } else {
      toggleBtn.classList.remove("playing");
      if (toggleText) toggleText.textContent = "AUDIO: OFF";
    }
  }

  soundscape.subscribe(updateUI);

  toggleBtn.addEventListener("click", () => {
    soundscape.toggle();
  });
}

// -------------------------------------------------------------
// 2. Hero Background Photo Switcher
// -------------------------------------------------------------
const heroPhotos = [
  {
    src: khojWindingRoad,
    tag: "ARAVALLI RIDGE OVERLOOK · 06:40 AM",
    note: "Sitting above Leopard Trail with roasted chana and morning silence.",
  },
  {
    src: morningFrisbee,
    tag: "MORNING RECESS · 07:15 AM",
    note: "Frisbee showdown in the meadow clearing.",
  },
  {
    src: cyclingDawn,
    tag: "GRAVEL DAWN RIDE · 05:45 AM",
    note: "Misty curves and zero morning traffic on Silani road.",
  },
  {
    src: chaiCommunityCircle,
    tag: "POST-HIKE KULHAD CHAI · 08:30 AM",
    note: "Muddy boots, steaming chai and strangers who aren’t strangers anymore.",
  },
];

function initHeroSwitcher() {
  const heroImg = document.getElementById("heroBgImg");
  const heroCaption = document.getElementById("heroPhotoTag");
  const switcherBtns = document.querySelectorAll(".switcher-btn");
  let currentIndex = 0;
  let autoTimer = null;

  function setPhoto(index) {
    currentIndex = index;
    const photo = heroPhotos[index];
    if (!heroImg || !photo) return;

    const nextImage = new Image();
    nextImage.onload = () => {
      heroImg.style.opacity = "0.4";
      setTimeout(() => {
        heroImg.src = photo.src;
        heroImg.style.opacity = "1";
      }, 200);
    };
    nextImage.src = photo.src;

    if (heroCaption) {
      heroCaption.textContent = photo.tag;
    }

    switcherBtns.forEach((btn, idx) => {
      btn.classList.toggle("active", idx === index);
    });
  }

  switcherBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      clearInterval(autoTimer);
      const idx = parseInt(btn.dataset.index, 10);
      setPhoto(idx);
    });
  });

  // Auto rotate every 9s
  autoTimer = setInterval(() => {
    const nextIdx = (currentIndex + 1) % heroPhotos.length;
    setPhoto(nextIdx);
  }, 9000);
}

// -------------------------------------------------------------
// 3. Mission Filtering System
// -------------------------------------------------------------
function initMissionFilters() {
  const filterBtns = document.querySelectorAll(".filter-pill");
  const missionCards = document.querySelectorAll(".mission-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      missionCards.forEach((card) => {
        const cat = card.dataset.category;
        if (filter === "all" || cat === filter) {
          card.style.display = "flex";
          card.style.animation = "fadeIn 0.4s ease";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

// -------------------------------------------------------------
// 4. Mission Dossier Modal & Interactive RSVP Flow
// -------------------------------------------------------------
const missionData = {
  "001": {
    code: "MISSION 001",
    category: "KHOJ",
    title: "KHOJ — TRAIL DAY",
    date: "Sunday · 5:30 AM",
    location: "Vatika Chowk (Gurgaon) to Secret Aravalli Scrub",
    coordinates: "28.4089° N, 77.0620° E",
    spotsLeft: 6,
    totalSpots: 20,
    difficulty:
      "Moderate (6.2 km loop with loose gravel & gentle hill scramble)",
    vibe: "Quiet morning exploration, pickup frisbee, warm rock silence, post-hike chai.",
    itinerary: [
      "05:30 AM — Assemble at Vatika Chowk (Gurgaon)",
      "06:00 AM — Briefing & trail entry into rocky scrub",
      "06:15–08:00 AM — KHOJ exploration + Ultimate Frisbee",
      "08:00–08:20 AM — Meditation & Roasted Chana snack session",
      "08:30 AM — Sayonara & optional kulhad chai stop",
    ],
    gear: [
      "Sturdy hiking shoes with solid grip (no flat casual sneakers)",
      "1 Litre water bottle (reusable only, zero single-use plastic)",
      "Cap / bandana for morning sun protection",
      "Small shoulder pack or daypack for snacks",
      "Zero ego & readiness to play like a kid",
    ],
  },
  "002": {
    code: "MISSION 002",
    category: "RIDE",
    title: "SUNRISE GRAVEL & DHABA CRUISE",
    date: "Saturday · 5:15 AM",
    location: "Leopard Trail Entry to Silani Farmlands",
    coordinates: "28.3842° N, 77.0118° E",
    spotsLeft: 8,
    totalSpots: 16,
    difficulty:
      "Easy-Moderate (38 km flat gravel & quiet paved village curves)",
    vibe: "Paced for community, not for Strava bragging. Sunrise over mustard fields and crispy tandoori parathas.",
    itinerary: [
      "05:15 AM — Meet at Leopard Trail Arch",
      "05:35 AM — Roll out into morning twilight mist",
      "06:30 AM — Regroup at Silani village banyan tree",
      "07:15 AM — Dhaba halt: hot kulhad chai, butter parathas & stories",
      "08:45 AM — Easy spin back to starting point",
    ],
    gear: [
      "Road, Hybrid, or Gravel cycle in good working condition",
      "Helmet is strictly non-negotiable",
      "Front and rear safety lights for early morning hours",
      "Spare tube & mini pump (we carry tools as a pack)",
      "Appetite for rustic breakfast",
    ],
  },
  "003": {
    code: "MISSION 003",
    category: "PLAY",
    title: "RECESS IN THE RIDGE",
    date: "Sunday · 4:00 PM",
    location: "Aravalli Biodiversity Park & Ridge, Gurgaon",
    coordinates: "28.4891° N, 77.1022° E",
    spotsLeft: 12,
    totalSpots: 30,
    difficulty: "Zero technical hiking. High laughter quotient.",
    vibe: "Unapologetic childhood recess for working adults. Ultimate frisbee, capture the flag, dodgeball and watching golden hour turn into twilight over the Aravalli canopy.",
    itinerary: [
      "04:00 PM — Meet at Aravalli clearing",
      "04:15 PM — Warmup + team sorting (random sticks draw)",
      "04:30–06:00 PM — Frisbee Cup & Capture the Flag battles",
      "06:00–06:30 PM — Sunset sit-down & cold lemon shikanji",
    ],
    gear: [
      "Running shoes or barefoot-friendly comfort",
      "Clothes you don’t mind getting slightly grass-stained",
      "Water bottle",
    ],
  },
  "004": {
    code: "MISSION 004",
    category: "ADVENTURE",
    title: "THE CRATER LAKE EXPEDITION",
    date: "Next Sunday · 5:45 AM",
    location: "Gwal Pahari Buffer Zone · Secret Sandstone Quarry",
    coordinates: "28.4352° N, 77.1420° E",
    spotsLeft: 4,
    totalSpots: 14,
    difficulty: "Moderate-Plus (Rocky scrambling & steep quarry ledge descent)",
    vibe: "A completely unexpected turquoise waterbody hidden behind Gurgaon’s rocky rim. Completely disconnected from cellular signals.",
    itinerary: [
      "05:45 AM — Covert meetup point shared 24h prior",
      "06:10 AM — Quiet traverse through thorn scrub",
      "07:00 AM — Arrival at Crater Lake rim",
      "07:15–08:30 AM — Bouldering scramble, quiet reflection & journal time",
      "09:00 AM — Return hike",
    ],
    gear: [
      "Proper ankle-support boots or high-grip trail runners",
      "Full-length pants (thorny scrub protection)",
      "1.5L water & electrolytes",
      "Journal/notebook if you like sketching or writing",
    ],
  },
};

function initMissionModal() {
  const modal = document.getElementById("missionModal");
  const closeBtn = document.getElementById("modalCloseBtn");
  const viewBtns = document.querySelectorAll(".btn-view-mission");

  if (!modal) return;

  function openMission(id) {
    const data = missionData[id] || missionData["001"];
    document.getElementById("modalMissionCode").textContent = data.code;
    document.getElementById("modalMissionTitle").textContent = data.title;
    document.getElementById("modalMissionMeta").textContent =
      `${data.date} · ${data.location}`;
    document.getElementById("modalCoords").textContent = data.coordinates;
    document.getElementById("modalSpotsBadge").textContent =
      `${data.spotsLeft} SPOTS LEFT / ${data.totalSpots} TOTAL`;
    document.getElementById("modalDifficulty").textContent = data.difficulty;
    document.getElementById("modalVibe").textContent = data.vibe;

    // Build timeline
    const timelineList = document.getElementById("modalTimelineList");
    timelineList.innerHTML = data.itinerary
      .map(
        (item) =>
          `<li style="margin-bottom: 0.5rem; display: flex; gap: 0.5rem;"><span style="color: var(--c-mustard);">✦</span> <span>${item}</span></li>`,
      )
      .join("");

    // Build gear list
    const gearList = document.getElementById("modalGearList");
    gearList.innerHTML = data.gear
      .map(
        (item) =>
          `<li style="margin-bottom: 0.4rem; display: flex; gap: 0.5rem;"><span style="color: var(--c-terracotta);">✓</span> <span>${item}</span></li>`,
      )
      .join("");

    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }

  viewBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.missionId || "001";
      openMission(id);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Handle RSVP Form Submission
  const rsvpForm = document.getElementById("missionRsvpForm");
  if (rsvpForm) {
    rsvpForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("rsvpName").value.trim();
      const phone = document.getElementById("rsvpPhone").value.trim();
      const people = document.getElementById("rsvpCount").value;
      const code = document.getElementById("modalMissionCode").textContent;

      if (!name || !phone) {
        alert("Please provide your name and WhatsApp number.");
        return;
      }

      // Pre-compose WhatsApp text
      const waMsg = encodeURIComponent(
        `Hey nothingmatter.! I want to RSVP for ${code}.\nName: ${name}\nSpots: ${people}\nPhone: ${phone}\n"Nothing matters. Go outside."`,
      );

      // Show instant confirmation
      showToast(`Spot reserved for ${name}! Opening WhatsApp...`);
      setTimeout(() => {
        window.open(`https://wa.me/919999999999?text=${waMsg}`, "_blank");
        closeModal();
        rsvpForm.reset();
      }, 700);
    });
  }
}

// -------------------------------------------------------------
// 5. "You Might Find..." Interactive Cursor / Hover Reveal
// -------------------------------------------------------------
function initYouMightFind() {
  const items = document.querySelectorAll(".ymf-item");
  const previewCard = document.getElementById("ymfPreview");
  const previewImg = document.getElementById("ymfPreviewImg");
  const previewCaption = document.getElementById("ymfPreviewCaption");

  if (!previewCard) return;

  const ymfPhotos = {
    trail: {
      img: aravalliTrailHike,
      caption: "Rocky scrub trails older than the Himalayas.",
    },
    lake: {
      img: lakeSunsetMeditation,
      caption: "Calm water & temple bells at the ridge.",
    },
    viewpoint: {
      img: khojWindingRoad,
      caption: "Overlooking the misty valley with roasted chana.",
    },
    friend: {
      img: chaiCommunityCircle,
      caption: "Strangers sharing kulhad chai at 8:30 AM.",
    },
    story: {
      img: morningFrisbee,
      caption: "A 20-minute frisbee match in ankle-deep grass.",
    },
    nothing: {
      img: lakeSunsetMeditation,
      caption: "Absolute morning silence. That’s kind of the point.",
    },
  };

  items.forEach((item) => {
    const key = item.dataset.key;
    const data = ymfPhotos[key];
    if (!data) return;

    item.addEventListener("mouseenter", (e) => {
      previewImg.src = data.img;
      previewCaption.textContent = data.caption;
      previewCard.classList.add("visible");
      positionPreview(e);
    });

    item.addEventListener("mousemove", (e) => {
      positionPreview(e);
    });

    item.addEventListener("mouseleave", () => {
      previewCard.classList.remove("visible");
    });
  });

  function positionPreview(e) {
    const offset = 25;
    let x = e.clientX + offset;
    let y = e.clientY + offset;

    // Check bounds
    if (x + 300 > window.innerWidth) {
      x = e.clientX - 300;
    }
    if (y + 260 > window.innerHeight) {
      y = e.clientY - 260;
    }

    previewCard.style.left = `${x}px`;
    previewCard.style.top = `${y}px`;
  }
}

// -------------------------------------------------------------
// 6. Interactive Trail Checklist
// -------------------------------------------------------------
function initInteractiveChecklist() {
  const checkItems = document.querySelectorAll(".check-item");
  checkItems.forEach((item) => {
    item.addEventListener("click", () => {
      item.classList.toggle("checked");
      const box = item.querySelector(".check-box");
      if (item.classList.contains("checked")) {
        box.textContent = "✓";
      } else {
        box.textContent = "";
      }
    });
  });
}

// -------------------------------------------------------------
// 7. Mobile Menu Drawer
// -------------------------------------------------------------
function initMobileMenu() {
  const menuBtn = document.getElementById("mobileMenuBtn");
  const drawer = document.getElementById("mobileDrawer");
  const links = document.querySelectorAll(".mobile-nav-link");

  if (!menuBtn || !drawer) return;

  menuBtn.addEventListener("click", () => {
    menuBtn.classList.toggle("active");
    drawer.classList.toggle("open");
    document.body.style.overflow = drawer.classList.contains("open")
      ? "hidden"
      : "";
  });

  links.forEach((l) => {
    l.addEventListener("click", () => {
      menuBtn.classList.remove("active");
      drawer.classList.remove("open");
      document.body.style.overflow = "";
    });
  });
}

// -------------------------------------------------------------
// 8. Community Join Modal
// -------------------------------------------------------------
function initCommunityModal() {
  const modal = document.getElementById("communityModal");
  const triggers = document.querySelectorAll(".btn-community-trigger");
  const closeBtn = document.getElementById("commModalCloseBtn");

  if (!modal) return;

  function open() {
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function close() {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }

  triggers.forEach((t) => t.addEventListener("click", open));
  if (closeBtn) closeBtn.addEventListener("click", close);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });

  const form = document.getElementById("communityJoinForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const val = document.getElementById("commInput").value.trim();
      if (!val) return;
      showToast("Welcome to nothingmatter.! Invite link sent to your number.");
      close();
      form.reset();
    });
  }
}

// -------------------------------------------------------------
// 9. Lightbox for Polaroid Gallery
// -------------------------------------------------------------
function initLightbox() {
  const items = document.querySelectorAll(".collage-item");
  const lightbox = document.getElementById("lightboxModal");
  const lbImg = document.getElementById("lightboxImg");
  const lbCaption = document.getElementById("lightboxCaption");
  const closeBtn = document.getElementById("lightboxClose");

  if (!lightbox) return;

  items.forEach((item) => {
    item.addEventListener("click", () => {
      const img = item.querySelector("img");
      const caption = item.querySelector(".collage-caption");
      if (!img) return;

      lbImg.src = img.src;
      lbCaption.textContent = caption
        ? caption.textContent
        : "Field Snapshot · Gurgaon";
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
    });
  });

  function close() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }

  if (closeBtn) closeBtn.addEventListener("click", close);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });
}

// Toast helper
function showToast(msg) {
  let toast = document.getElementById("globalToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "globalToast";
    toast.className = "toast-msg";
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span>🌿</span> <span>${msg}</span>`;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3800);
}
