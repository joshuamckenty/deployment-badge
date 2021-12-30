import type { NextApiRequest, NextApiResponse } from 'next';
export declare type DeploymentBadgeHandlerOptions = {
    deploymentsUrl: string;
    namedLogo?: string;
    env?: string;
};
declare const deploymentBadgeHandler: (req: NextApiRequest, res: NextApiResponse, options: DeploymentBadgeHandlerOptions) => Promise<void>;
export default deploymentBadgeHandler;
