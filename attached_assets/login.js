
async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        alert('Login successful!');
        window.location.href = '/dashboard.html';
    } catch (error) {
        alert('Login failed: ' + error.message);
    }
}
