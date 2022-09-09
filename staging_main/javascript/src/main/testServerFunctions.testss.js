// This file contains unit tests for functions inside the serverFunction.js file
// Unit test are performed by JEST testing framework. Link - https://jestjs.io/

const serverFunctions = require("./serverFunctions.js")

test('Check Username', ()=>{
    expect(serverFunctions.checkUserName('SomeName')).toBe(true)
    expect(serverFunctions.checkUserName('      ')).toBe(false)
    
})

test('Check Password Length', () => {
    expect(serverFunctions.checkPasswordLength('12345678')).toBe(true);
    expect(serverFunctions.checkPasswordLength('123456')).toBe(false);
})

test('Check Email ID', ()=>{
    expect(serverFunctions.checkEmailId("@.")).toBe(false);
    expect(serverFunctions.checkEmailId("string@string")).toBe(false);
    expect(serverFunctions.checkEmailId("string@string.string")).toBe(true);
    expect(serverFunctions.checkEmailId("string@string.string.string")).toBe(true);
})