function storeId(entity) {
  return function (response, context, next) {
    if (response.body && response.body[`${entity}id`]) {
      context.vars[`${entity}Ids`] = context.vars[`${entity}Ids`] || [];
      context.vars[`${entity}Ids`].push(response.body[`${entity}id`]);
    }
    done();
  };
}

module.exports = {
  storeAnnouncementId: storeId("announcement"),
  storeEventId: storeId("event"),
  storeSavedId: storeId("saved"),
  storeHelpId: storeId("help"),
  storeInfoId: storeId("info"),
  storeMapId: storeId("map"),
  storeRoleId: storeId("role"),
  storeUserId: storeId("user"),
};
