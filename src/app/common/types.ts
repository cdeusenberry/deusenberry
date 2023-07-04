import { z } from "zod";

export const NamedApiResourceSchema = z.object({
  name: z.string(),
  url: z.string().url(),
});
export type NamedApiResource = z.infer<typeof NamedApiResourceSchema>;

// const PokemonSprites = z.object({
//   back_default: z.string().url(),
//   back_female: z.string().url().nullable(),
//   back_shiny: z.string().url(),
//   back_shiny_female: z.string().url().nullable(),
//   front_default: z.string().url(),
//   front_female: z.string().url().nullable(),
//   front_shiny: z.string().url(),
//   front_shiny_female: z.string().url().nullable(),
// });
