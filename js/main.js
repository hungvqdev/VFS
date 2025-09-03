var swiper = new Swiper(".slider-content", {
  slidesPerView: 4, // mặc định desktop
  spaceBetween: 25,
  loop: true,
  grabCursor: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    0: {
      // mobile
      slidesPerView: 1,
    },
    768: {
      // tablet (>=768px)
      slidesPerView: 2,
    },
    1200: {
      // desktop (>=1200px)
      slidesPerView: 4,
    },
  },
});

var swiper = new Swiper(".swiper-hero", {
  loop: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  allowTouchMove: true,
  slidesPerView: 1,
  effect: "slide",
});

(function () {
  const modal = document.getElementById("myModal");
  const modalContent = document.getElementById("modalContent");
  const buttons = document.querySelectorAll(".openModal");
  const closeBtn = modal.querySelector(".modal-close");

  if (!modal || !modalContent || !closeBtn) {
    console.error("Modal elements not found in DOM.");
    return;
  }

  // Chuẩn hóa target (chấp nhận "#id" hoặc "id")
  function resolveTemplate(target) {
    if (!target) return null;
    const sel = target.trim().startsWith("#")
      ? target.trim()
      : "#" + target.trim();
    return document.querySelector(sel);
  }

  // Reset scroll về đầu
  function resetScroll() {
    modalContent.scrollTop = 0;
  }

  // Mở modal từ template
  function openFromTemplate(templateEl) {
    if (!templateEl) {
      console.warn("Template element not found.");
      return;
    }

    const node = templateEl.content.cloneNode(true);
    modalContent.innerHTML = "";
    modalContent.appendChild(closeBtn);
    modalContent.appendChild(node);

    modal.style.display = "flex";
    requestAnimationFrame(() => {
      modal.classList.add("show");
      resetScroll();
    });

    modal.setAttribute("aria-hidden", "false");
    modalContent.focus();
  }

  // Đóng modal
  function closeModal() {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    setTimeout(() => {
      modal.style.display = "none";
      resetScroll();
    }, 300);
  }

  // Gán sự kiện mở modal cho các nút
  buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const target = btn.getAttribute("data-target");
      const tpl = resolveTemplate(target);
      if (!tpl) {
        console.error("Không tìm thấy template cho target:", target);
        return;
      }
      openFromTemplate(tpl);
    });
  });

  // Đóng khi click ra ngoài modal-content
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Đóng khi click nút close
  closeBtn.addEventListener("click", closeModal);

  // Đóng bằng phím Escape
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("show")) {
      closeModal();
    }
  });

  // Log JS error (debug)
  window.addEventListener("error", (ev) => {
    console.error("JS Error:", ev.message, "at", ev.filename + ":" + ev.lineno);
  });
})();
