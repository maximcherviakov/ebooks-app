import Genre from "../models/genre.model";
import { genres } from "./consts";

export const initGenres = async () => {
  if ((await Genre.countDocuments()) <= 0) {
    for (const genre of genres) {
      await Genre.create({ name: genre });
    }
  }

  console.log("Genres seeded successfully");
};