const defaultIsCached = obj => !!obj

const generateConstantFromString = string => string.replace(/([A-Z])/g, $1 => `_${$1}`).toUpperCase()

const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1)

const serializeOrderedQuery = (query = {}) => {
    return Object.keys(query)
        // remove blank query params
        .filter(key => !['', undefined, null].includes(query[key]))
        // sort to ensure consistant ordering
        .sort()
        .map(key => key)
        .join('&')
}


const removeFromArray = (value, array) => {
    const valueIndex = array.indexOf(value)
    if (valueIndex === -1) return array
    return [
        ...array.slice(0, valueIndex),
        ...array.slice(valueIndex),
    ]
}

const addToArray = (value, array) => {
    const valueIndex = array.indexOf(value)
    if (valueIndex !== -1) return array
    return [...array, value]
}

module.exports = {
    defaultIsCached,
    capitalize,
    removeFromArray,
    generateConstantFromString,
    serializeOrderedQuery,
}
