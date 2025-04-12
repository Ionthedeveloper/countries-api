const filtersState = {
  name: "",
  languages: [],
  regions: [],
};

let currentCountries = [];

document.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch("https://restcountries.com/v3.1/all");

  currentCountries = await response.json();
  renderCountries();

  setupNameFilter();

  setupRegionFilter();

  setupLanguageFilter();
});

let renderCountries = () => {
  const countriesContainer = document.querySelector(".countries");
  countriesContainer.innerHTML = "";

  if (!currentCountries || currentCountries.length === 0) {
    countriesContainer.classList.add("empty");
    countriesContainer.innerHTML = `<p>Не найдено</p>`;
    return;
  }

  currentCountries.forEach((country) => {
    const name =
      country.translations?.rus?.official ||
      country.name.common ||
      "Нет данных";
    const capital = country.capital?.[0] || "Нет данных";
    const region = country.region || "Нет данных";
    const flag = country.flags.svg || "";

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
    <div class="country-info">
        <img src="${flag}" alt="${country.name}">
        <h3>${name}</h3>
        <p>Регион: <span>${region}</span></p>
        <p>Столица: <span>${capital}</span></p>
        <p>Язык: <span>${
          country.languages
            ? Object.values(country.languages).join(", ")
            : "Нет данных"
        }</span></p>
        <button>Подробнее</button>
        </div>
    `;

    countriesContainer.appendChild(card);
  });
};

async function applyFilters() {
  try {
    const queries = [];

    if (filtersState.name) {
      queries.push(
        fetch(
          `https://restcountries.com/v3.1/name/${encodeURIComponent(
            filtersState.name
          )}`
        ).then((response) => (response.ok ? response.json() : []))
      );
    }

    for (const region of filtersState.regions) {
      queries.push(
        fetch(`https://restcountries.com/v3.1/region/${region}`).then((r) =>
          r.ok ? r.json() : []
        )
      );
    }

    for (const lang of filtersState.languages) {
      queries.push(
        fetch(`https://restcountries.com/v3.1/lang/${lang}`).then((r) =>
          r.ok ? r.json() : []
        )
      );
    }

    if (queries.length === 0) {
      const res = await fetch("https://restcountries.com/v3.1/all");
      currentCountries = await res.json();
      renderCountries();
      return;
    }

    const results = await Promise.all(queries);
    console.log(results);
    const uniqueCountries = intersectCountries(results);
    currentCountries = uniqueCountries;

    currentCountries = results.flat();
    renderCountries();
  } catch (error) {
    console.error("Ошибка применения фильтров", error);
    renderCountries([]);
  }
}

function intersectCountries(countryLists) {
  if (!countryLists.length) return [];

  const key = (country) => country.cca3 || country.name.common;

  const keysOfTreeArrays = countryLists.map((list) => {
    return list.map(key);
  });

  const firstList = countryLists[0];
  const result = [];

  firstList.forEach((country) => {
    const countryKey = key(country);

    const inAll = keysOfTreeArrays.every((list) => list.includes(countryKey));
    if (inAll) {
      result.push(country);
    }
  });

  return result;
}

const setupNameFilter = () => {
  const input = document.getElementById("title-search");

  let debounceTimer = null;

  input.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      filtersState.name = input.value.trim();
      applyFilters();
    }, 400);
  });
};

function setupRegionFilter() {
  const checkBoxes = document.querySelectorAll(
    '.region-inputs input[type="checkbox"]'
  );
  checkBoxes.forEach((cb) => {
    cb.addEventListener("change", () => {
      filtersState.regions = Array.from(checkBoxes)
        .filter((cb) => cb.checked)
        .map((cb) => cb.dataset.region.toLowerCase());
      applyFilters();
    });
  });
}

function setupLanguageFilter() {
  const checkboxes = document.querySelectorAll(
    '.language-inputs input[type="checkbox"]'
  );
  checkboxes.forEach((cb) => {
    cb.addEventListener("change", () => {
      filtersState.languages = Array.from(checkboxes)
        .filter((cb) => cb.checked)
        .map((cb) => cb.dataset.lang);
      applyFilters();
    });
  });
}
