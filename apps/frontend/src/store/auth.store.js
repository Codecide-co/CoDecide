import { createStore } from "@core/store";
import { getSession } from "@core/helpers";

const initialState = {
  user: getSession(),
};

export const authStore = createStore(initialState);
