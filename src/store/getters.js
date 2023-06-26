const getters = {
  device: state => state.app.device,
  theme: state => state.app.theme,
  color: state => state.app.color,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  nickname: state => state.user.name,
  positionName: state => state.user.info.position?state.user.info.position.positionName:'无职位',
  welcome: state => state.user.welcome,
  roles: state => state.user.roles,
  userInfo: state => state.user.info,
  addRouters: state => state.permission.addRouters,
  multiTab: state => state.app.multiTab,
  menuList: state => state.user.menuList,
  school_id: state => state.user.school_id
}

export default getters
