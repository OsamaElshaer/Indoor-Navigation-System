const { ObjectId } = require("mongodb");
const { httpServer } = require("../src/loaders/app");
const request = require("supertest");
const { mongoConnect, getDb } = require("../src/loaders/database");
const { OrganizationModel } = require("../src/models/organization.model");
const organizationModelObj = new OrganizationModel();
let JwtToken = "";

describe("organization operations", () => {
    beforeAll(async () => {
        await mongoConnect();
    });

    it("should create a new organization", async () => {
        const newOrganization = {
            organizationData: {
                organizationName: "Acme Corporation",
                contactEmail: "contact@acme.com",
                contactPhone: "123-456-7890",
                adminName: "John Doe",
                adminEmail: "john.doe@acme.com",
                adminPhone: "987-654-3210",
                userName: "acmeadmin",
                password: "@Asecurepassword123",
                organizationType: "Business",
            },
        };

        const response = await request(httpServer)
            .post("/api/organizations/signup")
            .send(newOrganization);

        expect(response.status).toBe(201);
        expect(
            ObjectId.isValid(response.body.data.organizationId)
        ).toBeTruthy();
    }, 10000);

    it("should login and return token", async () => {
        const userData = {
            userName: "acmeadmin",
            password: "@Asecurepassword123",
        };

        const response = await request(httpServer)
            .post("/api/organizations/login")
            .send(userData);

        JwtToken = response.body.data.token;
        expect(response.status).toBe(201);
        expect(response.body.data.token).toBeTruthy();
    });

    it("should send token to user email for confirmation and reset password", async () => {
        const email = "john.doe@acme.com";

        const forgetPasswordResponse = await request(httpServer)
            .post("/api/organizations/forgetPassword")
            .send({ email });

        expect(forgetPasswordResponse.body.data.sendMail).toBeTruthy();

        const user = await organizationModelObj.find("adminEmail", email);

        const password = "Password2@Again1";
        const passwordConfirmation = "Password2@Again1";

        const resetPasswordResponse = await request(httpServer)
            .post(`/api/organizations/resetPassword/${user.resetToken}`)
            .send({ password, passwordConfirmation });

        expect(resetPasswordResponse.body.data.status).toBeTruthy();
    }, 30000);

    afterAll(async () => {
        await getDb().dropDatabase();
    });
});
