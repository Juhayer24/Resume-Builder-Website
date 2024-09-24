function registerUser() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ firstName, lastName, email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Signup successful!');
            window.location.href = 'login.html';
        } else {
            console.log(data, response);
            alert('Signup failed: ' + data.message);
        }
    })
    .catch(err => {
        console.error('Error:', err);
        alert('Signup failed!');
    });
}