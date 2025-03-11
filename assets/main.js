document.addEventListener("DOMContentLoaded", () => {
  const titles = document.querySelectorAll(".filter-title");

  titles.forEach(title => {
      title.addEventListener("click", () => {
          const content = title.nextElementSibling;

          if (content.style.display === "block") {
              content.style.display = "none";
          } else {
              content.style.display = "block";
          }
      });
  });
});


let allCountries = [];

async function fetchCountries() {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,capital,flags,population,region,languages"
    );
    const data = await response.json();
    allCountries = data;
    displayCountries(allCountries);
  } catch (error) {
    console.error("Error", error);
  }
}

let displayCountries = (countries) => {
  const container = document.getElementById("countries");
  container.innerHTML = "";

  countries.forEach((country) => {
    const countryElement = document.createElement("div");
    countryElement.classList.add("country");
    countryElement.innerHTML = `
                      <img src="${country.flags.svg}" alt="${
      country.name.common
    }">
                      <h3>${country.name.common}</h3>
                      <p>Столица: ${
                        country.capital ? country.capital[0] : "Нет данных"
                      }</p>
                      <p>Население: ${country.population.toLocaleString()}</p>
                      <p>Континент: ${country.region}</p>
                  `;
    container.appendChild(countryElement);
  });
};

let filterCountries = () => {
  const searchValue = document.getElementById("search").value.toLowerCase();
  const minPopulation =
    parseInt(document.getElementById("minPopulation").value) || 0;
  const maxPopulation =
    parseInt(document.getElementById("maxPopulation").value) || Infinity;
  const selectedContinent = Array.from(
    document.querySelectorAll(".continent:checked")
  ).map((input) => input.value);
  const selectedGovernments = Array.from(
    document.querySelectorAll(".government:checked")
  ).map((input) => input.value);
  const selectedLanguage = document.querySelector(
    "input[name='language']:checked"
  )?.value;

  const filteredCountries = allCountries.filter((country) => {
    const name = country.name.common.toLowerCase();
    const population = country.population;
    const continent = country.region;
    const languages = country.languages ? Object.values(country.languages) : [];

    return (
      name.includes(searchValue) &&
      population >= minPopulation &&
      population <= maxPopulation &&
      (selectedContinent.length === 0 ||
        selectedContinent.includes(continent)) &&
      (!selectedLanguage || languages.includes(selectedLanguage))
    );
  });

  displayCountries(filteredCountries)
};

fetchCountries()
