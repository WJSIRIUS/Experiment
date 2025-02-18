
export function saveData(key,data) {
    localStorage.setItem(key, JSON.stringify(data))
}

export function loadData(key) {
    const storedData = JSON.parse(localStorage.getItem(key))
    return storedData
}

export function clearData(key) {
    localStorage.removeItem(key)
}

