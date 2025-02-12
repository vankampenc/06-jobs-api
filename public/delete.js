import { showEvs } from "./evs.js";
import { enableInput, message, token } from "./index.js"

export const deleteEntry = async (evId) => {
    if (!evId) {
message.textContent = "An Error Occurred"
    } else {
        try {
            enableInput(false)
            const response = await fetch(`/api/v1/evs/${evId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },

            });
            if (response.status === 200) {
                message.textContent = "EV entry deleted"
                showEvs()
            } else {
                const data = await response.json()
                message.textContent = data.msg;
            }
        } catch (err) {
            console.log(err);
            message.textContent = "A communication error occurred.";
        }
        enableInput(true)
    }
}

