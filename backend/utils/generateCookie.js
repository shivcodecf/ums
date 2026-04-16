export const generateCookie = (res, token) => {
  return res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};


// export const setCookies = (res, token) => {
//   res.cookie("token", token, {
//     httpOnly: true, // ✅ prevents JS access (XSS safe)
//     secure: false, // ✅ HTTPS only in prod
//     sameSite: "lax", // ✅ prevents CSRF
//     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
//   });
// };
