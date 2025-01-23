import {
  inputEnabled,
  setDiv,
  message,
  setToken,
  token,
  enableInput,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showAddEdit } from "./addEdit.js";

let evsDiv = null;
let evsTable = null;
let evsTableHeader = null;

export const handleEvs = () => {
  evsDiv = document.getElementById("evs");
  const logoff = document.getElementById("logoff");
  const addEv = document.getElementById("add-ev");
  evsTable = document.getElementById("evs-table");
  evsTableHeader = document.getElementById("evs-table-header");

  evsDiv.addEventListener("click", (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addEv) {
        showAddEdit(null);
      } else if (e.target === logoff) {
        setToken(null);

        message.textContent = "You have been logged off.";

        jobsTable.replaceChildren([jobsTableHeader]);

        showLoginRegister();
      } else if (e.target.classList.contains("editButton")) {
        message.textContent = "";
        showAddEdit(e.target.dataset.id);
      }
    }
  });
};

export const showEvs = async () => {
  try {
    enableInput(false);

    const response = await fetch("/api/v1/evs", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    let children = [evsTableHeader];

    if (response.status === 200) {
      if (data.count === 0) {
        evsTable.replaceChildren(...children); // clear this for safety
      } else {
        for (let i = 0; i < data.evs.length; i++) {
          let rowEntry = document.createElement("tr");

          let editButton = `<td><button type="button" class="editButton" data-id=${data.evs[i]._id}>edit</button></td>`;
          let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.evs[i]._id}>delete</button></td>`;
          let rowHTML = `
            <td>${data.evs[i].make}</td>
            <td>${data.evs[i].model}</td>
            <td>${data.evs[i].status}</td>
            <div>${editButton}${deleteButton}</div>`;

          rowEntry.innerHTML = rowHTML;
          children.push(rowEntry);
        }
        evsTable.replaceChildren(...children);
      }
    } else {
      message.textContent = data.msg;
    }
  } catch (err) {
    console.log(err);
    message.textContent = "A communication error occurred.";
  }
  enableInput(true);
  setDiv(evsDiv);
};