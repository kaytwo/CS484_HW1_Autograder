# Vitest Autograder

This autograder is intended for use with assignments that use Vitest, a test
framework for JavaScript.

It borrows heavily from the [UCSB JavaScript gradescope autograder](https://github.com/ucsb-gradescope-tools/jest-autograder), which in turn borrwed from an [autograder written for Maven
by Cole Bergmann](https://github.com/ucsb-gradescope-tools/maven-autograder), which in turn is based on earlier autograders by Phill Conrad.

# Quick Start

The core of this autograder runs at the bottom of `run_main_tests` - you can upload an autograder built using this repo and it will by default give:
* 1 point for passing `npm run format`
* 1 point for passing `npm run lint`
* 1 point for passing `npm run typecheck`

It will also give N points for each passing `vitest` test, where N is a number of points given in the title of the test (e.g. 3 for `(3 pts) connects to database`), or if no points are given, 1.


# Supplemental tests and configuration

The setup script looks for files in two special directories, `merges/` and `overrides/`.

* any files in the overrides directory will be copied into the submission
  folder, overwriting whatever is there completely. For instance, if you are
  enforcing a specific set of linter / type checker rules, you can include
  `.eslintrc.cjs` and `tsconfig.json`. You can also ensure provided test cases
  haven't been manipulated / removed from source control by providing them. This
  will not stop enterprising students from including their own tests formatted
  such that they receive extra credit, but that should be easy to find. 

* any files in the merges directory will be [merged via
  `jq`](https://stackoverflow.com/a/24904276/12887845) using the linked
  technique. This can be helpful to ensure specific `package.json` scripts have
  not been altered, but still allow students to add additional packages.

# Running / debugging

* To test the autograder locally:
  * copy a submission into `localautograder/submission/`
  * run `./run_autograder`
  

* To generate autograder for Gradescope:
  - run `./tools/make_autograder`
  - upload `Autograder.zip` to Gradescope
  - consider adjusting Gradescope settings to maximize memory/CPU if/when doing mutation testing
* To test on Gradescope:
  - create a separate repo with a sample solution (e.g. lab00-SOLUTION-PRIVATE)
  - either submit from GitHub directly, or use the download .zip feature of GitHub and submit that

# Testing multiple student solutions

It is good practice to test your autograder with multiple student solutions, for example:

* A perfect solution, such an instructor reference solution
* An almost perfect solution, to make sure that test cases catch bugs
* Various malformed solutions, to ensure that the error messages students will see in Gradescope
  will be helpful, and not too confusing.
* A vacuous solution (e.g. an empty solution) to ensure that the intended number of points
  (possibly zero) is awarded.

To enable this, you can pass an optional parameter to the run_autograder command.  This parameter
is the name of a directory to use for a sample solution other than `./localautograder/submission`.

For example, you might set up:

* `./localautograder/submission_flat`, a directory where the files are in the top level directory, rather
  than under /`src/main/java` as they should be.
* `./localautograder/submission_fail_one_test`, a solution that should fail exactly one of the instructor tests

You can then run these by running:
* `./run_autograder ./localautograder/submission_flat`
* `./run_autograder ./localautograder/submission_fail_one_test`

for example.

# Documentation

## File structure:

- `staging_main/` - The maven project used to run **instructor** tests. 
  Student code will be copied into `javascript/src/main` and the instructor will configure the `javascript/package.json` and `javascript/src/test` classes

- `localautograder/` - This folder is used when doing local testing
  of the autograder.

  `run_autograder` automatically looks here instead of `/autograder/` when the script is run on a dev machine. No configuration is necessary for this to work.
    - `localautograder/submission` = `/autograder/submission`
      This folder typically contains a sample solution that you can
      use to test the autograder locally.   Files in this folder are
      not copied into the `Autograder.zip` file.
    - `localautograder/results` = `/autograder/results`
      This folder is where the results are placed when running the 
      autograder locally to test itl.
- `tools/` - Contains some useful tools. Read more at [tools/README.md](tools/README.md)
    - `json_generator.py` - Used as a helper to write Gradescope json files from the `run_autograder` script
    - `make_autograder` - Zips only the essential autograder files, leaving out any sample solutions or other files
    - `vitest_to_gradescope.py` - transforms the json reporter format vitest output to the result.json gradescope output.
