module.exports = {
    displayName: "test",
    testMatch: ["<rootDir>/test/**.spec.js"],
    collectCoverage: true,
    collectCoverageFrom: [
        "<rootDir>/src/**.js"
    ]
};