class QuakeData {
  constructor(
    idi,
    mag,
    place,
    prof,
    date,
    time,
    country,
    lon,
    lat,
    tmssp,
    isnew
  ) {
    this.id = idi;
    this.magnitud = mag;
    this.lugar = place;
    this.profundidad = prof;
    this.date = date;
    this.time = time;
    this.pais = country;
    this.longitud = lon;
    this.latitud = lat;
    this.timestamp = tmssp;
    this.isnew = isnew;
    this.marker = null;
  }
}

var quakes = [];
var earth = new WE.map("earth_div");
var country = "default";
var order = "default";
var markers = [];
var list = [];
var next = "";

const selectElement = document.getElementById("select2");

selectElement.addEventListener("change", function () {
  country = selectElement.value;
  show();
});

const selectedOrder = document.getElementById("select1");

selectedOrder.addEventListener("change", function () {
  order = selectedOrder.value;
  show();
});

document.addEventListener("DOMContentLoaded", async function () {
  initialize();
  await newQ();
  createCountries();
});

function initialize() {
  WE.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
    earth
  );
}

document.body.addEventListener("click", function (event) {
  if (event.target.classList.contains("item")) {
    requestAnimationFrame(() => {
      const elementId = parseInt(event.target.id, 10);

      if (
        Number.isInteger(elementId) &&
        elementId >= 0 &&
        elementId < list.length
      ) {
        const marker = list[elementId].marker;
        if (marker && marker.element && marker.element.firstElementChild) {
          marker.element.firstElementChild.style.backgroundImage =
            "url(data:image/png;base64,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";
        }

        earth.setView([list[elementId].latitud, list[elementId].longitud]);
        earth.setZoom(10);
      } else {
        console.error("Invalid elementId:", elementId);
      }
    });
  }
});

async function updateQ() {
  if (quakes.length === 0) {
    console.error("No quakes data available");
    return;
  }

  let starttime = next;

  try {
    const response = await fetch("http://localhost:5000/quake/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ starttime }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    if (data.error) {
      console.error("Error:", data.error);
      return;
    }

    if (data.length > 0) {
      let existingIds = new Set(quakes.map((q) => q.id));
      let newQuakes = [];

      for (let i = 0; i < data.length; i++) {
        if (!existingIds.has(data[i].id)) {
          console.log("Sila");
          console.log(data);
          let mag = data[i].magnitud;
          let q = new QuakeData(
            data[i].id,
            mag.toFixed(1),
            data[i].lugar,
            data[i].profundidad,
            data[i].date,
            data[i].time,
            data[i].pais,
            data[i].longitud,
            data[i].latitud,
            data[i].timestamp,
            true
          );
          newQuakes.push(q);
        }
      }

      quakes = [...quakes, ...newQuakes];
      next = data[data.length - 1].timestamp;
      show();
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function newQ() {
  try {
    const response = await fetch("http://localhost:5000/quake/new");

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      console.error("No data returned");
      return;
    }

    quakes = data.map(
      (q) =>
        new QuakeData(
          q.id,
          q.magnitud.toFixed(1),
          q.lugar,
          q.profundidad,
          q.date,
          q.time,
          q.pais,
          q.longitud,
          q.latitud,
          q.timestamp,
          false
        )
    );

    next = quakes[0].timestamp;
    show();
  } catch (error) {
    console.error("Error:", error);
  }
}

async function createCountries() {
  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/all?fields=translations,cca2`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      console.error("No data returned");
      return;
    }

    const panel = document.querySelector(".countries");
    for (let i = 0; i < data.length; i++) {
      for (let li = 0; li < list.length; li++) {
        if (data[i].cca2 === list[li].pais) {
          let option = document.createElement("option");
          option.value = data[i].cca2;
          option.textContent = data[i].translations.spa.common;
          panel.appendChild(option);
          break;
        }
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function show() {
  list = [...quakes];

  if (country !== "default") {
    list = list.filter((q) => q.pais === country);
  }

  if (order !== "default") {
    switch (order) {
      case "1":
        list.reverse();
        break;
      case "2":
        break;
      case "3":
        list.sort((a, b) => a.magnitud - b.magnitud);
        break;
      case "4":
        list.sort((a, b) => b.magnitud - a.magnitud);
        break;
    }
  }

  updateDOM();
}

function updateDOM() {
  const itemPane = document.querySelector(".itemPane");
  itemPane.innerHTML = "";

  markers.forEach((marker) => marker.removeFrom(earth));
  markers = [];

  list.forEach((quake, i) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = quake.isnew ? "newitem" : "item";
    itemDiv.id = i;

    const magHeader = document.createElement("h1");
    magHeader.id = "Mag";
    magHeader.textContent = quake.magnitud;
    itemDiv.appendChild(magHeader);

    const valuesDiv = document.createElement("div");
    valuesDiv.className = "values";
    itemDiv.appendChild(valuesDiv);

    const subvalueDiv = document.createElement("div");
    subvalueDiv.className = "subvalue";
    valuesDiv.appendChild(subvalueDiv);

    const placeParagraph = document.createElement("p");
    placeParagraph.id = "Place";
    placeParagraph.textContent = quake.lugar;
    subvalueDiv.appendChild(placeParagraph);

    const subvalue2Div = document.createElement("div");
    subvalue2Div.className = "subvalue2";
    valuesDiv.appendChild(subvalue2Div);

    const infoParagraph = document.createElement("p");
    infoParagraph.id = "Info";
    infoParagraph.textContent = `${quake.profundidad}KM`;
    subvalue2Div.appendChild(infoParagraph);

    const dateParagraph = document.createElement("p");
    dateParagraph.id = "Date";
    dateParagraph.textContent = quake.date;
    subvalue2Div.appendChild(dateParagraph);

    const timeParagraph = document.createElement("p");
    timeParagraph.id = "Date2";
    timeParagraph.textContent = quake.time;
    subvalue2Div.appendChild(timeParagraph);

    const flagImage = document.createElement("img");
    flagImage.id = "Flag";
    flagImage.src = `https://flagsapi.com/${quake.pais}/flat/64.png`;
    flagImage.alt = "";
    valuesDiv.appendChild(flagImage);

    itemPane.appendChild(itemDiv);

    let marker = WE.marker(
      [quake.latitud, quake.longitud],
      quake.isnew
        : "data:image/png;base64,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",
      100,
      24
    ).addTo(earth);
    marker.bindPopup(
      `<p class='Text'>Fecha y Hora: ${quake.date}/${quake.time}</p>
       <p class='Text'>Lugar: ${quake.lugar}</p>
       <p class='Text'>Latitud: ${quake.latitud}</p>
       <p class='Text'>Longitud: ${quake.longitud}</p>
       <p class='Text'>Magnitud: ${quake.magnitud}</p>
       <p class='Text'>Profundidad: ${quake.profundidad}</p>`,
      { maxWidth: 200, closeButton: true }
    );
    markers.push(marker);
    quake.marker = marker;
  });
}

setInterval(updateQ, 5000);

const news = document.getElementById("news");
const content = document.getElementById("content");
var user = null;
var newslist = null;

news.addEventListener("click", function () {
  content.classList.remove("hide");
});

window.onload = function () {
  tryfetch();
  getnews();
};

function getnews() {
  fetch(`http://localhost:5000/news/select`)
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        const content = document.getElementById("content");
        content.innerHTML = "";

        const i = document.createElement("i");
        i.classList.add("fa-solid");
        i.classList.add("fa-circle-xmark");
        i.id = "exit";

        i.addEventListener("click", function () {
          content.classList.add("hide");
        });

        content.appendChild(i);

        const p1 = document.createElement("p");
        p1.classList.add("main");
        p1.textContent = "Noticias";

        content.appendChild(p1);
      } else {
        newslist = data;
        onGetNews();
      }
    })
    .catch((error) => console.log("-" + error));
}

function tryfetch() {
  fetch(`http://localhost:3000/retrieve`)
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        console.error("Error retrieving user data:", data.error);
        window.location.href = "error2.html";
      } else {
        user = data;
        if (!user) {
          window.location.href = "error2.html";
        } else {
          userValidated();
        }
      }
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
      window.location.href = "error2.html";
    });
}

function userValidated() {
  const admin = document.getElementById("admin");
  const add = document.getElementById("add");
  const userPanel = document.getElementById("user");
  const i = document.createElement("i");

  if (user.rol) {
    admin.classList.remove("hide");
  }

  add.classList.remove("hide");

  i.classList.add("fa-solid");
  i.classList.add("fa-user");

  userPanel.innerText = user.nombre + " ";
  userPanel.appendChild(i);
}

async function onGetNews() {
  let users = [];

  try {
    const response = await fetch(`http://localhost:5000/user/select/all`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();

    if (data.error) {
      console.error("Error fetching users:", data.error);
      return;
    } else {
      users = data;
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return;
  }

  const content = document.getElementById("content");
  content.innerHTML = "";

  const i = document.createElement("i");
  i.classList.add("fa-solid");
  i.classList.add("fa-circle-xmark");
  i.id = "exit";

  i.addEventListener("click", function () {
    content.classList.add("hide");
  });

  content.appendChild(i);

  const p1 = document.createElement("p");
  p1.classList.add("main");
  p1.textContent = "Noticias";

  content.appendChild(p1);

  newslist.forEach((post) => {
    const postDiv = document.createElement("div");
    postDiv.className = "post";

    let usuario = "Anónimo";
    users.forEach((userT) => {
      if (userT.id_usuario === post.userId) {
        usuario = `${userT.nombre} ${userT.apellidos}`;
      }
    });

    const userP = document.createElement("p");
    userP.className = "user";
    userP.textContent = usuario;
    postDiv.appendChild(userP);

    const titleP = document.createElement("p");
    titleP.className = "title";
    titleP.textContent = post.title;
    postDiv.appendChild(titleP);

    const messageP = document.createElement("p");
    messageP.className = "message";
    messageP.textContent = post.content;
    postDiv.appendChild(messageP);

    const dateP = document.createElement("p");
    dateP.className = "date";
    dateP.textContent = post.nDate;

    if (user && (user.rol || user.id_usuario === post.userId)) {
      const editButton = document.createElement("button");
      editButton.className = "edit";
      editButton.textContent = "Editar Post";
      editButton.addEventListener("click", () => {
        if (editButton.textContent === "Editar Post") {
          titleP.innerHTML = `<input id="textzone" type="text" value="${post.title}" />`;
          messageP.innerHTML = `<textarea id="textarea">${post.content}</textarea>`;

          editButton.textContent = "Guardar Cambios";
        } else {
          const newTitle = titleP.querySelector("input").value;
          const newMessage = messageP.querySelector("textarea").value;

          fetch(`http://localhost:5000/news/update`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ide: post.id,
              title: newTitle,
              content: newMessage,
              date: new Date().toISOString(),
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.error) {
                console.error("Error updating post:", data.error);
              } else {
                getnews();
              }
            })
            .catch((error) => console.error("Error updating post:", error));
        }
      });
      postDiv.appendChild(editButton);

      const deleteButton = document.createElement("button");
      deleteButton.className = "delete";
      deleteButton.textContent = "Eliminar Post";
      deleteButton.addEventListener("click", () => {
        if (confirm("Seguro que desea Borrar?")) {
          fetch(`http://localhost:5000/news/delete`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ide: post.id }),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.error) {
                console.error("Error deleting post:", data.error);
              } else {
                getnews();
              }
            })
            .catch((error) => console.error("Error deleting post:", error));
        }
      });
      postDiv.appendChild(deleteButton);
    }

    postDiv.appendChild(dateP);

    content.appendChild(postDiv);
  });
}