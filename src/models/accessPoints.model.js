const { getDb } = require("../loaders/database");
const { ObjectId } = require("mongodb");

class AccessPOintModelAbstract {
    add(obj) {
        throw new Error("add method must be implemented in derived classes");
    }

    find(key, value) {
        throw new Error("find method must be implemented in derived classes");
    }

    update(APId, updatedAPData) {
        throw new Error("update method must be implemented in derived classes");
    }
    delete(_id) {
        throw new Error("delete method must be implemented in derived classes");
    }
}

class AccessPointModel extends AccessPOintModelAbstract {
    add(obj) {
        const db = getDb();
        const result = db.collection("accessPoints").insertOne(obj);
        return result;
    }
    find(key, value) {
        const query = { [key]: new ObjectId(value) };
        const AP = getDb().collection("accessPoints").findOne(query);

        return AP;
    }
    findAll() {
        const cursor = getDb().collection("accessPoints").find();
        return cursor.toArray();
    }

    update(APId, updatedAPData) {
        const db = getDb();
        const result = db
            .collection("accessPoints")
            .updateOne({ _id: new ObjectId(APId) }, { $set: updatedAPData });
        return result;
    }
    remove(id) {
        const db = getDb();
        const result = db
            .collection("accessPoints")
            .deleteOne({ _id: new ObjectId(id) });
        return result;
    }
}

module.exports.AccessPointModel = AccessPointModel;
