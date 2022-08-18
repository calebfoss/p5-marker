"use strict";
import { expect } from "chai";
import { AttrParseUtil } from "../src/utils/attrParse.js";

describe("AttrParseUtil", () => {
  const { allQuotesMatched, encloseList } = AttrParseUtil;
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
});
