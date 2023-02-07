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

  const handlePropRef = (token) => {
    const getPropRef = (o, refs) => {
      const [prop] = refs;
      if (prop in o === false) {
        if (prop in el.pInst) return getPropRef(el.pInst, refs);
        console.error(
          `On ${el.tagName}'s ${attrName} attribute, ${prop} could not be found.`
        );
        return () => {};
      }
      if (refs.length > 1) return getPropRef(o[prop], refs.slice(1));
      return () => o[prop];
    };
    return getPropRef(el, token.value.split("."));
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
        return handlePropRef(token);
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

  const parseList = () => {
    const left = parsePrimaryExpression();

    if (position === tokens.length) return left;
    if (checkNextToken().kind === ",") eatToken();
    return left;
  };

  const parseObjectLiteral = () => {
    const remainingTokens = tokens.slice(position);
    if (
      position > tokens.length - 2 ||
      remainingTokens.every((token) => token.kind !== ":")
    )
      return parseList();

    const commaSeparatedSections = [[]];
    for (const token of remainingTokens) {
      if (token.kind === ",") {
        commaSeparatedSections.push([]);
        position++;
      } else {
        commaSeparatedSections[commaSeparatedSections.length - 1].push(token);
      }
    }

    const keyValuePairs = commaSeparatedSections.map((sectionTokens, i) => {
      const colonIndex = sectionTokens.findIndex((token) => token.kind === ":");
      position += sectionTokens.length;
      if (colonIndex < 0) {
        if (sectionTokens.length > 1)
          console.error(
            "Couldn't figure out what to do with these:",
            sectionTokens
          );
        const propName = sectionTokens[0].value;

        const getValue = parse(el, obj, attrName, sectionTokens)[0];
        return [propName, getValue()];
      }
      if (colonIndex === 0) {
        console.error("FOUND COLON AT BEGINNING OF SECTION");
        return [];
      }
      if (colonIndex === 1) {
        const propName = sectionTokens[0].value;
        const tokensAfterColon = sectionTokens.slice(2);
        const getValue = parse(el, obj, attrName, tokensAfterColon)[0];
        return [propName, getValue()];
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
      return [getPropName(), getValue()];
    });
    return () => Object.fromEntries(keyValuePairs);
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
    const end = commaIndex > -1 ? commaIndex : tokens.length;
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
    position = end + 1;
    return () => (left() ? middle() : right());
  };

  const parseLogical = () => {
    const left = parseTernary();
    if (position === tokens.length) return left;
    if (checkNextToken().kind !== "logical") return left;
    const operator = eatToken();
    const right = parseTernary();
    if (operator.value === "and") {
      return () => left() && right();
    }
    return () => left() || right();
  };

  const parseCall = () => {
    const left = parseLogical();

    if (position === tokens.length || position === 0) return left;
    const prevToken = tokens[position - 1];

    if (prevToken.kind === "property" && checkNextToken().kind === "(") {
      eatToken();

      const right = handleParenthetical();
      return () =>
        typeof left() === "function"
          ? left()(...right())
          : right().reduce((obj, propOrIndex) => obj[propOrIndex], left());
    }
    return left;
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
    const left = parseCall();

    if (position === tokens.length) return left;
    if (checkNextToken().kind === multiCharToken.comparison) {
      const operator = eatToken();
      const right = parseCall();
      return getComparisonFn(operator, left, right);
    }
    return left;
  };

  const parseMultiplicativeExpression = () => {
    const left = parseComparisonExpression();

    if (position === tokens.length) return left;
    if (
      checkNextToken().kind === "*" ||
      checkNextToken().kind === "/" ||
      checkNextToken().kind === "%"
    ) {
      const operator = eatToken().value;

      const right = parseComparisonExpression();
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
