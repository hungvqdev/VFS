var swiper = new Swiper(".swiper-hero", {
  loop: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
    pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true,
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

  const subModal = document.getElementById("mySubModal");
  const subModalContent = document.getElementById("subModalContent");

  const noCloseTemplates = ["tplLogin"];

  // stack để quản lý nhiều lớp submodal
  const subStack = [];

  function resolveTemplate(target) {
    if (!target) return null;
    const sel = target.trim().startsWith("#")
      ? target.trim()
      : "#" + target.trim();
    return document.querySelector(sel);
  }

  function resetScroll(el) {
    if (el) el.scrollTop = 0;
  }

  // --- Modal chính ---
  function openMainModal(tpl) {
    const node = tpl.content.cloneNode(true);
    modalContent.innerHTML = "";
    modalContent.appendChild(closeBtn);
    modalContent.appendChild(node);

    if (noCloseTemplates.includes(tpl.id)) {
      closeBtn.style.display = "none";
    } else {
      closeBtn.style.display = "block";
    }

    modal.style.display = "flex";
    requestAnimationFrame(() => {
      modal.classList.add("show");
      resetScroll(modalContent);
    });
  }

  function closeMainModal() {
    modal.classList.remove("show");
    setTimeout(() => {
      modal.style.display = "none";
      resetScroll(modalContent);
    }, 300);
  }

  // --- Sub modal ---
  function openSubModal(tpl, standalone = false) {
    const node = tpl.content.cloneNode(true);

    // nếu standalone → reset stack
    if (standalone) {
      subStack.length = 0;
      subModalContent.innerHTML = "";
    }

    subStack.push(tpl.id);

    subModalContent.innerHTML = "";
    subModalContent.appendChild(node);

    subModal.style.display = "flex";
    requestAnimationFrame(() => {
      subModal.classList.add("show");
      resetScroll(subModalContent);
    });

    // nút close trong submodal
    const subCloseBtn = subModalContent.querySelector(".sub-modal-close");
    if (subCloseBtn) {
      subCloseBtn.addEventListener("click", () => closeSubModal());
    }
  }

  function closeSubModal(closeAll = false) {
    if (closeAll) {
      subStack.length = 0;
      subModal.classList.remove("show");
      setTimeout(() => {
        subModal.style.display = "none";
        subModalContent.innerHTML = "";
      }, 300);
      return;
    }

    subStack.pop();
    if (subStack.length === 0) {
      // không còn sub nào → ẩn subModal
      subModal.classList.remove("show");
      setTimeout(() => {
        subModal.style.display = "none";
        subModalContent.innerHTML = "";
      }, 300);
    } else {
      // load lại submodal trước đó
      const prevTpl = document.getElementById(subStack[subStack.length - 1]);
      if (prevTpl) {
        openSubModal(prevTpl);
      }
    }
  }

  // --- Sự kiện ---
  buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const target = btn.getAttribute("data-target");
      const tpl = resolveTemplate(target);
      if (!tpl) return;
      openMainModal(tpl);
    });
  });

  closeBtn.addEventListener("click", closeMainModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeMainModal();
    }
    if (e.target.matches(".openSubModal")) {
      e.preventDefault();
      const target = e.target.getAttribute("data-target");
      const tpl = resolveTemplate(target);
      if (!tpl) return;
      openSubModal(tpl);
    }
  });

  // mở submodal standalone (ngoài modal chính)
  document.addEventListener("click", (e) => {
    if (e.target.matches(".openSubModalStandalone")) {
      e.preventDefault();
      const target = e.target.getAttribute("data-target");
      const tpl = resolveTemplate(target);
      if (!tpl) return;
      openSubModal(tpl, true);
    }
  });

  // ESC → đóng submodal trước
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (subModal.classList.contains("show")) {
        closeSubModal();
      } else if (modal.classList.contains("show")) {
        closeMainModal();
      }
    }
  });

  // API ngoài
  window.closeAllSubModals = () => closeSubModal(true);
})();
``



