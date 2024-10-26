db = db.getSiblingDB("ebooks-db"); // Switch to the database

// Create a collection and insert sample data
// db.createCollection('test');

// Create a new user with readWrite role
db.createUser({
  user: "dbuser", // Username for the user
  pwd: "dbuser1234", // Password for the user
  roles: [
    { role: "readWrite", db: "ebooks-db" }, // Grant the user readWrite access on 'ebooks-db'
  ],
});
