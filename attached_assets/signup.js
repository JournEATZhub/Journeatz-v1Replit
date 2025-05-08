
async function handleSignup(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Sign up successful!');
        window.location.href = '/login.html';
    } catch (error) {
        alert('Sign up failed: ' + error.message);
    }
}
