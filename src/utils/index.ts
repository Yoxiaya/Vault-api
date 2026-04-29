export const parseIdParam = (id: string | undefined): number => {
	const parsedId = parseInt(id || '', 10);
	if (isNaN(parsedId)) {
		throw new Error('Invalid ID parameter');
	}
	return parsedId;
};