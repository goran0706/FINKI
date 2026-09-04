import React from "react";
import { FieldValues, useForm } from "react-hook-form";

interface FormData {
  username: string;
  password: string;
}

const FormReactHookFormTs = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FieldValues) => console.log(data);

  return (
    <form>
      <div className="mb-3">
        <label htmlFor="username" className="form-label">
          Username
        </label>
        <input
          {...register("username", { required: true, minLength: 3 })}
          id="username"
          type="text"
          className="form-control"
        />
        {errors.username?.type === "required" && (
          <p className="text-danger">The username field is required.</p>
        )}
        {errors.username?.type === "minLength" && (
          <p className="text-danger">The username must be 3 characters.</p>
        )}
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          {...register("password", { required: true })}
          id="password"
          type="password"
          className="form-control"
        />
        {errors.password?.type === "required" && (
          <p className="text-danger">The password field is required.</p>
        )}
      </div>
      <button
        className="btn btn-primary"
        type="submit"
        onClick={handleSubmit(onSubmit)}
      >
        Submit
      </button>
    </form>
  );
};

export default FormReactHookFormTs;
