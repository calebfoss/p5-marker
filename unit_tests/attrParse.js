"use strict";
import { expect } from "chai";
import { AttrParseUtil } from "../src/utils/attrParse.js";

describe("AttrParseUtil", () => {
  const { allQuotesMatched, encloseList, replaceVarNames } = AttrParseUtil;
  const quoteTests = [
    "'a'bc",
    "a'b'c",
    "ab'c'",
    "`a`bc",
    "a`b`c",
    "ab`c`",
    '"a"bc',
    'a"b"c',
    'ab"c"',
  ];
  quoteTests.forEach((qt) =>
    it(`should find matched quotes in ${qt}`, (done) => {
      expect(allQuotesMatched(qt)).to.equal(true);
      done();
    })
  );
  it("should should wrap this in brackets", (done) => {
    expect(encloseList("a,b,c")).to.equal("[a,b,c]");
    done();
  });
  it("should not wrap this in brackets", (done) => {
    expect(encloseList("[a,b,c]")).to.equal("[a,b,c]");
    done();
  });

  it("should filter out object property names but allow ternary operators", (done) => {
    expect(
      "{prop: val1, prop: val2 === val3 ? val4 : val5}".match(
        AttrParseUtil.regex.varName
      )
    ).deep.to.equal(["val1", "val2", "val3", "val4", "val5"]);
    done();
  });
});
