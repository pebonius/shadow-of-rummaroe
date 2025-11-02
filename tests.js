import { playerTests } from "./player.test.js";
import { savePointTests } from "./savePoint.test.js";

const testTests = [isTest, areTest, throwTest, doesNotThrowTest];

const testsToRun = [
  { tests: testTests, name: "test tests" },
  { tests: playerTests, name: "player tests" },
  { tests: savePointTests, name: "savePoint tests" },
];

export function is(receivedValue, expectedValue) {
  if (receivedValue === expectedValue) {
    console.log(
      `\t\texpected ${expectedValue}, received ${receivedValue} - OK 🟢`
    );
    return true;
  }
  console.log(
    `\t\texpected ${expectedValue}, received ${receivedValue} - NOK ❌`
  );
  return false;
}

export function are(valuesToTest, expectedValue) {
  let result = true;

  valuesToTest.forEach((element) => {
    if (!is(element, expectedValue)) {
      result = false;
    }
  });

  return result;
}

export function areOutputs(valuesToTest, functionToTest, expectedValue) {
  valuesToTest.forEach((element) => {
    const optionalQuote = typeof element === "string" ? '"' : "";

    console.log(
      `\t\texpect ${functionToTest.name}(${optionalQuote}${element}${optionalQuote}) to be ${expectedValue}`
    );
    is(functionToTest(element), expectedValue);
  });
}

export function throws(functionToTest) {
  try {
    functionToTest();
  } catch (error) {
    console.log(`did throw error - OK 🟢`);
    return;
  }
  console.log(`did not throw error - NOK ❌`);
}

export function doesNotThrow(functionToTest) {
  try {
    functionToTest();
  } catch (error) {
    console.log(`did throw error - NOK ❌`);
    return;
  }
  console.log(`did not throw error - OK 🟢`);
}

function isTest() {
  is(true, true);
}

function areTest() {
  is(are([true, true], true), true);
}

function throwTest() {
  throws(() => {
    throw new Error("some error");
  });
}

function doesNotThrowTest() {
  doesNotThrow(() => {
    const someValue = 0;
  });
}

function runTests() {
  testsToRun.forEach((testSuite) => {
    console.log(`running ${testSuite.name}`);
    testSuite.tests.forEach((test) => {
      console.log(`\trunning ${test.name}...`);
      test();
      console.log(`\t${test.name} completed`);
    });
  });
}

runTests();
