// @ts-check

import dns from 'dns'
import { Db } from '../db/memory.js'

/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
export function getValidateUrl(req, res, next) {
    const { short } = req.params;

    if (short) {
        dns.lookup(short, (err, address, _family) => {
            if (err) {
                req['xError'] = 'Invalid Hostname'
            } else {
                const n = Number(short)
                if (isNaN(n)) {
                    req['xError'] = 'Wrong format'
                } else {
                    const newUrl = Db.getFullUrl(n)
                    
                    if (newUrl) {
                        req['xData'] = newUrl
                    } else {
                        req['xError'] = 'No short URL found for the given input'
                    }
                }
            }

            next()
        })
    }
}

