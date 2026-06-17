const users = [];
let nextId = 1;

const UserStore = {
  findByEmail(email) {
    return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },
  findById(id) {
    return users.find(u => u.id === id) || null;
  },
  create({ name, email, hashedPassword }) {
    const user = { id: nextId++, name, email, hashedPassword, createdAt: new Date().toISOString() };
    users.push(user);
    return user;
  },
  all() {
    return users.map(({ hashedPassword, ...safe }) => safe);
  }
};

module.exports = UserStore;