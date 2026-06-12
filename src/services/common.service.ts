import { uploadImage, deleteImage } from '../utils';

export class CommonService {
	private imageApiUrl: string;
	private imageApiToken: string;
	constructor(imageApiUrl: string, imageApiToken: string) {
		this.imageApiUrl = imageApiUrl;
		this.imageApiToken = imageApiToken;
	}
	async uploadImage(image: File) {
		console.log('上传图片:', image.name);
		return await uploadImage(image, this.imageApiUrl, this.imageApiToken);
	}
	async deleteImage(url: string) {
		if (!url) return null;
		console.log('删除图片:', url);
		return await deleteImage(url, this.imageApiUrl, this.imageApiToken);
	}
}
