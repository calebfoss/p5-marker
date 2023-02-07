const singleCharTokens = new Set("()[]{},:+-/*%");
const multiCharToken = {
  number: "number",
  property: "property",
  boolean: "boolean",
  not: "not",
  comparison: "comparison",
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

    const numberMatch = strFromStart.match(/^\d+(?:\.\d+)?/);
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
    console.error(`Unexpected token: ${strFromStart}`);
  };
  return getTokens();
};

const parse = (el, obj, propName, tokens) => {
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
        `On ${el.tagName}'s ${obj}.${propName}, found an opening parenthesis without a closing parenthesis`
      );
    const innerBody = parse(
      el,
      obj,
      propName,
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
          `On ${el.tagName}'s ${obj}.${propName} property, ${prop} could not be found.`
        );
        return () => {};
      }
      if (refs.length > 1) return getPropRef(o[prop], refs.slice(1));
      return () => o[prop];
    };
    return getPropRef(el, token.value.split("."));
  };

  const parsePrimaryExpression = () => {
    console.log("PRIMARY", checkNextToken());
    const token = eatToken();
    switch (token.kind) {
      case multiCharToken.number:
        return () => Number(token.value);
      case multiCharToken.boolean:
        return () => token.value === "true";
      case multiCharToken.property:
        return handlePropRef(token);
      case "(":
        return handleParenthetical();
      default:
        console.error(`Parser failed on token ${token.kind}: ${token.value}`);
        position = tokens.length;
    }
  };

  const parseList = () => {
    console.log("BEFORE LIST", checkNextToken());
    const left = parsePrimaryExpression();

    if (position === tokens.length) return left;
    if (checkNextToken().kind === ",") eatToken();
    return left;
  };

  const parseMethodCall = () => {
    console.log("BEFORE METHOD", checkNextToken());
    const left = parseList();

    if (position === tokens.length || position === 0) return left;
    const prevToken = tokens[position - 1];

    if (prevToken.kind === "property" && checkNextToken().kind === "(") {
      console.log("METHOD", checkNextToken());
      eatToken();

      const right = handleParenthetical();

      return () => left()(...right());
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
    console.log("BEFORE COMPARE", checkNextToken());
    const left = parseMethodCall();

    if (position === tokens.length) return left;
    if (checkNextToken().kind === multiCharToken.comparison) {
      console.log("COMPARE", checkNextToken());
      const operator = eatToken();
      const right = parseMethodCall();
      return getComparisonFn(operator, left, right);
    }
    return left;
  };

  const parseMultiplicativeExpression = () => {
    console.log("BEFORE MULT", checkNextToken());
    const left = parseComparisonExpression();

    if (position === tokens.length) return left;
    if (
      checkNextToken().kind === "*" ||
      checkNextToken().kind === "/" ||
      checkNextToken().kind === "%"
    ) {
      console.log("MULT", checkNextToken());
      const operator = eatToken().value;

      const right = parseComparisonExpression();
      return operationFn(left, operator, right);
    }
    return left;
  };

  const parseAdditiveExpression = () => {
    console.log("BEFORE ADD", checkNextToken());
    const left = parseMultiplicativeExpression();
    if (position === tokens.length) return left;
    if (checkNextToken().kind === "+" || checkNextToken().kind === "-") {
      console.log("ADD", checkNextToken());
      const operator = eatToken().value;
      const right = parseMultiplicativeExpression();
      return operationFn(left, operator, right);
    }
    return left;
  };

  let statementBody = [];

  while (position < tokens.length) {
    console.log(
      `Parsing at position ${position}/${tokens.length}: ${tokens[position].value}`
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
  return body.length ? () => body.map((fn) => fn()) : body;
};

const test = interpret(
  {
    add: function (a, b) {
      return a + b;
    },
    get test_array() {
      return [1, 2, 3];
    },
  },
  {},
  "test",
  "test_array(1)"
);
console.log(test());
