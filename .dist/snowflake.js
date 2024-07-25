class SnowFlake {
    id;
    static SnowFlakes = new Map();
    static FinalizationRegistry = new FinalizationRegistry((a) => {
        SnowFlake.SnowFlakes.get(a[1]).delete(a[0]);
    });
    obj;
    constructor(id, obj) {
        if (!obj) {
            this.id = id;
            return;
        }
        if (!SnowFlake.SnowFlakes.get(obj.constructor)) {
            SnowFlake.SnowFlakes.set(obj.constructor, new Map());
        }
        if (SnowFlake.SnowFlakes.get(obj.constructor).get(id)) {
            const snowflake = SnowFlake.SnowFlakes.get(obj.constructor).get(id).deref();
            snowflake.obj = obj;
            return snowflake;
        }
        this.id = id;
        SnowFlake.SnowFlakes.get(obj.constructor).set(id, new WeakRef(this));
        SnowFlake.FinalizationRegistry.register(this, [id, obj.constructor]);
        this.obj = obj;
    }
    static getSnowFlakeFromID(id, type) {
        if (!SnowFlake.SnowFlakes.get(type)) {
            SnowFlake.SnowFlakes.set(type, new Map());
        }
        const snowflake = SnowFlake.SnowFlakes.get(type).get(id);
        if (snowflake) {
            return snowflake.deref();
        }
        {
            const snowflake = new SnowFlake(id, undefined);
            SnowFlake.SnowFlakes.get(type).set(id, new WeakRef(snowflake));
            SnowFlake.FinalizationRegistry.register(this, [id, type]);
            return snowflake;
        }
    }
    getUnixTime() {
        return Number((BigInt(this.id) >> 22n) + 1420070400000n);
    }
    toString() {
        return this.id;
    }
    getObject() {
        return this.obj;
    }
}
export { SnowFlake };
