const { getDb } = require("../loaders/database");
const { ObjectId } = require("mongodb");

class FloorModelAbstract {
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

class FloorModel extends FloorModelAbstract {
    add(obj) {
        const db = getDb();
        const result = db.collection("floorPlans").insertOne(obj);
        return result;
    }
    find(key, value) {
        const query = { [key]: new ObjectId(value) };
        const result = getDb().collection("floorPlans").findOne(query);

        return result;
    }
    findAll() {
        const cursor = getDb().collection("floorPlans").find();
        return cursor.toArray();
    }

    update(floorPlan, updatedFloorPlan) {
        const db = getDb();
        const result = db
            .collection("floorPlans")
            .updateOne(
                { _id: new ObjectId(floorPlan) },
                { $set: updatedFloorPlan }
            );
        return result;
    }
    async remove(id) {
        const db = await getDb();
        const result = await db
            .collection("floorPlans")
            .deleteOne({ _id: new ObjectId(id) });
        return result;
    }
}

module.exports.FloorModel = FloorModel;
