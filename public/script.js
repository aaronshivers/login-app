const navLinks = document.getElementById('navLinks')

document.cookie ? null : navLinks.innerHTML += `<li class="nav-item"><a class="nav-link" href="/login">Login</a></li>`
document.cookie ? null : navLinks.innerHTML += `<li class="nav-item"><a class="nav-link" href="/signup">Signup</a></li>`
document.cookie ? navLinks.innerHTML += `<li class="nav-item"><a class="nav-link" href="/profile">Profile</a></li>` : null
document.cookie ? navLinks.innerHTML += `<li class="nav-item"><a class="nav-link" href="/logout">Logout</a></li>` : null
