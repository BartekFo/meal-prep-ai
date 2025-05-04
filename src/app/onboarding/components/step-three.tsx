// "use client";

// import type React from "react";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { X } from "lucide-react";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";

// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import type { UserData } from "../page";

// const formSchema = z.object({
//   likedIngredients: z.array(z.string()),
//   dislikedIngredients: z.array(z.string()),
// });

// interface StepThreeProps {
//   userData: UserData;
//   updateUserData: (data: Partial<UserData>) => void;
//   onNext: () => void;
//   onBack: () => void;
// }

// export function StepThree({
//   userData,
//   updateUserData,
//   onNext,
//   onBack,
// }: StepThreeProps) {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [newLikedIngredient, setNewLikedIngredient] = useState("");
//   const [newDislikedIngredient, setNewDislikedIngredient] = useState("");

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       likedIngredients: userData.likedIngredients,
//       dislikedIngredients: userData.dislikedIngredients,
//     },
//   });

//   function onSubmit(values: z.infer<typeof formSchema>) {
//     setIsSubmitting(true);

//     // Simulate API call
//     setTimeout(() => {
//       updateUserData(values);
//       setIsSubmitting(false);
//       onNext();
//     }, 500);
//   }

//   const addLikedIngredient = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (
//       newLikedIngredient.trim() &&
//       !userData.likedIngredients.includes(newLikedIngredient.trim())
//     ) {
//       const updated = [...userData.likedIngredients, newLikedIngredient.trim()];
//       updateUserData({ likedIngredients: updated });
//       setNewLikedIngredient("");
//     }
//   };

//   const removeLikedIngredient = (ingredient: string) => {
//     const updated = userData.likedIngredients.filter(
//       (item) => item !== ingredient,
//     );
//     updateUserData({ likedIngredients: updated });
//   };

//   const addDislikedIngredient = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (
//       newDislikedIngredient.trim() &&
//       !userData.dislikedIngredients.includes(newDislikedIngredient.trim())
//     ) {
//       const updated = [
//         ...userData.dislikedIngredients,
//         newDislikedIngredient.trim(),
//       ];
//       updateUserData({ dislikedIngredients: updated });
//       setNewDislikedIngredient("");
//     }
//   };

//   const removeDislikedIngredient = (ingredient: string) => {
//     const updated = userData.dislikedIngredients.filter(
//       (item) => item !== ingredient,
//     );
//     updateUserData({ dislikedIngredients: updated });
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h2 className="font-bold text-2xl">Food Preferences</h2>
//         <p className="text-muted-foreground">
//           Tell us about ingredients you like and dislike. This helps us
//           personalize your recipe recommendations.
//         </p>
//       </div>

//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//         <Tabs defaultValue="liked" className="w-full">
//           <TabsList className="grid w-full grid-cols-2">
//             <TabsTrigger value="liked">Ingredients I Like</TabsTrigger>
//             <TabsTrigger value="disliked">Ingredients I Dislike</TabsTrigger>
//           </TabsList>
//           <TabsContent value="liked" className="space-y-4 pt-4">
//             <div>
//               <form onSubmit={addLikedIngredient} className="flex gap-2">
//                 <Input
//                   placeholder="Add ingredient you like (e.g., Avocado)"
//                   value={newLikedIngredient}
//                   onChange={(e) => setNewLikedIngredient(e.target.value)}
//                   className="flex-1"
//                 />
//                 <Button type="submit">Add</Button>
//               </form>
//             </div>

//             <div className="flex flex-wrap gap-2">
//               {userData.likedIngredients.length === 0 ? (
//                 <p className="text-muted-foreground text-sm">
//                   No liked ingredients added yet.
//                 </p>
//               ) : (
//                 userData.likedIngredients.map((ingredient) => (
//                   <Badge
//                     key={ingredient}
//                     variant="secondary"
//                     className="flex items-center gap-1 px-3 py-1.5"
//                   >
//                     {ingredient}
//                     <X
//                       className="ml-1 h-3 w-3 cursor-pointer"
//                       onClick={() => removeLikedIngredient(ingredient)}
//                     />
//                   </Badge>
//                 ))
//               )}
//             </div>
//           </TabsContent>
//           <TabsContent value="disliked" className="space-y-4 pt-4">
//             <div>
//               <form onSubmit={addDislikedIngredient} className="flex gap-2">
//                 <Input
//                   placeholder="Add ingredient you dislike (e.g., Cilantro)"
//                   value={newDislikedIngredient}
//                   onChange={(e) => setNewDislikedIngredient(e.target.value)}
//                   className="flex-1"
//                 />
//                 <Button type="submit">Add</Button>
//               </form>
//             </div>

//             <div className="flex flex-wrap gap-2">
//               {userData.dislikedIngredients.length === 0 ? (
//                 <p className="text-muted-foreground text-sm">
//                   No disliked ingredients added yet.
//                 </p>
//               ) : (
//                 userData.dislikedIngredients.map((ingredient) => (
//                   <Badge
//                     key={ingredient}
//                     variant="secondary"
//                     className="flex items-center gap-1 px-3 py-1.5"
//                   >
//                     {ingredient}
//                     <X
//                       className="ml-1 h-3 w-3 cursor-pointer"
//                       onClick={() => removeDislikedIngredient(ingredient)}
//                     />
//                   </Badge>
//                 ))
//               )}
//             </div>
//           </TabsContent>
//         </Tabs>

//         <div className="flex justify-between">
//           <Button type="button" variant="outline" onClick={onBack}>
//             Back
//           </Button>
//           <Button type="submit" disabled={isSubmitting}>
//             {isSubmitting ? "Saving..." : "Complete Setup"}
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// }
