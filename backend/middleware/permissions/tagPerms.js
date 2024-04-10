const roles_map = require("../../config/roles_map");
const canModifyOrDeleteTag = (user, tag) => {
  return user.id === tag.createdBy.toString() || user.role === roles_map.admin
}

module.exports = {
  canModifyOrDeleteTag,
}