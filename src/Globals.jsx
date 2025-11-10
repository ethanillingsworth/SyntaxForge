export function safeEval(input, test = null) {
    var logs = [];

    // eslint-disable-next-line no-unused-vars
    var console = {
        log: function () {
            for (const arg of arguments) {
                logs.push(arg)
            }
        },
    };
    // eslint-disable-next-line no-unused-vars
    var window = function () { };
    // eslint-disable-next-line no-unused-vars
    var document = function () { };
    // eslint-disable-next-line no-unused-vars
    var editor = function () { };
    // eslint-disable-next-line no-unused-vars
    var print = function () { };

    const a = function () {
        try {
            return eval(input + (test || ""));
        } catch (error) {
            logs.push(error.toString());
        }
    };

    // Return the eval'd result
    return { res: a(), logs: logs };
}