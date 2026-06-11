import { uploadImage, deleteImage } from '../utils';

export class CommonService {
	private imageApiUrl: string;
	private imageApiToken: string;
	constructor(imageApiUrl: string, imageApiToken: string) {
		this.imageApiUrl = imageApiUrl;
		this.imageApiToken = imageApiToken;
	}
	async uploadImage(image: File) {
		return await uploadImage(image, this.imageApiUrl, this.imageApiToken);
	}
	async deleteImage(url: string) {
		return await deleteImage(url, this.imageApiUrl, this.imageApiToken);
	}
}
