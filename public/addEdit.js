import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showEvs } from "./evs.js";

let addEditDiv = null;
let make = null;
let model = null;
let status = null;
let addingEv = null;

export const handleAddEdit = () => {
    addEditDiv = document.getElementById("edit-ev");
    make = document.getElementById("make");
    model = document.getElementById("model");
    status = document.getElementById("status");
    addingEv = document.getElementById("adding-ev");
    const editCancel = document.getElementById("edit-cancel");

    addEditDiv.addEventListener("click", async (e) => {
        if (inputEnabled && e.target.nodeName === "BUTTON") {
            if (e.target === addingEv) {
                enableInput(false);

                let method = "POST";
                let url = "/api/v1/evs";

                if (addingEv.textContent === "update") {
                    method = "PATCH";
                    url = `/api/v1/evs/${addEditDiv.dataset.id}`;
                }

                try {
                    const response = await fetch(url, {
                        method: method,
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            make: make.value,
                            model: model.value,
                            status: status.value,
                        }),
                    });

                    const data = await response.json();
                    if (response.status === 200 || response.status === 201) {
                        if (response.status === 200) {
                            // a 200 is expected for a successful update
                            message.textContent = "The EV entry was updated.";
                        } else {
                            // a 201 is expected for a successful create
                            message.textContent = "The EV entry was created.";
                        }

                        make.value = "";
                        model.value = "";
                        status.value = "pending";
                        showEvs();
                    } else {
                        message.textContent = data.msg;
                    }
                } catch (err) {
                    console.log(err);
                    message.textContent = "A communication error occurred.";
                }
                enableInput(true);
            } else if (e.target === editCancel) {
                message.textContent = "";
                showEvs();
            }
        }
    })
};

export const showAddEdit = async (evId) => {
    if (!evId) {
        make.value = "";
        model.value = "";
        status.value = "unknown";
        addingEv.textContent = "add";
        message.textContent = "";

        setDiv(addEditDiv);
    } else {
        enableInput(false);

        try {
            const response = await fetch(`/api/v1/evs/${evId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Got Response", response.status)
            const data = await response.json();
            console.log("Data", data)
            if (response.status === 200) {
                make.value = data.ev.make;
                model.value = data.ev.model;
                status.value = data.ev.status;
                addingEv.textContent = "update";
                message.textContent = "";
                addEditDiv.dataset.id = evId;

                setDiv(addEditDiv);
            } else {
                // might happen if the list has been updated since last display
                message.textContent = "The EVs entry was not found";
                showEvs();
            }
        } catch (err) {
            console.log(err);
            message.textContent = "A communications error has occurred.";
            showEvs();
        }

        enableInput(true);
    }
};

//original
