const BASE_URL = "http://localhost:8080"

export async function login(loginForm){
	const headers = new Headers();
	headers.append("Content-Type", "application/json");

	const request = new Request(BASE_URL + "/auth/login",
		{
			method: "POST",
			body: JSON.stringify(loginForm),
			headers: headers,
		});

	const response = await fetch(request);

	await throwIfNotOk(response);

	const json = await response.json();
	sessionStorage.setItem("accessToken", json.accessToken);

	return json;
}

export async function throwIfNotOk(response){

	if(!response.ok){

		let body = null;

		try{

			body = await response.json();

		} catch {

			throw new Error(`Status code: ${response.status}`);

		}

		const status = body?.status ?? response.status;
		const message = body?.message;

		throw new Error(
			message 
			? `Status code: ${status}\nError message: ${message}`
			: `Status code: ${status}`
		);
	}
}

export function getToken(){
	return sessionStorage.getItem("accessToken");
}

export async function logout(){
	sessionStorage.removeItem("accessToken");
}

export async function authenticatedFetch(path, options = {}){

	const token = getToken();

	console.log("Token retrieved: " + Boolean(token));

	const headers = new Headers(options.headers);
	headers.append("Content-Type", "application/json");
	headers.append("Authorization", `Bearer ${token}`);

	const response = await fetch(BASE_URL + path, {
		...options,
		headers
	});

	await throwIfNotOk(response);

	if(response.status === 204){
		return null;
	}

	const json = await response.json();
	return json;
}

export function hasRole(role) {
    const token = getToken();

    if (!token) return false;

    try {
        const payload = token.split(".")[1];

        if (!payload) return false;

        // Convert Base64URL to regular Base64.
        const base64 = payload
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        const padded = base64.padEnd(
            Math.ceil(base64.length / 4) * 4,
            "="
        );

        const bytes = Uint8Array.from(
            atob(padded),
            char => char.charCodeAt(0)
        );

        const claims = JSON.parse(
            new TextDecoder().decode(bytes)
        );

        return Array.isArray(claims.roles) &&
            claims.roles.includes(role);

    } catch {
        return false;
    }
}
