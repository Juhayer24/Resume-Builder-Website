document.addEventListener('DOMContentLoaded', function () {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // Check if the user is logged in by checking a session token
    const token = localStorage.getItem('token');
    if (token) {
        const profileDiv = document.getElementById('profile');
        fetch('/api/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            profileDiv.textContent = data.email[0].toUpperCase();
            profileDiv.style.display = 'flex';
        })
        .catch(err => {
            console.error('Error:', err);
            localStorage.removeItem('token');
        });
    }

    const resumeForm = document.getElementById('resumeForm');
    if (resumeForm) {
        resumeForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const resumeData = {
                fullName: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                summary: document.getElementById('summary').value,
                experience: document.getElementById('experience').value,
                education: document.getElementById('education').value,
                skills: document.getElementById('skills').value
            };

            localStorage.setItem('resumeData', JSON.stringify(resumeData));
            alert('Resume data saved successfully!');
            // Redirect to a page to view the resume
            window.location.href = 'viewResume.html';
        });
    }
});

function storeCredentials() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('token', data.token);
            alert('Login successful!');
            window.location.href = 'home.html';
        } else {
            alert('Login failed!');
        }
    })
    .catch(err => {
        console.error('Error:', err);
        alert('Login failed!');
    });
}

function registerUser() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('/api/register', {
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
            alert('Signup failed!');
        }
    })
    .catch(err => {
        console.error('Error:', err);
        alert('Signup failed!');
    });
}

function toggleMenu() {
    const menuContent = document.getElementById('menuContent');
    if (menuContent.style.display === 'block') {
        menuContent.style.display = 'none';
    } else {
        menuContent.style.display = 'block';
    }
}

function toggleAnswer(index) {
    const answer = document.getElementById('faq-answer-' + index);
    if (answer.style.display === 'block') {
        answer.style.display = 'none';
    } else {
        answer.style.display = 'block';
    }
}

function selectTemplate(templateNumber) {
    localStorage.setItem('selectedTemplate', templateNumber);
    window.location.href = `template${templateNumber}.html`;
}

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('resumeForm');
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(form);
        const resumeData = {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            summary: formData.get('summary'),
            experience: formData.get('experience'),
            education: formData.get('education'),
            skills: formData.get('skills'),
        };

        generateResume(resumeData);
    });

    function generateResume(data) {
        const resumeContent = `
            <html>
            <head>
                <title>Resume</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    h1 { text-align: center; }
                    .section { margin-bottom: 20px; }
                    .section h2 { margin-top: 0; }
                </style>
            </head>
            <body>
                <h1>${data.fullName}</h1>
                <p>Email: ${data.email}</p>
                <p>Phone: ${data.phone}</p>
                <p>Address: ${data.address}</p>
                <div class="section">
                    <h2>Summary</h2>
                    <p>${data.summary}</p>
                </div>
                <div class="section">
                    <h2>Experience</h2>
                    <p>${data.experience}</p>
                </div>
                <div class="section">
                    <h2>Education</h2>
                    <p>${data.education}</p>
                </div>
                <div class="section">
                    <h2>Skills</h2>
                    <p>${data.skills}</p>
                </div>
            </body>
            </html>
        `;

        const blob = new Blob([resumeContent], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'resume.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
});
