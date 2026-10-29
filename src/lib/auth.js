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

	if(!response.ok){

		let body = null;

		try{

			body = await response.json();

		} catch {

			throw new Error(`Status code: ${response.status}`);

		}

		throw new Error(`Status code: ${body.status}\nError message: ${body.message}`);
	}

	const json = await response.json();
	sessionStorage.setItem("accessToken", json.accessToken);

	return json;
}

export function getToken(){
	return sessionStorage.getItem("accessToken");
}

export async function logout(){
	sessionStorage.removeItem("accessToken");
}
