/* eslint-disable no-unused-vars */
export class CodeRunner {
    static run(code, test = null) {
        var logs = [];

        var console = {
            log: function (...args) {
                logs.push(...args);
            }
        };
        var window = function () { };
        var document = function () { };
        var editor = function () { };
        var print = function () { };

        const a = function () {
            try {
                return eval(code + (test || ""));
            } catch (error) {
                logs.push(error.toString());
            }
        };

        // Return the eval'd result
        return { res: a(), logs: logs };
    }
}