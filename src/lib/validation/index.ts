import * as z from "zod";

// ============================================================
// USUÁRIO
// ============================================================
export const SignupValidation = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
  username: z.string().min(2, { message: "O nome de usuário deve ter pelo menos 2 caracteres." }),
  email: z.string().email(),
  password: z.string().min(4, { message: "A senha deve ter pelo menos 4 caracteres." }),
});

export const SigninValidation = z.object({
  email: z.string().email(),
  password: z.string().min(4, { message: "A senha deve ter pelo menos 4 caracteres." }),
});

export const ProfileValidation = z.object({
  file: z.custom<File[]>(),
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
  username: z.string().min(2, { message: "O nome de usuário deve ter pelo menos 2 caracteres." }),
  email: z.string().email(),
  bio: z.string(),
});

// ============================================================
// POSTAGEM
// ============================================================
export const PostValidation = z.object({
  caption: z.string().min(5, { message: "Mínimo de 5 caracteres." }).max(2200, { message: "Máximo de 2.200 caracteres." }),
  file: z.custom<File[]>(),
  location: z.string().min(1, { message: "Este campo é obrigatório." }).max(1000, { message: "Máximo de 1.000 caracteres." }),
  tags: z.string(),
});


export const isLiked = (
  likes: { id: string; userId: string; postId: string; createdAt: string }[],
  postId: string,
  userId: number
): boolean => {
  return likes.some(like => like.postId.toString() === postId && Number(like.userId) === Number(userId));
};
