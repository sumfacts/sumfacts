---
permalink: /contributing
---

# Contributing guide

Thank you for your help making SumFacts better! Every contribution is appreciated. There are many areas where you can contribute.

We would love to have you join the development. We welcome implementing new features that will benefit many users and ideas to improve our documentation.

We strive to create an environment of respect and healthy discourse by setting standards for our interactions and we expect it from all members of our community - from long term project member to first time visitor. For more information, review our [code of conduct](./CODE_OF_CONDUCT.md) and values.

::: tip Submit issue first
If you plan to implement a new feature or some other change please create an issue first, to make sure that your work is not lost.
:::

[[toc]]

## Documentation

Maintaining documentation takes time. If anything is unclear, or could be explained better, we appreciate the time you spend correcting or clarifying it.

## Issues

Before submitting the issue:

- Search the existing issues
- Provide all the relevant information, reducing both your schema and data to the smallest possible size when they still have the issue.

We value simplicity - simplifying the example that shows the issue makes it more valuable for other users. This process helps us reduce situations where an error is occurring due to incorrect usage rather than a bug.

### Bug reports

Please make sure to include the following information in the issue:

1. What version of SumFacts are you using?
2. Does the issue happen if you use the latest version?
5. Your downloaded JSON code sample from the app as well as any images.
7. What results did you expect?

To speed up investigation and fixes, please include the link to the problematic Argument diagram.

[Create bug report](https://github.com/sumfacts/sumfacts/issues/new/choose).

### Security vulnerabilities

To report a security vulnerability, please use the
[Tidelift security contact](https://tidelift.com/security).
Tidelift will coordinate the fix and disclosure.

Please do NOT report security vulnerabilities via GitHub issues.

<a name="changes"></a>

### Change proposals

[Create a feature request](https://github.com/sumfacts/sumfacts/issues/new/choose) for a new feature, option or some other improvement.

Please include this information:

1. The version of SumFacts you are using.
2. The problem you want to solve.
3. Your solution to the problem.
4. Would you like to implement it?

If you’re requesting a change, it would be helpful to include this as well:

1. What you did.
2. What happened.
3. What you would like to happen.

Please include as much details as possible - the more information, the better.

<a name="compatibility"></a>

### Browser and compatibility issues

[Create an issue](https://github.com/sumfacts/sumfacts/issues/new/choose) to report a compatibility problem that only happens in a particular environment (when your code works correctly in the latest stable Node.js in linux systems but fails in some other environment).

Please include this information:

1. The version of SumFacts you are using.
2. The environment you have the problem with.
3. Your code (please make it as small as possible to reproduce the issue).
4. If your issue is in the browser, please list the other packages loaded in the page in the order they are loaded. Please check if the issue gets resolved (or results change) if you move SumFacts bundle closer to the top.
5. Results in the latest stable Node.js.
6. Results and error messages in your platform.

<a name="installation"></a>

### Installation and dependency issues

[Create an issue](https://github.com/sumfacts/sumfacts/issues/new/choose) to report problems that happen during SumFacts installation or when SumFacts is missing some dependency.

Before submitting the issue, please try the following:

- use the latest stable Node.js and `npm`
- try using `yarn` instead of `npm`
- remove `node_modules` and `package-lock.json` and run `yarn` again

If nothing helps, please submit:

1. The version of SumFacts you are using
2. Operating system and Node.js, and browser version
3. Package manager and its version
4. Link to (or contents of) package.json and package-lock.json
5. Error messages
6. The output of `npm ls`

## Code

Thanks a lot for considering contributing to SumFacts! We look forward to your contributions.

### How we make decisions

We value conscious curation of our library size, and balancing performance and functionality. To that end, we cannot accept every suggestion. When evaluating pull requests we consider:

- Will this benefit many users or a niche use case?
- How will this impact the performance of SumFacts?
- How will this expand our library size?

To help us evaluate and understand, when you submit an issue and pull request:

- Explain why this feature is important to the user base
- Include documentation
- Include test coverage with any new feature implementations

Please include documentation and test coverage with any new feature implementations.

### Development

Running tests:

```bash
yarn
yarn test
```

`yarn build` - compiles typescript to dist folder.

`yarn dev` - automatically compiles typescript when files in the src directory change.

### Pull requests

We want to iterate on the code efficiently. To speed up the process, please follow these steps:

1. Submit an [issue with the bug](https://github.com/sumfacts/sumfacts/issues/new/choose) or with the proposed change (unless the contribution is to fix the documentation typos and mistakes).
2. Describe the proposed api and implementation plan (unless the issue is a relatively simple bug and fixing it doesn't change any api).
3. Once agreed, please write as little code as possible to achieve the desired result. We are passionate about keeping our library size optimized.
4. Please add the tests both for the added feature and, if you are submitting an option, for the existing behaviour when this option is turned off or not passed.
5. Please avoid unnecessary changes, refactoring or changing coding styles as part of your change (unless the change was proposed as refactoring).
6. Follow the coding conventions even if they are not validated.
7. Please run the tests before committing your code.
8. If tests fail in CI build after you make a PR please investigate and fix the issue.

### Contributions license

When contributing the code you confirm that:

1. Your contribution is created by you.
2. You have the right to submit it under the MIT license.
3. You understand and agree that your contribution is public, will be stored indefinitely, can be redistributed as the part of SumFacts or another related package under MIT license, modified or completely removed from SumFacts.
4. You grant irrevocable MIT license to use your contribution as part of SumFacts or any other package.
5. You waive all rights to your contribution.
6. Unless you request otherwise, you can be mentioned as the author of the contribution in the SumFacts documentation and change log.