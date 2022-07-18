# Branching Strategy

## Creating branches

Developers must work in branches to allow multiple people to work independently in the same code base without interfering in each others tasks.

We will use feature branches to achieve this but also to keep the method simple and less prone to complications. Feature branches should be short-lived.

![feature branches](./images/feature-branches.png =500x)

When developers start a story they should create a feature branch with the naming convention `feature/{general name of story}-#{story ID number}`, for example `feature/branching-strategy-docs-#1234`. Developers should then work on changes for that story in that branch.

When the code is ready to go back in to the `main` branch then developers should pull `origin/main` in to their branch first, make sure it still builds and that all the tests pass - this means you can check the merge is clean before impacting other developers.

![creating a pr](./images/pr-with-feature-branch.png =500x)

Developers should avoid cherry picking and squashing commits as much as possible as this complicates debugging back through history to identify where a bug occured.

> **Important:** Pull Requests can be made part way through a branch too if you have a small and complete piece of functionality that can be tested independently. It is good for branches to be short-lived to avoid as many merge-conflicts as possible.

## Pull Request Procedure

**As a developer**, when a branch is ready to be merged back in then you should create a pull request in GitHub. The description should contain:
- A general description of the changes in the pull request
- A brief method for testing the changes as a guide to testers

The pull request should be linked to the corresponding Story ID as well.

**As a reviewer**, before approving:
- review the code changes and check for any coding related issues
- ensure the build passes
- assess the impact on code coverage
- if possible run through using the new functionality yourself, otherwise talk to the developer and get them to demonstrate it working.
