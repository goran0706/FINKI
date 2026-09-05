import { useEffect, useState } from "react";

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

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const getUsers = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        const message = extractErrorMessage(error);
        console.log(message);
        setErrorMessage(message);
      } finally {
        setIsLoading(false);
      }
    };
    getUsers();
  }, []);

  return { users, isLoading, errorMessage };
};

export default useUsers;
