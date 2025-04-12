document.addEventListener("DOMContentLoaded", () => {
  const titles = document.querySelectorAll(".filter-title");

  titles.forEach((title) => {
    title.addEventListener("click", () => {
      const content = title.nextElementSibling;

      if (content.style.maxHeight) {
        content.style.maxHeight = null;
        content.style.opacity = "0";
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
        content.style.opacity = "1";
      }
    });
  });
});

