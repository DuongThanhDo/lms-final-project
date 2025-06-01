function setSession(token, minutes) {
    const now = new Date();
    const expirationTime = now.getTime() + minutes * 60 * 1000;
    const sessionData = {
        token: token,
        expiresAt: expirationTime
    };
    localStorage.setItem("userSession", JSON.stringify(sessionData));
}

function getSession() {
    const sessionData = localStorage.getItem("userSession");
    if (!sessionData) return null;

    const { token, expiresAt } = JSON.parse(sessionData);
    const now = new Date().getTime();

    if (now > expiresAt) {
        localStorage.removeItem("userSession");
        return null;
    }
    return token;
}
