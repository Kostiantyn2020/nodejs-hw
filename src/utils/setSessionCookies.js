export const setSessionCookies = (res, session) => {
  res.cookie('sessionId', session._id, {
    httpOnly: true,
  });

  res.cookie('accessToken', session.accessToken, {
    httpOnly: true,
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
  });
};
