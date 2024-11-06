export default function createClasses(list: Record<string, boolean>) {
	return Object.keys(list)
		.filter((key) => {
			return list[key]
		})
		.join(' ')
}
