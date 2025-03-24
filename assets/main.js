document.addEventListener("DOMContentLoaded", () => {
  const titles = document.querySelectorAll(".filter-title");

  titles.forEach(title => {
      title.addEventListener("click", () => {
          const content = title.nextElementSibling;
          content.style.display = content.style.display === "block" ? "none" : "block";
      });
  });
});

let allCountries = [];

async function fetchCountries() {    
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const data = await response.json();
    allCountries = data;
    displayCountries(allCountries);
  } catch (error) {
    console.error("Ошибка загрузки стран:", error);
  }
}

let displayCountries = (countries) => {
  const container = document.getElementById("countries");
  container.innerHTML = "";

  if (countries.length === 0) {
    container.innerHTML = "<p>Нет результатов</p>";
    return;
  }

  countries.forEach(country => {
    const countryElement = document.createElement("div");
    countryElement.classList.add("country");

    const countryInfo = document.createElement("div");
    countryInfo.classList.add("country-info");
    countryInfo.innerHTML = `
      <img src="${country.flags.svg}" alt="${country.name.common}">
      <h3>${country.name.common}</h3>
      <p>Регион: ${country.region}</p>
      <p>Столица: ${country.capital ? country.capital[0] : "Нет данных"}</p>
      <p>Язык: ${Object.values(country.languages || {}).join(", ")}</p>
      <button>Подробнее</button>
    `;
    countryElement.appendChild(countryInfo);
    container.appendChild(countryElement);
  });
}

let updatePopulationValue = () => {
  const rangeInput = document.getElementById("populationRange");
  const valueDisplay = document.getElementById("populationValue");
  valueDisplay.textContent = parseInt(rangeInput.value).toLocaleString();
}

let filterCountries = () => {
  const searchValue = document.getElementById("search").value.toLowerCase();
  const population = parseInt(document.getElementById("populationRange").value);
  const selectedContinents = Array.from(document.querySelectorAll(".continent:checked")).map(input => input.value);
  const selectedLanguages = Array.from(document.querySelectorAll(".language:checked")).map(input => input.value);
  const selectedCurrencies = Array.from(document.querySelectorAll("input[name='currency']:checked")).map(input => input.value);
  const independence = Array.from(document.querySelectorAll("#independence input:checked")).map(input => input.value);
  const timezones = Array.from(document.querySelectorAll("#timezone input:checked")).map(input => input.value);
  const seaAccess = document.querySelector("#sea_access")?.checked ? "true" : "false";
  const unMembership = document.querySelector("#un_membership")?.checked ? "true" : "false";

  const filteredCountries = allCountries.filter(country => {
    const nameMatches = country.name.common.toLowerCase().includes(searchValue);
    const populationMatches = country.population <= population;
    const continentMatches = selectedContinents.length === 0 || selectedContinents.includes(country.region);
    const languageMatches = selectedLanguages.length === 0 || (country.languages && Object.keys(country.languages).some(lang => selectedLanguages.includes(lang)));
    const currencyMatches = selectedCurrencies.length === 0 || (country.currencies && Object.keys(country.currencies).some(curr => selectedCurrencies.includes(curr)));
    const independenceMatches = independence.length === 0 || (country.independent !== undefined && independence.includes(country.independent.toString()));
    const timezoneMatches = timezones.length === 0 || (country.timezones && timezones.includes(country.timezones[0]));
    const seaAccessMatches = seaAccess === undefined || (country.borders ? "true" : "false") === seaAccess;
    const unMembershipMatches = unMembership === undefined || (country.unMember !== undefined && country.unMember.toString() === unMembership);

    return nameMatches && populationMatches && continentMatches && languageMatches && currencyMatches && independenceMatches && timezoneMatches && seaAccessMatches && unMembershipMatches;
  });

  displayCountries(filteredCountries);
}

fetchCountries();
