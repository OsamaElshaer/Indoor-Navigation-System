const { getDb } = require("../loaders/database");

class OrganizationModelAbstract {
    create(obj) {
        throw new Error("create method must be implemented in derived classes");
    }

    find(key, value) {
        throw new Error("find method must be implemented in derived classes");
    }

    update(OrganizationId, updatedOrganizationData) {
        throw new Error("update method must be implemented in derived classes");
    }
}

class OrganizationModel extends OrganizationModelAbstract {
    create = async (obj) => {
        const db = await getDb();
        const result = await db.collection("organizations").insertOne(obj);
        return result.insertedId;
    };

    find = async (key, value) => {
        const query = { [key]: value }; // Dynamically use key parameter as the key name
        const organization = await getDb()
            .collection("organizations")
            .findOne(query);

        return organization;
    };

    update = async (OrganizationId, updatedOrganizationData) => {
        const db = await getDb();
        const result = await db
            .collection("organizations")
            .updateOne(
                { _id: OrganizationId },
                { $set: updatedOrganizationData }
            );

        return result;
    };
}

exports.OrganizationModel = OrganizationModel;
