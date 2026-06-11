export const uploadImage = async (image: File, apiUrl: string, apiToken: string): Promise<Record<string, any>> => {
	const formData = new FormData();
	formData.append('file', image);
	formData.append('token', apiToken);
	const result = await fetch(`${apiUrl}/upload`, {
		method: 'POST',
		body: formData,
	});
	return result.json();
};
export const deleteImage = async (url: string, apiUrl: string, apiToken: string): Promise<Record<string, any>> => {
	const formData = new FormData();
	formData.append('urls', url);
	formData.append('token', apiToken);
	const result = await fetch(`${apiUrl}/delete`, {
		method: 'POST',
		body: formData,
	});
	return result.json();
};
