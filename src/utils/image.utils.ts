import { IMAGE_API_TOKEN, IMAGE_API_URL } from '../config';

export const uploadImage = async (image: File) => {
	const formData = new FormData();
	formData.append('file', image);
	formData.append('token', IMAGE_API_TOKEN);
	const result = await fetch(`${IMAGE_API_URL}/upload`, {
		method: 'POST',
		body: formData,
	});
	return result.json();
};
export const deleteImage = async (url: string) => {
	const formData = new FormData();
	formData.append('urls', url);
	formData.append('token', IMAGE_API_TOKEN);
	const result = await fetch(`${IMAGE_API_URL}/delete`, {
		method: 'POST',
		body: formData,
	});
	return result.json();
};
