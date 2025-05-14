const apiUrl = "https://6823b82b65ba05803397b364.mockapi.io";
let username = document.getElementById("username-input");
let password = document.getElementById("password-input");
let confirmPassword = document.getElementById("confirm-password");
let submitButton = document.getElementById("submit");

submitButton.addEventListener("click", async (e) => {
  e.preventDefault();
  const user = { username: username.value, password: password.value };
  crateUser(user);
});
async function crateUser(user) {
  try {
    const checkUser = await fetch(`${apiUrl}/users?username=${user.username}`);
    if (checkUser.ok) {
      alert("اسم المستخدم موجود");
      return;
    }
    if (confirmPassword.value != password.value) {
      alert("كلمة السر غير متطابقه");
      return;
    }
    // post create user
    const response = await fetch(`${apiUrl}/users`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const data = await response.json();
    console.log("تم التسجيل", data);
    alert("تم التسجيل بنجاح");
    window.location.href = "/login.html";
  } catch (error) {
    console.log("error regster", error);
  }
}
