// import { Router } from "express";
// import { supabaseAdmin } from "../utils/supabaseAdmin.js";
// import { requireAdmin } from "../middleware/admin.middleware.js";

// const router = Router();

// /**
//  * PATCH /admin/users/:id/role
//  * body: { role: "admin" | "user" }
//  */
// router.patch("/users/:id/role", requireAdmin, async (req, res) => {
//   const { id } = req.params;
//   const { role } = req.body;

//   if (!["admin", "user"].includes(role)) {
//     return res.status(400).json({ message: "Invalid role" });
//   }

//   const { error } = await supabaseAdmin
//     .from("users")
//     .update({ role })
//     .eq("id", id);

//   if (error) {
//     return res.status(500).json({ message: error.message });
//   }

//   res.json({ success: true });
// });

// export default router;
