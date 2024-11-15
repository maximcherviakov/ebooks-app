import { model, Model, Schema } from "mongoose";
import { IGenre } from "../types/type";

type GenreModel = Model<IGenre>;

const genreSchema = new Schema<IGenre, GenreModel>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const Genre = model<IGenre, GenreModel>("Genre", genreSchema);

export default Genre;
