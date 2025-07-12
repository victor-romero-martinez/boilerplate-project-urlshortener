// @ts-check

class Db {
    constructor() {
        this.index = 0;
        /** @type {Map<string, number>} */
        this.db = new Map();
    }

    /** @param {string} fullUrl */
    getShortUrl(fullUrl) {
        return this.db.get(fullUrl)
    }

    /** @param {number} shorUrl */
    getFullUrl(shorUrl) {
        for (const [k, v] of this.db.entries()) {
            if (v === shorUrl) return k
        }

        return undefined
    }

    /** @param {string} url */
    setUrl(url) {
        if (this.db.has(url)) {
            return this.db.get(url)
        }

        this.index++;
        this.db.set(url.trim(), this.index);

        return this.db.get(url)
    }
}

exports.Db = new Db()