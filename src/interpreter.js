const singleCharTokens = new Set("()[]{},:+-/*%?");
const multiCharToken = {
  number: "number",
  property: "property",
  boolean: "boolean",
  not: "not",
  comparison: "comparison",
  string: "string",
  logical: "logical",
  until: "until",
};

const token = (kind, start, end, value) => ({ kind, start, end, value });

const lex = (str) => {
  const getTokens = (start = 0, tokens = []) => {
    if (start === str.length) return tokens;
    const strFromStart = str.slice(start);

    const leadingWhitespace = strFromStart.match(/^\s+/);
    if (leadingWhitespace) {
      const end = start + leadingWhitespace[0].length;
      return getTokens(end, tokens);
    }

    if (singleCharTokens.has(strFromStart[0])) {
      const end = start + 1;
      const singleCharToken = token(
        strFromStart[0],
        start,
        end,
        strFromStart[0]
      );
      return getTokens(end, tokens.concat(singleCharToken));
    }

    const numberMatch = strFromStart.match(/^-?\d+(?:\.\d+)?/);
    if (numberMatch) {
      const end = start + numberMatch[0].length;
      const numberToken = token(
        multiCharToken.number,
        start,
        end,
        numberMatch[0]
      );
      return getTokens(end, tokens.concat(numberToken));
    }
    const booleanMatch = strFromStart.match(/^(?:true|false)/);
    if (booleanMatch) {
      const end = start + booleanMatch[0].length;
      const booleanToken = token(
        multiCharToken.boolean,
        start,
        end,
        booleanMatch[0]
      );
      return getTokens(end, tokens.concat(booleanToken));
    }
    const notMatch = strFromStart.match(/^not/);
    if (notMatch) {
      const end = start + notMatch[0].length;
      const notToken = token(multiCharToken.not, start, end, notMatch[0]);
      return getTokens(end, tokens.concat(notToken));
    }
    const comparisonMatch = strFromStart.match(
      /^(?:is|less_than|greater_than|no_more_than|at_least)/
    );
    if (comparisonMatch) {
      const end = start + comparisonMatch[0].length;
      const comparisonToken = token(
        multiCharToken.comparison,
        start,
        end,
        comparisonMatch[0]
      );
      return getTokens(end, tokens.concat(comparisonToken));
    }
    const logicalMatch = strFromStart.match(/^(?:and|or)/);
    if (logicalMatch) {
      const end = start + logicalMatch[0].length;
      const logicalToken = token(
        multiCharToken.logical,
        start,
        end,
        logicalMatch[0]
      );
      return getTokens(end, tokens.concat(logicalToken));
    }
    const untilMatch = strFromStart.match(/^until/);
    if (untilMatch) {
      const end = start + untilMatch[0].length;
      const untilToken = token(multiCharToken.until, start, end, untilMatch[0]);
      return getTokens(end, tokens.concat(untilToken));
    }
    const propertyMatch = strFromStart.match(/^[a-zA-Z]\w*(?:\.[a-zA-Z]\w*)*/);
    if (propertyMatch) {
      const end = start + propertyMatch[0].length;
      const propertyToken = token(
        multiCharToken.property,
        start,
        end,
        propertyMatch[0]
      );
      return getTokens(end, tokens.concat(propertyToken));
    }
    const stringMatch = strFromStart.match(/^'.*?'/);
    if (stringMatch) {
      const end = start + stringMatch[0].length;
      const stringToken = token(
        multiCharToken.string,
        start,
        end,
        stringMatch[0].slice(1, -1)
      );
      return getTokens(end, tokens.concat(stringToken));
    }

    console.error(`Unexpected token: ${strFromStart}`);
  };

  return getTokens();
};

const parse = (el, obj, attrName, tokens) => {
  let position = 0;
  const checkNextToken = () => tokens[position];
  const eatToken = () => tokens[position++];

  const operationFn = (left, operator, right) => {
    switch (operator) {
      case "+":
        return () => left() + right();
      case "-":
        return () => left() - right();
      case "*":
        return () => left() * right();
      case "/":
        return () => left() / right();
      case "%":
        return () => left() % right();
      default:
        console.error(`Couldn't find function for operator ${operator}`);
    }
  };

  const handleParenthetical = () => {
    const endParenthesisIndex =
      tokens.slice(position).findIndex((token) => token.value === ")") +
      position;
    if (endParenthesisIndex < 0)
      console.error(
        `On ${el.tagName}'s ${obj}.${attrName}, found an opening parenthesis without a closing parenthesis`
      );
    const innerBody = parse(
      el,
      obj,
      attrName,
      tokens.slice(position, endParenthesisIndex)
    );
    position = endParenthesisIndex + 1;
    return () => innerBody.map((fn) => fn());
  };

  const getObjectPropertyRef = (token) => {
    const getPropRef = (o, refs) => {
      const [prop] = refs;

      if (prop in o === false) {
        if (prop in el.pInst) return getPropRef(el.pInst, refs);
        console.error(
          `On ${el.tagName}'s ${attrName} attribute, ${prop} could not be found.`
        );
        return [];
      }
      if (refs.length > 1) return getPropRef(o[prop], refs.slice(1));
      return [o, prop];
    };
    const splitToken = token.value.split(".");
    if (
      el instanceof HTMLCanvasElement ||
      attrName === "repeat" ||
      attrName === "change" ||
      splitToken[0] === "above_siblings_off"
    )
      return getPropRef(el, splitToken);
    switch (splitToken[0]) {
      case "above_sibling":
        if (splitToken.length === 1) return [el, "above_sibling"];
        return getPropRef(el.above_sibling, splitToken.slice(1));
      case "parent":
        if (splitToken.length === 1) return [el, "parent"];
        return getPropRef(el.parent, splitToken.slice(1));
      default:
        return getPropRef(el.parent, splitToken);
    }
  };

  const parsePrimaryExpression = () => {
    const token = eatToken();
    switch (token.kind) {
      case multiCharToken.number:
        return () => Number(token.value);
      case multiCharToken.boolean:
        return () => token.value === "true";
      case multiCharToken.string:
        return () => token.value;
      case multiCharToken.property:
        const [o, prop] = getObjectPropertyRef(token);
        if (typeof o === "undefined") return () => undefined;
        if (position === tokens.length || checkNextToken().kind !== "(")
          return () => o[prop];
        eatToken(); // Left parenthesis
        const remainingTokens = tokens.slice(position);
        const endParenthesisIndex = remainingTokens.findIndex(
          (t) => t.kind === ")"
        );
        const sections = commaSeparateSections(
          remainingTokens.slice(0, endParenthesisIndex)
        );
        const argExpressions = sections
          .map((section) => parse(el, obj, attrName, section))
          .flat();
        const getArgs = () => argExpressions.map((fn) => fn());
        position += endParenthesisIndex + 1;
        return () =>
          typeof o[prop] === "function"
            ? o[prop](...getArgs())
            : getArgs().reduce((obj, propOrIndex) => obj[propOrIndex], o[prop]);
      case multiCharToken.until:
        const restOfStatement = parse(
          el,
          obj,
          attrName,
          tokens.slice(position)
        )[0];
        position = tokens.length;
        return () => !restOfStatement();
      case "(":
        return handleParenthetical();
      case "-":
        position--;
        return () => 0;
      default:
        console.error(`Parser failed on token ${token.kind}: ${token.value}`);
        position = tokens.length;
    }
  };

  const commaSeparateSections = (tokens) => {
    const sections = [[]];
    for (const token of tokens) {
      if (token.kind === ",") {
        sections.push([]);
      } else {
        sections[sections.length - 1].push(token);
      }
    }
    return sections;
  };

  const parseList = () => {
    const remainingTokens = tokens.slice(position);
    const commaIndex = remainingTokens.findIndex((token) => token.kind === ",");
    if (commaIndex === -1) return parsePrimaryExpression();
    const leftParenthesisIndex = remainingTokens.findIndex(
      (token) => token.kind === "("
    );
    if (leftParenthesisIndex > 0 && leftParenthesisIndex < commaIndex)
      return parsePrimaryExpression();
    const commaSeparatedSections = commaSeparateSections(remainingTokens);
    position += remainingTokens.length;
    const fns = commaSeparatedSections
      .map((section) => parse(el, obj, attrName, section))
      .flat();
    return () => fns.map((fn) => fn());
  };

  const parseObjectLiteral = () => {
    const remainingTokens = tokens.slice(position);
    if (
      position > tokens.length - 2 ||
      remainingTokens.every((token) => token.kind !== ":")
    )
      return parseList();

    const commaSeparatedSections = commaSeparateSections(remainingTokens);
    position += remainingTokens.length;
    const getKeyValuePairs = commaSeparatedSections.map((sectionTokens, i) => {
      const colonIndex = sectionTokens.findIndex((token) => token.kind === ":");
      if (colonIndex < 0) {
        if (sectionTokens.length > 1)
          console.error(
            "Couldn't figure out what to do with these:",
            sectionTokens
          );
        const propName = sectionTokens[0].value;

        const getValue = parse(el, obj, attrName, sectionTokens)[0];
        return () => [propName, getValue()];
      }
      if (colonIndex === 0) {
        console.error("FOUND COLON AT BEGINNING OF SECTION");
        return () => [];
      }
      if (colonIndex === 1) {
        const propName = sectionTokens[0].value;
        const tokensAfterColon = sectionTokens.slice(2);
        const getValue = parse(el, obj, attrName, tokensAfterColon)[0];
        return () => [propName, getValue()];
      }

      const getPropName = parse(
        el,
        obj,
        attrName,
        sectionTokens.slice(0, colonIndex)
      )[0];

      const getValue = parse(
        el,
        obj,
        attrName,
        sectionTokens.slice(colonIndex)
      )[0];
      return () => [getPropName(), getValue()];
    });
    return () => Object.fromEntries(getKeyValuePairs.map((fn) => fn()));
  };

  const parseTernary = () => {
    const remainingTokens = tokens.slice(position);
    const questionIndex = remainingTokens.findIndex(
      (token) => token.kind === "?"
    );
    if (questionIndex === -1) return parseObjectLiteral();
    const commaIndex = remainingTokens.findIndex((token) => token.kind === ",");
    if (commaIndex >= 0 && commaIndex < questionIndex)
      return parseObjectLiteral();
    const left = parse(
      el,
      obj,
      attrName,
      remainingTokens.slice(0, questionIndex)
    )[0];
    const colonIndex = remainingTokens.findIndex((token) => token.kind === ":");
    const end = commaIndex > -1 ? commaIndex : remainingTokens.length;
    const middle = parse(
      el,
      obj,
      attrName,
      remainingTokens.slice(questionIndex + 1, colonIndex)
    )[0];
    const right = parse(
      el,
      obj,
      attrName,
      remainingTokens.slice(colonIndex + 1, end)
    )[0];
    position += end;
    return () => (left() ? middle() : right());
  };

  const getComparisonFn = (token, left, right) => {
    switch (token.value) {
      case "less_than":
        return () => left() < right();
      case "greater_than":
        return () => left() > right();
      case "no_more_than":
        return () => left() <= right();
      case "at_least":
        return () => left() >= right();
      case "is":
        return () => Object.is(left(), right());
      default:
        console.error(`Couldn't find comparison function for ${token.value}`);
    }
  };

  const parseComparisonExpression = () => {
    const remainingTokens = tokens.slice(position);
    const compareIndex = remainingTokens.findIndex(
      (token) => token.kind === multiCharToken.comparison
    );
    if (compareIndex === -1) return parseTernary();
    const untilIndex = tokens.findIndex(
      (token) => token.kind === multiCharToken.until
    );
    if (untilIndex > -1 && untilIndex < compareIndex)
      return parsePrimaryExpression();
    const commaIndex = remainingTokens.findIndex((token) => token.kind === ",");
    if (commaIndex > -1 && commaIndex < commaIndex) return parseTernary();
    const left = parse(
      el,
      obj,
      attrName,
      remainingTokens.slice(0, compareIndex)
    )[0];
    const operator = remainingTokens[compareIndex];
    const right = parse(el, obj, attrName, tokens.slice(compareIndex + 1))[0];
    position += remainingTokens.length;
    return getComparisonFn(operator, left, right);
  };

  const parseLogical = () => {
    const remainingTokens = tokens.slice(position);
    const logicalIndex = remainingTokens.findIndex(
      (token) => token.kind === multiCharToken.logical
    );
    if (logicalIndex === -1) return parseComparisonExpression();
    const commaIndex = remainingTokens.findIndex((token) => token.kind === ",");
    if (commaIndex > -1 && commaIndex < logicalIndex)
      return parseComparisonExpression();
    const left = parse(
      el,
      obj,
      attrName,
      remainingTokens.slice(0, logicalIndex)
    )[0];
    const operator = remainingTokens[logicalIndex].value;
    const right = parse(
      el,
      obj,
      attrName,
      remainingTokens.slice(logicalIndex + 1)
    )[0];
    position += remainingTokens.length;
    if (operator === "and") {
      return () => left() && right();
    }
    return () => left() || right();
  };

  const parseMultiplicativeExpression = () => {
    const left = parseLogical();

    if (position >= tokens.length) return left;
    if (
      checkNextToken().kind === "*" ||
      checkNextToken().kind === "/" ||
      checkNextToken().kind === "%"
    ) {
      const operator = eatToken().value;

      const right = parseLogical();
      return operationFn(left, operator, right);
    }
    return left;
  };

  const parseAdditiveExpression = () => {
    const left = parseMultiplicativeExpression();
    if (position === tokens.length) return left;
    if (checkNextToken().kind === "+" || checkNextToken().kind === "-") {
      const operator = eatToken().value;
      const right = parseMultiplicativeExpression();
      return operationFn(left, operator, right);
    }
    return left;
  };

  let statementBody = [];

  while (position < tokens.length) {
    console.log(
      `Parsing at position ${position}/${tokens.length}: ${tokens
        .slice(position)
        .map((token) => token.value)
        .join(" ")}`
    );
    const expression = parseAdditiveExpression();
    statementBody.push(expression);
    if (position === 0) {
      console.error(`${el.tagName} hit an infinite loop`);
      break;
    }
  }

  return statementBody;
};

export const interpret = (el, obj, propName, attrValue) => {
  const tokens = lex(attrValue);
  const body = parse(el, obj, propName, tokens);
  return body.length > 1 ? () => body.map((fn) => fn()) : body[0];
};
