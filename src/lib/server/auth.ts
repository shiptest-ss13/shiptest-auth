import { Authentik } from "arctic";
import {
  CLIENT_ID,
  CLIENT_SECRET,
  BASE_URL,
  REDIRECT_URI,
} from "$env/static/private";

export const auth = new Authentik(
  BASE_URL,
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
