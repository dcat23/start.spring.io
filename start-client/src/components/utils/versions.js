const strict_range = /\[(.*),(.*)\]/
const halfopen_right_range = /\[(.*),(.*)\)/
const halfopen_left_range = /\((.*),(.*)\]/
const qualifiers = ['M', 'RC', 'BUILD-SNAPSHOT', 'RELEASE']

class Versions {

    static compare(a, b) {
        let result
        const versionA = a.split('.')
        const versionB = b.split('.')
        const parseQualifier = version => {
            const qual = (version || '').replace(/\d+/g, '')
            return qualifiers.indexOf(qual) !== -1 ? qual : 'RELEASE'
        }
        for (let i = 0; i < 3; i++) {
            result = parseInt(versionA[i], 10) - parseInt(versionB[i], 10)
            if (result !== 0) {
                return result
            }
        }
        const qualify = version => qualifiers.indexOf(parseQualifier(version))
        result = qualify(versionA[3]) - qualify(versionB[3])
        if (result !== 0) {
            return result
        }
        return versionA[3].localeCompare(versionB[3])
    }

    static rangeToText(range) {
        const strict_match = range.match(strict_range)
        if (strict_match) {
            return ">= "+ strict_match[1] + " and <= " + strict_match[2]
        }
        const hor_match = range.match(halfopen_right_range)
        if (hor_match) {
            return ">= "+ hor_match[1] + " and < " + hor_match[2]
        }
        const hol_match = range.match(halfopen_left_range)
        if (hol_match) {
            return "> "+ hol_match[1] + " and <= " + hol_match[2]
        }
        return ">= " + range
    }

    static isInRange(version, range) {
        const strict_match = range.match(strict_range)
        if (strict_match) {
            return (
                Versions.compare(strict_match[1], version) <= 0 &&
                Versions.compare(strict_match[2], version) >= 0
            )
        }
        const hor_match = range.match(halfopen_right_range)
        if (hor_match) {
            return (
                Versions.compare(hor_match[1], version) <= 0 && Versions.compare(hor_match[2], version) > 0
            )
        }
        const hol_match = range.match(halfopen_left_range)
        if (hol_match) {
            return (
                Versions.compare(hol_match[1], version) < 0 && Versions.compare(hol_match[2], version) >= 0
            )
        }
        return Versions.compare(range, version) <= 0
    }

}

export default Versions
