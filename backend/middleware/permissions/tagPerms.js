const roles_map = require("../../config/roles_map");

const canCreateTag = (req, res, next) => {
  // if isn't an editor AND isn't an admin, they can't create a tag
  
}

const canModifyTag = (req, res, next) => {

  // if isn't an editor AND isn't an admin, they can't modify a tag
  
}

// Well, this seems like a better job for verifyRoles