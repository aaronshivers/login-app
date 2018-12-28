const homeContainer = document.getElementById('homeContainer')
const loginLink = document.getElementsByClassName('loginLink')

document.cookie ? null : homeContainer.innerHTML += `<a class="btn btn-outline-primary btn-block mt-3" href="/login">Login</a>`
document.cookie ? null : homeContainer.innerHTML += `<a class="btn btn-outline-primary btn-block mt-3" href="/signup">Signup</a>`
document.cookie ? homeContainer.innerHTML += `<a class="btn btn-outline-primary btn-block mt-3" href="/profile">Profile</a>` : null
document.cookie ? homeContainer.innerHTML += `<a class="btn btn-outline-primary btn-block mt-3" href="/logout">Logout</a>` : null
