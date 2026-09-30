/**
 * Redux Toolkit createAsyncThunk
 * ===============================
 *
 * createAsyncThunk is a Redux Toolkit API for modeling asynchronous work as a Redux thunk.
 * It accepts a thunk type prefix and an asynchronous payload creator, then automatically
 * generates pending, fulfilled, and rejected action creators for the request lifecycle.
 *
 * The payload creator receives the thunk argument and a thunkAPI object. The thunkAPI provides
 * utilities such as dispatch, getState, rejectWithValue, and an AbortSignal. The generated
 * thunk can be dispatched like a normal Redux action creator and its lifecycle actions can be
 * handled by a slice through extraReducers.
 *
 * A dispatched createAsyncThunk promise always resolves with the final fulfilled or rejected
 * action. Calling unwrap() converts that result back into the original fulfilled value or throws
 * the rejected error/payload, which is useful when component code needs to react to success or
 * failure directly.
 */

import type { PayloadAction } from "@reduxjs/toolkit";
import { configureStore, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Provider, useDispatch, useSelector } from "react-redux";
import type { FC, ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface AsyncUser {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}

export interface AsyncUserState {
  readonly user: AsyncUser | null;
  readonly status: "idle" | "pending" | "succeeded" | "failed";
  readonly error: string | null;
}

export interface AsyncUserRejectedValue {
  readonly message: string;
}

export interface CreateAsyncThunkExampleProps {
  readonly title: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

const initialState: AsyncUserState = {
  user: null,
  status: "idle",
  error: null,
};

const fetchUser = createAsyncThunk<
  AsyncUser,
  number,
  {
    rejectValue: AsyncUserRejectedValue;
  }
>(
  "asyncUser/fetchUser",
  async (userId: number, { rejectWithValue }): Promise<AsyncUser | ReturnType<typeof rejectWithValue>> => {
    await new Promise<void>((resolve): void => {
      window.setTimeout(resolve, 700);
    });

    if (userId <= 0) {
      return rejectWithValue({
        message: "The user ID must be greater than zero.",
      });
    }

    return {
      id: userId,
      name: "John Doe",
      email: "john.doe@example.com",
    };
  },
);

const asyncUserSlice = createSlice({
  name: "asyncUser",
  initialState,
  reducers: {
    clearUser(state): void {
      state.user = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder): void => {
    builder.addCase(fetchUser.pending, (state): void => {
      state.status = "pending";
      state.error = null;
    });
    builder.addCase(fetchUser.fulfilled, (state, action: PayloadAction<AsyncUser>): void => {
      state.status = "succeeded";
      state.user = action.payload;
      state.error = null;
    });
    builder.addCase(fetchUser.rejected, (state, action): void => {
      state.status = "failed";
      state.error = action.payload?.message ?? action.error.message ?? "The request failed.";
    });
  },
});

const asyncUserStore = configureStore({
  reducer: {
    asyncUser: asyncUserSlice.reducer,
  },
});

export type AsyncUserRootState = ReturnType<typeof asyncUserStore.getState>;

export type AsyncUserAppDispatch = typeof asyncUserStore.dispatch;

export const CreateAsyncThunkLifecycleExample: FC = (): ReactElement => {
  const status: AsyncUserState["status"] = useSelector(
    (state: AsyncUserRootState): AsyncUserState["status"] => state.asyncUser.status,
  );
  const dispatch: AsyncUserAppDispatch = useDispatch();

  const loadUser = (): void => {
    dispatch(fetchUser(1));
  };

  return (
    <article>
      <h3>Request lifecycle</h3>
      <p>Status: {status}</p>
      <button type="button" onClick={loadUser} disabled={status === "pending"}>
        {status === "pending" ? "Loading..." : "Load user"}
      </button>
    </article>
  );
};

export const CreateAsyncThunkArgumentExample: FC = (): ReactElement => {
  const user: AsyncUser | null = useSelector((state: AsyncUserRootState): AsyncUser | null => state.asyncUser.user);
  const dispatch: AsyncUserAppDispatch = useDispatch();

  const loadUser = (userId: number): void => {
    dispatch(fetchUser(userId));
  };

  return (
    <article>
      <h3>Thunk argument</h3>
      <p>User: {user?.name ?? "No user loaded"}</p>
      <button
        type="button"
        onClick={() => {
          loadUser(42);
        }}
      >
        Load user 42
      </button>
    </article>
  );
};

export const CreateAsyncThunkRejectedValueExample: FC = (): ReactElement => {
  const error: string | null = useSelector((state: AsyncUserRootState): string | null => state.asyncUser.error);
  const dispatch: AsyncUserAppDispatch = useDispatch();

  const loadInvalidUser = (): void => {
    dispatch(fetchUser(0));
  };

  return (
    <article>
      <h3>rejectWithValue</h3>
      <p>{error ?? "No rejected request payload is currently stored."}</p>
      <button type="button" onClick={loadInvalidUser}>
        Trigger validation error
      </button>
    </article>
  );
};

export const CreateAsyncThunkUnwrapExample: FC = (): ReactElement => {
  const [message, setMessage] = useStateLike("No request result has been handled.");
  const dispatch: AsyncUserAppDispatch = useDispatch();

  const loadUser = async (): Promise<void> => {
    try {
      const user: AsyncUser = await dispatch(fetchUser(7)).unwrap();

      setMessage(`Loaded ${user.name}.`);
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "message" in error && typeof error.message === "string") {
        setMessage(error.message);
        return;
      }

      setMessage("The request failed.");
    }
  };

  return (
    <article>
      <h3>unwrap()</h3>
      <p>{message}</p>
      <button
        type="button"
        onClick={() => {
          void loadUser();
        }}
      >
        Load and unwrap
      </button>
    </article>
  );
};

export const CreateAsyncThunkRejectedActionExample: FC = (): ReactElement => {
  const status: AsyncUserState["status"] = useSelector(
    (state: AsyncUserRootState): AsyncUserState["status"] => state.asyncUser.status,
  );

  return (
    <article>
      <h3>Generated lifecycle actions</h3>
      <p>Current status: {status}</p>
      <p>createAsyncThunk generates pending, fulfilled, and rejected action creators from the thunk definition.</p>
    </article>
  );
};

function useStateLike(initialValue: string): readonly [string, (nextValue: string) => void] {
  const [value, setValue] = React.useState<string>(initialValue);

  return [
    value,
    (nextValue: string): void => {
      setValue(nextValue);
    },
  ];
}

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ReduxToolkitCreateAsyncThunkDemo: FC = (): ReactElement => {
  return (
    <Provider store={asyncUserStore}>
      <section>
        <h2>1. Async Request Lifecycle</h2>
        <CreateAsyncThunkLifecycleExample />

        <h2>2. Passing an Argument to a Thunk</h2>
        <CreateAsyncThunkArgumentExample />

        <h2>3. Handling a Known Rejection Payload</h2>
        <CreateAsyncThunkRejectedValueExample />

        <h2>4. Unwrapping a Thunk Result</h2>
        <CreateAsyncThunkUnwrapExample />

        <h2>5. Generated Lifecycle Actions</h2>
        <CreateAsyncThunkRejectedActionExample />
      </section>
    </Provider>
  );
};

export default ReduxToolkitCreateAsyncThunkDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// createAsyncThunk models asynchronous work as a Redux thunk.
// The payload creator receives the thunk argument and thunkAPI.
// Dispatching the thunk automatically produces pending, fulfilled, or rejected lifecycle actions.
// extraReducers can handle those lifecycle actions inside a slice.
// rejectWithValue provides a typed, application-specific rejected payload.
// The dispatched thunk promise resolves with the final Redux action.
// unwrap() extracts the fulfilled payload or throws the rejected value/error.
// createAsyncThunk can therefore connect asynchronous request logic with Redux state transitions.
