const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

const revealElements = document.querySelectorAll(
  ".section-heading, .feature-card, .showcase-copy, .dashboard, .contact-card"
);

if (
  !reducedMotion.matches &&
  "IntersectionObserver" in window
) {
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12
    }
  );

  revealElements.forEach(function (element) {
    element.classList.add("reveal-ready");
    observer.observe(element);
  });

  // Give the three feature cards a small stagger.
  document.querySelectorAll(".feature-card").forEach(
    function (card, index) {
      card.style.setProperty(
        "--reveal-delay",
        `${index * 100}ms`
      );
    }
  );
}

const earthModel = document.getElementById("earth-model");
const planetStage = document.querySelector(".planet-stage");

function updateEarthMotion() {
  const shouldRotate = !reducedMotion.matches && !document.hidden;

  earthModel.toggleAttribute("auto-rotate", shouldRotate);
}

function showEarth() {
  planetStage.classList.add("model-loaded");
  updateEarthMotion();
}

earthModel.addEventListener("load", showEarth);

earthModel.addEventListener("error", function () {
  planetStage.classList.remove("model-loaded");
  console.warn("The Earth model could not load. Showing the CSS fallback.");
});

reducedMotion.addEventListener("change", updateEarthMotion);
document.addEventListener("visibilitychange", updateEarthMotion);

// Also handle a model that finishes loading before setup completes.
customElements.whenDefined("model-viewer").then(function () {
  if (earthModel.loaded) {
    showEarth();
  }
});