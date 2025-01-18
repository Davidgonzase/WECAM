export const Logout: FunctionComponent = () => {
    function out() {
        console.log("Deleting cookie...");
        document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        console.log("Redirecting to /login...");
        window.location.href = "/login";
    }
    return (
        <button class="logout-button" onClick={() => { out(); }}>Logout</button>
    );
};
