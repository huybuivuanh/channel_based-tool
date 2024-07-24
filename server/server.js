const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// // create connection to mysql
// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
// });

// create connection to mysql
const connection = mysql.createConnection({
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

connection.connect((err) => {
  if (err) {
    console.log("Error connecting to database");
  } else {
    // console.log("Connected to Mysql databse!");
  }
});

// create database if not exists
connection.query(`CREATE DATABASE IF NOT EXISTS project`, (err) => {
  if (err) {
    console.log("Error creating database: " + err);
  } else {
    // console.log("Database created/exists");
  }
});

// switch project database
connection.query(`USE project`, (err) => {
  if (err) {
    console.log("Error switching to project database: " + err);
  } else {
    // console.log("Switched to project database");
  }
});

// connection.query("DROP TABLE users");
// connection.query("DROP TABLE channels");
// connection.query("DROP TABLE reactions");
// connection.query("DROP TABLE messages");

// Create the users table
connection.query(
  `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fName VARCHAR(50) NOT NULL,
    lName VARCHAR(50) NOT NULL,
    DOB DATE NOT NULL,
    email VARCHAR(50) NOT NULL,
    pw VARCHAR(200) NOT NULL,
    imgPath VARCHAR(200) DEFAULT NULL,
    created DATE NOT NULL,
    postNum INT NOT NULL DEFAULT 0,
    role ENUM('user', 'admin') DEFAULT 'user',
    UNIQUE KEY unique_email (email)
  )`,
  (err) => {
    if (err) {
      console.error("Error creating user table: " + err);
    } else {
      //   console.log("User table created/exists!");
      const password = "asd123";
      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
          console.log(err);
        } else {
          // Insert the admin account
          const adminAccount = {
            fName: "AdminFirst",
            lName: "AdminLast",
            DOB: "2000-01-01",
            email: "admin@cmpt.com",
            pw: hash,
            created: new Date().toISOString().slice(0, 10),
            postNum: 0,
            role: "admin",
          };

          connection.query(
            `INSERT IGNORE INTO users SET ?`,
            adminAccount,
            (err, result) => {
              if (err) {
                console.error("Error inserting admin account: " + err);
              } else {
                if (result.affectedRows === 1) {
                  // console.log("Admin account inserted successfully!");
                } else {
                  // console.log("Admin account already exists, no action taken.");
                }
              }
            }
          );
        }
      });
    }
  }
);

// create channel table
connection.query(
  `CREATE TABLE IF NOT EXISTS channels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(200) NOT NULL,
    created DATE NOT NULL,
    userID INT NOT NULL,
    userName VARCHAR(50) NOT NULL,
    imgPath VARCHAR(250)
  )`,
  (err) => {
    if (err) {
      console.error("Error creating channel table: " + err);
    } else {
      //   console.log("Channel table created/exists!");
    }
  }
);

// create message table
connection.query(
  `CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message VARCHAR(2000) NOT NULL,
    channelID INT NOT NULL,
    created DATETIME NOT NULL,
    userID INT NOT NULL,
    imgPath VARCHAR(250),
    likes INT NOT NULL DEFAULT 0,
    dislikes INT NOT NULL DEFAULT 0,
    parentID INT NOT NULL DEFAULT 0
  )`,
  (err) => {
    if (err) {
      console.error("Error creating message table: " + err);
    } else {
      // console.log("Message table created/exists!");
    }
  }
);

// create reaction table
connection.query(
  `CREATE TABLE IF NOT EXISTS reactions (
    userID_messageID VARCHAR(250) NOT NULL,
    messageID INT NOT NULL,
    reaction INT DEFAULT 0,
    PRIMARY KEY (userID_messageID)
  )`,
  (err) => {
    if (err) {
      console.error("Error creating reactions table: " + err);
    } else {
      //   console.log("Channel table created/exists!");
    }
  }
);

// handle image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define the directory where uploaded files will be stored
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    // Define the name of the file
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// Verify and decode the JWT token
function verifyToken(req, res, next) {
  const token = req.header("Authorization");

  if (!token) {
    res.status(403).json({ message: "No token provided" });
    return;
  }

  jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
    if (err) {
      res.status(401).json({ message: "Invalid token" });
    } else {
      req.user = decoded;
      next();
    }
  });
}

// login route
app.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  connection.query(
    `SELECT * FROM users WHERE email = ?`,
    [email],
    (err, results) => {
      if (err) {
        console.log("Error querying databse" + err);
      } else {
        if (results.length === 1) {
          bcrypt.compare(password, results[0].pw, (err, result) => {
            if (result) {
              const id = results[0].id;
              const token = jwt.sign({ id }, process.env.TOKEN_KEY, {
                expiresIn: "1h", // Token expiration time
              });
              // console.log("Login successful!");
              res.json({
                message: "Login successful!",
                token: token,
                userInfo: results[0],
              });
            } else {
              console.log("Incorrect password!");
              res.json({ message: "Incorrect password!" });
            }
          });
        } else {
          console.log("Email (" + email + ") not found!");
          res.json({ message: "Email (" + email + ") not found!" });
        }
      }
    }
  );
});

// register route
app.post("/register", upload.single("image"), async (req, res) => {
  // encrypt password
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    } else {
      // Get the image file information
      const fName = req.body.firstName;
      const lName = req.body.lastName;
      const DOB = req.body.dateOfBirth;
      const email = req.body.email;
      const pw = hash; // hashed password
      const created = new Date().toISOString().slice(0, 10);
      const image = req.file;
      if (image) {
        const query = `
  INSERT INTO users (fName, lName, DOB, email, pw, created, imgPath)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`;
        // insert into database with image path
        connection.query(
          query,
          [fName, lName, DOB, email, pw, created, image.filename],
          (err) => {
            if (err) {
              console.log(err);
              res.json("Error saving user: " + err);
            } else {
              connection.query(
                `SELECT * FROM users WHERE email = ?`,
                [email],
                (err, results) => {
                  if (err) {
                    console.log(err);
                  } else {
                    const id = results[0].id;
                    const token = jwt.sign({ id }, process.env.TOKEN_KEY, {
                      expiresIn: "1h", // Token expiration time
                    });
                    // console.log("Registered Sucessfull!");
                    res.json({
                      message: "Registered Sucessfull!",
                      userInfo: results[0],
                      token: token,
                    });
                  }
                }
              );
            }
          }
        );
      } else {
        // insert into database without image path
        const query = `
  INSERT INTO users (fName, lName, DOB, email, pw, created)
  VALUES (?, ?, ?, ?, ?, ?)
`;
        // insert into database with image path
        connection.query(
          query,
          [fName, lName, DOB, email, pw, created],
          (err) => {
            if (err) {
              console.log(err);
              res.json("Error saving user: " + err);
            } else {
              connection.query(
                `SELECT * FROM users WHERE email = ?`,
                [email],
                (err, results) => {
                  if (err) {
                    console.log(err);
                  } else {
                    const id = results[0].id;
                    const token = jwt.sign({ id }, process.env.TOKEN_KEY, {
                      expiresIn: "1h", // Token expiration time
                    });
                    // console.log("Registered Sucessfull!");
                    res.json({
                      message: "Registered Sucessfull!",
                      userInfo: results[0],
                      token: token,
                    });
                  }
                }
              );
            }
          }
        );
      }
    }
  });
});

// get channel list route
app.get("/getchannels", verifyToken, (req, res) => {
  connection.query(`SELECT * FROM channels`, (err, results) => {
    if (err) {
      console.log("Error querying databse for channels!" + err);
      res.json({ message: "Error querying databse for channels!" });
    } else {
      if (results.length === 0) {
        // console.log("0 channels are created yet!");
        res.json("0 channels are created yet!");
      } else {
        res.json(results);
      }
    }
  });
});

// add channel route
app.post("/addchannel", verifyToken, upload.single("image"), (req, res) => {
  const name = req.body.name;
  const description = req.body.description;
  const userID = req.body.userID;
  const userName = req.body.userName;
  const created = new Date().toISOString().slice(0, 10);

  // Get the image file information
  const image = req.file;

  // Check if an image was uploaded
  if (image) {
    // Save the path to the image in the database
    const imagePath = image.filename;

    connection.query(
      "INSERT INTO channels (name, description, created, userID, userName, imgPath) VALUES (?, ?, ?, ?, ?, ?)",
      [name, description, created, userID, userName, imagePath],
      (err) => {
        if (err) {
          console.log(err);
          res.status(500).json("Error saving channel: " + err);
        } else {
          // console.log("Added channel successfully!");
          res.json("Added channel successfully!");
        }
      }
    );
  } else {
    // save channel without img path
    connection.query(
      "INSERT INTO channels (name, description, created, userID, userName) VALUES (?, ?, ?, ?, ?)",
      [name, description, created, userID, userName],
      (err) => {
        if (err) {
          console.log(err);
          res.status(500).json("Error saving channel: " + err);
        } else {
          // console.log("Added channel successfully!");
          res.json("Added channel successfully!");
        }
      }
    );
  }
});

// get message list route
app.post("/getmessages", verifyToken, (req, res) => {
  const channelID = req.body.channelID;

  var foundMessages = [];
  // get messages from the specified channel
  connection.query(
    `SELECT * FROM messages WHERE channelID = ?`,
    [channelID],
    (err, results) => {
      if (err) {
        console.log("Error querying database for messages!" + err);
        // res.json({ message: "Error querying database for messages!" });
      } else {
        if (results.length === 0) {
          // console.log("0 messages are created yet!");
          res.json("0 messages are created yet!");
        } else {
          foundMessages = [...results];

          // Call getAllUsers with a callback
          getAllUsers(foundMessages, (authors) => {
            const flatTree = buildFlatMessageStructure(foundMessages, authors);
            const tree = buildMessageTree(flatTree);
            res.json({ tree: tree, flatTree: flatTree });
          });
        }
      }
    }
  );
});

// Function to fetch all users
function getAllUsers(foundMessages, callback) {
  const userIds = foundMessages.map((message) => message.userID);

  if (userIds.length === 0) {
    console.log("No users found!");
    callback([]);
    return;
  }

  connection.query(
    `SELECT * FROM users WHERE id IN (?)`,
    [userIds],
    (err, results) => {
      if (err) {
        console.log(err);
        callback([]);
      } else {
        const authors = results.map((user) => ({
          userID: user.id,
          profilePic: user.imgPath,
          author: `${user.fName} ${user.lName}`,
        }));
        callback(authors);
      }
    }
  );
}

// Function to build the flatMessages structure
function buildFlatMessageStructure(foundMessages, authors) {
  const flatMessages = [];

  // Iterate through foundMessages and build the flat structure
  foundMessages.forEach((message) => {
    const authorInfo = authors.find(
      (author) => author.userID === message.userID
    );
    const author = authorInfo.author;
    const profilePic = authorInfo.profilePic;

    const date = new Date(message.created);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day} at ${hours}:${minutes}:${seconds}`;

    flatMessages.push({
      id: message.id,
      author: author,
      content: message.message,
      timestamp: formattedDate,
      imgPath: message.imgPath,
      profilePic: profilePic,
      parentID: message.parentID,
      likes: message.likes,
      dislikes: message.dislikes,
      userID: message.userID,
      replies: [],
    });
  });

  return flatMessages;
}

function buildMessageTree(flatMessages, parentID = 0) {
  const tree = [];

  flatMessages
    .filter((message) => message.parentID === parentID)
    .forEach((message) => {
      const node = {
        id: message.id,
        author: message.author,
        content: message.content,
        timestamp: message.timestamp,
        imgPath: message.imgPath,
        profilePic: message.profilePic,
        parentID: message.parentID,
        likes: message.likes,
        dislikes: message.dislikes,
        userID: message.userID,
        replies: buildMessageTree(flatMessages, message.id),
      };
      tree.push(node);
    });

  return tree;
}

// add message route
app.post("/addmessage", verifyToken, upload.single("image"), (req, res) => {
  const message = req.body.message;
  const channelID = req.body.channelID;
  const userID = req.body.userID;
  const created = new Date().toISOString().slice(0, 19).replace("T", " ");
  const parentID = req.body.parentID || 0;

  // Get the image file information
  const image = req.file;

  // Check if an image was uploaded
  if (image) {
    // Save the path to the image in the database
    const imagePath = image.filename;

    // Insert into the database with the image path
    connection.query(
      `INSERT INTO messages (message, channelID, created, userID, imgPath, parentID) VALUES (?, ?, ?, ?, ?, ?)`,
      [message, channelID, created, userID, imagePath, parentID],
      (err) => {
        if (err) {
          console.log(err);
          res.status(500).json("Error saving message: " + err);
        } else {
          // console.log("Added message successfully!");
          res.json("Added message successfully!");

          // update post num
          connection.query(
            `UPDATE users SET postNum = postNum + 1 WHERE id = ?`,
            [userID],
            (err) => {
              if (err) {
                console.error("Error updating post number: " + err);
              } else {
                // console.log("Post number updated successfully");
              }
            }
          );
        }
      }
    );
  } else {
    // Handle the case where no image was uploaded
    connection.query(
      `INSERT INTO messages (message, channelID, created, userID, parentID) VALUES (?, ?, ?, ?, ?)`,
      [message, channelID, created, userID, parentID],
      (err) => {
        if (err) {
          console.log(err);
          res.status(500).json("Error saving message: " + err);
        } else {
          // console.log("Added message successfully!");
          res.json("Added message successfully!");

          // update post num
          connection.query(
            `UPDATE users SET postNum = postNum + 1 WHERE id = ?`,
            [userID],
            (err) => {
              if (err) {
                console.error("Error updating post number: " + err);
              } else {
                // console.log("Post number updated successfully");
              }
            }
          );
        }
      }
    );
  }
});

// update like/dislike count route
app.patch("/updatecount", verifyToken, (req, res) => {
  const like = req.body.likeCount;
  const dislike = req.body.dislikeCount;
  const messageID = req.body.messageID;
  const userID = req.body.userID;
  const reaction = req.body.reaction;
  const userID_messageID = userID + "_" + messageID;

  connection.query(
    "INSERT INTO reactions (userID_messageID, messageID, `reaction`) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE `reaction` = ?",
    [userID_messageID, messageID, reaction, reaction],
    (err) => {
      if (err) {
        console.error("Error updating or inserting reaction: " + err);
      } else {
        // console.log("Reaction updated or inserted successfully");
      }
    }
  );

  connection.query(
    "UPDATE messages SET `likes` = ?, `dislikes` = ? WHERE id = ?",
    [like, dislike, messageID],
    (err) => {
      if (err) {
        console.error("Error updating data: " + err);
        res.json("Error updating data: " + err);
      } else {
        // console.log("Data updated successfully");
        res.json("Data updated successfully");
      }
    }
  );
});

app.post("/getreaction", verifyToken, (req, res) => {
  const userID = req.body.userID;
  const messageID = req.body.messageID;
  const userID_messageID = userID + "_" + messageID;

  connection.query(
    "SELECT * FROM reactions WHERE userID_messageID = ?",
    [userID_messageID],
    (err, results) => {
      if (err) {
        console.log("Error querying for reaction: " + err);
        res.json("Error querying for reaction: " + err);
      } else {
        if (results.length === 0) {
          // console.log("No reaction found for this message");
          res.json("No reaction found for this message");
        } else {
          // console.log("Reaction found!");
          res.json({ reaction: results[0].reaction });
        }
      }
    }
  );
});

// delete message route
app.post("/deletemessage", verifyToken, (req, res) => {
  const messageTree = req.body.root;

  const messageIDsToDelete = extractMessageIDs(messageTree);
  const userIDsToDelete = extractUserIDs(messageTree);
  const userIDsWithCounts = removeDuplicates(userIDsToDelete);

  // updating postnum
  for (const userCount of userIDsWithCounts) {
    connection.query(
      "UPDATE users SET `postNum` = `postNum` - ? WHERE id = ?",
      [userCount.count, userCount.id],
      (err) => {
        if (err) {
          console.error("Error decreasing post number: " + err);
        } else {
          // console.log(
          //   `Post number decreased for user ${userCount.id} successfully`
          // );
        }
      }
    );
  }

  // delete all reactions associated with the deleted message
  connection.query(
    "DELETE FROM reactions WHERE messageID IN (?)",
    [messageIDsToDelete],
    (err) => {
      if (err) {
        console.log("Error deleting reaction:", err);
      } else {
        // console.log("Reactions deleted successfully");
      }
    }
  );

  // Delete messages and their replies
  connection.query(
    "DELETE FROM messages WHERE id IN (?)",
    [messageIDsToDelete],
    (err) => {
      if (err) {
        console.log("Error deleting data:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        // console.log("Messages deleted successfully");
        res.status(200).json("Messages deleted successfully");
      }
    }
  );
});

// Function to extract message IDs from the tree
function extractMessageIDs(root, IDs = []) {
  if (root && root.length > 0) {
    root.forEach((message) => {
      IDs.push(message.id);
      extractMessageIDs(message.replies, IDs);
    });
  }
  return IDs;
}

// Function to extract users IDs from the tree
function extractUserIDs(root, IDs = []) {
  if (root && root.length > 0) {
    root.forEach((message) => {
      IDs.push(message.userID);
      extractUserIDs(message.replies, IDs);
    });
  }
  return IDs;
}

function removeDuplicates(IDs) {
  var results = [];

  for (var i = 0; i < IDs.length; i++) {
    var found = false;

    for (var j = 0; j < results.length; j++) {
      if (IDs[i] === results[j].id) {
        results[j].count++;
        found = true;
        break;
      }
    }

    if (!found) {
      results.push({ id: IDs[i], count: 1 });
    }
  }

  return results;
}

// delete user route
app.delete("/deleteuser/:userID", verifyToken, (req, res) => {
  const userID = req.params.userID;

  connection.query("DELETE FROM users WHERE id = ?", [userID], (err) => {
    if (err) {
      console.error("Error deleting user:", err);
      res.json("Error deleting user:", err);
    } else {
      // console.log("User deleted successfully");
      res.json("User deleted successfully");
    }
  });
});

// delete channel route
app.delete("/deletechannel/:channelID", verifyToken, (req, res) => {
  const channelID = req.params.channelID;

  connection.query(
    "SELECT * FROM messages WHERE ChannelID = ?",
    [channelID],
    (error, messages) => {
      if (error) {
        console.log(error);
      } else {
        const messageIDs = messages.map((message) => message.id);
        const userIDs = messages.map((message) => message.userID);
        const userIDsWithCounts = removeDuplicates(userIDs);

        // updating postnum
        for (const userCount of userIDsWithCounts) {
          connection.query(
            "UPDATE users SET `postNum` = `postNum` - ? WHERE id = ?",
            [userCount.count, userCount.id],
            (err) => {
              if (err) {
                console.error("Error decreasing post number: " + err);
              } else {
                // console.log(
                //   `Post number decreased for user ${userCount.id} successfully`
                // );
              }
            }
          );
        }

        const placeholders = Array(messageIDs.length).fill("?").join(", ");
        const query = `DELETE FROM reactions WHERE messageID IN (${placeholders})`;
        connection.query(query, messageIDs, (error2) => {
          if (error2) {
            console.log(error2);
          }
        });
      }
    }
  );

  connection.query(
    "DELETE FROM messages WHERE channelID = ?",
    [channelID],
    (err) => {
      if (err) {
        console.error("Error deleting messages:", err);
        return res.json("Error deleting messages:", err);
      }
      connection.query(
        "DELETE FROM channels WHERE id = ?",
        [channelID],
        (err) => {
          if (err) {
            console.error("Error deleting channel:", err);
            return res.json("Error deleting channel:", err);
          }
          // console.log("Channel and associated messages deleted successfully");
          res.json("Channel and associated messages deleted successfully");
        }
      );
    }
  );
});

// get all users route
app.get("/getusers", verifyToken, (req, res) => {
  connection.query(`SELECT * FROM users`, (err, users) => {
    if (err) {
      console.error("Error querying for users:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      if (users.length === 0) {
        console.log("No users found");
        res.status(404).json({ message: "No users found" });
      } else {
        const userIDs = users.map((user) => user.id);
        // get user rating
        connection.query(
          `SELECT * FROM messages WHERE userID IN (?)`,
          [userIDs],
          (error, messages) => {
            if (error) {
              console.error("Error querying for rating", error);
            } else {
              if (messages.length === 0) {
                console.log("No rating messages found");
              }
              const usersWithRatings = getRating(users, messages);
              res.status(200).json(usersWithRatings);
            }
          }
        );
      }
    }
  });
});

// get rating helper
function getRating(users, messages) {
  function calculateRating(likeCount, dislikeCount) {
    const totalReactions = likeCount + dislikeCount;
    if (totalReactions === 0) {
      return -1;
    }
    const rating = (likeCount / totalReactions) * 10;
    const rounded = Number(rating.toFixed(1));

    return rounded;
  }

  return users.map((user) => {
    let likeCount = 0;
    let dislikeCount = 0;

    messages.forEach((message) => {
      if (user.id === message.userID) {
        likeCount += message.likes || 0;
        dislikeCount += message.dislikes || 0;
      }
    });

    return {
      ...user,
      rating: calculateRating(likeCount, dislikeCount),
      classification: classifyUser(
        user.postNum,
        calculateRating(likeCount, dislikeCount)
      ),
    };
  });
}

function classifyUser(postNum, rating) {
  const beginnerPostNum = 5;
  const beginnerRating = 3;
  const expertPostNum = 10;
  const expertRating = 7;
  if (postNum <= beginnerPostNum || rating <= beginnerRating) {
    return 1;
  } else if (postNum >= expertPostNum && rating >= expertRating) {
    return 3;
  } else {
    return 2;
  }
}

app.use(express.static("uploads"));

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server is running on port ${process.env.SERVER_PORT}`);
});
