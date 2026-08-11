const countries = [
  {
    country: "Nigeria",
    city: "Abuja",
    image: "./assets/tour-enhanced/abuja-4k.webp",
    intro: "Where the IBX journey meets policy, enterprise and the builders shaping Nigeria’s digital future.",
    details: "The Abuja stop brings blockchain education, builders and ecosystem leaders into one room to connect practical adoption with national opportunity."
  },
  {
    country: "Cameroon",
    city: "Yaoundé",
    image: "./assets/tour-enhanced/cameroon-4k.webp",
    intro: "A meeting point for ambitious communities building the next generation of African technology.",
    details: "IBX arrives in Yaoundé to exchange knowledge, spotlight local innovation and connect Cameroon’s growing Web3 communities to a wider African network."
  },
  {
    country: "Benin",
    city: "Cotonou",
    image: "./assets/tour-enhanced/cotonou-amazone-4k.webp",
    intro: "History, courage and emerging technology converge at the heart of Cotonou.",
    details: "The Cotonou stop celebrates the strength of community while creating access to blockchain education, collaboration and real-world digital tools."
  },
  {
    country: "Togo",
    city: "Lomé",
    image: "./assets/tour-enhanced/togo-4k-v2.webp",
    intro: "A borderless exchange of ideas, talent and practical paths into the decentralized economy.",
    details: "In Lomé, IBX works alongside local communities to make Web3 understandable, useful and connected to the opportunities young Africans are creating."
  },
  {
    country: "Côte d’Ivoire",
    city: "Abidjan",
    image: "./assets/tour-enhanced/abidjan-4k.webp",
    intro: "Culture, commerce and a new generation of builders meet on the West African coast.",
    details: "The Abidjan stop brings together creators, founders and blockchain communities for a shared experience of learning, culture and ecosystem connection."
  },
  {
    country: "Benin",
    city: "Cotonou Forum",
    image: "./assets/tour-enhanced/cotonou-palais-4k.webp",
    intro: "A focused gathering for the conversations and collaborations that move adoption forward.",
    details: "This Cotonou chapter creates a formal space for ecosystem dialogue, workshops and partnerships connecting grassroots energy with institutional momentum."
  }
];

const landing = document.querySelector("#landing");
const tour = document.querySelector("#tour");
const background = document.querySelector(".tour-backgrounds");
const rail = document.querySelector(".country-rail");
const detailsPanel = document.querySelector("#details-panel");
const cityName = document.querySelector("#city-name");
const countryName = document.querySelector("#country-name");
const countryIntro = document.querySelector("#country-intro");
const currentIndex = document.querySelector("#current-index");
const totalCount = document.querySelector("#total-count");
const detailsTitle = document.querySelector("#details-title");
const panelCountry = document.querySelector("#panel-country");
const panelCopy = document.querySelector("#panel-copy");
const panelNumber = document.querySelector("#panel-number");

let activeIndex = 4;
let wheelLocked = false;
let touchStartX = 0;
let lastFocusedElement = null;
let activeContinent = 2;
let continentWheelLocked = false;
let continentTouchStartY = 0;

const continentButtons = [...document.querySelectorAll("[data-continent]")];
const continentPicker = document.querySelector(".continent-picker");
const continentStatus = document.querySelector("#continent-status");
const enterContinentButton = document.querySelector("#enter-selected-continent");

totalCount.textContent = String(countries.length).padStart(2, "0");

countries.forEach((item, index) => {
  const button = document.createElement("button");
  button.type = "button";
  button.role = "tab";
  button.textContent = item.country;
  button.setAttribute("aria-label", `View ${item.city}, ${item.country}`);
  button.addEventListener("click", () => setCountry(index));
  rail.append(button);

  const preload = new Image();
  preload.src = item.image;
});

function setCountry(index, immediate = false) {
  activeIndex = (index + countries.length) % countries.length;
  const item = countries[activeIndex];
  if (!immediate) background.classList.add("is-changing");

  window.setTimeout(() => {
    background.style.backgroundImage = `url("${item.image}")`;
    cityName.textContent = item.city;
    countryName.textContent = item.country;
    countryIntro.textContent = item.intro;
    currentIndex.textContent = String(activeIndex + 1).padStart(2, "0");
    detailsTitle.textContent = item.city;
    panelCountry.textContent = item.country;
    panelCopy.textContent = item.details;
    panelNumber.textContent = String(activeIndex + 1).padStart(2, "0");

    [...rail.children].forEach((button, buttonIndex) => {
      button.setAttribute("aria-selected", String(buttonIndex === activeIndex));
      button.tabIndex = buttonIndex === activeIndex ? 0 : -1;
    });
    rail.children[activeIndex]?.scrollIntoView({ behavior: immediate ? "auto" : "smooth", inline: "center", block: "nearest" });
    background.classList.remove("is-changing");
  }, immediate ? 0 : 220);
}

function enterTour() {
  landing.classList.remove("is-active");
  landing.setAttribute("aria-hidden", "true");
  tour.classList.add("is-active");
  tour.setAttribute("aria-hidden", "false");
  window.setTimeout(() => document.querySelector("[data-open-details]")?.focus(), 700);
}

function updateContinentPicker(index) {
  activeContinent = (index + continentButtons.length) % continentButtons.length;

  continentButtons.forEach((button, buttonIndex) => {
    const offset = buttonIndex - activeContinent;
    const distance = Math.abs(offset);
    const curvedX = Math.min(distance * distance * 18, 74);
    const itemY = offset * 82;
    const scale = Math.max(.68, 1 - distance * .12);
    const opacity = Math.max(.12, 1 - distance * .29);
    const blur = distance > 2 ? 2 : 0;

    button.style.setProperty("--curve-x", `${curvedX}px`);
    button.style.setProperty("--item-y", `${itemY}px`);
    button.style.setProperty("--item-scale", scale);
    button.style.setProperty("--item-opacity", opacity);
    button.style.setProperty("--item-blur", `${blur}px`);
    button.style.setProperty("--item-z", `${-distance * 34}px`);
    button.style.setProperty("--item-rotate", `${offset * -7}deg`);
    button.setAttribute("aria-selected", String(buttonIndex === activeContinent));
    button.tabIndex = buttonIndex === activeContinent ? 0 : -1;
  });

  const selected = continentButtons[activeContinent].dataset.continent;
  continentStatus.textContent = selected;
  enterContinentButton.querySelector("span").textContent = selected === "Africa" ? "Enter Africa" : `${selected} · Coming soon`;
  enterContinentButton.classList.toggle("is-disabled", selected !== "Africa");
  enterContinentButton.setAttribute("aria-disabled", String(selected !== "Africa"));
}

function selectOrEnterContinent(index) {
  if (index !== activeContinent) {
    updateContinentPicker(index);
    return;
  }
  if (continentButtons[index].dataset.continent === "Africa") enterTour();
}

function backHome() {
  closeDetails();
  tour.classList.remove("is-active");
  tour.setAttribute("aria-hidden", "true");
  landing.classList.add("is-active");
  landing.setAttribute("aria-hidden", "false");
}

function openDetails() {
  lastFocusedElement = document.activeElement;
  detailsPanel.classList.add("is-open");
  detailsPanel.setAttribute("aria-hidden", "false");
  document.body.classList.add("panel-open");
  detailsPanel.querySelector("button")?.focus();
}

function closeDetails() {
  if (!detailsPanel.classList.contains("is-open")) return;
  detailsPanel.classList.remove("is-open");
  detailsPanel.setAttribute("aria-hidden", "true");
  document.body.classList.remove("panel-open");
  lastFocusedElement?.focus();
}

document.querySelectorAll("[data-enter-tour]").forEach((button) => button.addEventListener("click", enterTour));
document.querySelectorAll("[data-back-home]").forEach((button) => button.addEventListener("click", backHome));
document.querySelectorAll("[data-open-details]").forEach((button) => button.addEventListener("click", openDetails));
document.querySelectorAll("[data-close-details]").forEach((button) => button.addEventListener("click", closeDetails));
document.querySelector("[data-previous]").addEventListener("click", () => setCountry(activeIndex - 1));
document.querySelector("[data-next]").addEventListener("click", () => setCountry(activeIndex + 1));

continentButtons.forEach((button, index) => button.addEventListener("click", () => selectOrEnterContinent(index)));
enterContinentButton.addEventListener("click", () => {
  if (continentButtons[activeContinent].dataset.continent === "Africa") enterTour();
});

landing.addEventListener("wheel", (event) => {
  if (continentWheelLocked || Math.abs(event.deltaY) < 12) return;
  continentWheelLocked = true;
  updateContinentPicker(activeContinent + (event.deltaY > 0 ? 1 : -1));
  window.setTimeout(() => { continentWheelLocked = false; }, 520);
}, { passive: true });

continentPicker.addEventListener("touchstart", (event) => {
  continentTouchStartY = event.changedTouches[0].clientY;
}, { passive: true });

continentPicker.addEventListener("touchend", (event) => {
  const distance = continentTouchStartY - event.changedTouches[0].clientY;
  if (Math.abs(distance) > 42) updateContinentPicker(activeContinent + (distance > 0 ? 1 : -1));
}, { passive: true });

document.querySelectorAll(".menu-toggle").forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const menu = document.querySelector(`#${toggle.getAttribute("aria-controls")}`);
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    menu.classList.toggle("is-open", !open);
  });
});

document.querySelectorAll("[data-affiliate-link]").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (link.getAttribute("href") === "#" || link.getAttribute("href") === "#tangem") {
      event.preventDefault();
      if (tour.classList.contains("is-active")) openDetails();
    }
  });
});

tour.addEventListener("wheel", (event) => {
  if (detailsPanel.classList.contains("is-open") || wheelLocked || Math.abs(event.deltaY) < 18) return;
  wheelLocked = true;
  setCountry(activeIndex + (event.deltaY > 0 ? 1 : -1));
  window.setTimeout(() => { wheelLocked = false; }, 850);
}, { passive: true });

tour.addEventListener("touchstart", (event) => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
tour.addEventListener("touchend", (event) => {
  const distance = touchStartX - event.changedTouches[0].clientX;
  if (Math.abs(distance) > 55) setCountry(activeIndex + (distance > 0 ? 1 : -1));
}, { passive: true });

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeDetails();
  if (landing.classList.contains("is-active")) {
    if (event.key === "ArrowDown") updateContinentPicker(activeContinent + 1);
    if (event.key === "ArrowUp") updateContinentPicker(activeContinent - 1);
    if (event.key === "Enter" && document.activeElement?.matches("[data-continent]")) selectOrEnterContinent(activeContinent);
    return;
  }
  if (!tour.classList.contains("is-active") || detailsPanel.classList.contains("is-open")) return;
  if (event.key === "ArrowRight" || event.key === "ArrowDown") setCountry(activeIndex + 1);
  if (event.key === "ArrowLeft" || event.key === "ArrowUp") setCountry(activeIndex - 1);
  if (event.key === "Home") setCountry(0);
  if (event.key === "End") setCountry(countries.length - 1);
});

setCountry(activeIndex, true);
updateContinentPicker(activeContinent);
