<p align="center">
<img
    width=160px
    src="images/icon.png"
    alt="Logo"
/>
</p>
<h1 align="center">Deployment Badge</h1>

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

This [NPM package](https://www.npmjs.com/package/deployment-badge) allows to easily display a badge with the 
deployment status of your *Next.js* app on your Github README. You can use it if your deployment
platform is integrated with Github deployments, and you have connected your Github Repository
with your deployment provider to automatically trigger a new deployment when a branch is updated.

It works well with e.g. Vercel, see [an example project](https://github.com/FelixMohr/nextjs-material-ui-blog).

## How to use it

Install *deployment-badge* with your package manager:

``yarn add deployment-badge`` or ``npm install --save deployment-badge``

Create an API handler as follows in the directory *pages/api* of your Next.js project:

```typescript
import type { NextApiRequest, NextApiResponse } from 'next'
import deploymentBadgeHandler from 'deployment-badge'

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  await deploymentBadgeHandler(req, res, { deploymentsUrl: DEPLOYMENTS_URL, namedLogo: 'vercel', env: 'Production' })
}

export default handler
```

The third parameter of ``deploymentBadgeHandler`` accepts these values as options:

* *deploymentsUrl*: The Github API deployments URL of your project, e.g. https://api.github.com/repos/FelixMohr/nextjs-material-ui-blog/deployments 
* *namedLogo*: A logo to include in the generated badge. Any name from [Simple Icons](https://simpleicons.org/) can be chosen. Can be omitted.
* *env*: The environment for which to generate the badge. Can be omitted, default is *Production*

This handler will generate JSON responses that can be used by [Shields.io](https://shields.io), from where they will be added to the README.md:

```markdown
[![Deployment Status](https://img.shields.io/endpoint?url=https://devx.sh/api/deployment)](https://devx.sh)
```

Replace the URL above with the URL of your deployed handler.