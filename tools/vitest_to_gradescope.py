#!/usr/bin/env python3

import json
import argparse
import os
from pathlib import Path
import re

import itertools
flatten = itertools.chain.from_iterable

def jest_assertion_to_gradescope(assertion):
    the_test = {
        "name": get_name(assertion),
        "max_score": get_max_score(assertion),
        "score": get_score(assertion), 
        "output": get_output(assertion)
    }
    return the_test

def get_name(assertion):
    ancestors = map(lambda x:f'[{x}]', assertion["ancestorTitles"])
    #formatted_ancestors = ": ".join(map(lambda x: f'[{x}]', assertion["ancestors"])
    formatted_ancestors = "".join(ancestors)
    return f'{formatted_ancestors}: {assertion["title"]}'

def get_max_score(assertion):
    regex=r'^(\(\s*(\d+)\s*pt[s]?[\s]*\))?(.*)$'
    match = re.search(regex, assertion["title"])
    return match.group(2) if match.group(2) is not None else 1

def get_score(assertion):
    max_score = get_max_score(assertion)
    if assertion["status"]=="passed":
        return max_score
    else:
        return 0

def get_output(assertion):
    return "\n".join(assertion["failureMessages"])

def main():

    # Initialize command line arguments
    parser = argparse.ArgumentParser()

    parser.add_argument("-i", "--input", help="Input file to read (produced by jest)")
    parser.add_argument("-o", "--output", help="Output file to produce (in Gradescope format)")
    args = parser.parse_args()


    jest_data = {}

    if args.input != None:
        with open(args.input,'r') as json_data:
            jest_data = json.load(json_data)


    assertions = list(flatten(map(lambda x:x["assertionResults"], jest_data["testResults"])))
    gradescope_tests = list(map(jest_assertion_to_gradescope, assertions))

    if args.output != None:
      with open(args.output,'w') as json_data:
        json.dump({ "tests": gradescope_tests}, json_data,indent=2,sort_keys=True)


if __name__=="__main__":
  main()