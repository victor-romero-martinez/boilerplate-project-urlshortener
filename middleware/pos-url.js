// @ts-check

import dns from 'dns';
import { Db } from '../db/memory.js';

/** @param {string} url */
function urlNormalized(url) {
    if (!url.startsWith('https')) return { error: 'invalid url', domain: '' }
    const match = url.trim().match(/^https:\/\/([^\/]+)(\/.*)?$/);
    return { domain: match ? match[1] : '' }
}

/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
export function postValidateUrl(req, res, next) {
    let body = '';

    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        const formData = new URLSearchParams(body);
        const url = formData.get('url');

        if (url) {
            const { domain, error } = urlNormalized(url)

            if (error) {
                req['xError'] = error
                next()
            }

            dns.lookup(domain, (err, address, _family) => {
                if (err || !address) {
                    req['xError'] = 'Invalid Hostname'
                } else {
                    const short = Db.getShortUrl(url)
                    const short_url = short ? short : Db.setUrl(url)

                    req['xData'] = { original_url: url, short_url }
                }

                next()
            })
        }
    });
}
