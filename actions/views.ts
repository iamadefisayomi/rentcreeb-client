// "use server";

// import { errorMessage, propertyKey } from "@/constants";
// import { adminDB } from "@/utils/firebaseAdmin";
// import { NextRequest } from "next/server";

// // Record a property view for a specific device
// export async function recordPropertyView(propertyId: string, req: NextRequest) {
//   try {
//     const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
//     const userAgent = req.headers.get("user-agent") ?? "unknown";

//     const deviceId = `${ipAddress}_${userAgent}`;
//     const today = new Date().toISOString().split("T")[0]; // Get current date in 'YYYY-MM-DD' format

//     const viewsRef = adminDB.collection("propertyViews").doc(propertyId);
//     const docSnapshot = await viewsRef.get();

//     if (!docSnapshot.exists) {
//       await viewsRef.set({ views: [{ deviceId, date: today }] });
//     } else {
//       const currentViews = docSnapshot.data()?.views || [];
//       const hasViewedToday = currentViews.some(
//         (view: { deviceId: string; date: string }) =>
//           view.deviceId === deviceId && view.date === today
//       );

//       if (!hasViewedToday) {
//         await viewsRef.update({
//           views: [...currentViews, { deviceId, date: today }],
//         });
//       }
//     }

//     return { success: true, message: "View recorded successfully." };
//   } catch (error: any) {
//     return errorMessage(error.message);
//   }
// }

// // Get the total views for a specific property
// export async function getPropertyViews(propertyId: string) {
//   try {
//     const viewsRef = adminDB.collection("propertyViews").doc(propertyId);
//     const docSnapshot = await viewsRef.get();

//     if (!docSnapshot.exists) {
//       return { success: true, data: 0, message: "No views found for this property." };
//     }

//     const totalViews = docSnapshot.data()?.views.length || 0;
//     return { success: true, data: totalViews };
//   } catch (error: any) {
//     return errorMessage(error.message);
//   }
// }
