// ===== Ресторан «Дельта» — клиентская логика =====

// ===== Маска телефона +7 (XXX) XXX-XX-XX =====
function maskPhone(input) {
  input.addEventListener("input", function () {
    var d = input.value.replace(/\D/g, "");
    if (d.startsWith("8")) d = "7" + d.slice(1);
    if (!d.startsWith("7")) d = "7" + d;
    d = d.slice(0, 11);
    var out = "+7";
    if (d.length > 1) out += " (" + d.slice(1, 4);
    if (d.length >= 5) out += ") " + d.slice(4, 7);
    if (d.length >= 8) out += "-" + d.slice(7, 9);
    if (d.length >= 10) out += "-" + d.slice(9, 11);
    input.value = out;
  });
}

// ===== Валидация =====
function showError(id, msg) {
  var el = document.getElementById(id);
  if (el) el.textContent = msg;
}

function phoneOk(v) {
  return /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(v);
}

function validateShort(form) {
  var ok = true;
  var name = form.name.value.trim();
  var phone = form.phone.value.trim();
  showError("e-name", "");
  showError("e-phone", "");
  if (!name) {
    showError("e-name", "Укажите имя");
    ok = false;
  }
  if (!phoneOk(phone)) {
    showError("e-phone", "Формат: +7 (999) 123-45-67");
    ok = false;
  }
  return ok ? true : false; // false — остаёмся, редирект на spasibo.html при успехе
}

function validateBooking(form) {
  var ok = true;
  var ids = ["b-name", "b-phone", "b-date", "b-time", "b-guests"];
  ids.forEach(function (id) {
    showError("e-" + id.slice(2), "");
  });

  if (!form.name.value.trim()) {
    showError("e-name", "Укажите имя");
    ok = false;
  }
  if (!phoneOk(form.phone.value.trim())) {
    showError("e-phone", "Формат: +7 (999) 123-45-67");
    ok = false;
  }

  var dateVal = form.date.value;
  if (!dateVal) {
    showError("e-date", "Выберите дату");
    ok = false;
  } else {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(dateVal) < today) {
      showError("e-date", "Дата не может быть в прошлом");
      ok = false;
    }
  }

  if (!form.time.value) {
    showError("e-time", "Выберите время");
    ok = false;
  }
  var guests = form.guests.value;
  if (!guests || +guests < 1) {
    showError("e-guests", "Минимум 1 гость");
    ok = false;
  }

  return ok;
}

function validateFeedback(form) {
  var ok = true;
  showError("fe-name", "");
  showError("fe-phone", "");
  showError("fe-message", "");
  if (!form.name.value.trim()) {
    showError("fe-name", "Укажите имя");
    ok = false;
  }
  if (!phoneOk(form.phone.value.trim())) {
    showError("fe-phone", "Формат: +7 (999) 123-45-67");
    ok = false;
  }
  if (form.message.value.trim().length < 5) {
    showError("fe-message", "Напишите сообщение");
    ok = false;
  }
  return ok;
}

document.addEventListener("DOMContentLoaded", function () {
  // Мобильное меню (бургер)
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      nav.classList.toggle("open");
      burger.classList.toggle("open");
    });
    nav
      .querySelectorAll("a")
      .forEach((a) =>
        a.addEventListener("click", () => nav.classList.remove("open")),
      );
  }

  // Слайдер на главной (Swiper)
  const swiperContainer = document.querySelector(".swiper-container");
  if (swiperContainer && window.Swiper) {
    new Swiper(swiperContainer, {
      loop: true,
      autoplay: { delay: 40000, disableOnInteraction: false },
    });
  }

  // Каталог меню: фильтрация и сортировка
  var chips = document.querySelectorAll(".chip");
  var sortSelect = document.getElementById("sort");
  var grid = document.getElementById("dishes");
  var currentFilter = "Все";

  function applyState() {
    if (!grid) return;
    var cards = Array.from(grid.querySelectorAll(".dish"));
    cards.forEach(function (card) {
      var show =
        currentFilter === "Все" || card.dataset.category === currentFilter;
      card.style.display = show ? "" : "none";
    });
    if (sortSelect && sortSelect.value !== "none") {
      cards.sort(function (a, b) {
        var d = +a.dataset.price - +b.dataset.price;
        return sortSelect.value === "desc" ? -d : d;
      });
      cards.forEach(function (card) {
        grid.appendChild(card);
      });
    }
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) {
        c.classList.remove("active");
      });
      chip.classList.add("active");
      currentFilter = chip.dataset.filter;
      applyState();
    });
  });

  if (sortSelect) sortSelect.addEventListener("change", applyState);

  // Навешиваем маску на все поля телефона
  document.querySelectorAll('input[type="tel"]').forEach(maskPhone);

  // Fancybox — увеличение фото блюд и галереи
  if (window.Fancybox) {
    Fancybox.bind("[data-fancybox]", {
      loop: true, // Бесконечная прокрутка галереи по кругу
      protect: true, // Защита изображений от сохранения через правый клик
      Toolbar: {
        display: {
          left: ["infobar"],
          middle: [],
          right: ["slideshow", "thumbs", "close"], // Кнопки на верхней панели
        },
      },
    });
  }
});
