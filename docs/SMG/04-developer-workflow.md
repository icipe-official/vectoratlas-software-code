# Developer Workflow

## General story workflow
Ensure that you have a working development environment, instructions [here](./03-setting-up-a-development-env.md). When doing development for the Vector Atlas system, you should use the following process:
1. Select a story from the GitHub project board.
1. Pull the latest version of the `main` branch
1. Create a branch from there called `feature/{insert general name of story}-#{story number}`
1. Put the story into `In Progress` on the GitHub project board
1. Repeatedly during development:
   1. Develop code/write tests
   1. Ensure all tests pass
   1. Run linter and fix issues
   1. Commit
   1. (optionally) push to `origin`
1. Merge `origin/main` into your feature branch.
1. Run unit tests
1. Check impact on coverage, write more tests if below threshold.
1. Run any system tests if relevant.
1. Push to `origin`
1. Make a pull request
1. Put the story into `In review` on the GitHub project board
1. Get the pull request reviewed and address any comments
1. Wait for the automated build on GitHub project to succeed
1. Once a pull request is approved then it can be merged back into `origin/main` by completing the pull request.
1. Check that the merge build succeeded.
1. Move the story to `In testing` on the GitHub project board
1. If a bug is found in testing, move the story back to `In Progress` and start the workflow again from Step 4.
1. If the code passes then it is a Tester's responsibility to move the story to `Done`.
