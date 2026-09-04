import { useEffect, useReducer, useRef, useState } from "react";

const extractErrorMessage = (error: unknown) => {
  let message = "";
  if (typeof error === "string") {
    message = error;
  }
  if (error instanceof Error) {
    message = error.message;
  }
  return message;
};

interface IUserResponse {
  id: number;
  name: string;
}

interface IState {
  users: IUserResponse[];
  isLoading: boolean;
  errorMessage: string;
}

interface IFetchUsersAction {
  type: "FETCH_USERS";
}

interface IFetchUsersSuccessAction {
  type: "FETCH_USERS_SUCCESS";
  payload: IUserResponse[];
}

interface IFetchUsersErrorAction {
  type: "FETCH_USERS_ERROR";
  payload: string;
}

type IAction =
  | IFetchUsersAction
  | IFetchUsersSuccessAction
  | IFetchUsersErrorAction;

const Hooks = () => {
  /* useState  */
  const [users, setUsers] = useState<IUserResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  /* userReducer */
  const [state, dispatch] = useReducer(
    function reducer(state: IState, action: IAction) {
      switch (action.type) {
        case "FETCH_USERS":
          return { ...state, isLoading: true, errorMessage: "" };
        case "FETCH_USERS_SUCCESS":
          return {
            ...state,
            isLoading: false,
            users: action.payload,
            errorMessage: "",
          };
        case "FETCH_USERS_ERROR":
          return { ...state, isLoading: false, errorMessage: action.payload };
        default:
          return state;
      }
    },
    {
      users: [],
      isLoading: false,
      errorMessage: "",
    }
  );

  /* Fetching data & side-effects */
  useEffect(() => {
    const getUsers = async () => {
      setIsLoading(true);
      dispatch({ type: "FETCH_USERS" });

      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        const data = await res.json();

        // useState
        setUsers(data);
        // useReducer
        dispatch({ type: "FETCH_USERS_SUCCESS", payload: data });
      } catch (error) {
        const message = extractErrorMessage(error);
        console.log(message);
        setErrorMessage(message);
        dispatch({ type: "FETCH_USERS_ERROR", payload: message });
      } finally {
        setIsLoading(false);
      }
    };

    getUsers();
  }, []);

  /* Handle Events & Clean-up */
  const [clicksCount, setClicksCount] = useState<number>(0);

  useEffect(() => {
    const clickListener = () => setClicksCount((count) => count + 1);

    document.body.addEventListener("click", clickListener);

    return () => {
      document.body.removeEventListener("click", clickListener);
    };
  }, []);

  /* store values or references between rerenders */
  // use-cases:
  // 1. previous values
  // 2. reference to elements
  // 3. reference to websocket client
  const storedValueRef = useRef<string>("Hello Darkness my old friend");
  const elementsRef = useRef<HTMLParagraphElement>(null);

  if (isLoading || state.isLoading) {
    return <div>Loading users</div>;
  }

  if (errorMessage || state.errorMessage) {
    return <div>Error fetching users: {errorMessage}</div>;
  }

  return (
    <div>
      <h1>Hooks</h1>

      <h2>Fetching users - useState</h2>
      {users.map((u) => (
        <p key={u.id}>{u.name}</p>
      ))}

      <h2>Fetching users - useReducer</h2>
      {state.users.map((u) => (
        <p key={u.id}>{u.name}</p>
      ))}

      <h2>Event listeners & clean-up</h2>
      <p>{clicksCount}</p>

      <h2>Store values - useRef</h2>
      <p ref={elementsRef}>{storedValueRef.current}</p>

      <h2>Store elements ref - useRef</h2>
      <p>{elementsRef?.current?.textContent}</p>
    </div>
  );
};

export default Hooks;
