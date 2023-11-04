// join user to chat
const users = [];

const userJoin = (id, userName, chatRoom) => {
  const user = { id, userName, chatRoom };

  users.push(user);
  return user;
};

// get current user
const getCurrentUser = (id) => {
  return users.find((user) => user.id === id);
};

//user disconnects
const userDisconnect = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

//get room users
const getRoomUsers = (chatRoom) => {
  return users.filter((user) => user.chatRoom === chatRoom);
};

module.exports = {
  userJoin,
  users,
  getCurrentUser,
  userDisconnect,
  getRoomUsers,
};
