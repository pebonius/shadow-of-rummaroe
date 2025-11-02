import { playerTests } from "./player.test.js";
import { savePointTests } from "./savePoint.test.js";

let testsFailed = 0;

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
  testsFailed++;
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
    console.log(`\t\tdid throw error - OK 🟢`);
    return true;
  }
  console.log(`\t\tdid not throw error - NOK ❌`);
  testsFailed++;
  return false;
}

export function doesNotThrow(functionToTest) {
  try {
    functionToTest();
  } catch (error) {
    console.log(`\t\tdid throw error - NOK ❌`);
    testsFailed++;
    return false;
  }
  console.log(`\t\tdid not throw error - OK 🟢`);
  return true;
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
  let testsRan = 0;
  testsToRun.forEach((testSuite) => {
    console.log(`running ${testSuite.name}`);
    testSuite.tests.forEach((test) => {
      console.log(`\trunning ${test.name}...`);
      test();
      testsRan++;
      console.log(`\t${test.name} completed`);
    });
  });
  console.log(`total tests ran: ${testsRan}`);
  console.log(`tests failed: ${testsFailed}`);
}

runTests();
