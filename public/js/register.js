$(document).ready(() => {

    const registerForm = $("#registerForm")

    registerForm.on("submit", async function (e) {
        e.preventDefault();
        $("#username").removeClass("is-invalid");
        $("#us").text("");
        const data = $(this)
            .serializeArray()
            .reduce((obj, field) => ({ ...obj, [field.name]: field.value }), {});

        $.ajax(
            {
                url: "https://localhost:3003/auth/register",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (response) {
                    const success = response.success;
                    if (success) {
                        window.location.href = "/auth/login";
                    }
                    else
                    {
                        $("#username").addClass("is-invalid");
                        $("#us").text("User name was exists !!");
                    }

                },
                error: function (err) {
                    console.log(err);
                }
            }
        )
    })
});