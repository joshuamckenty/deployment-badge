import Cors from 'cors'
import type { NextApiRequest, NextApiResponse } from 'next'

const cors = Cors({
    methods: ['GET', 'HEAD'],
})

type MiddlewareFunction = (req: NextApiRequest, res: NextApiResponse, f: (result: unknown) => void) => void

const runMiddleware = (
    req: NextApiRequest,
    res: NextApiResponse,
    fn: MiddlewareFunction,
): Promise<unknown> => {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result)
            }

            return resolve(result)
        })
    })
}

export type DeploymentBadgeHandlerOptions = {
    deploymentsUrl: string
    namedLogo?: string
    env?: string
}

const deploymentBadgeHandler = async (req: NextApiRequest, res: NextApiResponse, options: DeploymentBadgeHandlerOptions): Promise<void> => {
    // Run the middleware
    await runMiddleware(req, res, cors as unknown as MiddlewareFunction)

    const env = options.env?? 'Production'

    const statusesUrl = await new Promise<string>((resolve) => {
        fetch(options.deploymentsUrl, {
            ...options, 
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`${process.env.GITHUB_USER}:${process.env.GITHUB_PAT}`).toString('base64')
            }
        })
            .then((response) => response.json())
            .then((data) => {
                const matchingData = data.find((d) => d['environment'] === env)
                resolve(matchingData['statuses_url'])
            })
    })
    console.log(statusesUrl)

    const state = await new Promise<string>((resolve) => {
        fetch(statusesUrl, {
            ...options, 
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`${process.env.GITHUB_USER}:${process.env.GITHUB_PAT}`).toString('base64')
            }
        })
            .then((response) => response.json())
            .then((data) => resolve(data[0]['state']))
    })
    console.log(state)

    let color = 'green'
    if (state === 'pending' || state === 'queued' || state === 'in_progress') {
        color = 'yellow'
    } else if (state === 'failure' || state === 'error') {
        color = 'red'
    }

    res.json({ schemaVersion: 1, label: 'deployment', message: state, color, namedLogo: options.namedLogo })
}

export default deploymentBadgeHandler
