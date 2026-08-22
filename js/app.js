(function () {
  const number = (window.TABUSI && window.TABUSI.whatsapp) || "";
  const message =
    (window.TABUSI && window.TABUSI.whatsappMessage) ||
    "Halo TABUSI, saya mau tanya menu kopinya.";
  const url =
    "https://wa.me/" +
    number.replace(/\D/g, "") +
    "?text=" +
    encodeURIComponent(message);

  document.querySelectorAll("#wa-button, #wa-fab").forEach(function (link) {
    link.href = url;
    link.target = "_blank";
  });
})();
