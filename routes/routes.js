module.exports = (app) => {
  const controller = require("../controllers/controller.js");

  // Create a new Entry
  app.post("/controller", controller.create);

  // Retrieve a single Entry with Id
  app.get("/controller/:id", controller.findOne);

  // Update a Entry with Id
  app.put("/controller/:id", controller.update);

  // Delete a Entry with Id
  app.delete("/controller/:id", controller.delete);
};
