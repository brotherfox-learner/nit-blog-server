// import { createClient } from "@supabase/supabase-js";
// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";

// const __dirname = fileURLToPath(new URL(".", import.meta.url));
// dotenv.config({ path: path.resolve(__dirname, "..", "..", ".env") });

// const supabase = createClient(
//   process.env.SUPABASE_URL,
//   process.env.SUPABASE_PUBLISHABLE_KEY
// );

// export async function requireAdmin(req, res, next) {
//   try {
//     const authHeader = req.headers.authorization;
//     const token = authHeader?.replace("Bearer ", "");

//     if (!token) {
//       return res.status(401).json({ message: "Missing token" });
//     }

//     // 1) verify token
//     const { data: { user }, error: authError } =
//       await supabase.auth.getUser(token);

//     if (authError || !user) {
//       return res.status(401).json({ message: "Invalid token" });
//     }

//     // 2) check role from users table
//     const { data: profile, error } = await supabase
//       .from("users")
//       .select("role")
//       .eq("id", user.id)
//       .single();

//     if (error || profile?.role !== "admin") {
//       return res.status(403).json({ message: "Admin only" });
//     }

//     // 3) แนบ user ไว้ใช้ต่อ
//     req.user = user;
//     next();
//   } catch (err) {
//     res.status(500).json({ message: "Auth middleware failed" });
//   }
// }
