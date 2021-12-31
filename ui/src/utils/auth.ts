import { reactive, toRefs, watch, readonly } from "vue";
import { useRouter } from "vue-router";
import { useApi } from "./api";

export const AUTH_KEY = "auth_token";

interface Token {
  type: string;
  token: string;
  expires_at: string;
}

interface User {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: Token;
}

interface AuthState {
  authenticating: boolean;
  user?: User;
  error?: Error;
}

const state = reactive<AuthState>({
  authenticating: false,
  user: undefined,
  error: undefined,
});

const token = localStorage.getItem(AUTH_KEY);

if (token) {
  state.authenticating = true;
  const authData = JSON.parse(localStorage.getItem(AUTH_KEY) || "[]");
  state.user = authData;
} else {
  state.authenticating = false;
}

export const useAuth = () => {
  const setUser = (payload: User): void => {
    console.log(payload);

    if (payload) {
      state.authenticating = true;
      localStorage.setItem(AUTH_KEY, JSON.stringify(payload));
      state.user = payload;
      state.error = undefined;
    } else {
      state.authenticating = false;
    }
  };

  const logout = () => {
    state.authenticating = false;
    state.user = undefined;
    localStorage.removeItem(AUTH_KEY);
  };

  return {
    setUser,
    logout,
    ...toRefs(readonly(state)),
  };
};
