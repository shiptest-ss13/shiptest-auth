import { signOut } from "../../auth.server";
import type { Actions } from "./$types";

export const actions = { default: signOut } satisfies Actions;
