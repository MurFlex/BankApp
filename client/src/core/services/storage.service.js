export class StorageService {
	getItem(key) {
		const value = localStorage.getItem(key)
		return value ? JSON.parse(value) : null
	}

	setItem(key, value) {
		localStorage.setItem(key, JSON.stringify(value))
	}

	removeItem(key) {
		localStorage.removeItem(key)
	}

	clear() {
		localStorage.clear()
	}
}
