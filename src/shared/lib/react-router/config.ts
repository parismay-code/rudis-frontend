export const pathKeys = {
  root: '/',
  landing() {
    return pathKeys.root;
  },
  home() {
    return pathKeys.root.concat('home/');
  },
  room: {
    mask() {
      return pathKeys.root.concat('rooms/:id/');
    },
    root(roomId: number) {
      return pathKeys.root.concat(`rooms/${roomId}`);
    },
  },
  page404() {
    return pathKeys.root.concat('404/');
  },
  pageBackendIssues() {
    return pathKeys.root.concat('unavailable/');
  },
};