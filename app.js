const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand();
}

const sendBtn = document.getElementById("sendBtn");

sendBtn.addEventListener("click", () => {
  const payload = {
    type: "portfolio_contact",
    text: "User portfolio sahifasidan signal yubordi"
  };

  if (tg) {
    tg.sendData(JSON.stringify(payload));
  } else {
    alert("Bu tugma Telegram ichida ochilganda ishlaydi.");
  }
});
