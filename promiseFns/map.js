const util = require("./util");
module.exports = (Bluebird) => {
    Bluebird.map = (x, mapper, opts) => Bluebird.resolve(x).map(mapper, opts);

    Bluebird.prototype.map = function (mapper, { concurrency } = {}) {
        return Bluebird.resolve((async () => {
            const values = await Bluebird.all(await this);
            if(!concurrency) {
                return Bluebird.all(values.map(mapper));
            }
            const throttled = util.throttle(mapper, Number(concurrency));
            return Bluebird.all(values.map(throttled));
        })());
    };
};

