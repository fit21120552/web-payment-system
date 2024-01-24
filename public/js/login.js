$(document).ready(() => {
    const AuthServerURL = "https://localhost:3003/auth";
    const loginForm = $("#loginForm")

    loginForm.on("submit", async function (e) {
        e.preventDefault();
        //remove validate
        $("#username").removeClass("is-invalid");
        $("#us").text("");
        $("#password").removeClass("is-invalid");
        $("#pw").text("");
        const data = $(this)
            .serializeArray()
            .reduce((obj, field) => ({ ...obj, [field.name]: field.value }), {});

        $.ajax(
            {
                url: `/auth/loginGame`,
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (response) {
                    if (response.success) {
                        const userData = response.user;
                        const form = $('<form action="http://localhost:21455/success" method="post" style="display:none;"></form>');
                        for (const key in userData) {
                            if (userData.hasOwnProperty(key)) {
                                form.append(`<input type="hidden" name="${key}" value="${userData[key]}" />`);
                            }
                        }
                        $('body').append(form);
                        form.submit();
                    }
                    else {
                        if (response.pw) {
                            $("#username").addClass("is-invalid");
                            $("#us").text(response.msg);
                        }
                        else {
                            $("#password").addClass("is-invalid");
                            $("#pw").text(response.msg);
                        }
                    }
                },
                error: function (err) {
                    console.log(err);
                }
            }
        )
    })
});