const controllers = [
    "UserController"
];

async function formulateRoutes(app) {
    for (const eachController of controllers) {
        const controllerModule = await import(`../controllers/${eachController}.js`);
        const controller = controllerModule.default;
        app.use("/api", controller);
    }
};

export default {
    formulateRoutes
};