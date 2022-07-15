# Coding Standards

## General principles

- All code should be developed in a feature branch for a given story.
- All code should have as much unit test coverage as possible, the target should be 80% or higher.
- Unit test should test and document behaviour and not simply run the code.
- All code should be run through static analysis if one is available, e.g. in JavaScript this would be ESLint.
- All code should be peer-reviewed in a pull request before being merged back to master.
- All builds should be automated.
- All deployments should be automated but may require approvals.
- Deployments should be configurable for different environments (i.e. Dev, QA, Staging and Prod).
- Documentation should be updated as part of stories if it is relevant to that change.
- Only code should be checked in, folders like `bin` and `obj` should be git ignored as they should be built as part of the build pipeline.
