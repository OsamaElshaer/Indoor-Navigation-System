const { getDb } = require("../loaders/database");

class UserModelAbstract {
    create(userName, email, password) {
        throw new Error("create method must be implemented in derived classes");
    }

    find(key, value) {
        throw new Error("find method must be implemented in derived classes");
    }

    update(userId, updatedUserData) {
        throw new Error("update method must be implemented in derived classes");
    }
}

class UserModel extends UserModelAbstract {
    create = async (userName, email, password) => {
        const user = {
            userName,
            email,
            password,
        };
        const db = await getDb();
        const result = await db.collection("users").insertOne(user);
        return result.insertedId;
    };

    find = async (key, value) => {
        const query = { [key]: value }; // Dynamically use key parameter as the key name
        const user = await getDb().collection("users").findOne(query);
        return user;
    };

    update = async (userId, updatedUserData) => {
        const db = await getDb();
        const result = await db
            .collection("users")
            .updateOne({ _id: userId }, { $set: updatedUserData });
        return result;
    };
}

exports.UserModel = UserModel;
