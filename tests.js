import { playerTests } from "./player.test.js";

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

function isTest() {
  is(true, true);
}

function areTest() {
  is(are([true, true], true), true);
}

const testTests = [isTest, areTest];

const testsToRun = [
  { tests: testTests, name: "test tests" },
  { tests: playerTests, name: "player tests" },
];

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
