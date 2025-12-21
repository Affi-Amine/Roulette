import { z } from "zod"

export const VerifyTicketSchema = z.object({
  ticket_id: z.string().min(1),
  nb_pizzas_classiques: z.number().int().nonnegative(),
  nb_pizzas_premium: z.number().int().nonnegative(),
  sig: z.string().regex(/^[a-f0-9]{64}$/i),
})

export const SpinSchema = z.object({
  ticket_id: z.string().min(1),
  spin_type: z.enum(["simple", "premium"]),
})

export const ClaimPrizesSchema = z.object({
  ticket_id: z.string().min(1),
  name: z.string().min(1).max(100),
  phone: z.string().min(5).max(30),
  spin_ids: z.array(z.string().uuid()).min(1),
})

