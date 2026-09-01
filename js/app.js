(function () {
  const number = (window.TABUSI && window.TABUSI.whatsapp) || "";
  const message =
    (window.TABUSI && window.TABUSI.whatsappMessage) ||
    "Halo TABUSI, saya mau tanya menunya.";
  const url =
    "https://wa.me/" +
    number.replace(/\D/g, "") +
    "?text=" +
    encodeURIComponent(message);

  document.querySelectorAll("#wa-button, #wa-fab").forEach(function (link) {
    link.href = url;
    link.target = "_blank";
  });

  const links = Array.prototype.slice.call(
    document.querySelectorAll('.nav a[href^="#"]')
  );
  const sections = links
    .map(function (link) {
      return document.querySelector(link.getAttribute("href"));
    })
    .filter(Boolean);

  if (!("IntersectionObserver" in window) || !sections.length) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) {
          link.classList.toggle(
            "is-current",
            link.getAttribute("href") === "#" + entry.target.id
          );
        });
      });
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: 0.1 }
  );

  sections.forEach(function (section) {
    observer.observe(section);
  });
})();
