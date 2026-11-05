
document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("carbonForm");

    if (!form) return;

    const fields = [
        "electricity",
        "petrol",
        "diesel",
        "lpg",
        "bus"
    ];

    function calculateFootprint(event) {

        if (event) event.preventDefault();

        const values = {};

        for (const field of fields) {
            const input = document.getElementById(field);
            const value = Number(input.value);

            if (input.value.trim() === "" ||
                !Number.isFinite(value) || value < 0) {
                alert("Please enter valid non-negative values.");
                input.focus();
                return;
            }

            values[field] = value;
        }

        // Simplified illustrative emission factors
        const electricity = values.electricity * 0.716;
        const petrol = values.petrol * 2.31;
        const diesel = values.diesel * 2.68;
        const lpg = values.lpg * 42.3;
        const bus = values.bus * 0.08;

        const total =
            electricity +
            petrol +
            diesel +
            lpg +
            bus;

        document.getElementById("carbonTotal").textContent =
            total.toFixed(2);

        document.getElementById("electricityResult").textContent =
            electricity.toFixed(2) + " kg";

        document.getElementById("petrolResult").textContent =
            petrol.toFixed(2) + " kg";

        document.getElementById("dieselResult").textContent =
            diesel.toFixed(2) + " kg";

        document.getElementById("lpgResult").textContent =
            lpg.toFixed(2) + " kg";

        document.getElementById("busResult").textContent =
            bus.toFixed(2) + " kg";

        let message = "";

        if (total < 100) {
            message = "Your entered monthly usage gives a relatively low estimated total. Continue making sustainable choices.";
        } else if (total < 300) {
            message = "Your estimated footprint is in the middle range of this calculator. Look for opportunities to save electricity and fuel.";
        } else {
            message = "Your estimated total is higher in this calculator. Consider reducing energy use and choosing shared transport where practical.";
        }

        document.getElementById("carbonMessage").textContent = message;
    }

    form.addEventListener("submit", calculateFootprint);

    form.addEventListener("reset", function () {
        setTimeout(function () {
            document.getElementById("carbonTotal").textContent = "0.00";

            fields.forEach(function (field) {
                const result = document.getElementById(field + "Result");

                if (result) result.textContent = "0 kg";
            });

            document.getElementById("carbonMessage").textContent =
                "Enter your monthly usage and calculate your result.";
        }, 0);
    });

});
