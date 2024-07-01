document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("user-form");
    const userTableBody = document.getElementById("user-table-body");

    // Function to load users from the server
    function loadUsers() {
      fetch("http://localhost:3000/users")
        .then((response) => response.json())
        .then((users) => {
          userTableBody.innerHTML = "";
          users.forEach((user) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.first_name}</td>
                <td>${user.dni}</td>
                <td>${user.gender}</td>
                <td>${user.birthdate}</td>
                <td>
                  <button onclick="editUser(${user.id}, '${user.name}', '${user.first_name}', '${user.dni}', '${user.gender}', '${user.birthdate}')">Editar</button>
                  <button onclick="deleteUser(${user.id})">Eliminar</button>
                </td>
              `;
            userTableBody.appendChild(row);
          });
        });
    }

    // Initial load of users
    loadUsers();

    // Function to handle form submission
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const first_name = document.getElementById("first_name").value;
      const dni = document.getElementById("dni").value;
      const genderSelect = document.getElementById("gender-select");
      const genderRadio = document.querySelector('input[name="gender"]:checked');
      const gender = genderSelect.value || (genderRadio ? genderRadio.value : '');
      const birthdate = document.getElementById("birthdate").value;

      fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, first_name, dni, gender, birthdate }),
      })
        .then((response) => response.text())
        .then((message) => {
          console.log(message);
          loadUsers();
          form.reset();
        });
    });

    // Function to delete a user
    window.deleteUser = function (id) {
      fetch(`http://localhost:3000/users/${id}`, {
        method: "DELETE",
      })
        .then((response) => response.text())
        .then((message) => {
          console.log(message);
          loadUsers();
        });
    }

    // Function to edit a user
    window.editUser = function (id, name, first_name, dni, gender, birthdate) {
      const newName = prompt("Ingrese el nuevo nombre:", name);
      const newFirstName = prompt("Ingrese el nuevo apellido:", first_name);
      const newDni = prompt("Ingrese el nuevo DNI:", dni);
      const newGender = prompt("Ingrese el nuevo género (M/F/O/P):", gender);
      const newBirthdate = prompt("Ingrese la nueva fecha de nacimiento (YYYY-MM-DD):", birthdate);

      if (newName && newFirstName && newDni && newGender && newBirthdate) {
        fetch(`http://localhost:3000/users/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newName, first_name: newFirstName, dni: newDni, gender: newGender, birthdate: newBirthdate }),
        })
          .then((response) => response.text())
          .then((message) => {
            console.log(message);
            loadUsers();
          });
      }
    }
  });