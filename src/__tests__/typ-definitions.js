// @flow
import {compileAndPrint} from "../compiler/index.js";

it("handles type synonyms of constants", () => {
  expect(
    compileAndPrint(
      `type b = boolean;
type s = string;
type v = void;
type n = null;
type f = number;
type o = {};
type e = empty;
`,
    ),
  ).toMatchSnapshot();
});

it("handles type definition of enums", () => {
  expect(
    compileAndPrint(`type SayHi = "hi" | 'hello' | "h";`),
  ).toMatchSnapshot();

  expect(compileAndPrint('type Single = "s";')).toMatchSnapshot();
});

it("does not handle enums with other elements than strings", () => {
  expect(
    compileAndPrint(`type SayHi = "hi" | 'hello' | 12;`),
  ).toMatchSnapshot();
});

it("does not handle other literals than string", () => {
  expect(compileAndPrint(`type Boo = false;`)).toMatchSnapshot();

  expect(compileAndPrint(`type Num = 12;`)).toMatchSnapshot();
});

it("does handle records", () => {
  expect(
    compileAndPrint(`type Status = {
      message: string,
      quantity: number,
    };`),
  ).toMatchSnapshot();
});

it("does not handle records with spreads", () => {
  expect(
    compileAndPrint(`type Status = {
      message: string,
      quantity: number,
      ...A,
    };`),
  ).toMatchSnapshot();
});

it("handles sum types", () => {
  expect(
    compileAndPrint(`type Status =
  | {
      type: "Error",
      message: string,
    }
  | {
      type: "Loading",
    }
  | {
      type: "Nothing",
    }
  | {
      type: "Success",
      fresh: boolean,
      "value": string,
    };`),
  ).toMatchSnapshot();

  expect(
    compileAndPrint(`type Status =
  | {
      type: "Error",
      message: string,
    };`),
  ).toMatchSnapshot();
});

it("shows errors for sum types", () => {
  expect(
    compileAndPrint(`type Status =
  | {
      message: string,
    }
  | {
      type: "Loading",
    };`),
  ).toMatchSnapshot();

  expect(
    compileAndPrint(`type Status =
  | {
      type: "Error",
      message: string,
    }
  | {
      type: number,
    };`),
  ).toMatchSnapshot();

  expect(
    compileAndPrint(`type Status =
  | {
     type: "Spread",
      ...A,
    };`),
  ).toMatchSnapshot();

  expect(
    compileAndPrint(`type Status =
  | {
     type: "Spread",
    }
  | string;`),
  ).toMatchSnapshot();

  expect(compileAndPrint(`type Status = number | string;`)).toMatchSnapshot();
});
