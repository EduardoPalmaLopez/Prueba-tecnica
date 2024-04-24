const renderUsers = (users) => {
  const usersContainer = document.getElementById("users");
  usersContainer.innerHTML = "";
  users.forEach((user) => {
    const userElement = document.createElement("div");
    userElement.className = "card";
    if (user.location.country === "Mexico") {
      userElement.classList.add("mexico");
    }
    userElement.innerHTML = `
        <div class="container">
          <img src="${user.picture.large}" alt="${user.name.first} ${user.name.last}" class="avatar_img"/>
          <h4 class="reset_text"><b>${user.name.first} ${user.name.last}</b></h4>
          <p class="reset_text">${user.dob.age} años</p>
          <p class="reset_text">${user.location.street.name}, ${user.location.city}</p>
        </div>
      `;
    usersContainer.appendChild(userElement);
  });
};

const updateResultCount = (count) =>
  (document.getElementById("resultCount").textContent = `Resultados: ${count}`);

const showSpinner = (show) =>
  (document.getElementById("spinner").style.display = show ? "block" : "none");

let allUsers = [];

const fetchUsers = async () => {
  try {
    showSpinner(true);

    const response = await fetch("https://randomuser.me/api/?results=100");
    if (!response.ok) {
      throw new Error("No se pudo obtener los datos");
    }

    const data = await response.json();
    allUsers = data.results;
    updateCountriesDropdown(allUsers);
    renderUsers(allUsers);
  } catch (error) {
    console.error("Error al cargar los datos:", error);
    alert("Hubo un problema al obtener los datos. Intente de nuevo más tarde.");
  } finally {
    showSpinner(false);
  }
};

fetchUsers();

// Filter users to obtained in fetch
const filterUsers = () => {
  const searchInput = document.getElementById("search").value.toLowerCase();
  const countrySelect = document.getElementById("country").value;

  const filteredUsers = allUsers.filter((user) => {
    const fullName = `${user.name.first.toLowerCase()} ${user.name.last.toLowerCase()}`;
    const matchesName = fullName.includes(searchInput);
    const matchesCountry =
      user.location.country === countrySelect || countrySelect === "";
    return matchesName && matchesCountry;
  });

  renderUsers(filteredUsers);
  updateResultCount(filteredUsers.length);
};

const updateCountriesDropdown = (users) => {
  const countrySet = new Set();
  users.forEach((user) => countrySet.add(user.location.country));

  const countrySelect = document.getElementById("country");
  countrySelect.innerHTML = '<option value="">Todos los países</option>'; // Reset options

  countrySet.forEach((country) => {
    const option = document.createElement("option");
    option.value = country;
    option.textContent = country;
    countrySelect.appendChild(option);
  });
};

const toggleResultCount = (show) => {
  const resultCountElement = document.getElementById("resultCount");
  if (show) {
    resultCountElement.classList.add("visible");
  } else {
    resultCountElement.classList.remove("visible");
  }
};

document.getElementById("search").addEventListener("input", () => {
  filterUsers();
  toggleResultCount(true);
});
document.getElementById("country").addEventListener("change", () => {
  filterUsers();
  toggleResultCount(true);
});
